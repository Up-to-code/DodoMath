# Reanimated feedback and shared UI rebuild

Reference: [Ambrose Yu's Duolingo core product sounds](https://ambroseyu.com/work/duolingo-core-product-sounds). All 14 embedded study clips were downloaded into `.references/ambrose`, with stream metadata and download results. This folder is excluded from Git. Native HLS playback uses extensionless MPEG-TS segments; the local downloader accommodated that format. Clip 02 was sampled at 2 FPS for combo/question/feedback study; clip 04 for the milestone sequence. These are study assets, not application character or audio assets.

Observed patterns: compact bordered answer tiles; white question canvas; persistent top progress; full-width success feedback with the Continue action inside the same color field; a brief combo accent that settles before the next question; stronger milestone and perfect-lesson moments. The app uses its orange accent identity, registered Fox/Nia/Orbit and mathematics-specific input/graph types.

## Runtime implementation

`components/Motion.tsx` provides Reanimated press depth (70ms anticipation and spring release), screen/question entry (210ms, 8px), companion response (860 ms anticipation, emphasis and eased settle), and progress fill (320ms). Shared Action, course/list rows, tabs, learning-path nodes and answer banks use this motion system. Native stack transitions use the navigation renderer; in-screen animation uses Reanimated shared values.

Grading shows a compact selected-answer result and a full-width green/red feedback field. StreakMoment plays a short gold accent at five-answer multiples, with a longer ten-answer moment. CompletionMoment distinguishes a perfect lesson using the actual mistake count. Existing answer validation and instructional methods are preserved.

Motion is cosmetic: navigation, grading and progression never await animation callbacks. The saved motion preference and OS reduced-motion preference disable decorative movement. Shared values are cancelled on unmount and reset when interaction becomes disabled. Character artwork keeps the authored registration; the response is a modest whole-character scale accent and registered-pose dissolve, not a newly generated anatomical gesture.

## Sound

The active v5 pack contains original DodoMath cues composed from recorded VSCO 2 Community Edition marimba samples, licensed CC0. Short correct/retry cues and escalating five-answer, ten-answer and completion phrases share a timbre. No Duolingo recording or WaBing voice is bundled. Source URLs, sample hashes, voicing, note timings and measured output levels are in `assets/sounds/v5/provenance.json`; the source license is `assets/sounds/v5/VSCO-CC0.txt`. Previous synthesized and stock packs remain recoverable in Git history.

## Verification and limits

TypeScript and targeted ESLint pass. A full Expo web export produced a client bundle and 27 static routes. The new Reanimated imports and all active sound assets resolve. RMS/peak and color choices were reviewed from source; success actions keep dark text on green, retry actions use a darker red for legibility.

Rams quick_review with via=rules was attempted for changed UI files but refused because credits are exhausted. Browser automation was blocked by its URL policy in the preceding attempt; no alternate browser bypass was used. The iOS simulator connector could not find simctl. Runtime screenshots, native-device timing and pixel-perfect fidelity are therefore not certified. Reference-informed structure and timing are implemented; downloaded reference frames are not presented as screenshots of this app.


## Shared feedback clock refinement

Answer feedback now has a unique event and a monotonic presentation time. Web audio is fetched and decoded when the screen mounts, then scheduled with Web Audio at a 40 ms lead. `getOutputTimestamp()` maps that audio deadline to the presentation clock, including output latency; where unavailable, the adapter uses reported base/output latency. The character, registered-pose dissolve, tile colors, feedback footer and 5/10 streak read the same event. A late React commit starts at the elapsed phase instead of adding another full animation delay.

Nia and Orbit use a restrained 860 ms envelope with quintic easing. Fox instead uses baked, layered 960 ms success and 880 ms retry gestures, without an additional whole-body scale pulse. All poses and both Fox atlases stay mounted for decoding; a 140 ms blend preserves the registered body origin. The feedback footer keeps the companion and concise heading visible while long explanations scroll within 112 px; compact tiles retain accessible touch targets. Mathematical content and validation are unchanged.

Native audio seeks first and then shares a 40 ms timer deadline with the visual event and haptic. Expo does not expose a sample-accurate native output scheduler here, so device audio latency is not measured or eliminated. Web output timing is also limited by the display frame rate and the browser's latency estimates; physical speaker/display synchronization still needs listening on the target device.

Muted or unavailable audio still publishes visual feedback. Cold preparation is capped at 180 ms so a failed asset or blocked audio context cannot stall grading. A lock prevents repeated Check/Continue taps from duplicating XP or progress. Continue/retry cancel old audio; mute silences scheduled output without losing pending visual feedback. Unmount cancels pending requests and releases audio nodes.

Validation: `node --test tests/feedback-sync.test.cjs` passes 11 checks covering presentation deadline mapping, late commits, replacement/cancellation, muted feedback, mute during loading, cold-load fallback, latency fallback and the native seek/timer lifecycle. TypeScript and Expo lint pass. Required Rams `quick_review` with `via=rules` was attempted again and refused because the review credits remain exhausted. No browser-policy workaround was used, and runtime visual/audio synchronization is not certified by these numerical tests.


## Deeper sound and acting study — October 14, 2026

The previous stock sound pack was not Duolingo's original audio. The following primary sources explain the relevant design and engineering decisions. Timing and music choices below are our production decisions, not claimed Duolingo specifications.

| Primary source | Documented evidence | Application here |
| --- | --- | --- |
| [Ambrose Yu: Duolingo sonic identity](https://ambroseyu.com/work/duolingo-sonic-identity) | The palette grew from OP-1 and marimba explorations. The suite eventually covered answers, combos and session mechanics. Duo's WaBing is a separately performed and processed voice. | Use a recorded mallet timbre with one cohesive family, without claiming stock confirmations or a generated imitation are the original recordings. |
| [Ambrose Yu: core product sounds](https://ambroseyu.com/work/duolingo-core-product-sounds) | Five-answer, ten-answer and perfect rewards escalate one sonic idea; frequent mechanics require restraint. | Reserve added notes and longer tails for rare rewards. Keep normal grading small and distinct. |
| [Ambrose Yu: Simply case study](https://ambroseyu.com/work/simply-sonic-identity) | This separate product documents functional and emotional briefs. Its fail cue uses a shorter related articulation; a long one reads as disappointment. | Our retry is a short, lower, quieter phrase. This is a transferable design principle from Simply, not a claim about Duolingo's wrong-answer instrumentation. |
| [Duolingo: world character visemes](https://blog.duolingo.com/world-character-visemes/) | Audio timing triggers a Rive state machine; body and mouth states can combine, blend and interrupt. Outcome states include correct and wrong reactions. | Keep our existing Reanimated runtime and shared presentation clock. Use body-part tracks and deterministic frames for Fox; cancel on advancing. No new Rive dependency is needed for this change. |
| [Duolingo ABC Android engineering](https://blog.duolingo.com/a-good-read-building-duolingo-abc-for-android/) | Coordinating animation and audio is an explicit asynchronous engineering problem; coroutines compose simultaneous and sequential work. | Audio readiness and animation start share a bounded event rather than unrelated callbacks. Preserve silent fallback and cancellation. |
| [Duolingo: building character](https://blog.duolingo.com/building-character/) | Characters receive individual correct-answer celebrations, with additional mid-lesson rewards. | Fox has its own restrained gesture instead of applying the same scale pop to every companion. |
| [Versilian Studios: VSCO 2 CE](https://versilian-studios.com/vsco-community/) and [repository license](https://github.com/sgossner/VSCO-2-CE/blob/master/LICENSE) | The creator publishes the recorded sample library under CC0. | Four marimba recordings supply real attacks and resonances; local composition/transposition produces the seven cues. Preserve credit and source hashes. |
| [MDN: audio output timestamps](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp) | Context time can be mapped to the performance clock using the output timestamp. | Retain output-clock scheduling for the new pack. This estimates playback presentation; it does not certify physical-device synchronization. |

The earlier evidence library contains all 14 embedded core-product clips, with contact sheets from clips 02 and 04. These remain local study material. Public soundboard uploads are not reliable evidence of a current app version, original authorship, or permission to redistribute; they are not bundled. This study does not claim a complete inventory of every sound across Duolingo versions.

### Original cue brief and measurements

The new sequence is authored locally from C4, G4, B4 and F3 recordings. Correct uses E4 then G4, 170 ms apart. Retry uses two lower descending notes, 95 ms apart. The five-answer cue extends the correct phrase, and the ten-answer/completion phrases add a higher payoff. This is original voicing and rhythm, not an extraction of Duolingo's melody. Source attacks are aligned; tail fades prevent truncation clicks. No synthetic FM mallet, copied voice, or original Duolingo waveform is shipped.

| Cue | Duration | Peak amplitude | Measured onset |
| --- | ---: | ---: | ---: |
| Tap | 85 ms | 0.24 | 0.59 ms |
| Correct | 580 ms | 0.55 | 0.70 ms |
| Retry | 330 ms | 0.31 | 0.59 ms |
| Five-answer reward | 830 ms | 0.55 | 0.70 ms |
| Ten-answer reward | 1030 ms | 0.55 | 0.70 ms |
| Completion | 1120 ms | 0.55 | 0.88 ms |
| Flight | 720 ms | 0.55 | 0.70 ms |

Onsets use a 0.002 sample-amplitude threshold on the exported PCM, before runtime volume. These are file measurements, not listener ratings or acoustic latency measurements. The sound keeps its natural speed while the character has a longer anticipation/settle; all start from the same event.

### Fox movement and QA

The new motion uses the existing approved 33-part Fox rig. The success gesture has a small arm anticipation, 32-degree shoulder lift, elbow/wrist follow-through, a two-degree head response and a delayed four-degree tail accent. Retry has a small considerate head tilt and open arm gesture while retaining a reassuring mouth, rather than sadness or shaking. Garment components follow their existing parent ownership. Feet and pelvis are not animated.

Both clips are non-looping performances and hold the final pose. Success contains 30 frames over 960 ms; retry contains 28 over 880 ms. Atlases use 256 px cells sampled from 512 px renders. The former generic reaction was 520 ms. A longer visual hold is intentional and does not slow the sound waveform or prevent a student from continuing.

Every rendered frame was checked for protected shoe pixels and shoe-joint coordinates: zero changed channels and zero drift. The minimum source alpha margin is 58 px. QH's existing assessment finds connected alpha ratio 1, zero clipping/off-canvas samples, zero triangle flips and zero joint-limit overruns for both clips. Its numeric score is 100 under those declared constraints. This is not 100% artistic accuracy: no per-joint attachment contracts were declared in this legacy rig, and its global connected-alpha heuristic does not prove anatomical quality. Local contact sheets were inspected; browser/device playback remains unverified because the browser tool's earlier URL-policy rejection was not bypassed.

Rebuild commands: `node scripts/build_feedback_fox.mjs /path/to/QH-Motion-Studio` and `python3 scripts/build_sampled_feedback.py`. The latter requires the four attributed samples plus license in `.references/vsco`; source URLs are preserved in the active provenance manifest. The app does not need QH or those source recordings installed to play the bundled outputs. Required Rams review was attempted again with `via=rules`; exhausted credits prevented a result.
