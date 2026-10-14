import type { Question } from './mathCourse';
const choice=(prompt:string,options:string[],answer:string,explanation:string,equation?:string):Question=>({kind:'choice',buddy:'count',prompt,options,answer,explanation,equation,sourceStart:0});
const number=(prompt:string,answer:string,explanation:string,equation?:string):Question=>({kind:'number',buddy:'count',prompt,options:[],answer,explanation,equation,sourceStart:0});
export const FOUNDATION_LESSONS:{id:string;title:string;questions:Question[]}[]=[
 {id:'basic-counting',title:'Numbers',questions:[
  number('Count each dot once. How many are there?','4','Count from left to right: 1, 2, 3, 4.','● ● ● ●'),
  choice('Which number comes just after 6?',['5','7','8'],'7','One step forward from 6 is 7.'),
  choice('Compare the numbers. Which is greater?',['3','8','They are equal'],'8','8 is farther along the counting sequence than 3.','3 or 8'),
  number('Count backward one step from 5. Write the number.','4','One step backward from 5 gives 4.'),
 ]},
 {id:'basic-place-value',title:'Place value',questions:[
  number('The left digit counts tens. How many tens are in 24?','2','24 has 2 tens and 4 ones.','24'),
  number('The right digit counts ones. How many ones are in 24?','4','The ones digit is 4.','24'),
  number('Combine 3 tens and 2 ones. Write the number.','32','3 tens are 30. Add 2 ones: 30 + 2 = 32.','30 + 2'),
  choice('Compare the tens first. Which number is greater?',['15','21','They are equal'],'21','21 has 2 tens, while 15 has 1 ten.','15 or 21'),
 ]},
 {id:'basic-addition',title:'Addition',questions:[
  choice('Choose the operation for putting 3 apples and 2 apples together.',['3 + 2','3 − 2','3 ÷ 2'],'3 + 2','Addition combines the two groups.'),
  number('Start at 3 and count forward 2 steps. Write the sum.','5','Count 4, then 5. So 3 + 2 = 5.','3 + 2'),
  number('Start at 6 and count forward 3 steps. Write the sum.','9','Count 7, 8, 9. The sum is 9.','6 + 3'),
  number('Adding zero changes nothing. Write the sum.','7','Zero adds no extra objects, so the value stays 7.','7 + 0'),
 ]},
 {id:'basic-subtraction',title:'Subtraction',questions:[
  choice('Choose the operation for taking 3 apples away from 8.',['8 + 3','8 − 3','3 − 8'],'8 − 3','Start with 8 and subtract the 3 that leave.'),
  number('Start at 8 and count backward 3 steps. Write what remains.','5','Count 7, 6, 5. Five remain.','8 − 3'),
  number('Count backward 2 steps from 9.','7','Two steps backward are 8 and 7.','9 − 2'),
  number('Take all 4 objects away. How many remain?','0','Removing the entire group leaves zero.','4 − 4'),
 ]},
 {id:'basic-groups',title:'Equal groups',questions:[
  choice('Three groups each have 2 objects. Choose the multiplication.',['3 × 2','3 + 2','3 − 2'],'3 × 2','The two factors describe 3 groups of 2.','2 + 2 + 2'),
  number('Add the three equal groups. How many objects in total?','6','2 + 2 + 2 = 6.','3 × 2'),
  number('Share 12 objects equally among 3 groups. How many in each?','4','Each group gets 4, since 3 × 4 = 12.','12 ÷ 3'),
  number('Five equal groups contain 15 objects. How many in each?','3','15 ÷ 5 = 3, and 5 × 3 checks the total.','15 ÷ 5'),
 ]},
 {id:'basic-fractions',title:'Fractions',questions:[
  {kind:'fraction-model',buddy:'count',denominator:4,prompt:'Select 1 of the 4 equal parts.',options:[],answer:'1/4',explanation:'The numerator counts the selected part; the denominator counts all 4 equal parts.',sourceStart:0},
  choice('Two of four equal parts are selected. Which reduced fraction is the same amount?',['1/2','1/4','3/4'],'1/2','Divide both 2 and 4 by 2: 2/4 = 1/2.','2/4'),
  {kind:'fraction',buddy:'count',requireReduced:true,prompt:'Divide the top and bottom by 2. Write the reduced fraction.',equation:'2/4',options:[],answer:'1/2',explanation:'2 ÷ 2 = 1 and 4 ÷ 2 = 2. The fraction is 1/2.',sourceStart:0},
  number('All 3 of the 3 equal parts are selected. How many whole objects is that?','1','3/3 is one complete whole.','3/3'),
 ]},
 {id:'basic-decimals',title:'Decimals & percents',questions:[
  choice('A decimal of 0.5 is five tenths. Which reduced fraction equals it?',['1/2','1/5','5/1'],'1/2','Five tenths is 5/10. Dividing by 5 gives 1/2.','0.5'),
  number('Add the tenths: 2 tenths plus 3 tenths. Write the decimal.','0.5','2 + 3 = 5 tenths, or 0.5.','0.2 + 0.3'),
  number('25 out of 100 is what percent? Write the number without the % sign.','25','25 out of 100 is 25%. Write the number 25.'),
  number('Half means divide by 2. What is 50% of 10?','5','50% is half: 10 ÷ 2 = 5.'),
 ]},
 {id:'basic-shapes',title:'Shapes & measure',questions:[
  choice('Count the sides of a triangle.',['3','4','5'],'3','A triangle has 3 straight sides.'),
  number('A square has four sides of 3 cm. Add all four sides for its perimeter.','12','3 + 3 + 3 + 3 = 12 cm.','4 × 3'),
  number('A rectangle is 4 cm long and 2 cm wide. Multiply to find its area.','8','4 × 2 = 8 square centimetres.','4 × 2'),
  number('One metre is 100 cm. Divide by 2 to find half a metre in cm.','50','100 ÷ 2 = 50 cm.','100 ÷ 2'),
 ]},
];
export function foundationFor(id:string){return FOUNDATION_LESSONS.find(lesson=>lesson.id===id);}
