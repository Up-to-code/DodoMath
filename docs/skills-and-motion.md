# Skills, motion and sound · 13 October 2026

The app stays on Expo/React Native. Character artwork is generated raster art; mathematical diagrams remain data-driven. No new application libraries or third-party skills were installed.

## Screenshot matching

The installed **clone-website** skill provides the reference collection, measured implementation and render/compare workflow. The existing library contains 117 distinct screenshot panels from 15 official articles, 72 original assets and four animated references. Different historical Math releases are documented separately.

The strongest additional screenshot-first candidate found is [bdsanxz/pixel-perfect](https://github.com/bdsanxz/pixel-perfect). It describes a framework-independent inspect/decompose/render/compare/verify loop and preserves the current architecture. Its small public repository is a candidate, not an independently validated quality guarantee. [Huc91/pixel-perfect-skill](https://github.com/Huc91/pixel-perfect-skill) is an alternative for screenshot QA, including React Native simulator capture. Neither is installed. The implemented Fox and purple brand intentionally differ from Duolingo; no exact pixel-match score is claimed.

## Expressions and authored animation

Installed **2dimg2motion** handles baseline normalization, generated anchors and generated in-betweens. **emotional-character** separates identity, expressions and transition assets. **frame-animator** supplies blink, hold and secondary-action timing. These skills are already available locally; a new tool is unnecessary for the first motion.

[Sprite Forge](https://github.com/0x0funky/agent-sprite-forge) is an additional external reference for per-action character generation and sprite packaging. It uses external generation services and configuration; it was not run. [Character Animation Creator](https://github.com/tachikomared/character-animation-creator-skill) is oriented toward pixel-art sprites and is a weaker fit for the current Fox artwork.

The delivered hello pilot has **24 frames at 24 fps for one second**. Its eight anchors are at 0,3,6,9,12,15,18,23; the first and last are exact copies of the cleaned frozen baseline. Six interior anchors and sixteen in-between drawings were generated with image_gen. The viewer-right arm waves; the viewer-left arm stays down beside the left tail. Failed arm-switching/background drafts were rejected.

The first version used shared-sheet registration. The current user-requested repair measures and registers each frame to one body origin; see character-registration.md. Originals are retained. There is no scripted limb warp, per-frame auto-fitting or opacity dissolve pretending to be new drawings. The delivered sheet has 23 distinct drawings because the loop endpoints are identical. Generated anatomical and line details have some residual variation; this is a reusable pilot rather than a finished expression library.

Runtime playback waits for the atlas to load, chooses the frame from elapsed time, stops after one second, cancels an interrupted replay, resets on backgrounding, and respects system/app reduced-motion settings. Display refresh rate is independent of the authored 24fps source. Try the hand icon on **Profile → Fox**. The companions' reaction sets remain static pose images; they have not all been regenerated as 24-frame motions. Full-body PNG frames are not independently rigged limbs or lip-synced speech.

## Sound research and implementation

Duolingo's sound designer documents its [sonic identity](https://ambroseyu.com/work/duolingo-sonic-identity) and [core in-app sounds](https://ambroseyu.com/work/duolingo-core-product-sounds). The latter describes the correct-answer family escalating to combo and perfect-lesson rewards, with different intensity for frequent and rare events. Those recordings are listening references; no commercial reuse permission was established and they are not bundled.

The active v5 pack uses original compositions built from recorded marimba samples in [VSCO 2 Community Edition](https://versilian-studios.com/vsco-community/), licensed CC0. Its seven cues cover tap, correct, retry, five-answer combo, ten-answer combo, completion and flight. Quiet retries and longer reward phrases share the same instrument. Source hashes, note timings and output measurements are in `assets/sounds/v5/provenance.json`, with the license in `assets/sounds/v5/VSCO-CC0.txt`. See [the deeper sound and acting study](reanimated-reference-rebuild.md) for the primary sources, comparisons and implementation limits.

The mixer rate-limits taps, suppresses taps immediately after a result, cancels earlier result cues, prevents stale asynchronous seeks from triggering old sounds, and pauses immediately when muted. Five-answer and ten-answer streaks trigger distinct combo cues.

## Current interface changes

Opening Start/Review now uses a bounded, dismissible bottom sheet, preserving the path's scroll position and geometry. Previously studied lessons enter guided review directly; new lessons open the source video. Nodes have a short spring press response, with static behavior for reduced motion. The lesson header uses a compact two-line title and aligned 44px back target. Content remains scrollable with a pinned footer and safe-area handling.

Checks cover 360,390,432 and820px layouts, no horizontal document overflow, question controls, graph retry preservation, correct/retry images, exact path geometry before/after closing, direct review routing, 24-frame playback/replay and reduced motion. Physical device keyboards, haptics and audio playback still need device checks. Required Rams quick_review with via=rules was attempted after edits and refused because the workspace's 15 review credits are exhausted; it returned no findings or approval.

## Follow-up stability repair
The Generate 2D Assets Clean Align skill was subsequently installed and used for bbox/alpha-similarity comparison. The current Foxhello uses one stationary raster head/body plus generated arm parts at fixed shoulder/wrist pivots;24 baked rig renders replace the earlier individually changing drawings in runtime playback. The old atlas remains available as a reference. See character-registration.md for matrices, pixel errors and scope.
