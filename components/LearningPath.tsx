import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotionPressable, MotionEntry } from './Motion';
import { Action, MathScreen } from './MathUI';
import { ModeCharacter } from './ModeCharacter';
import { DuoIcon } from './DuoIcons';
import { COURSE } from '@/data/mathCourse';
import { useFeedback } from '@/hooks/useFeedback';
import { streakLength, useMathStore } from '@/store/mathStore';
const arithmeticUnits = ['Small numbers', 'Decimals and percentages', 'Whole numbers', 'Factors and fractions', 'Working with data'];
function PathNode({ label, done, active, expanded, icon, onPress }: { label:string; done:boolean; active:boolean; expanded:boolean; icon:'checkmark'|'trophy'|'star'; onPress:()=>void }) {
  return <MotionPressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{expanded}} onPress={onPress} style={{width:72,height:64,borderRadius:36,alignItems:'center',justifyContent:'center',backgroundColor:done?'#58CC02':active?'#EA580C':'#E5E5E5',borderBottomWidth:7,borderBottomColor:done?'#459B00':active?'#C2410C':'#CFCFCF'}}><Ionicons name={icon} size={31} color={done||active?'white':'#AFAFAF'}/></MotionPressable>;
}
export default function LearningPath() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const feedback = useFeedback();
  const { level, completed, watched, xp, practiceDays } = useMathStore();
  const [selected, setSelected] = useState<string | null>(null);
  const section = COURSE.levels.find(s => s.id === level) ?? COURSE.levels[0];
  const lessons = COURSE.lessons.filter(l => l.level === section.id);
  const current = lessons.find(l => !completed.includes(l.id));
  const units = Array.from({ length: Math.ceil(lessons.length / 5) }, (_, i) => lessons.slice(i * 5, i * 5 + 5));
  useEffect(() => setSelected(null), [level]);
  const selectedLesson = lessons.find(l => l.id === selected);
  const review = !!selected && (completed.includes(selected) || watched.includes(selected));
  return <><MathScreen header={<View className="w-full max-w-[520px] self-center flex-row items-center justify-between px-5 py-2 border-b-2 border-[#F1F1F1]">
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose course. Current course ${section.title}`} onPress={() => router.push('/(tabs)/learn')} className="min-h-12 flex-row items-center gap-1">
      <DuoIcon name="math" size={38}/><Ionicons name="chevron-down" size={16} color="#777777" />
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${streakLength(practiceDays)} day streak. Open daily goal`} onPress={() => router.push('/quests')} className="min-h-12 flex-row items-center gap-1.5"><Ionicons name="flame" size={26} color="#FF9600" /><Text className="font-poppins-bold text-[#AD5700] text-base">{streakLength(practiceDays)}</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${xp} XP. Open progress`} onPress={() => router.push('/progress')} className="min-h-12 flex-row items-center gap-1.5"><Ionicons name="flash" size={24} color="#FFC800" /><Text className="font-poppins-bold text-[#735B00] text-base">{xp}</Text></TouchableOpacity>
  </View>}>
    {units.map((unit, unitIndex) => <View key={unit[0].id} className="mb-6">
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Unit ${unitIndex + 1}. ${section.title}. Open course list`} onPress={() => router.push('/practice/videos')} className="bg-[#C2410C] rounded-2xl px-5 py-4 mb-6 flex-row items-center gap-3">
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
              {active && <View className="border-2 border-border bg-white rounded-xl px-3 py-1 mb-2"><Text className="font-poppins-bold text-[#9A3412] text-xs">START</Text></View>}
              <View style={{ borderWidth: active ? 5 : 0, borderColor: '#E5E5E5', borderRadius: 50, padding: active ? 5 : 10 }}>
                <PathNode label={`${lesson.title}. ${done ? 'Completed' : active ? 'Current lesson' : 'Upcoming lesson'}`} done={done} active={active} expanded={chosen} icon={done ? 'checkmark' : index === unit.length - 1 ? 'trophy' : 'star'} onPress={() => {feedback('tap');setSelected(chosen ? null : lesson.id);}} />
              </View>
            </View>
          </View>

        </View>;
      })}
    </View>)}
  </MathScreen>
    <Modal visible={!!selectedLesson} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
      <View className="flex-1 justify-end">
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss lesson menu" onPress={() => setSelected(null)} className="absolute inset-0 bg-black/20" />
        <MotionEntry trigger={selected??undefined}><View accessibilityViewIsModal className="w-full max-w-[520px] self-center rounded-t-3xl bg-white border-t-2 border-border px-5 pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16), maxHeight: '60%' }}>
          <View className="flex-row items-center gap-2 mb-3">
            <Text accessibilityRole="header" className="flex-1 font-poppins-bold text-text-primary text-xl">{review ? 'Review lesson' : 'Start lesson'}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close lesson menu" onPress={() => setSelected(null)} className="w-12 h-12 items-center justify-center"><Ionicons name="close" size={24} color="#777777" /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}><Text className="font-poppins text-base text-text-primary">{selectedLesson?.title}</Text></ScrollView>
          <Action label={review ? 'Review' : 'Start'} onPress={() => { if (!selectedLesson) return; const target = selectedLesson.id; setSelected(null); router.push(review ? `/exam/${target}` : `/lesson/${target}`); }} />
        </View></MotionEntry>
      </View>
    </Modal>
  </>;
}
