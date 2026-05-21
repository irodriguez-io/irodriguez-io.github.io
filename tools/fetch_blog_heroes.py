#!/usr/bin/env python3
"""
fetch_blog_heroes.py
--------------------
Populate /img/blog-hero/ with topic-tagged hero images from Pixabay,
and (re)generate /_data/images.yml for use by the post-hero include.

Usage:
    pip install Pillow PyYAML
    export PIXABAY_KEY=your_key_here
    python3 tools/fetch_blog_heroes.py

Notes:
- Re-runnable. Already-downloaded images are skipped; YAML is regenerated
  fresh from whatever images are on disk plus the search results this run.
- Each search query is mapped to a set of semantic topic tags. When the
  same Pixabay image appears in multiple searches, its tags are unioned
  in _data/images.yml. That's how one image can serve infosec + cybersec
  + data-security without storing it 3 times.
- Resized to 1200px wide, encoded WebP (target <150 KB) with JPG fallback.
"""

import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from io import BytesIO
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing dependency: pip install Pillow")

try:
    import yaml
except ImportError:
    sys.exit("Missing dependency: pip install PyYAML")


# ---------------------------------------------------------------------------
# Search configuration
# ---------------------------------------------------------------------------
# (search_query, [topic_tags_to_apply])
# Edit freely. Re-run the script and _data/images.yml updates accordingly.
SEARCH_GROUPS = [
    ("identity authentication",   ["iam"]),
    ("login fingerprint",         ["iam"]),
    ("biometric access control",  ["iam"]),
    ("cybersecurity padlock",     ["infosec", "cybersec", "data-security"]),
    ("encryption shield",         ["infosec", "cybersec", "data-security"]),
    ("hacker security",           ["infosec", "cybersec"]),
    ("data security",             ["data-security", "infosec"]),
    ("automation code",           ["automation"]),
    ("terminal programming",      ["automation"]),
    ("workflow gears",            ["automation"]),
    ("server datacenter",         ["networking"]),
    ("network cloud computing",   ["networking"]),
    ("ethernet infrastructure",   ["networking"]),
    ("technology abstract",       ["generic"]),
    ("circuit board digital",     ["generic"]),
]

PER_SEARCH    = 5      # images requested per search (Pixabay min is 3)
TARGET_WIDTH  = 1200   # final image width in pixels
WEBP_MAX_KB   = 150    # WebP target ceiling (drops quality until it fits)
JPG_QUALITY   = 82
USER_AGENT    = "fetch_blog_heroes/1.0 (+https://irodriguez.io)"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def repo_root() -> Path:
    """Walk up from this script's location to find _config.yml."""
    here = Path(__file__).resolve().parent
    for p in [here, *here.parents]:
        if (p / "_config.yml").exists():
            return p
    sys.exit("Could not find _config.yml — run this from inside the repo.")


def pixabay_search(api_key: str, query: str, per_page: int) -> list:
    params = urllib.parse.urlencode({
        "key": api_key,
        "q": query,
        "image_type": "photo",
        "orientation": "horizontal",
        "safesearch": "true",
        "per_page": max(per_page, 3),
        "min_width": 1200,
    })
    url = f"https://pixabay.com/api/?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.load(r)
    return data.get("hits", [])[:per_page]


def http_get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def encode_webp(img: Image.Image, out_path: Path) -> tuple[int, int]:
    """Encode to WebP, stepping quality down until size <= WEBP_MAX_KB."""
    quality = 85
    buf = BytesIO()
    while quality >= 50:
        buf = BytesIO()
        img.save(buf, format="WEBP", quality=quality, method=6)
        if buf.tell() <= WEBP_MAX_KB * 1024:
            break
        quality -= 5
    with open(out_path, "wb") as f:
        f.write(buf.getvalue())
    return quality, buf.tell()


