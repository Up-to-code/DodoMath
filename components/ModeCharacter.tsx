import { useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMotion } from '@/hooks/useMotion';
const characters = { count: require('@/assets/images/kit.png'), algebra: require('@/assets/images/nia.png'), graph: require('@/assets/images/orbit.png') };
export function ModeCharacter({ mode, size = 64, reaction = 'idle' }: { mode: keyof typeof characters; size?: number; reaction?: 'idle' | 'thinking' | 'success' | 'retry' }) {
  const moving = useMotion();
  const pose = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    pose.stopAnimation(); pose.setValue(0);
    if (!moving || reaction === 'idle') return;
    const motion = Animated.sequence([
      Animated.timing(pose, { toValue: 1, duration: reaction === 'retry' ? 650 : 850, useNativeDriver: true }),
      Animated.timing(pose, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]);
    motion.start(); return () => motion.stop();
  }, [pose, reaction, moving]);
  const success = reaction === 'success';
  const retry = reaction === 'retry';
  return <View accessible accessibilityLabel={`${mode === 'count' ? 'Kit' : mode === 'graph' ? 'Orbit' : 'Nia'} ${success ? 'celebrates' : retry ? 'encourages you to try again' : reaction === 'thinking' ? 'thinks with you' : 'is ready'}`} style={{ width: size, height: size }}>
    <Animated.View style={{ width: size, height: size, transform: [
      { translateY: pose.interpolate({ inputRange: [0, .25, .5, .75, 1], outputRange: success ? [0, -14, 0, -7, 0] : [0, -2, -2, -1, 0] }) },
      { translateX: pose.interpolate({ inputRange: [0, .2, .4, .6, .8, 1], outputRange: retry ? [0, -5, 5, -4, 3, 0] : [0, 0, 0, 0, 0, 0] }) },
      { rotate: pose.interpolate({ inputRange: [0, .3, .6, 1], outputRange: success ? ['0deg', '-8deg', '5deg', '0deg'] : retry ? ['0deg', '-5deg', '5deg', '0deg'] : ['0deg', '4deg', '4deg', '0deg'] }) },
    ] }}><Image source={characters[mode]} style={{ width: size, height: size }} resizeMode="contain" accessible={false} /></Animated.View>
    {(success || retry) && <View pointerEvents="none" style={{ position: 'absolute', right: -3, bottom: -2 }}><Ionicons name={success ? 'checkmark-circle' : 'bulb-outline'} size={22} color={success ? '#459B00' : '#C76700'} /></View>}
  </View>;
}
