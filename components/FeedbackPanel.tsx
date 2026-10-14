import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useFeedbackPhase } from '@/hooks/useFeedbackPhase';
import { ModeCharacter } from './ModeCharacter';
import type { ReactNode } from 'react';
export function FeedbackFooter({ result, children }: { result?: 'success' | 'retry'; children: ReactNode }) {
  const phase = useFeedbackPhase(result ?? 'idle');
  const style = useAnimatedStyle(() => ({ backgroundColor: result ? interpolateColor(Math.min(1, phase.value / .25), [0, 1], ['#FFFFFF', result === 'success' ? '#D7FFB8' : '#FFDFE0']) : '#FFFFFF' }));
  return <Animated.View style={[{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderTopWidth: result ? 0 : 2, borderColor: '#F1F1F1' }, style]}>{children}</Animated.View>;
}
export function FeedbackPanel({ correct, message, mode, children }: { correct: boolean; message: string; mode: 'count' | 'algebra' | 'graph'; children?: ReactNode }) {
  const phase = useFeedbackPhase(correct ? 'success' : 'retry');
  const entry = useAnimatedStyle(() => {
    const t = Math.min(1, phase.value / .42), eased = 1 - Math.pow(1 - t, 3);
    return { opacity: Math.min(1, phase.value / .18), transform: [{ translateY: (1 - eased) * 10 }] };
  });
  return <Animated.View style={entry}><View className="flex-row items-center gap-3 mb-2">
    <ModeCharacter mode={mode} size={56} reaction={correct ? 'success' : 'retry'} />
    <View className="flex-1 flex-row items-center gap-2"><Ionicons name={correct ? 'checkmark-circle' : 'close-circle'} size={22} color={correct ? '#3C7900' : '#B72525'} accessible={false} /><Text accessibilityLiveRegion="polite" className={`font-poppins-bold text-xl ${correct ? 'text-[#3C7900]' : 'text-[#B72525]'}`}>{correct ? 'Nicely done!' : 'Try again'}</Text></View>
  </View><ScrollView style={{ maxHeight: 112 }} contentContainerStyle={{ paddingBottom: 12 }}><Text className={`font-poppins text-base leading-6 ${correct ? 'text-[#3C7900]' : 'text-[#B72525]'}`}>{message}</Text>{children}</ScrollView></Animated.View>;
}
