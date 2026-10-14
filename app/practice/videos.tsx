import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ListPage, ListRow } from '@/components/ListUI';
import { MotionPressable } from '@/components/Motion';
import { learningUnits } from '@/data/curriculum';
import { useMathStore } from '@/store/mathStore';
export default function Videos(){
 const router=useRouter();const {unit}=useLocalSearchParams<{unit?:string}>();const {level,watched,completed,completedFoundations}=useMathStore();const units=learningUnits(level),selected=units.find(item=>item.id===unit),lessons=selected?.lessons??units.flatMap(item=>item.lessons),done=level===0?completedFoundations:completed;
 return <ListPage title={selected?'Unit lessons':'Lessons'} back action={<MotionPressable accessibilityRole="button" accessibilityLabel="Choose subject" onPress={()=>router.push('/(tabs)/learn')} className="w-11 h-11 items-center justify-center"><Ionicons name="options-outline" size={22} color="#C2410C"/></MotionPressable>}>{lessons.map(lesson=><ListRow key={lesson.id} title={lesson.title} accessibilityLabel={`${lesson.sourceTitle}${done.includes(lesson.id)?', completed':''}`} icon={done.includes(lesson.id)?'checkmark-circle-outline':lesson.foundation?'pencil-outline':'play-circle-outline'} color={done.includes(lesson.id)?'#459B00':'#C2410C'} onPress={()=>router.push(lesson.foundation||watched.includes(lesson.id)?`/exam/${lesson.id}`:`/lesson/${lesson.id}`)}/>)}</ListPage>;
}
