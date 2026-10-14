import { Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ListGroup, ListPage, ListRow } from '@/components/ListUI';
import { useMathStore } from '@/store/mathStore';
export default function Settings(){
 const router=useRouter();const {sounds,animations,haptics,setPreference,dailyGoal}=useMathStore();
 const preferences=[{key:'sounds',label:'Sound',icon:'volume-medium-outline',value:sounds},{key:'animations',label:'Animations',icon:'sparkles-outline',value:animations},{key:'haptics',label:'Vibration',icon:'phone-portrait-outline',value:haptics}] as const;
 return <ListPage title="Settings" back>
  <ListGroup><ListRow title="Account" icon="person-outline" divider={false} onPress={()=>router.push('/account')}/></ListGroup>
  <ListGroup>{preferences.map((p,index)=><View key={p.key} className={`min-h-16 flex-row items-center gap-3 ${index<preferences.length-1?'border-b border-[#EEEEEE]':''}`}>
   <Ionicons name={p.icon} size={23} color="#C2410C" accessible={false}/><Text className="flex-1 font-poppins-bold text-base text-text-primary">{p.label}</Text><Switch accessibilityLabel={p.label} value={p.value} onValueChange={value=>setPreference(p.key,value)} trackColor={{false:'#E5E5E5',true:'#C2410C'}} thumbColor="white"/>
  </View>)}</ListGroup>
  <ListGroup><ListRow title="Daily goal" icon="flag-outline" value={String(dailyGoal)} onPress={()=>router.push('/quests')}/><ListRow title="Sounds" icon="musical-notes-outline" divider={false} onPress={()=>router.push('/sounds')}/></ListGroup>
 </ListPage>;
}
