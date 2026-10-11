# Setup

## Requirements

Use Node.js 24 (validated with 24.12.0), Git, and pnpm 12.11.2. The project uses Expo SDK 54, React Native 0.81, React 19, and NativeWind 5 preview. Keep the existing dependency lockfile and Lightning CSS override.

```sh
git clone https://github.com/Up-to-code/DodoMath.git
cd DodoMath
pnpm install --frozen-lockfile
pnpm web
```

Use the URL Expo prints. If its default port is busy, accept its suggested port. To choose a port explicitly:

```sh
pnpm exec expo start --web --port 8082
```

## iOS and Android

The retained Stream/WebRTC integration uses native modules, so use a development build for the complete app. Expo Go does not contain every native module used here.

- iOS: macOS, Xcode, and an installed simulator or connected device.
- Android: Android Studio, the Android SDK, and an emulator or connected device.

```sh
pnpm ios
# or
pnpm android
```

These commands generate/build native projects. Native JavaScript export validation does not confirm physical-device behavior. Test YouTube playback, graph gestures, audio, safe areas, and keyboard layout on each device target.

## Optional integrations

The mathematics flow runs with no `.env` file. Do not copy placeholder credentials into a working configuration. If enabling an integration, create `.env` and add only real values for that integration; the file is ignored by Git.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional starter authentication. Client-visible publishable key. |
| `POSTHOG_PROJECT_TOKEN` | Optional analytics ingestion token; included in app configuration. |
| `POSTHOG_HOST` | Analytics endpoint. |
| `STREAM_API_KEY` | Stream public application key. |
| `STREAM_API_SECRET` | Server-only Stream secret. Never expose it through client configuration. |
| `VISION_AGENT_URL` | Optional Python agent service endpoint. |

The retained Python agent has its own `vision-agent/.env.example` and configuration. It is separate from guided mathematics practice. Keep its provider secrets server-side.

## Validation

```sh
pnpm typecheck
pnpm lint
node tests/answerValidation.test.cjs
node tests/courseExams.test.cjs
node tests/functionGraph.test.cjs
pnpm exec expo export --platform all
```

For independent symbolic checks, install SymPy in a Python virtual environment and run `python scripts/verify_course_exams.py`.

## Troubleshooting

- **Stale styles or cached routes:** restart with `pnpm exec expo start --clear`.
- **Missing native module:** rebuild the iOS/Android development app after changing native dependencies.
- **Video does not play:** check network connectivity and the source YouTube video. Videos are streamed, not bundled for offline playback.
- **Valid answer rejected:** record the lesson/question and entered expression, then check required intermediate forms and accepted answers. Do not loosen grading with unbounded evaluation or numeric sampling.
- **Different progress on another device:** local AsyncStorage progress is not synchronized.
