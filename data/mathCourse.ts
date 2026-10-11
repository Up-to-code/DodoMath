import catalog from './course/catalog.json';
import transcripts from './course/transcripts.json';
import guided from './course/guided-exams.json';
import guides from './course/lesson-guides.json';
export type Cue = { start: number; duration: number; text: string };
export type QuestionKind = "choice"|"number"|"fraction"|"expression"|"order"|"fraction-model"|"number-line"|"graph"|"function-graph";
export type Question = { equation?:string; curveFamily?:'linear'|'quadratic';targetPoints?:[number,number][]; buddy?:'count'|'algebra'|'graph';scene?:'bridge'|'matrix';sceneCount?:number;sceneTotal?:number; prompt: string; options: string[]; answer: string; explanation: string; sourceStart: number; kind?:QuestionKind; acceptedAnswers?:string[]; requireReduced?:boolean; visual?:"apples"|"groups"|"pizza"; denominator?:number; problem?:string;stepLabel?:string;answerFormat?:string;requiredDenominator?:number;answerForm?:'prime-product'|'factorized'|'product'|'power'|'sum-products';grading?:'ordered-values'|'unordered-values'|'text'; };
export type MathLesson = typeof catalog.lessons[number];
export const COURSE = catalog;
export const CAPTION_SOURCES: Record<string, {url:string;language:string;cueCount:number;captionStatus:string}> = transcripts;
export const LESSON_GUIDES = guides as Record<string,{order:number;level:number;title:string;problem:string;method:string;sourceStart:number;sourceEnd:number;sourceUrl:string;basis:string;steps:string[]}>;
export const DRAFT_EXAMS: Record<string, Question[]> = {};
export const GUIDED_EXAMS = guided as Record<string,Question[]>;
// A displayed formula replaces repeated prose without changing any guided step or answer.
GUIDED_EXAMS.zNU8iK8sGD0 = GUIDED_EXAMS.zNU8iK8sGD0.map((q,i)=>({...q,equation:'∫ x sin(x) dx',problem:undefined,prompt:i===0?'Choose the integration-by-parts setup.':q.prompt}));
const FOUNDATION_EXAMS: Record<string, Question[]> = {
  JbhBdOfMEPs: [
    {prompt:'Which question has a definite mathematical answer?',options:['Which pizza tastes best?','What is 1 + 1?','Which movie is best?'],answer:'What is 1 + 1?',explanation:'The introduction distinguishes definite mathematical questions from subjective preferences.',sourceStart:165},
    {prompt:'How does Professor Dave describe the approach to this course?',options:['Memorize answers without questions','Ask questions and build tools to answer them','Begin with differential equations'],answer:'Ask questions and build tools to answer them',explanation:'The course develops tools in response to questions, beginning with arithmetic.',sourceStart:270},
    {prompt:'Where does this course begin?',options:['Basic arithmetic','Advanced calculus','Matrix decomposition'],answer:'Basic arithmetic',explanation:'The course begins with elementary arithmetic and develops more advanced mathematics progressively.',sourceStart:336},
  ],
  rV7WjNWHOsI: [
    {prompt:'You receive 2 apples, then 3 more. Which operation models combining the groups?',options:['2 + 3','3 − 2','2 ÷ 3'],answer:'2 + 3',explanation:'Addition combines two groups. First represent the situation with symbols.',sourceStart:155},
    {kind:'number',visual:'apples',prompt:'Now count the combined group. What is the sum of 2 + 3?',options:['4','5','6'],answer:'5',explanation:'Two apples and three apples form a group of five.',sourceStart:170},
    {prompt:'You have 5 apples and eat 1. Which expression represents what remains?',options:['5 + 1','1 − 5','5 − 1'],answer:'5 − 1',explanation:'Subtraction removes an amount from the initial group.',sourceStart:213},
    {kind:'number',prompt:'What is the difference in 5 − 1?',options:['4','5','6'],answer:'4',explanation:'Removing one apple leaves four. Model the action before computing.',sourceStart:228},
    {prompt:'Would reversing the subtraction always give the same result?',options:['Yes','No'],answer:'No',explanation:'Subtraction is not commutative. The order of the numbers matters.',sourceStart:300},
  ],
  fr04p6Ar9ic: [
    {visual:'groups',prompt:'Two apples are added five times. Choose the repeated addition.',options:['2 + 5','2 + 2 + 2 + 2 + 2','5 − 2'],answer:'2 + 2 + 2 + 2 + 2',explanation:'Five equal groups of two can be represented as repeated addition.',sourceStart:45},
    {prompt:'Which multiplication abbreviates that repeated addition?',options:['2 × 5','2 × 2','5 × 5'],answer:'2 × 5',explanation:'The factors describe the equal groups: two apples, five times.',sourceStart:80},
    {kind:'number',prompt:'What is the product of 2 × 5?',options:['7','10','25'],answer:'10',explanation:'Adding two five times gives ten.',sourceStart:65},
    {prompt:'You need 15 apples in baskets of 5. Choose the operation before finding the answer.',options:['15 + 5','15 × 5','15 ÷ 5'],answer:'15 ÷ 5',explanation:'Division finds how many equal groups fit into the total.',sourceStart:143},
    {kind:'number',prompt:'How many baskets do you need?',options:['3','5','10'],answer:'3',explanation:'Fifteen divided by five per basket gives three baskets.',sourceStart:157},
  ],
  qyW2mWvvtZ8: [
    {kind:'fraction-model',denominator:8,prompt:'A pizza has 8 equal slices. Select one slice of the pizza.',options:['1/8','8/1','1/4'],answer:'1/8',explanation:'The numerator counts selected slices; the denominator counts equal parts in the whole.',sourceStart:55},
    {prompt:'To reduce 2/8 using the demonstrated method, what must you do?',options:['Divide only the top by 2','Divide both top and bottom by 2','Subtract 2 from both'],answer:'Divide both top and bottom by 2',explanation:'Doing the same division to numerator and denominator preserves the fraction’s value.',sourceStart:95},
    {kind:'fraction',requireReduced:true,prompt:'After dividing the top and bottom of 2/8 by 2, write the reduced fraction.',options:['1/4','2/4','1/8'],answer:'1/4',explanation:'2 ÷ 2 = 1 and 8 ÷ 2 = 4, so two eighths is one fourth.',sourceStart:111},
    {kind:'number',prompt:'Convert 4/3 to a mixed number. First, how many whole groups of 3 fit into 4?',options:['1','2','3'],answer:'1',explanation:'Three thirds make one whole. One third remains.',sourceStart:187},
    {kind:'fraction',prompt:'Now write the mixed number.',options:['1 1/3','1 2/3','2 1/3'],answer:'1 1/3',explanation:'Four thirds is one whole and one third.',sourceStart:199},
  ],
};
export const REVIEWED_EXAMS: Record<string, Question[]> = {...FOUNDATION_EXAMS,...GUIDED_EXAMS};
export function examFor(id: string) { return REVIEWED_EXAMS[id] ?? []; }
export function timestamp(seconds: number) { const s=Math.floor(seconds); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
