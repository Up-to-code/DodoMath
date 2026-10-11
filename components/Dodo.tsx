import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import { useMotion } from '@/hooks/useMotion';
export type DodoMood = 'happy' | 'thinking' | 'encouraging' | 'celebrate' | 'flying' | 'surprised' | 'sleepy' | 'neutral';
const body = require('@/assets/images/dodo-v3-body.png');
const head = require('@/assets/images/dodo-v3-head.png');
const wing = require('@/assets/images/dodo-v3-wing.png');
/** Registered full-canvas sprites keep the neck and shoulder pivots aligned. */
export function Dodo({ size = 120, mood = 'happy', animate = true }: { size?: number; mood?: DodoMood; animate?: boolean }) {
  const moving = useMotion() && animate;
  const flight = mood === 'flying' || mood === 'celebrate';
  const flap = useRef(new Animated.Value(0)).current;
  const nod = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    [flap, nod, lift].forEach(value => { value.stopAnimation(); value.setValue(0); });
    if (!moving) return;
    const cycle = (value: Animated.Value, duration: number) => Animated.loop(Animated.sequence([
      Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const motions = [cycle(nod, flight ? 900 : 2200)];
    if (flight) motions.push(cycle(flap, 220), cycle(lift, 780));
    motions.forEach(motion => motion.start());
    return () => motions.forEach(motion => motion.stop());
  }, [moving, flight, flap, nod, lift]);
  const height = size * 1295 / 1215;
  const layer = { position: 'absolute' as const, width: size, height };
  return <View accessible accessibilityLabel={`Dodo is ${mood}`} style={{ width: size, height }}>
    <Animated.View style={{ ...layer, transform: [{ translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -size * .065] }) }] }}>
      <Image source={body} style={layer} resizeMode="stretch" accessible={false} />
      <Animated.View style={{ ...layer, transformOrigin: [size * .57, height * .42, 0], transform: [{ rotate: nod.interpolate({ inputRange: [0, 1], outputRange: [mood === 'thinking' ? '-3deg' : '0deg', mood === 'thinking' ? '-1deg' : '2deg'] }) }] }}><Image source={head} style={layer} resizeMode="stretch" accessible={false} /></Animated.View>
      <Animated.View style={{ ...layer, transformOrigin: [size * .54, height * .47, 0], transform: [{ rotate: flap.interpolate({ inputRange: [0, 1], outputRange: [flight ? '12deg' : '0deg', flight ? '-28deg' : '0deg'] }) }] }}><Image source={wing} style={layer} resizeMode="stretch" accessible={false} /></Animated.View>
    </Animated.View>
  </View>;
}
