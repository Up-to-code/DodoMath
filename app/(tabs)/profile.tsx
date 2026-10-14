import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ListGroup, ListPage, ListRow } from '@/components/ListUI';
import { MotionPressable } from '@/components/Motion';
import { CharacterSprite } from '@/components/CharacterSprite';
import { StatsStrip } from '@/components/StatsStrip';
import { streakLength, useMathStore } from '@/store/mathStore';
export default function Profile(){
 const router=useRouter();const {completed,completedFoundations,watched,learnerName,xp,practiceDays}=useMathStore();
 return <ListPage title="Profile" action={<MotionPressable accessibilityRole="button" accessibilityLabel="Open settings" onPress={()=>router.push('/settings')} className="w-11 h-11 items-center justify-center"><Ionicons name="settings-outline" size={23} color="#C2410C"/></MotionPressable>}>
  <View className="items-center pt-4"><CharacterSprite character="fox" size={96}/><Text numberOfLines={2} className="font-poppins-bold text-2xl text-text-primary mt-3 text-center">{learnerName}</Text></View>
  <StatsStrip items={[
   {label:'Day streak',value:streakLength(practiceDays),icon:'flame',color:'#C2410C',onPress:()=>router.push('/statistics')},
   {label:'Total XP',value:xp,icon:'flash',color:'#AD5700',onPress:()=>router.push('/statistics')},
   {label:'Lessons',value:completed.length+completedFoundations.length,icon:'checkmark-circle',color:'#459B00',onPress:()=>router.push('/progress')},
  ]}/>
  <ListGroup><ListRow title="Statistics" icon="stats-chart-outline" onPress={()=>router.push('/statistics')}/><ListRow title="Progress" icon="checkmark-circle-outline" color="#459B00" onPress={()=>router.push('/progress')}/><ListRow title="Studied" icon="play-circle-outline" value={String(watched.length)} divider={false} onPress={()=>router.push('/studied')}/></ListGroup>
  <ListGroup><ListRow title="Account" icon="person-outline" onPress={()=>router.push('/account')}/><ListRow title="Daily goal" icon="flag-outline" onPress={()=>router.push('/quests')}/><ListRow title="Fox" icon="happy-outline" divider={false} onPress={()=>router.push('/fox-studio')}/></ListGroup>
 </ListPage>;
}
