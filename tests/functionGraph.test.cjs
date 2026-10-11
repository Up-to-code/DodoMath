const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const Module = require('node:module');
function load(path) { const m = new Module(path); m.paths = module.paths; m._compile(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, path); return m.exports; }
const { curveValue, curveEquation, readCoefficients } = load('data/functionGraph.ts');
const { isCorrectAnswer } = load('data/answerValidation.ts');
for (const [family, coefficients, points] of [
  ['linear', [-2, 1], [[-1, 3], [1, -1]]],
  ['quadratic', [-1, 2, 3], [[-1, 0], [3, 0], [0, 3], [1, 4]]],
  ['quadratic', [1, -2, -3], [[-1, 0], [3, 0], [0, -3], [1, -4]]],
]) {
  for (const [x, y] of points) assert.equal(curveValue(family, coefficients, x), y);
  const q = { kind: 'function-graph', grading: 'ordered-values', answer: coefficients.join(',') };
  assert(isCorrectAnswer(q, coefficients.join(',')));
  assert(!isCorrectAnswer(q, coefficients.map(v => v + 1).join(',')));
  assert(!isCorrectAnswer(q, 'NaN,0,0'));
  assert(!isCorrectAnswer(q, coefficients.slice(1).join(',')));
}
assert.equal(curveEquation('quadratic', [-1, 2, 3]), 'y = −x² + 2x + 3');
assert.equal(curveEquation('linear', [0, 0]), 'y = 0');
assert.deepEqual(readCoefficients('broken', 'quadratic'), [1, 0, 0]);
assert.deepEqual(readCoefficients('', 'linear'), [0, 0]);
console.log('Curve targets, negative slopes, roots, vertices, coefficient order and malformed answers pass.');
