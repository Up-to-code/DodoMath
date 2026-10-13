import { useEffect, useRef, useState } from 'react';
import { Animated, Image, View } from 'react-native';
import { images } from '@/constants/images';
import { useMotion } from '@/hooks/useMotion';
export type CharacterName = 'fox' | 'nia' | 'orbit';
export type CharacterPose = 'idle' | 'thinking' | 'success' | 'retry';
/** Generated full-body pose images. Fixed source cells retain scale; transitions preserve transparent alpha. */
export function CharacterSprite({ character, pose = 'idle', size = 64, animate = true }: { character: CharacterName; pose?: CharacterPose; size?: number; animate?: boolean }) {
  const moving = useMotion() && animate;
  const transition = useRef(new Animated.Value(1)).current;
  const motion = useRef(new Animated.Value(0)).current;
  const previousPose = useRef(pose);
  const [previous, setPrevious] = useState(pose);
  const assets = images.companions[character];
  useEffect(() => {
    transition.stopAnimation(); motion.stopAnimation();
    setPrevious(previousPose.current); previousPose.current = pose;
    transition.setValue(moving ? 0 : 1); motion.setValue(0);
    const animation = Animated.parallel([
      Animated.timing(transition, { toValue: 1, duration: moving ? 160 : 0, useNativeDriver: true }),
      Animated.timing(motion, { toValue: 1, duration: moving ? pose === 'success' ? 560 : 360 : 0, useNativeDriver: true }),
    ]);
    animation.start(); return () => animation.stop();
  }, [pose, moving, transition, motion]);
  const label = character === 'fox' ? 'Fox' : character === 'nia' ? 'Nia' : 'Orbit';
  const layer = { position: 'absolute' as const, width: size, height: size };
  return <View accessible accessibilityLabel={`${label} ${pose === 'success' ? 'celebrates' : pose === 'retry' ? 'encourages you to try again' : pose === 'thinking' ? 'thinks with you' : 'is ready'}`} style={{ width: size, height: size }}>
    <Animated.View style={{ ...layer, transform: [{ translateY: motion.interpolate({ inputRange: [0, .2, .6, 1], outputRange: moving && pose === 'success' ? [0, size * .02, -size * .07, 0] : [0, 0, 0, 0] }) }] }}>
      {moving && previous !== pose && <Animated.View style={{ ...layer, opacity: transition.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}><Image source={assets[previous]} style={layer} resizeMode="contain" accessible={false} /></Animated.View>}
      <Animated.View style={{ ...layer, opacity: transition }}><Image source={assets[pose]} style={layer} resizeMode="contain" accessible={false} /></Animated.View>
    </Animated.View>
  </View>;
}
