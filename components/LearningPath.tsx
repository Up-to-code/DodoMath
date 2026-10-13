import { useEffect, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Action, MathScreen } from './MathUI';
import { ModeCharacter } from './ModeCharacter';
import { DuoIcon } from './DuoIcons';
import { COURSE } from '@/data/mathCourse';
import { streakLength, useMathStore } from '@/store/mathStore';
const arithmeticUnits = ['Small numbers', 'Decimals and percentages', 'Whole numbers', 'Factors and fractions', 'Working with data'];
export default function LearningPath() {
  const router = useRouter();
  const { level, completed, xp, practiceDays } = useMathStore();
  const [selected, setSelected] = useState<string | null>(null);
  const section = COURSE.levels.find(s => s.id === level) ?? COURSE.levels[0];
  const lessons = COURSE.lessons.filter(l => l.level === section.id);
  const current = lessons.find(l => !completed.includes(l.id));
  const units = Array.from({ length: Math.ceil(lessons.length / 5) }, (_, i) => lessons.slice(i * 5, i * 5 + 5));
  useEffect(() => setSelected(null), [level]);
  return <MathScreen header={<View className="w-full max-w-[520px] self-center flex-row items-center justify-between px-5 py-2 border-b-2 border-[#F1F1F1]">
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose course. Current course ${section.title}`} onPress={() => router.push('/(tabs)/learn')} className="min-h-12 flex-row items-center gap-1">
      <DuoIcon name="math" size={38}/><Ionicons name="chevron-down" size={16} color="#777777" />
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${streakLength(practiceDays)} day streak. Open daily goal`} onPress={() => router.push('/quests')} className="min-h-12 flex-row items-center gap-1.5"><Ionicons name="flame" size={26} color="#FF9600" /><Text className="font-poppins-bold text-[#AD5700] text-base">{streakLength(practiceDays)}</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${xp} XP. Open progress`} onPress={() => router.push('/progress')} className="min-h-12 flex-row items-center gap-1.5"><Ionicons name="flash" size={24} color="#FFC800" /><Text className="font-poppins-bold text-[#735B00] text-base">{xp}</Text></TouchableOpacity>
  </View>}>
    {units.map((unit, unitIndex) => <View key={unit[0].id} className="mb-6">
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Unit ${unitIndex + 1}. ${section.title}. Open course list`} onPress={() => router.push('/practice/videos')} className="bg-[#7C3AED] rounded-2xl px-5 py-4 mb-6 flex-row items-center gap-3">
        <View className="flex-1"><Text className="font-poppins-bold text-white text-xs mb-1">{section.title.toUpperCase()} · UNIT {unitIndex + 1}</Text><Text accessibilityRole="header" className="font-poppins-bold text-white text-xl">{section.id===1?arithmeticUnits[unitIndex]:unit[0].title}</Text></View><Ionicons name="list" size={24} color="white" />
      </TouchableOpacity>
      {unit.map((lesson, index) => {
        const done = completed.includes(lesson.id); const active = current?.id === lesson.id;
        const offset = [0, -42, -68, -42, 0][index] * (unitIndex % 2 === 0 ? 1 : -1);
        const chosen = selected === lesson.id;
        return <View key={lesson.id} className="items-center mb-4">
          <View style={{ width: '100%', minHeight: active ? 112 : 90, alignItems: 'center', justifyContent: 'center' }}>
            {index === 2 && <View pointerEvents="none" style={{ position: 'absolute', left: unitIndex % 2 === 0 ? '66%' : '6%', top: 7 }}><ModeCharacter mode={level >= 9 ? 'graph' : level <= 2 ? 'count' : 'algebra'} size={86} /></View>}
            <View style={{ transform: [{ translateX: offset }], alignItems: 'center' }}>
              {active && <View className="border-2 border-border bg-white rounded-xl px-3 py-1 mb-2"><Text className="font-poppins-bold text-[#6A3BCC] text-xs">START</Text></View>}
              <View style={{ borderWidth: active ? 5 : 0, borderColor: '#E5E5E5', borderRadius: 50, padding: active ? 5 : 10 }}>
                <Pressable accessibilityRole="button" accessibilityLabel={`${lesson.title}. ${done ? 'Completed' : active ? 'Current lesson' : 'Upcoming lesson'}`} accessibilityState={{ expanded: chosen }} onPress={() => setSelected(chosen ? null : lesson.id)} style={({ pressed }) => ({ width: 72, height: 64, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? '#58CC02' : active ? '#8B5CF6' : '#E5E5E5', borderBottomWidth: pressed ? 2 : 7, borderBottomColor: done ? '#459B00' : active ? '#6840C7' : '#CFCFCF', transform: [{ translateY: pressed ? 4 : 0 }] })}>
                  <Ionicons name={done ? 'checkmark' : index === unit.length - 1 ? 'trophy' : 'star'} size={31} color={done || active ? 'white' : '#AFAFAF'} />
                </Pressable>
              </View>
            </View>
          </View>
          {chosen && <View className="w-full max-w-[360px] bg-[#7C3AED] rounded-2xl p-4 mt-2">
            <View className="flex-row items-start gap-2 mb-3"><Text accessibilityRole="header" className="flex-1 font-poppins-bold text-white text-lg">{lesson.title}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close lesson menu" onPress={() => setSelected(null)} className="w-11 h-11 items-center justify-center -mr-2 -mt-2"><Ionicons name="close" size={22} color="white"/></TouchableOpacity></View>
            <Action label={done ? 'Review' : 'Start'} secondary onPress={() => { setSelected(null); router.push(`/lesson/${lesson.id}`); }}/>
          </View>}
        </View>;
      })}
    </View>)}
  </MathScreen>;
}
