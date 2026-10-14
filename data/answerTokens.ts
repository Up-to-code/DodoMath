import type { Question } from './mathCourse';
/** Preserve mixed-number spacing; written numbers are assembled from digits, not a revealed answer tile. */
export function answerParts(question:Pick<Question,'kind'|'answer'>){
 const numeric=question.kind==='number'||question.kind==='fraction';
 const mixed=numeric?question.answer.trim().match(/^([+-]?\d+)\s+(\d+\s*\/\s*\d+)$/):null;
 if(mixed)return {parts:[mixed[1],mixed[2].replace(/\s/g,'')],separator:' '};
 if(numeric&&/^[+-]?\d+(?:\.\d+)?(?:\/\d+)?$/.test(question.answer))return {parts:question.answer.split(''),separator:''};
 return {parts:question.answer.match(/[A-Za-z]+\([^()]*\)|\d+(?:\.\d+)?|[A-Za-z]+|[^\s]/g)??[],separator:''};
}
