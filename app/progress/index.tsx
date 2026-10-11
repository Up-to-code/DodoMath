import { useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { useMathStore } from '@/store/mathStore';
export default function Progress(){const router=useRouter();const completed=useMathStore(s=>s.completed);return <ListPage title="Progress" back>{COURSE.levels.map(l=><ListRow key={l.id} title={l.title} icon="checkmark-circle-outline" color="#459B00" value={`${COURSE.lessons.filter(x=>x.level===l.id&&completed.includes(x.id)).length}/${l.end-l.start+1}`} onPress={()=>router.push(`/progress/${l.id}`)}/>)}</ListPage>;}
