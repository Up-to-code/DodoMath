# Architecture

Expo Router supplies the screens. Zustand and AsyncStorage persist local learning state. React Native components render mobile/web interactions, React Native SVG draws graph and puzzle scenes, and MathJS supports bounded expression grading.

## Main routes

| Surface | Source |
| --- | --- |
| Home path | `app/(tabs)/index.tsx` |
| Courses | `app/(tabs)/learn.tsx` |
| Practice menu | `app/(tabs)/ai-teacher.tsx` |
| Working nodes list | `app/(tabs)/chat.tsx` |
| Profile | `app/(tabs)/profile.tsx` |
| Original lesson player | `app/lesson/[id].tsx` |
| Demonstrated method | `app/lesson-method/[id].tsx` |
| Guided exam or puzzle | `app/exam/[id].tsx` |
| Puzzle collection | `app/practice/puzzles.tsx` |
| Working node editor | `app/working-node/[id].tsx` |
| Course progress | `app/progress/index.tsx`, `app/progress/[id].tsx` |
| Goals and preferences | `app/quests.tsx`, `app/settings.tsx` |

Some route names remain from the language-learning starter; their displayed labels are mathematics-specific.

## Core modules

- `data/mathCourse.ts`: typed lessons, nine question kinds, foundation exams, and imported course content.
- `data/skillPractice.ts`: independent story puzzles and function graph workshops.
- `data/answerValidation.ts`: bounded mathematical parsing, equivalence, required forms, and answer validation.
- `data/functionGraph.ts`: curve calculations and coefficient validation.
- `store/mathStore.ts`: selected course, watched/completed lessons, XP, mistakes, settings, and Working nodes.
- `components/QuestionInteraction.tsx`: answer tiles, keyboard input, ordering, fractions, number lines, and coordinates.
- `components/FunctionGraph.tsx`: coefficient sliders, precise inputs, and graph pan/zoom.
- `components/CharacterSprite.tsx`, `components/ModeCharacter.tsx`, and `components/Fox.tsx`: generated raster poses, expression transitions, and companion feedback motion; `hooks/useMotion.ts` respects motion preferences.
- `components/CoursePlayer.tsx` and `.web.tsx`: native embedded player and web player.
- `hooks/useFeedback.ts`: licensed sound effects and haptics.

## Learning sequence

Choose a lesson → watch the original video → mark it studied → consult the method → complete each guided question → record mastery. An incorrect attempt preserves the current step for a retry. A correct step reveals its explanation. Completing the same mastered lesson again does not grant duplicate XP.

Independent puzzles provide practice without completing a source-video lesson. Working nodes let learners save their own method notes.

## State and integrations

Learning data is local. No production account-sync backend is implemented. Starter auth, Stream APIs, optional analytics, and a Python vision agent remain separate integrations. Secrets belong in server environments; publishable/ingestion keys are distinct from server secrets.
