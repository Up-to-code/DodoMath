# DodoMath feedback sounds v3

Seven original stereo effects are active in the native and web feedback hooks: tap (85ms), correct (380ms), retry (280ms), five-answer streak (520ms), ten-answer streak (700ms), completion (950ms), flight (420ms). A shared mallet timbre, short room reflections, gentle percussion and an airy movement cue form the family. These are locally synthesized original recordings, not sampled Duolingo audio.

Reference: [Duolingo sound designer Ambrose Yu](https://ambroseyu.com/work/duolingo-core-product-sounds), describing a consistent sound family that escalates for different reward levels. The project's melodies and DSP are authored independently in `scripts/generate_feedback_sounds_v3.py`. Provenance, hashes and peak/RMS levels accompany the versioned assets. The previous sound pack is retained.

The exam plays one grading cue: retry on a wrong answer; ten-streak on multiples of ten; five-streak on other multiples of five; otherwise correct. Completion plays on the final Continue action. Audio follows the existing sound preference and haptics preference. Taps are quiet and rate-limited; a grading sound replaces the prior grading cue. Settings > Preview sounds exposes all seven cues.

Validation: TypeScript and targeted ESLint pass. All WAVs decode as 44.1kHz stereo 16-bit PCM, stay below clipping, and start/end at zero. QA results and an ordered preview are saved under `outputs/sound-design-v3`. Browser automation was refused by the browser URL policy, so runtime browser playback was not verified. Rams quick_review with via=rules was attempted and refused because review credits are exhausted. Native-device listening was not performed.
