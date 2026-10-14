import { lessonLabel } from '@/data/courseLabels';
import { useRouter } from 'expo-router';
import { EmptyList, ListPage, ListRow } from '@/components/ListUI';
import { useMathStore } from '@/store/mathStore';
import { COURSE } from '@/data/mathCourse';
import { SKILL_PRACTICE } from '@/data/skillPractice';
export default function Mistakes(){const router=useRouter();const mistakes=useMathStore(s=>s.mistakes);return <ListPage title="Review" back>{Object.keys(mistakes).length?Object.entries(mistakes).map(([id,p])=><ListRow key={id} title={SKILL_PRACTICE[id]?.title??(()=>{const lesson=COURSE.lessons.find(l=>l.id===id);return lesson?lessonLabel(lesson):'Practice';})()} icon="refresh-outline" value={String(p.length)} onPress={()=>router.push(`/exam/${id}`)}/>):<EmptyList message="Nothing to revisit yet" icon="checkmark-circle-outline"/>}</ListPage>;}
