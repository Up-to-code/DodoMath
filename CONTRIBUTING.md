# Contributing

Read `AGENTS.md`, [Setup](docs/setup.md), and the documentation relevant to your change. Keep changes focused and preserve the demonstrated teaching method.

## Workflow

1. Open an issue describing the concrete problem or feature.
2. Create a branch and implement the change.
3. Run typecheck, lint, and the relevant mathematical checks from the README.
4. For UI changes, verify a narrow phone viewport and mobile scrolling, keyboard entry, feedback, and reduced motion. Run Rams `quick_review` with `via: rules` and fix reported findings. If the service is unavailable, document that limitation.
5. Submit a pull request explaining the resulting behavior and validation.

Changes to grading need meaningful examples of accepted and rejected answers. Changes to course exercises need a source method/timestamp and independent verification of the calculations. Preserve correct intermediate forms instead of accepting only a final answer.

Do not commit `.env` files, API secrets, raw copyrighted transcripts, downloaded source-course videos, local progress, or generated dependency/build directories. Preserve asset notices and upstream attribution. Check native exports when changing platform behavior; exports do not replace physical-device checks.
