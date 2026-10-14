import { MotionReaction } from './Motion';
import { CharacterSprite, type CharacterPose } from './CharacterSprite';
export type CompanionReaction = CharacterPose;
export function ModeCharacter({ mode, size = 64, reaction = 'idle' }: { mode: 'count' | 'algebra' | 'graph'; size?: number; reaction?: CompanionReaction }) {
  const sprite=<CharacterSprite character={mode === 'count' ? 'fox' : mode === 'graph' ? 'orbit' : 'nia'} pose={reaction} size={size}/>;
  // Fox owns an authored layered reaction; do not add a second whole-body pulse.
  return mode==='count'?sprite:<MotionReaction reaction={reaction}>{sprite}</MotionReaction>;
}
