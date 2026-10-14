import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useFeedbackPhase } from '@/hooks/useFeedbackPhase';
import { useMotion } from '@/hooks/useMotion';
export function StreakMoment({ count }: { count: number }) {
  const enabled = useMotion(), phase = useFeedbackPhase(count, count % 10 === 0 ? 1200 : 900);
  const style = useAnimatedStyle(() => {
    const p = phase.value, arrive = 1 - Math.pow(1 - Math.min(1, p / .25), 3);
    return { opacity: !count || !enabled ? 0 : Math.min(1, p / .12) * Math.min(1, (1 - p) / .2), transform: [{ translateY: (1 - arrive) * 10 }, { scale: .92 + .08 * arrive }] };
  });
  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="absolute left-0 right-0 items-center" style={{ top: '28%' }}><Animated.View style={[{ alignItems: 'center' }, style]}><Ionicons name="flash" size={count % 10 === 0 ? 80 : 56} color="#FFC800" /><View className="bg-[#FFF4CC] border-2 border-[#FFC800] rounded-3xl px-5 py-2 -mt-3"><Text className="font-poppins-bold text-xl text-[#AD5700]">{count} IN A ROW</Text></View></Animated.View></View>;
}
