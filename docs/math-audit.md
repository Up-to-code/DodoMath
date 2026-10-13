# Mathematical audit · 13 October 2026

All **193 course videos / 789 guided questions**, plus **17 practice-puzzle questions**, have been checked for canonical-answer acceptance and populated prompts/explanations. All 11 levels are represented. The remaining-course suite additionally checks all 189 exam/guide records, lesson-level agreement, source timestamps within video duration, answer alternatives, choice distractors, malformed inputs and required intermediate forms.

The course contains 199 choices, 314 number entries, 265 expressions, 6 fractions, 1 fraction model and 4 point-graph questions. Separate practice adds ordered steps, removable answer tiles, a number line and adjustable linear/quadratic graphs. These counts describe the present content, not future function families.

**554 independent SymPy calculations pass**, covering arithmetic and symbolic answers. Additional residual checks verify authored ODE/PDE solutions, initial/boundary conditions, six antiderivatives by differentiation, eigenvector/diagonalization equations and a series recurrence. These tests compute from independently authored problem expressions; canonical-answer acceptance alone is not treated as proof of mathematical correctness.

Representative method sequences were also read across every level: negative-number movement; quadratic factorization and roots; a 5–12–13 triangle; polynomial zeros/end behavior; a trigonometric identity with cos(x)≠0; the derivative of ln(sin(x)) on its stated domain; area between curves; three-component vector arithmetic; Green's theorem on the unit circle; a Cauchy–Euler equation on x>0; and the fixed-end wave solution sin(x)cos(2t). No discrepancy was found in those sequences.

## Corrections

The symbolic grader could accept `x²/x` as `x`, erasing the restriction x≠0. Explicit variable-denominator and negative-power restrictions are now compared before symbolic cancellation. Tests reject removed-domain alternatives such as `x*x^(-1)` versus `1`; preserve `x^(-1)` versus `1/x`; and retain valid polynomial/factorized alternatives. This is a conservative explicit rational-domain check, not a complete theorem prover for every function domain.

Required forms still reject skipping the taught step: a final numeric value cannot replace a requested prime product, distributed sum, product, power or factorization. Ordered coordinates/coefficients and reduced/required-denominator fractions remain enforced. Graph checks cover negative slopes, coefficient order, roots and vertices.

Generic “check the operation” retry feedback was replaced by hints specific to fractions, graph targets, coordinate order, factorization, distribution, number-line direction and written expressions. It does not reveal the answer.

## Verification limits

This audit does **not** constitute a fresh human review of all 193 complete videos or a new transcription of them. Source guides and caption-derived records remain the evidence for teaching-method alignment. Automated answers and timestamp checks do not prove that every authored step exactly reproduces a teacher's explanation. General symbolic identities and advanced function-domain equivalence are intentionally conservative; unsupported equivalent forms can still be rejected. The interactive graph currently implements linear/quadratic families only.

Reproduce with `node tests/fullMathAudit.test.cjs`, the three existing grading/graph suites, and `python scripts/verify_course_exams.py` with SymPy available. Typecheck, lint and iOS/Android/web exports pass. The browser tests check actual written calculus, fractions, order, graphs and feedback states.
