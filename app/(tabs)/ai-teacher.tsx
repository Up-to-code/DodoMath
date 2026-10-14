import { useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { useMathStore } from '@/store/mathStore';
export default function Practice(){const router=useRouter();const mistakes=useMathStore(s=>s.mistakes);return <ListPage title="Practice"><ListRow title="Puzzles" icon="extension-puzzle-outline" onPress={()=>router.push('/practice/puzzles')}/><ListRow title="Lessons" icon="play-circle-outline" onPress={()=>router.push('/practice/videos')}/><ListRow title="Review" icon="refresh-outline" value={String(Object.values(mistakes).reduce((n,p)=>n+p.length,0))} onPress={()=>router.push('/mistakes')}/></ListPage>;}
