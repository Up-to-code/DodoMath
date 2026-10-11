import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dodo, DodoMood } from '@/components/Dodo';
import { ListPage } from '@/components/ListUI';
import { useFeedback } from '@/hooks/useFeedback';
const poses=[{mood:'happy',icon:'happy-outline',label:'Happy Dodo'},{mood:'thinking',icon:'bulb-outline',label:'Thinking Dodo'},{mood:'flying',icon:'paper-plane-outline',label:'Flying Dodo'}] as const;
export default function DodoStudio(){const [mood,setMood]=useState<DodoMood>('happy');const play=useFeedback();return <ListPage title="Dodo" back footer={<View className="flex-row gap-6 justify-center">{poses.map(p=><TouchableOpacity key={p.mood} accessibilityRole="radio" accessibilityLabel={p.label} accessibilityState={{checked:mood===p.mood}} onPress={()=>{setMood(p.mood);play(p.mood==='flying'?'fly':'tap');}} className="w-14 h-14 items-center justify-center"><Ionicons name={p.icon} size={28} color={mood===p.mood?'#7C3AED':'#AFAFAF'}/></TouchableOpacity>)}</View>}><View className="flex-1 items-center justify-center py-12"><Dodo size={240} mood={mood}/></View></ListPage>;}