def process_image(raw: bytes, webp_path: Path, jpg_path: Path):
    img = Image.open(BytesIO(raw)).convert("RGB")
    w, h = img.size
    if w > TARGET_WIDTH:
        new_h = int(h * TARGET_WIDTH / w)
        img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
    q, size_bytes = encode_webp(img, webp_path)
    img.save(jpg_path, format="JPEG", quality=JPG_QUALITY,
             optimize=True, progressive=True)
    return img.size, q, size_bytes


def alt_from_tags(tag_str: str) -> str:
    parts = [t.strip() for t in (tag_str or "").split(",") if t.strip()]
    return ", ".join(parts[:3]) or "Blog hero image"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    api_key = os.environ.get("PIXABAY_KEY")
    if not api_key:
        sys.exit("Set PIXABAY_KEY environment variable before running.")

    root = repo_root()
    out_dir  = root / "img" / "blog-hero"
    data_dir = root / "_data"
    out_dir.mkdir(parents=True, exist_ok=True)
    data_dir.mkdir(exist_ok=True)

    # pid -> {topics: set, meta: pixabay_hit}
    pool: dict[str, dict] = defaultdict(lambda: {"topics": set(), "meta": None})

    print(f"[root] {root}")
    print(f"[out ] {out_dir}")
    print()

    for query, topics in SEARCH_GROUPS:
        print(f"[search] {query!r:40s} -> {topics}")
        try:
            hits = pixabay_search(api_key, query, PER_SEARCH)
        except urllib.error.HTTPError as e:
            print(f"  ! HTTP {e.code} — skipping ({e.reason})")
            continue
        except Exception as e:
            print(f"  ! error: {e} — skipping")
            continue
        for h in hits:
            pid = str(h["id"])
            pool[pid]["topics"].update(topics)
            if not pool[pid]["meta"]:
                pool[pid]["meta"] = h
        time.sleep(1)  # polite pacing

    print(f"\n[pool] {len(pool)} unique images after dedup\n")

    yaml_entries = []
    for pid, info in pool.items():
        m = info["meta"]
        if not m:
            continue
        webp_path = out_dir / f"pixabay-{pid}.webp"
        jpg_path  = out_dir / f"pixabay-{pid}.jpg"

        if webp_path.exists() and jpg_path.exists():
            print(f"[skip ] {pid} (already on disk)")
        else:
            url = m.get("largeImageURL") or m.get("webformatURL")
            try:
                print(f"[fetch] {pid} <- {url}")
                raw = http_get(url)
                size, q, b = process_image(raw, webp_path, jpg_path)
                print(f"  -> {size[0]}x{size[1]}, webp q={q} ({b // 1024} KB)")
            except Exception as e:
                print(f"  ! failed: {e}")
                # don't yaml-list a file we couldn't write
                if not webp_path.exists():
                    continue

        yaml_entries.append({
            "file":   f"pixabay-{pid}",
            "topics": sorted(info["topics"]),
            "alt":    alt_from_tags(m.get("tags", "")),
            "credit": f"Pixabay/{m.get('user', 'unknown')}",
            "page":   m.get("pageURL", ""),
        })

    yaml_entries.sort(key=lambda e: e["file"])
    yaml_path = data_dir / "images.yml"
    with open(yaml_path, "w") as f:
        f.write("# Auto-generated by tools/fetch_blog_heroes.py\n")
        f.write("# Re-run the script to refresh. Manual edits to topics/alt are\n")
        f.write("# safe but will be overwritten on the next run unless you\n")
        f.write("# adjust SEARCH_GROUPS in the script instead.\n\n")
        yaml.safe_dump({"images": yaml_entries}, f,
                       sort_keys=False, allow_unicode=True)

    print(f"\n[done] {len(yaml_entries)} images on disk")
    print(f"[done] manifest written to {yaml_path}")
    print("\nNext: spot-check images in img/blog-hero/, then build the site.")


if __name__ == "__main__":
    main()
