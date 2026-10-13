import { CharacterSprite } from './CharacterSprite';
export type FoxMood = 'happy' | 'thinking' | 'encouraging' | 'celebrate' | 'flying' | 'surprised' | 'sleepy' | 'neutral';
export function Fox({ size = 120, mood = 'happy', animate = true }: { size?: number; mood?: FoxMood; animate?: boolean }) {
  return <CharacterSprite character="fox" size={size} animate={animate} pose={mood === 'thinking' || mood === 'surprised' ? 'thinking' : mood === 'encouraging' ? 'retry' : mood === 'celebrate' || mood === 'flying' ? 'success' : 'idle'}/>;
}
