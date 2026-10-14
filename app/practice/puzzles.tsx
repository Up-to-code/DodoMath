import { foundationFor } from '@/data/foundations';
import { useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { SKILL_PRACTICE } from '@/data/skillPractice';
export default function Puzzles(){const router=useRouter();return <ListPage title="Puzzles" back>{Object.entries(SKILL_PRACTICE).filter(([id])=>!foundationFor(id)).map(([id,p])=><ListRow key={id} title={p.title} icon={id.includes('graph')?'navigate-outline':id.includes('fraction')?'pizza-outline':id.includes('algebra')?'scale-outline':'extension-puzzle-outline'} onPress={()=>router.push(`/exam/${id}`)}/>)}</ListPage>;}
