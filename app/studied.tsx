import { lessonLabel } from '@/data/courseLabels';
import { useRouter } from 'expo-router';
import { ListPage, ListRow, EmptyList } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { useMathStore } from '@/store/mathStore';
export default function Studied(){const router=useRouter();const watched=useMathStore(s=>s.watched);return <ListPage title="Studied" back>{watched.length?COURSE.lessons.filter(l=>watched.includes(l.id)).map(l=><ListRow key={l.id} title={lessonLabel(l)} accessibilityLabel={l.title} icon="play-circle-outline" onPress={()=>router.push(`/lesson/${l.id}`)}/>):<EmptyList message="Your studied videos will appear here" icon="play-circle-outline"/>}</ListPage>;}
