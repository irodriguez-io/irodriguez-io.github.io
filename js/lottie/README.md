# Vendored Lottie player

Self-hosted so the site pulls no third-party script at runtime. Originally this
loaded `@latest` from unpkg.com and the animation JSON from lottie.host, which
meant an unpinned third-party module executing on our own origin and two extra
origins on the hero's critical path.

## Provenance

| File(s) | Source | Version |
|---|---|---|
| `lottie_light.min.js` | `https://unpkg.com/lottie-web@5.12.2/build/player/` | **5.12.2** (pinned) |
| `hero-identity.json` | `https://lottie.host/40e5933f-18e6-443a-aed2-394d88bd7119/de7oMybouy.json` | fetched 2026-08-24 |

One edit was applied: the `//# sourceMappingURL=` comment was stripped, since
the `.map` file is not vendored.

## Why `lottie_light`, and why not `<dotlottie-player>`

The hero used to run `@dotlottie/player-component`, a web component wrapping
lottie-web in Lit, xstate, howler and dotLottie zip handling. The hero uses none
of that — no audio, no state machines, no `.lottie` archive, no playback
controls. Worse, the component resolved its renderer through a **three-deep chain
of imports**: `dotlottie-player.js` statically pulled four chunks, and only once
those had executed did one of them fire a dynamic `import()` for the 64KB module
that does the actual drawing. Browsers do not speculatively fetch dynamic
imports, so the largest file on the path started downloading after two full
round trips had already finished.

`lottie_light.min.js` is one classic script with no waterfall:

| | files | gzipped JS |
|---|---|---|
| `@dotlottie/player-component` 2.7.12 | 6 (3 levels deep) | 99 KB |
| `lottie-web` 5.12.2 `lottie_light` | 1 | 46 KB |

`light` is the SVG-renderer build **without expression support**.
`hero-identity.json` contains zero expressions — 16 shape layers plus one null,
no masks, no mattes, no text, no images, no precomps — so it renders
identically. Verified by pixel-diffing both players pinned to frame 30: the only
difference was a 2px vertical offset, because the old custom element was
`display: inline` and sat on a text baseline.

**If the hero animation is ever replaced, check the new file for expressions
first** (`"x"` string properties on animated values). If it has any, switch to
`lottie_svg.min.js` (62 KB gzipped) — `lottie_light` silently ignores them.

## Re-vendoring / upgrading

```sh
V=5.12.2   # bump this
cd js/lottie
curl -sfL -o lottie_light.min.js \
  "https://unpkg.com/lottie-web@$V/build/player/lottie_light.min.js"
sed -i '' '/sourceMappingURL=/d' lottie_light.min.js
```

`index.html` and `spanish.html` load it with `defer` from `<head>`, **before**
`js/main.js`. Deferred scripts execute in document order, so that ordering is
what guarantees the global `lottie` exists when `main.js` calls
`lottie.loadAnimation()`. Both pages also `<link rel="preload">` the JSON so it
downloads alongside the player rather than after it.

## Retained but unused

`dotlottie-player.js`, `chunk-*.js`, `lottie_svg-*.js`, `dotlottie-audio-*.js`
and `dotlottie-state-machine-manager-*.js` are the old pinned 2.7.12 component
(~600KB). Nothing references them; they are kept only to make reverting easy and
can be deleted.
