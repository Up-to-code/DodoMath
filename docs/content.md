# Course content and grading

## Coverage

The course indexes 193 original videos across 11 levels. The first four lessons have 18 foundation questions. The other 189 lessons add 771 questions: 189 method choices and 582 written steps, for 789 guided course questions total. Independent workshops are additional practice.

Original YouTube videos and captions are accessed through the embedded player and source links. Full copyrighted transcripts and downloaded course videos are not redistributed.

## Content files

| File | Purpose |
| --- | --- |
| `data/course/catalog.json` | Ordered lesson metadata, levels, and source URLs. |
| `data/course/transcripts.json` | Caption source metadata, availability, and cue counts. |
| `data/course/lesson-guides.json` | Method summaries and source time ranges. |
| `data/course/guided-exams.json` | The 189 additional guided exams. |
| `data/course/exam-verification.json` | Authored independent verification calculations. |
| `data/course/draft-exams.json` | Import-generated short-excerpt recall drafts; not the reviewed guided exams. |
| `data/mathCourse.ts` | Foundation exams, shared types, and merged course data. |
| `data/skillPractice.ts` | Story and function workshops. |

## Author a question

Follow the `Question` type in `data/mathCourse.ts`. Supply a prompt, kind, canonical answer, explanation, source timestamp, and any answer choices or graph targets. Add accepted alternatives only when mathematically valid. Advanced authored course exams begin with a method choice and continue through intermediate written steps.

Use `answerForm` when a step specifically requires a prime product, factorization, product, power, or sum of products. Use reduced-fraction requirements and ordered/unordered grading intentionally. A correct final result must not bypass a required intermediate method.

For `function-graph`, choose `linear` or `quadratic`, define target points, and provide coefficients in the requested order. Current graph grading does not support other function families.

## Updating source metadata

Obtain playlist metadata and English JSON3 captions with yt-dlp without downloading video media. Keep source-caption research outside the public repository. Then:

```sh
python scripts/import_course.py /path/to/playlist.json /path/to/captions-directory
```

Caption filenames use `<video-id>.en.json3`. The importer updates catalog/caption metadata and recall drafts. It does not overwrite the authored guided exams. Review its generated changes before committing.

## Verification

```sh
node tests/answerValidation.test.cjs
node tests/courseExams.test.cjs
node tests/functionGraph.test.cjs
python scripts/verify_course_exams.py
```

The Python checker requires SymPy and verifies 554 authored calculations, including derivatives, antiderivatives, matrix properties, ODE/PDE residuals, and initial/boundary conditions. JavaScript checks cover canonical answers, alternatives, distractors, malformed input, mandatory intermediate forms, and curve targets.

These are mathematical checks, not a complete independent teaching review. Exercises use original examples grounded in source-caption method review; not every on-screen notation has been independently checked. Conservative symbolic grading can reject a valid advanced identity. Report such cases with the lesson ID, prompt, and entered answer.
