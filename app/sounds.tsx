import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListPage } from '@/components/ListUI';
import { FeedbackSound, useFeedback } from '@/hooks/useFeedback';
import { useMathStore } from '@/store/mathStore';
export default function Sounds(){const play=useFeedback();const enabled=useMathStore(s=>s.sounds);return <ListPage title="Sounds" back>{(['tap','correct','retry','combo','fly','complete'] as FeedbackSound[]).map(name=><TouchableOpacity key={name} accessibilityRole="button" accessibilityLabel={`Preview ${name} sound`} accessibilityState={{disabled:!enabled}} disabled={!enabled} onPress={()=>play(name)} className="min-h-20 border-b border-[#EEEEEE] flex-row items-center gap-4"><Ionicons name="play-circle-outline" size={26} color={enabled?'#7C3AED':'#AFAFAF'}/><Text className="font-poppins-bold text-base text-text-primary">{name==='tap'?'Tap':name==='correct'?'Correct':name==='retry'?'Try again':name==='combo'?'Streak':name==='fly'?'Flight':'Complete'}</Text></TouchableOpacity>)}</ListPage>;}
