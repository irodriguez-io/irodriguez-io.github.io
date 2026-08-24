# Vendored dotLottie player

Self-hosted so the site pulls no third-party script at runtime. Previously this
loaded `@latest` from unpkg.com and the animation JSON from lottie.host, which
meant an unpinned third-party module executing on our own origin and two extra
origins on the hero's critical path.

## Provenance

| File(s) | Source | Version |
|---|---|---|
| `dotlottie-player.js`, `chunk-*.js`, `lottie_svg-*.js`, `dotlottie-audio-*.js`, `dotlottie-state-machine-manager-*.js` | `https://unpkg.com/@dotlottie/player-component@2.7.12/dist/` | **2.7.12** (pinned) |
| `hero-identity.json` | `https://lottie.host/40e5933f-18e6-443a-aed2-394d88bd7119/de7oMybouy.json` | fetched 2026-08-24 |

Two edits were applied to every vendored file:

1. `.mjs` -> `.js` on the extension and on every internal `import()` specifier.
   GitHub Pages does not reliably serve `.mjs` as a JavaScript MIME type, and a
   module script rejected on MIME grounds fails silently. The browser only cares
   about the `Content-Type`, not the extension, so `.js` is strictly safer.
2. `//# sourceMappingURL=` comments stripped — the `.map` files are not vendored.

## Why only the SVG renderer

`chunk-TRZ6EGBZ.js` picks a renderer at runtime with a dynamic `import()`.
`<dotlottie-player>` defaults to `renderer="svg"` with `_light=false` and
`_worker=false`, so `lottie_svg-MJGYILXD-NRTSROOT.js` is the only variant that
can ever load. The other six (`lottie_light`, `lottie_light_canvas`,
`lottie_light_html`, `lottie_canvas`, `lottie_html`, `lottie_worker`, ~1.4 MB)
were pruned.

`index.html` and `spanish.html` set `renderer="svg"` **explicitly** so this stays
true rather than relying on a default that a future version could change. If you
ever set `renderer` to something else, or add the `light` or `worker` attribute,
re-vendor the matching variant first or the dynamic import will 404 at runtime.

## Re-vendoring / upgrading

```sh
V=2.7.12   # bump this
cd js/lottie
for f in dotlottie-player chunk-HDDX7F4A chunk-ODPU3M3Z chunk-TRZ6EGBZ chunk-ZWH2ESXT \
         lottie_svg-MJGYILXD-NRTSROOT dotlottie-audio-75C54RUV \
         dotlottie-state-machine-manager-2E7RUGJG-NTQ25VSR; do
  curl -sfL -o "$f.js" "https://unpkg.com/@dotlottie/player-component@$V/dist/$f.mjs"
done
# rewrite import specifiers and drop sourcemap comments
sed -i '' -E "s|(['\"]\./[A-Za-z0-9_.$-]+)\.mjs(['\"])|\1.js\2|g; /sourceMappingURL=/d" *.js
```

Chunk hashes change between versions. After bumping, grep the new
`dotlottie-player.js` and `chunk-*.js` for `import('./` and confirm every
referenced file exists locally.
