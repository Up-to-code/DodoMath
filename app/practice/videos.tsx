import { lessonLabel } from '@/data/courseLabels';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListPage, ListRow } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { useMathStore } from '@/store/mathStore';
export default function Videos(){const router=useRouter();const {level,watched,completed}=useMathStore();return <ListPage title="Lessons" back action={<TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose course" onPress={()=>router.push('/(tabs)/learn')} className="w-11 h-11 items-center justify-center"><Ionicons name="options-outline" size={24} color="#C2410C"/></TouchableOpacity>}>{COURSE.lessons.filter(l=>l.level===level).map(l=><ListRow key={l.id} title={lessonLabel(l)} accessibilityLabel={l.title} icon={completed.includes(l.id)?'checkmark-circle-outline':watched.includes(l.id)?'pencil-outline':'play-circle-outline'} color={completed.includes(l.id)?'#459B00':'#C2410C'} onPress={()=>router.push(watched.includes(l.id)?`/exam/${l.id}`:`/lesson/${l.id}`)}/>)}</ListPage>;}
