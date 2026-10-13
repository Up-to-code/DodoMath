import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fox, FoxMood } from '@/components/Fox';
import { FoxMotion } from '@/components/FoxMotion';
import { ListPage } from '@/components/ListUI';
import { useFeedback } from '@/hooks/useFeedback';
const poses=[{mood:'happy',icon:'happy-outline',label:'Happy Fox'},{mood:'thinking',icon:'bulb-outline',label:'Thinking Fox'},{mood:'celebrate',icon:'sparkles-outline',label:'Celebrating Fox'}] as const;
export default function FoxStudio(){
 const [mood,setMood]=useState<FoxMood>('happy');const [hello,setHello]=useState(false);const [playId,setPlayId]=useState(0);const play=useFeedback();
 return <ListPage title="Fox" back footer={<View className="flex-row gap-3 justify-center">
  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Play Fox hello animation" onPress={()=>{setHello(true);setPlayId(n=>n+1);play('tap');}} className="w-14 h-14 items-center justify-center"><Ionicons name="hand-left-outline" size={28} color={hello?'#7C3AED':'#777777'}/></TouchableOpacity>
  {poses.map(p=><TouchableOpacity key={p.mood} accessibilityRole="radio" accessibilityLabel={p.label} accessibilityState={{checked:!hello&&mood===p.mood}} onPress={()=>{setHello(false);setMood(p.mood);play(p.mood==='celebrate'?'combo':'tap');}} className="w-14 h-14 items-center justify-center"><Ionicons name={p.icon} size={28} color={!hello&&mood===p.mood?'#7C3AED':'#777777'}/></TouchableOpacity>)}
 </View>}><View className="flex-1 items-center justify-center py-12">{hello?<FoxMotion playId={playId} size={320}/>:<Fox size={240} mood={mood}/>}</View></ListPage>;
}
