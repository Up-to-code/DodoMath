import { FOUNDATION_LESSONS } from '@/data/foundations';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { sectionLabel } from '@/data/courseLabels';
import { useMathStore } from '@/store/mathStore';
export default function Progress(){
 const router=useRouter();const {completed,completedFoundations,setLevel}=useMathStore();const total=COURSE.lessons.length+FOUNDATION_LESSONS.length,done=completed.length+completedFoundations.length;
 return <ListPage title="Progress" back>
  <View className="py-3 mb-4"><Text className="font-poppins-bold text-3xl text-text-primary">{done}<Text className="font-poppins text-base text-text-secondary"> / {total}</Text></Text><Text className="font-poppins text-sm text-text-secondary mt-1 mb-4">Lessons completed</Text><View accessibilityRole="progressbar" accessibilityLabel="Completed lessons" accessibilityValue={{min:0,max:total,now:done}} className="h-3 bg-[#E5E5E5] rounded-full overflow-hidden"><View style={{width:`${Math.min(1,done/total)*100}%`,height:'100%',backgroundColor:'#58CC02',borderRadius:12}}/></View></View>
  <ListRow title="Basics" icon="leaf-outline" value={`${completedFoundations.length}/${FOUNDATION_LESSONS.length}`} onPress={()=>{setLevel(0);router.push('/(tabs)');}}/>
  {COURSE.levels.map(section=>{const lessons=COURSE.lessons.filter(lesson=>lesson.level===section.id),count=lessons.filter(lesson=>completed.includes(lesson.id)).length;return <ListRow key={section.id} title={sectionLabel(section)} accessibilityLabel={`${section.title}: ${count} of ${lessons.length} lessons completed`} icon="checkmark-circle-outline" color={count?'#459B00':'#AFAFAF'} value={`${count}/${lessons.length}`} onPress={()=>router.push(`/progress/${section.id}`)}/>;})}
 </ListPage>;
}
