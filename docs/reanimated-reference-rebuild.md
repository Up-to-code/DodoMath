# Reanimated feedback and shared UI rebuild

Reference: [Ambrose Yu's Duolingo core product sounds](https://ambroseyu.com/work/duolingo-core-product-sounds). All 14 embedded study clips were downloaded into `.references/ambrose`, with stream metadata and download results. This folder is excluded from Git. Native HLS playback uses extensionless MPEG-TS segments; the local downloader accommodated that format. Clip 02 was sampled at 2 FPS for combo/question/feedback study; clip 04 for the milestone sequence. These are study assets, not application character or audio assets.

Observed patterns: compact bordered answer tiles; white question canvas; persistent top progress; full-width success feedback with the Continue action inside the same color field; a brief combo accent that settles before the next question; stronger milestone and perfect-lesson moments. The app keeps its purple identity, registered Fox/Nia/Orbit and mathematics-specific input/graph types.

## Runtime implementation

`components/Motion.tsx` provides Reanimated press depth (70ms anticipation and spring release), screen/question entry (210ms, 8px), character response (small scale anticipation and spring settle), and progress fill (320ms). Shared Action, course/list rows, tabs, learning-path nodes and answer banks use this motion system. Native stack transitions use the navigation renderer; in-screen animation uses Reanimated shared values.

Grading shows a compact selected-answer result and a full-width green/red feedback field. StreakMoment plays a short gold accent at five-answer multiples, with a longer ten-answer moment. CompletionMoment distinguishes a perfect lesson using the actual mistake count. Existing answer validation and instructional methods are preserved.

Motion is cosmetic: navigation, grading and progression never await animation callbacks. The saved motion preference and OS reduced-motion preference disable decorative movement. Shared values are cancelled on unmount and reset when interaction becomes disabled. Character artwork keeps the authored registration; the response is a modest whole-character scale accent, not a newly generated anatomical gesture.

## Sound

The rejected synthesized v3 pack is no longer active. The app uses the project's earlier Kenney Interface Sounds CC0 effects through the existing web/native audio adapters. Five-answer and ten-answer cues are distinct; the ten cue combines two authored confirmation effects with a short fade. Original Duolingo audio is confined to downloaded study videos. Attribution and mapping are in `assets/sounds/v4/provenance.json` and the retained Kenney license.

## Verification and limits

TypeScript and targeted ESLint pass. A full Expo web export produced a client bundle and 27 static routes. The new Reanimated imports and all active sound assets resolve. RMS/peak and color choices were reviewed from source; success actions keep dark text on green, retry actions use a darker red for legibility.

Rams quick_review with via=rules was attempted for changed UI files but refused because credits are exhausted. Browser automation was blocked by its URL policy in the preceding attempt; no alternate browser bypass was used. The iOS simulator connector could not find simctl. Runtime screenshots, native-device timing and pixel-perfect fidelity are therefore not certified. Reference-informed structure and timing are implemented; downloaded reference frames are not presented as screenshots of this app.
