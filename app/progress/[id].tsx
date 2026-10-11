import { useLocalSearchParams, useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { useMathStore } from '@/store/mathStore';
export default function SectionProgress(){const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();const {completed,watched}=useMathStore();const section=COURSE.levels.find(l=>l.id===Number(id));return <ListPage title={section?.title??'Progress'} back>{COURSE.lessons.filter(l=>l.level===Number(id)).map(l=><ListRow key={l.id} title={l.title} icon={completed.includes(l.id)?'checkmark-circle':watched.includes(l.id)?'play-circle-outline':'ellipse-outline'} color={completed.includes(l.id)?'#459B00':'#AFAFAF'} onPress={()=>router.push(`/lesson/${l.id}`)}/>)}</ListPage>;}
