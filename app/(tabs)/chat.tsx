import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EmptyList, ListPage, ListRow } from '@/components/ListUI';
import { useMathStore } from '@/store/mathStore';
export default function WorkingNodes(){const router=useRouter();const nodes=useMathStore(s=>s.workingNodes);return <ListPage title="Working nodes" footer={<View className="items-center"><TouchableOpacity accessibilityRole="button" accessibilityLabel="Add working node" onPress={()=>router.push('/working-node/new')} className="w-14 h-14 rounded-full bg-[#7C3AED] items-center justify-center"><Ionicons name="add" size={30} color="white"/></TouchableOpacity></View>}>{nodes.length?nodes.map(n=><ListRow key={n.id} title={n.title||'Untitled'} detail={n.body.trim().split('\n')[0]||undefined} icon="document-text-outline" onPress={()=>router.push(`/working-node/${n.id}`)}/>):<EmptyList message="No working nodes yet" icon="pencil-outline"/>}</ListPage>;}
