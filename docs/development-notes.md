# Dodo Mathematics

An Expo mathematics learning app adapted from [Adrian Hajdin’s React Native Lingua starter](https://github.com/adrianhajdin/react-native-lingua).

Course: [Mathematics (All Of It), Professor Dave Explains](https://www.youtube.com/playlist?list=PLybg94GvOJ9FoGQeUMFZ4SWZsr30jlUYK).

## Run

Install dependencies with `pnpm install --frozen-lockfile` with pnpm 12.11.2. The pnpm lockfile and workspace settings preserve the starter’s Lightning CSS 1.30.1 override. Do not upgrade NativeWind without checking native exports.

```sh
npm start
npm run typecheck
npm run lint
npx expo export --platform all
```

No account or service credentials are required for the mathematics learning flow. Clerk authentication is retained from the starter and is available when `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured. Progress is local to the device; cross-device sync has not been implemented.

## Learning flow

Home continues to the first unmastered lesson. Learn contains 193 original videos in playlist order, grouped into 11 mathematical levels. Each lesson has an embedded original YouTube player, synchronized original captions through the player’s CC control, and a link to the source video’s transcript. Complete copyrighted transcripts are not redistributed in this project. Videos stream through YouTube; there are no downloaded video files.

The learner marks a video studied before entering practice. Practice reveals one question at a time. Incorrect attempts do not reveal the answer. Correct attempts reveal that step’s explanation. Repeating a completed reviewed lesson does not award duplicate XP. The Notebook lists studied videos; Progress tracks reviewed mastery and XP.

## Content status — 11 October 2026

- 193/193 video metadata records imported.
- 193/193 English source-caption transcripts imported for internal research; source links, availability, and caption counts are included in the app.
- All 193 videos now have guided practice across all 11 course levels: 789 questions total.
- The first four lessons retain their 18 foundation questions. The other 189 lessons add 771 original questions: 189 method choices and 582 written steps.
- Each new exam asks students to choose the demonstrated approach, then complete its intermediate calculations before giving a final result. Completed steps can be expanded as “Your work.”
- New exercises are grounded in timestamped source-caption method review. They use original examples; they are not exact transcriptions of every on-screen video problem. On-screen notation still needs independent review.
- 554 authored answer calculations pass independent SymPy checks. Additional checks verify ODE/PDE residuals, initial and boundary conditions, antiderivatives, diagonalization and a series recurrence.
- Algebraic grading accepts common equivalent expressions, vectors and ordered roots. Required prime-product, factored and multiplication forms prevent shortcutting those intermediate steps. Symbolic equivalence is conservative and may reject some valid advanced identities; numerical sampling is not used.

`data/course/catalog.json` contains levels and source URLs. `transcripts.json` contains caption-source metadata. `guided-exams.json` and `lesson-guides.json` contain the 189 new exams and source method references. `exam-verification.json` contains author-authored computations for the independent checker. `data/mathCourse.ts` merges the new exams with foundation practice. `store/mathStore.ts` persists mathematics progress separately from the starter’s language progress.

The authored exams and method references are available in `data/course/`.

## Importing updated captions

Use yt-dlp to obtain playlist metadata and English JSON3 captions, without downloading video media, then run:

```sh
python3 scripts/import_course.py /path/to/playlist.json /path/to/captions-directory
```

Each caption file should be named `<video-id>.en.json3`. This importer indexes caption sources and regenerates short-excerpt recall drafts with source timestamps. Reviewed exercises are stored separately and are not overwritten.

## Validation and limits

TypeScript and Expo lint checks pass. Browser testing covers the original video, source-caption panel, practice gating, incorrect retries, sequential questions, lesson completion, persistent progress, and prevention of duplicate XP. A 390-pixel phone viewport was checked visually. Native JavaScript exports are checked separately from installation and playback on physical devices.

Rams quick_review was requested with rules context, but the workspace has exhausted its Rams credits, so no Rams findings were returned. Manual accessibility checks include labeled controls, selected/disabled state, large touch targets, headings, and feedback announcements.

This is an initial local implementation. Mobile playback still requires testing on physical iOS and Android devices. App-store release, complete course teaching review, and production account syncing remain unfinished.

## Complete-course exam validation

```sh
node tests/answerValidation.test.cjs
node tests/courseExams.test.cjs
python3 scripts/verify_course_exams.py # requires SymPy
```

The coverage test exercises all 771 new canonical answers, provided alternatives, distractors, empty and malformed input, all 11 levels, equivalent symbolic forms, ordered values and mandatory intermediate forms. The first four exams and independent workshops retain their existing grading tests. A completed lesson grants 20 XP once. Practice is filtered to the currently selected course level.

## DodoMath refresh
The home screen has a continuous winding lesson path, purple unit headers, raised lesson nodes, a current-lesson marker, and a fixed bottom lesson menu. The top counters link to daily goals and progress. All course lessons remain available.

Courses, practice, progress and studied videos use simple navigable lists. Working nodes are a persisted list with a bottom + button and a separate editor. Existing notebook content is migrated to a Working node without clearing learner progress. Original videos have a dedicated Method screen and a YouTube source-transcript link.

The quiz uses compact choice rows and removable shuffled answer tiles, with keyboard entry for independent written solutions. Ordered steps disappear from the bank when selected and return when removed. Green signals success, yellow encouragement/warnings, red incorrect answers. Five story puzzles cover a bridge repair, pizza picnic, rocket route, garden growth and museum code. Kit, Nia and Orbit react with movement to answers.

Dodo v3 is an original purple bird rendered from registered transparent body, head and wing sprites. The head nods independently, and flight uses wing flaps and a gentle lift. The three studio controls preview happy, thinking and flying poses; facial expression variants are not yet separate assets. In-app and system reduced-motion preferences are honored.

Typography uses Nunito under SIL OFL (assets/fonts/Nunito-OFL.txt). Active effects are original recorded-marimba compositions using VSCO 2 Community Edition CC0 samples; see assets/sounds/v5/provenance.json and VSCO-CC0.txt. Character assets were generated for this project.

The 15-second ad is ../dodo-demo/dodomath-ad-15s-voiceover.mp4. Its synthetic narrator uses Piper LJSpeech (model metadata MIT; public-domain training dataset), action-aligned CC0 effects and original instrumental backing. The ending records the new Dodo flight. Transcript, edit timings and audio provenance are beside the video.

Validation: TypeScript, lint, 554 independent symbolic calculations and iOS/Android/web JavaScript exports pass. Browser checks cover the 360-pixel lesson menu, original-player navigation, puzzle method ordering and feedback, and Working node persistence after reload. Exports do not replace physical-device playback and haptics testing. Rams rules review was attempted but the workspace's review credits are exhausted.

## Full-screen question and graph refresh
Question screens use compact 44px answer tiles, white answer lines, an icon-only keyboard toggle, and a collapsible record of prior steps. Correct/retry feedback keeps a plain background. Companions jump for correct answers and gently shake for retries, with static status icons when reduced motion is enabled. The calculus example displays its integral separately from the prompt without changing guided steps or grading.

Shape the function adds three interactive graph exercises: a falling line, a downward quadratic and an upward quadratic. Sliders and precise numeric inputs adjust slope/intercept or a/b/c. Values include negative numbers; keyboard arrows adjust sliders, and pan/zoom controls change only the graph viewport. Wrong-answer retries preserve the coefficients. Grading checks the coefficient order against the requested mathematical curve. The graph currently supports linear and quadratic polynomials; other function families are not implemented.

`node tests/functionGraph.test.cjs` verifies negative slopes, roots, vertices and grading. Browser checks verify dragging, keyboard adjustment, panning, zoom, retry preservation, scrolling and correct feedback. iOS, Android and web JavaScript exports pass; physical-device gesture and playback checks remain needed. Rams rules review was attempted, but credits are exhausted.

The demo records a continuous 3:46 app journey, accelerated uniformly to 30 seconds. Both recordings are available in the repository release. The entire portrait viewport remains visible, including all nine question formats and navigation. CC0 sound effects are aligned with recorded actions, with original instrumental backing.

## Attribution and reuse

This project adapts Adrian Hajdin’s React Native Lingua starter, linked above. No blanket license is asserted over upstream code or third-party assets. Preserve upstream notices and check their terms before redistribution. Professor Dave’s lessons remain embedded YouTube videos; full copyrighted transcripts and downloaded course videos are not included. Font and sound licenses are bundled beside their assets. DodoMath is an independent project, unaffiliated with Duolingo.

## Fox motion and path refinement · 13 October 2026
Fox replaces the earlier bird as the main mascot. The hand control in Profile → Fox plays one authored 24-frame, one-second hello clip. Other expressions remain generated static poses. Start/Review uses a bounded bottom sheet and preserves path geometry; watched lessons enter exams directly. Compact lesson headers and spring path presses are implemented. Effects now use original rounded stereo plucks and an escalating reward family, not the earlier Kenney recordings. See skills-and-motion.md and math-audit.md for current assets, verification and limits.

## Shared pixel origin · 13 October 2026
All 24 Fox hello frames and 12 companion expression images now share canvas origin (256,256). Measured body landmarks drive uniform scale/translation plus raster-bias correction. X anchor range fell from 27px to0; remaining Y error is at most0.5px. The full-resolution atlas avoids downsample drift. Expression changes no longer add a root hop or dissolve. A standalone frame/pose inspector, per-frame matrices, pixel CSV and drift plots are delivered. Browser feedback owns its HTML audio play promise to handle rapid pause/navigation without an unhandled AbortError; native audio remains unchanged. See character-registration.md for exact formulas, tests and art limits.

The final hello is a raster cutout rig: one stationary body/head master, a generated sleeve and palm, fixed shoulder/wrist pivots, quintic easing, and24 baked frames. Independent production-atlas tests confirm exactlyzero changed protected head/body/foot pixels and identical idle/frame0/frame23 artwork. Installed clean-align skill functions were used to compare earlier alignment methods. Other characters keep separately registered expression poses.
