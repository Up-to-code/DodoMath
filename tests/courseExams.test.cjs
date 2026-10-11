const fs=require('node:fs');const assert=require('node:assert/strict');const ts=require('typescript');const Module=require('node:module');const path=require('node:path');const m=new Module(path.resolve('data/grader-test.cjs'));m.filename=path.resolve('data/grader-test.cjs');m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync('data/answerValidation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,m.filename);const {isCorrectAnswer,algebraicallyEqual}=m.exports;
const catalog=require('../data/course/catalog.json'),exams=require('../data/course/guided-exams.json'),guides=require('../data/course/lesson-guides.json');let questions=0,written=0;
assert.equal(Object.keys(exams).length,189);
for(const lesson of catalog.lessons.slice(4)){
 const qs=exams[lesson.id],guide=guides[lesson.id];assert(qs&&guide,lesson.title);assert.equal(guide.level,lesson.level);assert(qs.length>=4);assert(qs.some(q=>q.kind==='choice'));assert(qs.some(q=>q.kind!=='choice'));
 for(const q of qs){questions++;if(q.kind!=='choice')written++;assert(isCorrectAnswer(q,q.answer),`${lesson.order}: ${q.prompt}: canonical answer rejected`);for(const a of q.acceptedAnswers||[])assert(isCorrectAnswer(q,a),`${lesson.order}: alternative ${a}`);assert(!isCorrectAnswer(q,''));assert(!isCorrectAnswer(q,'not an answer'));assert(q.sourceStart>0&&q.sourceStart<lesson.duration);if(q.kind==='choice'){assert(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);for(const wrong of q.options.filter(a=>a!==q.answer))assert(!isCorrectAnswer(q,wrong));}}
}
for(const level of catalog.levels)assert(catalog.lessons.some(l=>l.level===level.id&&exams[l.id]));
const q=(answer,extra={})=>({kind:'expression',answer,...extra});
for(const [input,answer] of [['12+8x','8*x+12'],['(x+3)*(x-2)','x^2+x-6'],['x*x/4','x^2/4'],['sqrt(7)-1','-1+sqrt(7)'],['C+sin(1+x^2)','sin(x^2+1)+C'],['cos(x^2)*2x','2*x*cos(x^2)'],['pi*2/15','2*pi/15'],['3/2, -0.5','1.5,-1/2']]){
 const extra=answer.includes(',')?{grading:'ordered-values'}:{};assert(isCorrectAnswer(q(answer,extra),input),`Equivalent form rejected: ${input}`);
}
for(const [input,answer] of [['-cos(x)','cos(x)'],['x/y','-x/y'],['sin(x)*exp(t)','sin(x)*exp(-t)'],['x/x','1'],['T','t'],['C*x','C+x']])assert(!isCorrectAnswer(q(answer),input),`Wrong expression accepted: ${input}`);
for(const input of ['import("fs")','x=3;3','evaluate("2+2")','random()','x.constructor','[1,2]','9'.repeat(121),'sqrt(-1)*sqrt(-1)'])assert(!isCorrectAnswer(q('4'),input));
assert(isCorrectAnswer(q('-5,-2',{grading:'ordered-values'}),'(-5, -2)'));assert(!isCorrectAnswer(q('-5,-2',{grading:'ordered-values'}),'-2,-5'));
assert(isCorrectAnswer({kind:'fraction',answer:'4/5',requireReduced:true},'4/5'));assert(!isCorrectAnswer({kind:'fraction',answer:'4/5',requireReduced:true},'80/100'));
console.log(`189 exams / ${questions} questions / ${written} written steps: coverage, canonical answers, alternatives, distractors and malformed-input checks pass.`);

assert(!isCorrectAnswer(q('2^2*3*5',{answerForm:'prime-product'}),'60'));assert(!isCorrectAnswer(q('2^2*3*5',{answerForm:'prime-product'}),'4*15'));assert(isCorrectAnswer(q('2^2*3*5',{answerForm:'prime-product'}),'5*3*2*2'));assert(!isCorrectAnswer(q('(x+2)*(x+5)',{answerForm:'factorized'}),'x^2+7*x+10'));assert(isCorrectAnswer(q('(x+2)*(x+5)',{answerForm:'factorized'}),'(5+x)*(2+x)'));assert(!isCorrectAnswer(q('2/3*2',{answerForm:'product'}),'4/3'));console.log('Required intermediate product and factorization forms pass.');

assert(!isCorrectAnswer(q('5*3+5*4',{answerForm:'sum-products'}),'35'));assert(isCorrectAnswer(q('5*3+5*4',{answerForm:'sum-products'}),'4*5+3*5'));assert(!isCorrectAnswer(q('2^5',{answerForm:'power'}),'32'));assert(!isCorrectAnswer({kind:'number',answer:'80/100',requiredDenominator:100},'4/5'));assert(isCorrectAnswer({kind:'number',answer:'80/100',requiredDenominator:100},'80/100'));
