import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotionPressable, MotionEntry } from './Motion';
import { Action, MathScreen } from './MathUI';
import { ModeCharacter } from './ModeCharacter';
import { learningUnits, SUBJECTS } from '@/data/curriculum';
import { useFeedback } from '@/hooks/useFeedback';
import { streakLength, useMathStore } from '@/store/mathStore';
function PathNode({label,done,active,expanded,last,onPress}:{label:string;done:boolean;active:boolean;expanded:boolean;last:boolean;onPress:()=>void}){
 return <MotionPressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{expanded}} onPress={onPress} style={{width:58,height:52,borderRadius:30,alignItems:'center',justifyContent:'center',backgroundColor:done?'#58CC02':active?'#EA580C':'#E5E5E5',borderBottomWidth:5,borderBottomColor:done?'#459B00':active?'#C2410C':'#CFCFCF'}}><Ionicons name={done?'checkmark':last?'trophy':'star'} size={24} color={done||active?'white':'#AFAFAF'} accessible={false}/></MotionPressable>;
}
export default function LearningPath(){
 const router=useRouter(),insets=useSafeAreaInsets(),feedback=useFeedback();
 const {height}=useWindowDimensions();
 const {level,completed,completedFoundations,watched,xp,practiceDays}=useMathStore();
 const [selected,setSelected]=useState<string|null>(null);
 const units=learningUnits(level),lessons=units.flatMap(unit=>unit.lessons),doneIds=level===0?completedFoundations:completed;
 const subject=SUBJECTS.find(item=>item.id===level)??SUBJECTS[1];
 const headerTitle=({0:'Basics',1:'Arithmetic',2:'Algebra',3:'Geometry',4:'Functions',5:'Trigonometry',6:'Derivatives',7:'Integrals',8:'Linear algebra',9:'Multivariable',10:'Diff. equations',11:'Partial eqs.'} as Record<number,string>)[level]??subject.title;
 const current=lessons.find(lesson=>!doneIds.includes(lesson.id));
 const selectedLesson=lessons.find(lesson=>lesson.id===selected);
 const review=!!selected&&(doneIds.includes(selected)||watched.includes(selected));
 useEffect(()=>setSelected(null),[level]);
 return <><MathScreen header={<View className="w-full max-w-[520px] self-center flex-row items-center justify-between gap-3 px-5 py-2 border-b border-[#F1F1F1]">
  <MotionPressable accessibilityRole="button" accessibilityLabel={`Choose subject. Current subject ${subject.title}`} onPress={()=>router.push('/(tabs)/learn')} className="min-h-11 flex-row items-center gap-2"><Ionicons name="book-outline" size={22} color="#C2410C"/><Ionicons name="chevron-down" size={14} color="#737373"/></MotionPressable>
  <Text numberOfLines={1} className="flex-1 font-poppins-bold text-sm text-text-primary">{headerTitle}</Text>
  <MotionPressable accessibilityRole="button" accessibilityLabel={`${streakLength(practiceDays)} day streak. Open daily goal`} onPress={()=>router.push('/quests')} className="min-h-11 flex-row items-center gap-1"><Ionicons name="flame" size={22} color="#C2410C"/><Text className="font-poppins-bold text-sm text-[#9A3412]">{streakLength(practiceDays)}</Text></MotionPressable>
  <MotionPressable accessibilityRole="button" accessibilityLabel={`${xp} XP. Open progress`} onPress={()=>router.push('/progress')} className="min-h-11 flex-row items-center gap-1"><Ionicons name="flash" size={20} color="#AD5700"/><Text className="font-poppins-bold text-sm text-[#735B00]">{xp}</Text></MotionPressable>
 </View>}>
  {units.map((unit,unitIndex)=><View key={unit.id} className="mb-4">
   <MotionPressable accessibilityRole="button" accessibilityLabel={`${unit.title}. Open unit lessons`} onPress={()=>router.push(`/practice/videos?unit=${unit.id}`)} className="min-h-12 flex-row items-center gap-2 border-b border-[#EEEEEE] mb-3"><Text accessibilityRole="header" className="flex-1 font-poppins-bold text-base text-text-primary">{unit.title}</Text><Ionicons name="list-outline" size={20} color="#C2410C"/></MotionPressable>
   {unit.lessons.map((lesson,index)=>{
    const done=doneIds.includes(lesson.id),active=current?.id===lesson.id,offset=[0,-26,-46,-26,0,26,46][index%7]*(unitIndex%2===0?1:-1);
    return <View key={lesson.id} style={{width:'100%',height:80,alignItems:'center',justifyContent:'center'}}>
     {index===2&&<View pointerEvents="none" style={{position:'absolute',left:unitIndex%2===0?'66%':'3%',top:9}}><ModeCharacter mode={level===0||level<=2?'count':level>=9?'graph':'algebra'} size={62}/></View>}
     <View style={{transform:[{translateX:offset}],borderWidth:active?2:0,borderColor:'#FDBA74',borderRadius:38,padding:active?4:6}}><PathNode label={`${lesson.sourceTitle}. ${done?'Completed':active?'Current lesson':'Upcoming lesson'}`} done={done} active={active} expanded={selected===lesson.id} last={index===unit.lessons.length-1} onPress={()=>{feedback('tap');setSelected(selected===lesson.id?null:lesson.id);}}/></View>
    </View>;
   })}
  </View>)}
 </MathScreen>
 <Modal visible={!!selectedLesson} transparent animationType="fade" onRequestClose={()=>setSelected(null)}><View className="flex-1 justify-end">
  <Pressable accessibilityRole="button" accessibilityLabel="Dismiss lesson menu" onPress={()=>setSelected(null)} className="absolute inset-0 bg-black/20"/>
  {/* Bound the animation wrapper to the viewport; a percentage on its child collapses content. */}
  <MotionEntry trigger={selected??undefined} style={{width:'100%',maxWidth:520,alignSelf:'center',maxHeight:Math.max(0,height-insets.top-16)}}><View accessibilityViewIsModal onAccessibilityEscape={()=>setSelected(null)} className="w-full shrink rounded-t-2xl bg-white border-t border-border px-5 pt-3" style={{paddingBottom:Math.max(insets.bottom,16)}}>
   <ScrollView style={{flexGrow:0,flexShrink:1}} contentContainerStyle={{paddingBottom:12}} keyboardShouldPersistTaps="handled">
    <View className="flex-row items-start gap-3 mb-2"><Text accessibilityRole="header" className="flex-1 font-poppins-bold text-text-primary text-lg leading-6 pt-2">{selectedLesson?.title}</Text><MotionPressable accessibilityRole="button" accessibilityLabel="Close lesson menu" onPress={()=>setSelected(null)} className="w-11 h-11 items-center justify-center"><Ionicons name="close" size={22} color="#737373" accessible={false}/></MotionPressable></View>
    <Text className="font-poppins text-sm leading-5 text-text-secondary">{selectedLesson?.foundation?'4 guided questions':review?'Ready to review':'Watch the example, then practice'}</Text>
   </ScrollView>
   <View className="shrink-0"><Action label={review?'Review':'Start'} onPress={()=>{if(!selectedLesson)return;const {id,foundation}=selectedLesson;setSelected(null);router.push(foundation||review?`/exam/${id}`:`/lesson/${id}`);}}/></View>
  </View></MotionEntry>
 </View></Modal></>;
}
