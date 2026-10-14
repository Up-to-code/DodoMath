import { COURSE } from './mathCourse';
import { FOUNDATION_LESSONS } from './foundations';
import { lessonLabel, sectionLabel } from './courseLabels';
type Unit={title:string;start:number;end:number};
const unit=(title:string,start:number,end:number):Unit=>({title,start,end});
// These are topic units inside the original course subjects; source order is preserved.
export const SUBJECT_UNITS:Record<number,Unit[]>={
 0:[unit('Numbers',1,2),unit('Operations',3,5),unit('Fractions & decimals',6,7),unit('Shapes',8,8)],
 1:[unit('Numbers & operations',1,3),unit('Fractions & place value',4,5),unit('Decimals & percentages',6,8),unit('Whole-number methods',9,12),unit('Signs & powers',13,15),unit('Factors',16,18),unit('Fractions & data',19,21)],
 2:[unit('Equations',22,27),unit('Roots & powers',28,30),unit('Polynomials',31,37),unit('Expressions & graphs',38,43),unit('Systems & number types',44,46)],
 3:[unit('Lines & triangles',47,53),unit('Lengths & area',54,59),unit('Solids',60,61)],
 4:[unit('Functions',62,68),unit('Graphs & conics',69,75),unit('Exponentials & logs',76,81),unit('Sets & probability',82,84)],
 5:[unit('Angles & the unit circle',85,88),unit('Trig methods',89,93),unit('Triangles & coordinates',94,97)],
 6:[unit('Limits & derivatives',98,102),unit('Derivative rules',103,108),unit('Applications',109,113)],
 7:[unit('Integration basics',114,119),unit('Integration methods',120,123),unit('Area & volume',124,127),unit('Sequences & series',128,133)],
 8:[unit('Vectors & matrices',134,138),unit('Matrix methods',139,145),unit('Vector spaces',146,154),unit('Eigenvalues & decompositions',155,158)],
 9:[unit('Partial derivatives & fields',159,161),unit('Integrals & theorems',162,166)],
 10:[unit('First-order equations',167,172),unit('Second order & series',173,178),unit('Systems & transforms',179,183)],
 11:[unit('PDEs & Fourier methods',184,188),unit('Waves',189,190),unit('Diffusion',191,193)],
};
export const SUBJECTS=[{id:0,title:'Basics'},...COURSE.levels.map(section=>({id:section.id,title:sectionLabel(section)}))];
export const LEARNING_STAGES=[{title:'Start here',subjects:[0,1]},{title:'Core subjects',subjects:[2,3,4,5]},{title:'Advanced subjects',subjects:[6,7,8,9,10,11]}];
export type PathLesson={id:string;title:string;sourceTitle:string;foundation:boolean};
export function learningUnits(level:number){
 return (SUBJECT_UNITS[level]??SUBJECT_UNITS[1]).map((item,index)=>({id:`${level}-${index}`,title:item.title,lessons:level===0
  ?FOUNDATION_LESSONS.slice(item.start-1,item.end).map(lesson=>({id:lesson.id,title:lesson.title,sourceTitle:lesson.title,foundation:true}))
  :COURSE.lessons.filter(lesson=>lesson.level===level&&lesson.order>=item.start&&lesson.order<=item.end).map(lesson=>({id:lesson.id,title:lessonLabel(lesson),sourceTitle:lesson.title,foundation:false}))}));
}
