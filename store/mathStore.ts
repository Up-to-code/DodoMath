import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export type WorkingNode={id:string;title:string;body:string;updatedAt:string};
type MathProgress = {
  completed: string[]; completedFoundations:string[];completeFoundation:(id:string)=>void; watched: string[]; xp: number; level: number;
  dailySolved:Record<string,number>; practiceDays:string[]; recordCorrect:()=>void;
  workingNodes:WorkingNode[];saveWorkingNode:(node:WorkingNode)=>void;
  note:string;setNote:(note:string)=>void;
  sounds:boolean; animations:boolean; haptics:boolean; dailyGoal:number; learnerName:string; onboarded:boolean; mistakes:Record<string,string[]>;
  setPreference:(key:"sounds"|"animations"|"haptics",value:boolean)=>void; setGoal:(goal:number)=>void; setName:(name:string)=>void; finishOnboarding:()=>void; rememberMistake:(id:string,prompt:string)=>void;
  markWatched: (id: string) => void; complete: (id: string) => void; setLevel: (level: number) => void;
};
export const useMathStore = create<MathProgress>()(persist((set) => ({
  completed: [], completedFoundations:[],completeFoundation:(id)=>set(s=>s.completedFoundations.includes(id)?s:{completedFoundations:[...s.completedFoundations,id],xp:s.xp+10}), watched: [], xp: 0, level: 0,
  dailySolved:{},practiceDays:[],recordCorrect:()=>set(s=>{const day=localDay();return{dailySolved:{...s.dailySolved,[day]:(s.dailySolved[day]??0)+1},practiceDays:Array.from(new Set([...s.practiceDays,day]))};}),
  workingNodes:[],saveWorkingNode:(node)=>set(s=>({workingNodes:[node,...s.workingNodes.filter(n=>n.id!==node.id)]})),
  note:"",setNote:(note)=>set({note}),
  sounds:true,animations:true,haptics:true,dailyGoal:10,learnerName:"Math learner",onboarded:false,mistakes:{},
  setPreference:(key,value)=>set({[key]:value}),setGoal:(dailyGoal)=>set({dailyGoal}),setName:(learnerName)=>set({learnerName}),finishOnboarding:()=>set({onboarded:true}),
  rememberMistake:(id,prompt)=>set(s=>({mistakes:{...s.mistakes,[id]:Array.from(new Set([...(s.mistakes[id]??[]),prompt]))}})),
  markWatched: (id) => set(s => ({watched: s.watched.includes(id) ? s.watched : [...s.watched,id]})),
  complete: (id) => set(s => s.completed.includes(id) ? s : ({completed:[...s.completed,id],xp:s.xp+20})),
  setLevel: (level) => set({level}),
}), {name:'math-lingo-progress-v1',storage:createJSONStorage(()=>AsyncStorage),version:3,migrate:(raw)=>{const old=raw as Partial<MathProgress>;return {...old,completedFoundations:old.completedFoundations??[],workingNodes:old.workingNodes??(old.note?.trim()?[{id:'legacy-working-node',title:'Working node',body:old.note,updatedAt:new Date().toISOString()}]:[])} as MathProgress;}}));

export function localDay(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
export function streakLength(days:string[]){let count=0;const d=new Date();if(!days.includes(localDay()))d.setDate(d.getDate()-1);while(days.includes(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`)){count++;d.setDate(d.getDate()-1);}return count;}
