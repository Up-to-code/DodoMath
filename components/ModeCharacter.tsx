import { MotionReaction } from './Motion';
import { CharacterSprite, type CharacterPose } from './CharacterSprite';
export type CompanionReaction = CharacterPose;
export function ModeCharacter({ mode, size = 64, reaction = 'idle' }: { mode: 'count' | 'algebra' | 'graph'; size?: number; reaction?: CompanionReaction }) {
  return <MotionReaction reaction={reaction}><CharacterSprite character={mode === 'count' ? 'fox' : mode === 'graph' ? 'orbit' : 'nia'} pose={reaction} size={size}/></MotionReaction>;
}
