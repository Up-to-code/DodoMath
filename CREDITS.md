# Credits and reuse terms

DodoMath adapts [Adrian Hajdin / JavaScript Mastery’s React Native Lingua starter](https://github.com/adrianhajdin/react-native-lingua). Retained starter code and artwork remain subject to their original terms. This repository does not assert a blanket license over upstream code or third-party assets.

## Course

[Professor Dave Explains — Mathematics (All Of It)](https://www.youtube.com/playlist?list=PLybg94GvOJ9FoGQeUMFZ4SWZsr30jlUYK) supplies the original embedded video lessons. Videos stream through YouTube; full copyrighted transcripts and downloaded course media are not included. DodoMath exercises use original examples and source-linked method review. No endorsement by the course creator is claimed.

## Fonts and sound

- Nunito: SIL Open Font License, included in `assets/fonts/Nunito-OFL.txt`.
- Kenney Interface Sounds 1.0: CC0. The license and source mapping are in `assets/sounds/Kenney-CC0.txt` and `assets/sounds/provenance.json`. Audio was decoded to PCM WAV for the app.
- Retained starter fonts and other assets: consult their upstream terms before reuse; no new license is asserted here.

## Characters and demo

Dodo, Kit, Nia, and Orbit artwork was generated for this project. Dodo is layered into transparent head/body/wing sprites. The app and artwork are independent of Duolingo and do not imply an affiliation or endorsement.

The release’s journey videos use real continuous app interactions. The 30-second version uniformly accelerates the original 3:46 portrait recording. Action-synced CC0 effects and original instrumental backing are added during rendering; they are not native browser audio captures.

Check the applicable upstream and asset terms before redistributing or commercializing a build.

## 13 October 2026 character and sound refresh

Fox is the primary mascot. Fox, Nia and Orbit use generated transparent four-pose PNG atlases, registered in `constants/images.ts`. Fixed quadrant extraction preserves generated pixels and alpha; runtime blends whole poses rather than claiming an independently joint-rigged character. Legacy Dodo component/route names redirect to Fox for compatibility. The application/repository name remains DodoMath.

The current app WAV effects are original additive synthesis, documented in `assets/sounds/provenance.json`. Kenney’s original pack notice remains for the prior asset history; it does not describe the newly generated WAV recordings. The reference sound designer’s Duolingo audio was not sampled.
