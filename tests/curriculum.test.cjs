const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
const storage = { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} };
function load(filename) {
  filename = path.resolve(filename); if(cache.has(filename))return cache.get(filename);
  const exports = {}; cache.set(filename,exports);
  const js = ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const resolve = name => {
    if(name==='@react-native-async-storage/async-storage')return {default:storage};
    if(name.startsWith('.')) {
      const candidate=path.resolve(path.dirname(filename),name);
      if(candidate.endsWith('.json'))return {default:JSON.parse(fs.readFileSync(candidate,'utf8'))};
      return load(candidate+'.ts');
    }
    return require(name);
  };
  vm.runInNewContext(js,{exports,require:resolve,Date,Set,Map,console,setTimeout,clearTimeout},{filename});return exports;
}
const { FOUNDATION_LESSONS } = load('data/foundations.ts');
const { SUBJECTS, SUBJECT_UNITS, learningUnits } = load('data/curriculum.ts');
const { COURSE } = load('data/mathCourse.ts');
const { isCorrectAnswer, normalizeExpression } = load('data/answerValidation.ts');
test('subject units cover every source lesson exactly once in source order', () => {
  const lessons=SUBJECTS.filter(s=>s.id!==0).flatMap(s=>learningUnits(s.id).flatMap(u=>u.lessons));
  assert.equal(lessons.length,193);assert.equal(new Set(lessons.map(l=>l.id)).size,193);
  assert.equal(lessons.map(l=>l.id).join(','),COURSE.lessons.map(l=>l.id).join(','));
  assert.ok(Object.values(SUBJECT_UNITS).every(units=>units.every(u=>u.start<=u.end)));
  assert.ok(SUBJECTS.every(s=>learningUnits(s.id).every(u=>u.lessons.length>0)));
});
test('eight starter lessons contain 32 original questions with valid and distinct wrong answers', () => {
  assert.equal(FOUNDATION_LESSONS.length,8);
  assert.equal(new Set(FOUNDATION_LESSONS.map(l=>l.id)).size,8);
  for(const lesson of FOUNDATION_LESSONS){assert.equal(lesson.questions.length,4);
    for(const q of lesson.questions){
      assert.ok(isCorrectAnswer(q,q.answer),`${lesson.id}: correct answer rejected`);
      assert.equal(isCorrectAnswer(q,'not an answer'),false);
      for(const wrong of q.options.filter(o=>o!==q.answer))assert.equal(isCorrectAnswer(q,wrong),false,`${lesson.id}: distractor accepted`);
      assert.ok(q.explanation.trim());
    }
  }
  assert.equal(learningUnits(0).flatMap(u=>u.lessons).length,8);
});
test('fraction reduction and decimal equivalence remain mathematically correct', () => {
  const fraction=FOUNDATION_LESSONS.find(l=>l.id==='basic-fractions').questions[2];
  assert.equal(isCorrectAnswer(fraction,'1/2'),true);
  assert.equal(isCorrectAnswer(fraction,'2/4'),false);
  const decimal=FOUNDATION_LESSONS.find(l=>l.id==='basic-decimals').questions[1];
  assert.equal(isCorrectAnswer(decimal,'0.50'),true);
  assert.equal(isCorrectAnswer(decimal,'0.6'),false);
});
test('beginner completion persists once, earns 10 XP once, and leaves source progress intact', () => {
  const {useMathStore}=load('store/mathStore.ts');
  useMathStore.setState({completed:['legacy-video'],xp:20});
  useMathStore.getState().completeFoundation('basic-counting');
  useMathStore.getState().completeFoundation('basic-counting');
  assert.equal(useMathStore.getState().xp,30);
  assert.equal(useMathStore.getState().completedFoundations.join(','),'basic-counting');
  assert.equal(useMathStore.getState().completed.join(','),'legacy-video');
  const old={level:7,xp:240,completed:['source-1'],watched:['source-1'],workingNodes:[{id:'note-1',body:'Keep this'}]};
  const migrated=useMathStore.persist.getOptions().migrate(old,2);
  assert.equal(migrated.level,7);assert.equal(migrated.xp,240);
  assert.equal(migrated.completed.join(','),'source-1');assert.equal(migrated.workingNodes[0].body,'Keep this');
  assert.equal(migrated.completedFoundations.length,0);
});

test('starter numeric calculations agree with an independent evaluator', () => {
  const math=require('mathjs');
  for(const lesson of FOUNDATION_LESSONS)for(const q of lesson.questions){
    if(q.kind!=='number'||!q.equation||lesson.id==='basic-place-value')continue;
    const expected=q.equation.includes('●')?(q.equation.match(/●/g)||[]).length:math.evaluate(normalizeExpression(q.equation));
    assert.ok(Math.abs(Number(q.answer)-expected)<1e-9,`${lesson.id}: incorrect arithmetic`);
  }
  const place=FOUNDATION_LESSONS.find(l=>l.id==='basic-place-value').questions;
  assert.equal(Number(place[0].answer),Math.floor(24/10));
  assert.equal(Number(place[1].answer),24%10);
  assert.equal(Number(place[2].answer),3*10+2);
  assert.equal(Number(place[3].answer),Math.max(15,21));
});

test('numeric, fractional and hard-expression tiles can reconstruct valid source answers', () => {
  const {answerParts}=load('data/answerTokens.ts');
  const {REVIEWED_EXAMS}=load('data/mathCourse.ts');
  const all=[...FOUNDATION_LESSONS.flatMap(l=>l.questions),...Object.values(REVIEWED_EXAMS).flat()];
  for(const q of all){
    if(!['number','fraction','expression'].includes(q.kind)||q.grading==='text')continue;
    const {parts,separator}=answerParts(q);
    assert.ok(isCorrectAnswer(q,parts.join(separator)),`Tiles cannot form: ${q.answer}`);
  }
  const mixed={kind:'fraction',answer:'1 1/3',options:[]};
  assert.equal(answerParts(mixed).parts.join(answerParts(mixed).separator),'1 1/3');
  assert.equal(answerParts({kind:'number',answer:'32'}).parts.join(','),'3,2');
});
