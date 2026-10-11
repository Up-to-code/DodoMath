import { useRouter } from 'expo-router';
import { ListPage, ListRow } from '@/components/ListUI';
import { useMathStore } from '@/store/mathStore';
export default function Practice(){const router=useRouter();const mistakes=useMathStore(s=>s.mistakes);return <ListPage title="Practice"><ListRow title="Puzzles" icon="extension-puzzle-outline" onPress={()=>router.push('/practice/puzzles')}/><ListRow title="Video practice" icon="play-circle-outline" onPress={()=>router.push('/practice/videos')}/><ListRow title="Try again" icon="refresh-outline" value={String(Object.values(mistakes).reduce((n,p)=>n+p.length,0))} onPress={()=>router.push('/mistakes')}/></ListPage>;}
