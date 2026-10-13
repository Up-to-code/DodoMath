import { Image, View } from 'react-native';
import { images } from '@/constants/images';
import registration from '@/assets/characters/registration.json';
export type CharacterName = 'fox' | 'nia' | 'orbit';
export type CharacterPose = 'idle' | 'thinking' | 'success' | 'retry';
/** Generated poses share the same measured body origin. No procedural hop or crossfade displaces it. */
export function CharacterSprite({ character, pose = 'idle', size = 64 }: { character: CharacterName; pose?: CharacterPose; size?: number; animate?: boolean }) {
  const label = character === 'fox' ? 'Fox' : character === 'nia' ? 'Nia' : 'Orbit';
  const scale = registration.displayScale[character];
  const imageSize = size * scale;
  const inset = (size - imageSize) / 2;
  return <View accessible accessibilityLabel={`${label} ${pose === 'success' ? 'celebrates' : pose === 'retry' ? 'encourages you to try again' : pose === 'thinking' ? 'thinks with you' : 'is ready'}`} testID={`${character}-registered-${pose}`} style={{ width: size, height: size }}>
    <Image source={images.companions[character][pose]} accessible={false} resizeMode="contain" style={{ position: 'absolute', width: imageSize, height: imageSize, left: inset, top: inset }} />
  </View>;
}
