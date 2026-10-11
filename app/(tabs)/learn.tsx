import { useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { useMathStore } from '@/store/mathStore';
export default function Courses(){const router=useRouter();const {level,setLevel}=useMathStore();return <ListPage title="Courses">{COURSE.levels.map(section=><ListRow key={section.id} title={section.title} icon={section.id<=2?'calculator-outline':section.id>=9?'analytics-outline':'shapes-outline'} selected={level===section.id} onPress={()=>{setLevel(section.id);router.push('/(tabs)');}}/>)}</ListPage>;}
