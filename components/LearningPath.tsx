import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Action, MathScreen } from './MathUI';
import { ModeCharacter } from './ModeCharacter';
import { COURSE } from '@/data/mathCourse';
import { streakLength, useMathStore } from '@/store/mathStore';
import { useMotion } from '@/hooks/useMotion';

export default function LearningPath() {
  const router = useRouter();
  const { level, completed, xp, practiceDays } = useMathStore();
  const moving = useMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const section = COURSE.levels.find(s => s.id === level) ?? COURSE.levels[0];
  const lessons = COURSE.lessons.filter(l => l.level === section.id);
  const current = lessons.find(l => !completed.includes(l.id));
  const chosen = lessons.find(l => l.id === selected);
  const units = Array.from({ length: Math.ceil(lessons.length / 5) }, (_, i) => lessons.slice(i * 5, i * 5 + 5));
  useEffect(() => setSelected(null), [level]);

  return <>
    <MathScreen header={<View className="w-full max-w-[600px] self-center flex-row items-center justify-between px-5 py-2 border-b-2 border-[#F1F1F1]">
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose course. Current course ${section.title}`} onPress={() => router.push('/(tabs)/learn')} className="min-h-12 flex-row items-center gap-2">
        <View className="w-10 h-10 rounded-xl bg-[#7C3AED] items-center justify-center border-b-4 border-[#5B21B6]"><Text className="font-poppins-bold text-white text-2xl">∑</Text></View>
        <Ionicons name="chevron-down" size={16} color="#7C3AED" />
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${streakLength(practiceDays)} day streak. Open daily goal`} onPress={() => router.push('/quests')} className="min-h-12 flex-row items-center gap-1.5"><Ionicons name="flame" size={26} color="#FF9600" /><Text className="font-poppins-bold text-[#C76700] text-base">{streakLength(practiceDays)}</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${xp} XP. Open progress`} onPress={() => router.push('/progress')} className="min-h-12 flex-row items-center gap-1.5"><Ionicons name="flash" size={24} color="#FFC800" /><Text className="font-poppins-bold text-[#735B00] text-base">{xp}</Text></TouchableOpacity>
    </View>}>
      {units.map((unit, unitIndex) => <View key={unit[0].id}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Unit ${unitIndex + 1}. ${section.title}. Open course list`} onPress={() => router.push('/practice/videos')} className="bg-[#7C3AED] rounded-2xl px-5 py-4 mb-7 flex-row items-center gap-3">
          <View className="flex-1"><Text className="font-poppins-bold text-[#EDE9FE] text-xs mb-1">UNIT {unitIndex + 1}</Text><Text accessibilityRole="header" className="font-poppins-bold text-white text-xl">{section.title}</Text></View><Ionicons name="list" size={26} color="white" />
        </TouchableOpacity>
        <View className="pb-5">
          {unit.map((lesson, index) => {
            const done = completed.includes(lesson.id);
            const active = current?.id === lesson.id;
            const offset = [0, -38, -65, -38, 0][index];
            return <View key={lesson.id} className="items-center mb-5" style={{ minHeight: 90 }}>
              {index === 2 && <View pointerEvents="none" style={{ position: 'absolute', left: '62%', top: 0 }}><ModeCharacter mode={level >= 9 ? 'graph' : level <= 2 ? 'count' : 'algebra'} size={88} /></View>}
              <View style={{ transform: [{ translateX: offset }] }}>
                {active && <View className="self-center bg-white border-2 border-[#E5E5E5] rounded-xl px-3 py-1 mb-2"><Text className="font-poppins-bold text-[#7C3AED] text-xs">START</Text></View>}
                <View className={active ? 'border-[5px] border-[#EDE9FE] rounded-full p-1' : 'p-[9px]'}>
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${lesson.title}. ${done ? 'Completed' : active ? 'Current lesson' : 'Upcoming lesson'}`} onPress={() => setSelected(lesson.id)} className={`w-[76px] h-[68px] rounded-full items-center justify-center border-b-[7px] ${done ? 'bg-[#58CC02] border-[#459B00]' : active ? 'bg-[#7C3AED] border-[#5B21B6]' : 'bg-[#E5E5E5] border-[#CFCFCF]'}`}>
                    <Ionicons name={done ? 'checkmark' : index === unit.length - 1 ? 'trophy' : 'star'} size={34} color={done || active ? 'white' : '#AFAFAF'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>;
          })}
        </View>
      </View>)}
    </MathScreen>
    <Modal transparent visible={!!chosen} animationType={moving ? 'slide' : 'none'} onRequestClose={() => setSelected(null)}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,.25)' }}>
        <Pressable accessible={false} onPress={() => setSelected(null)} style={{ position: 'absolute', inset: 0 }} />
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <View className="px-6 pt-5 pb-4"><View className="flex-row items-start gap-3 mb-5"><Text accessibilityRole="header" className="flex-1 font-poppins-bold text-xl text-text-primary">{chosen?.title}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close lesson menu" onPress={() => setSelected(null)} className="w-11 h-11 items-center justify-center"><Ionicons name="close" size={25} color="#777" /></TouchableOpacity></View><Action label={chosen && completed.includes(chosen.id) ? 'Review' : 'Start'} onPress={() => { if (chosen) { setSelected(null); router.push(`/lesson/${chosen.id}`); } }} /></View>
        </SafeAreaView>
      </View>
    </Modal>
  </>;
}
