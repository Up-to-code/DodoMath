import { Text, View } from 'react-native';
import { ListPage } from '@/components/ListUI';
import { localDay, streakLength, useMathStore } from '@/store/mathStore';
function dateKey(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export default function Statistics(){
 const {dailySolved,practiceDays,xp,completed}=useMathStore();
 const week=Array.from({length:7},(_,i)=>{const date=new Date();date.setDate(date.getDate()-(6-i));return {key:dateKey(date),label:date.toLocaleDateString(undefined,{weekday:'narrow'}),full:date.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'}),count:dailySolved[dateKey(date)]??0};});
 const total=week.reduce((sum,day)=>sum+day.count,0),maximum=Math.max(1,...week.map(day=>day.count));
 const stats=[['Day streak',streakLength(practiceDays)],['Active days',new Set(practiceDays).size],['Total XP',xp],['Lessons completed',completed.length]] as const;
 return <ListPage title="Statistics" back>
  <Text className="font-poppins-bold text-4xl text-text-primary mt-3">{total}</Text><Text className="font-poppins text-base text-text-secondary mt-1">Correct answers · last 7 days</Text>
  <View className="flex-row items-end gap-3 mt-8 mb-8" style={{height:170}}>{week.map(day=><View key={day.key} accessible accessibilityLabel={`${day.full}: ${day.count} correct answers`} className="flex-1 items-center justify-end h-full">
   <Text className="font-poppins-bold text-xs text-text-secondary mb-2">{day.count}</Text><View accessible={false} className="w-full rounded-t-lg" style={{height:day.count?Math.max(8,day.count/maximum*112):4,backgroundColor:day.count?'#EA580C':'#E5E5E5'}}/><Text className={`font-poppins-bold text-xs mt-3 ${day.key===localDay()?'text-[#C2410C]':'text-text-secondary'}`}>{day.label}</Text>
  </View>)}</View>
  <View className="border-2 border-border rounded-2xl px-4">{stats.map(([label,value],index)=><View key={label} className={`min-h-16 flex-row items-center justify-between gap-4 ${index<stats.length-1?'border-b border-[#EEEEEE]':''}`}><Text className="font-poppins-bold text-base text-text-primary">{label}</Text><Text className="font-poppins-bold text-xl text-[#C2410C]">{value}</Text></View>)}</View>
 </ListPage>;
}
