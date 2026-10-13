import { parse, symbolicEqual, rationalize, simplify } from 'mathjs';
import type { MathNode, SimplifyContext } from 'mathjs';
import type { Question } from './mathCourse';
export function normalizeExpression(value:string) {
 return value.trim().replace(/²/g,'^2').replace(/³/g,'^3').replace(/[×·]/g,'*').replace(/[−–]/g,'-').replace(/÷/g,'/').replace(/π/g,'pi').replace(/θ/g,'theta').replace(/λ/g,'lambda').replace(/\bln\s*\(/g,'log(').replace(/\barcsin\s*\(/g,'asin(').replace(/\barccos\s*\(/g,'acos(').replace(/\s+/g,'');
}
export function numericValue(value:string):number|null {
 const s=value.trim().replace(/[−–]/g,'-');
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)){const n=Number(s);return Number.isFinite(n)?n:null;}
 const f=s.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);if(f){const d=Number(f[2]);const n=Number(f[1])/d;return d===0||!Number.isFinite(n)?null:n;}
 const m=s.match(/^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/);if(m){const d=Number(m[3]);const whole=Number(m[1]);if(!d)return null;const n=whole+(m[1].startsWith('-')?-1:1)*Number(m[2])/d;return Number.isFinite(n)?n:null;}
 return null;
}
function reduced(value:string){const parts=value.trim().match(/^([+-]?\d+)\s*\/\s*(\d+)$/);if(!parts)return false;let a=Math.abs(Number(parts[1])),b=Number(parts[2]);if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||!b)return false;while(b){const r=a%b;a=b;b=r;}return a===1;}
const functions=new Set(['sqrt','sin','cos','tan','asin','acos','atan','sinh','cosh','tanh','exp','log','abs']);
const symbols=new Set(['x','y','z','a','b','g','h','m','r','t','T','u','v','theta','n','k','s','A','B','C','Y','tau','lambda','i','e','pi']);
/** Only bounded scalar algebra enters symbolic simplification. No assignments, accessors or evaluation of learner code. */
function safeAlgebra(value:string){
 if(!value||value.length>120||!/^[\dA-Za-z+*/^().\-]+$/.test(value))return null;
 try{const node=parse(value);let count=0,valid=true;node.traverse(n=>{count++;if(count>80)valid=false;
 if(n.type==='SymbolNode'){if(!symbols.has((n as unknown as {name:string}).name)&&!functions.has((n as unknown as {name:string}).name))valid=false;}
 else if(n.type==='ConstantNode'){const number=Number((n as unknown as {value:unknown}).value);if(!Number.isFinite(number)||Math.abs(number)>1e6)valid=false;}
 else if(n.type==='OperatorNode'){const op=n as unknown as {op:string;args:{type:string;value?:unknown}[]};if(!['+','-','*','/','^'].includes(op.op))valid=false;if(op.op==='^'&&op.args[1]?.type==='ConstantNode'&&Math.abs(Number(op.args[1].value))>100)valid=false;}
 else if(n.type==='FunctionNode'){const fn=n as unknown as {fn:{name?:string};args:unknown[]};if(!functions.has(fn.fn.name??'')||fn.args.length!==1)valid=false;}
 else if(n.type!=='ParenthesisNode')valid=false;
 });return valid?node:null;}catch{return null;}
}
/** Collect explicit rational-domain restrictions before any cancellation. */
function nonzeroFactors(node:MathNode):MathNode[] {
 const factors:MathNode[]=[];
 const unwrap=(n:MathNode):MathNode=>n.type==='ParenthesisNode'?unwrap((n as unknown as {content:MathNode}).content):n;
 const numeric=(n:MathNode):number|null=>{const a=unwrap(n) as MathNode & {value?:unknown;op?:string;args?:MathNode[]};if(a.type==='ConstantNode')return Number(a.value);if(a.type==='OperatorNode'&&a.op==='-'&&a.args?.length===1){const v=numeric(a.args[0]);return v===null?null:-v;}return null;};
 const add=(n:MathNode)=>{const a=unwrap(n) as MathNode & {op?:string;args?:MathNode[]};if(a.type==='OperatorNode'&&a.args&&(a.op==='*'||a.op==='/')){a.args.forEach(add);return;}if(a.type==='OperatorNode'&&a.op==='^'&&a.args){add(a.args[0]);return;}let variable=false;a.traverse(v=>{if(v.type==='SymbolNode'&&!['pi','e','i'].includes((v as unknown as {name:string}).name))variable=true;});if(variable)factors.push(a);};
 node.traverse(n=>{if(n.type==='OperatorNode'){const a=n as unknown as {op:string;args:MathNode[]};if(a.op==='/')add(a.args[1]);if(a.op==='^'){const exponent=numeric(a.args[1]);if(exponent!==null&&exponent<0)add(a.args[0]);}}if(n.type==='FunctionNode'){const f=n as unknown as {fn:{name:string};args:MathNode[]};if(f.fn.name==='tan')add(parse(`cos(${f.args[0].toString()})`));}});
 return factors;
}
export function algebraicallyEqual(input:string,answer:string):boolean {
 const a=normalizeExpression(input),b=normalizeExpression(answer);if(a===b)return true;
 // Existing elementary workshops request complete equations. Preserve both sides and their orientation.
 if(a.includes('=')||b.includes('=')){const aa=a.split('='),bb=b.split('=');return aa.length===2&&bb.length===2&&((algebraicallyEqual(aa[0],bb[0])&&algebraicallyEqual(aa[1],bb[1]))||(algebraicallyEqual(aa[0],bb[1])&&algebraicallyEqual(aa[1],bb[0])));}
 const left=safeAlgebra(a),right=safeAlgebra(b);if(!left||!right)return false;
 try{
  const leftDomain=nonzeroFactors(left),rightDomain=nonzeroFactors(right);
  const matches=(a:MathNode,b:MathNode)=>symbolicEqual(a,b,{context:(simplify as unknown as {realContext:SimplifyContext}).realContext});
  if(!leftDomain.every(a=>rightDomain.some(b=>matches(a,b)))||!rightDomain.every(b=>leftDomain.some(a=>matches(a,b))))return false;
  if(symbolicEqual(left,right,{context:(simplify as unknown as {realContext:SimplifyContext}).realContext}))return true;
  // Expand polynomial forms only. Variable denominators retain their domain restrictions.
  let polynomial=true;
  for(const node of [left,right])node.traverse(n=>{
   if(n.type==='FunctionNode')polynomial=false;
   if(n.type==='OperatorNode'){
    const op=n as unknown as {op:string;args:MathNode[]};
    if(op.op==='/')op.args[1].traverse(d=>{if(d.type==='SymbolNode'&&!['pi','e','i'].includes((d as unknown as {name:string}).name))polynomial=false;});
    if(op.op==='^'&&(op.args[1].type!=='ConstantNode'||!Number.isInteger(Number((op.args[1] as unknown as {value:unknown}).value))))polynomial=false;
   }
  });
  return polynomial&&rationalize(`(${a})-(${b})`).toString()==='0';
 }catch{return false;}
}
function followsForm(value:string,form:Question['answerForm']):boolean {
 if(!form)return true;
 const node=safeAlgebra(normalizeExpression(value));if(!node)return false;
 const unwrap=(n:MathNode):MathNode=>n.type==='ParenthesisNode'?unwrap((n as unknown as {content:MathNode}).content):n;
 const root=unwrap(node) as MathNode & {op?:string;args?:MathNode[]};
 if(form==='power')return root.type==='OperatorNode'&&root.op==='^';
 if(form==='sum-products')return root.type==='OperatorNode'&&root.op==='+'&&(root.args??[]).every(a=>{const term=unwrap(a) as MathNode & {op?:string};return term.type==='OperatorNode'&&term.op==='*';});
 if(root.type!=='OperatorNode'||root.op!=='*')return false;
 if(form==='product')return true;
 if(form==='factorized')return (root.args??[]).filter(a=>unwrap(a).type==='OperatorNode'&&['+','-'].includes((unwrap(a) as unknown as {op:string}).op)).length>=2;
 const prime=(n:number)=>{if(!Number.isSafeInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
 const primeFactor=(n:MathNode):boolean=>{const a=unwrap(n) as MathNode & {value?:unknown;op?:string;args?:MathNode[]};if(a.type==='ConstantNode')return prime(Number(a.value));if(a.type!=='OperatorNode'||!a.args)return false;if(a.op==='*')return a.args.every(primeFactor);if(a.op==='^'){const exponent=unwrap(a.args[1]) as MathNode & {value?:unknown};return primeFactor(a.args[0])&&exponent.type==='ConstantNode'&&Number.isInteger(Number(exponent.value))&&Number(exponent.value)>=1;}return false;};
 return primeFactor(root);
}
function listValues(s:string){const v=s.trim();const text=/^[([{].*[)\]}]$/.test(v)?v.slice(1,-1):v;return text.split(',').map(s=>s.trim());}
export function isCorrectAnswer(question:Question,value:string):boolean {
 const kind=question.kind??'choice';if(!value.trim()||value.length>120||!followsForm(value,question.answerForm))return false;
 if(question.grading==='text')return [question.answer,...question.acceptedAnswers??[]].some(a=>normalizeExpression(a).toLowerCase()===normalizeExpression(value).toLowerCase());
 if(question.grading==='ordered-values'||question.grading==='unordered-values'){
  const input=listValues(value),expected=listValues(question.answer);if(input.length!==expected.length||input.some(s=>!s))return false;
  if(question.grading==='ordered-values')return input.every((s,i)=>algebraicallyEqual(s,expected[i]));
  const remaining=[...expected];return input.every(s=>{const i=remaining.findIndex(a=>algebraicallyEqual(s,a));if(i<0)return false;remaining.splice(i,1);return true;});
 }
 if(kind==='number'||kind==='fraction'||kind==='number-line'||kind==='fraction-model'){
  if(question.requiredDenominator){const fraction=value.trim().match(/^([+-]?\d+)\s*\/\s*(\d+)$/);if(!fraction||Number(fraction[2])!==question.requiredDenominator)return false;}
  const input=numericValue(value),answer=numericValue(question.answer);return input!==null&&answer!==null&&Math.abs(input-answer)<1e-9&&(!question.requireReduced||reduced(value));
 }
 if(kind==='expression')return [question.answer,...question.acceptedAnswers??[]].some(a=>algebraicallyEqual(value,a));
 if(kind==='graph'){const parts=value.split(',').map(s=>numericValue(s));const expected=question.answer.split(',').map(s=>numericValue(s));return parts.length===2&&expected.length===2&&parts.every((n,i)=>n!==null&&expected[i]!==null&&Math.abs(n-expected[i]!)<1e-9);}
 return value===question.answer;
}
