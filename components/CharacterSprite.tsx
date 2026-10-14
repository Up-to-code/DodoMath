import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { images } from '@/constants/images';
import registration from '@/assets/characters/registration.json';
import { useFeedbackPhase } from '@/hooks/useFeedbackPhase';
import { useFeedbackClock } from './FeedbackClock';
import feedback from '@/assets/animations/fox/feedback/runtime.json';
import { POSE_BLEND_MS, REACTION_DURATION_MS, reactionFrame } from '@/lib/feedbackTiming';
export type CharacterName = 'fox' | 'nia' | 'orbit';
export type CharacterPose = 'idle' | 'thinking' | 'success' | 'retry';
const poses: CharacterPose[] = ['idle', 'thinking', 'success', 'retry'];

/** Mount all registered poses once, keeping the body origin fixed during a short dissolve. */
export function CharacterSprite({ character, pose = 'idle', size = 64 }: { character: CharacterName; pose?: CharacterPose; size?: number; animate?: boolean }) {
  const label = character === 'fox' ? 'Fox' : character === 'nia' ? 'Nia' : 'Orbit';
  const phase = useFeedbackPhase(pose);
  const moment = useFeedbackClock();
  const [decoded,setDecoded]=useState({success:false,retry:false});
  const layered = character === 'fox' && !!moment && (pose === 'success' || pose === 'retry') && decoded[pose];
  const [transition, setTransition] = useState({ from: pose, to: pose });
  if (transition.to !== pose) setTransition({ from: transition.to, to: pose });
  const from = transition.from;
  const imageSize = size * registration.displayScale[character], inset = (size - imageSize) / 2;
  return <View accessible accessibilityLabel={`${label} ${pose === 'success' ? 'celebrates' : pose === 'retry' ? 'encourages you to try again' : pose === 'thinking' ? 'thinks with you' : 'is ready'}`} testID={`${character}-registered-${pose}`} style={{ width: size, height: size }}>
    {poses.map(candidate => <PoseImage key={candidate} character={character} candidate={candidate} pose={pose} from={from} phase={phase} layered={layered} size={imageSize} inset={inset} />)}
    {character === 'fox' && <View pointerEvents="none" style={{ position:'absolute', left:inset, top:inset, width:imageSize, height:imageSize, overflow:'hidden' }}>
      <FoxAnswerFrames action="success" active={layered && pose==='success'} size={imageSize} onLoad={()=>setDecoded(value=>({...value,success:true}))}/>
      <FoxAnswerFrames action="retry" active={layered && pose==='retry'} size={imageSize} onLoad={()=>setDecoded(value=>({...value,retry:true}))}/>
    </View>}
  </View>;
}
function PoseImage({ character, candidate, pose, from, phase, layered, size, inset }: { character: CharacterName; candidate: CharacterPose; pose: CharacterPose; from: CharacterPose; phase: SharedValue<number>; layered: boolean; size: number; inset: number }) {
  const style = useAnimatedStyle(() => {
    const blend = Math.min(1, phase.value * REACTION_DURATION_MS / POSE_BLEND_MS);
    if(layered) return {opacity:candidate===(from===pose?'idle':from)?1-blend:0};
    return { opacity: candidate === pose ? (from === pose ? 1 : blend) : candidate === from ? 1 - blend : 0 };
  });
  return <Animated.Image source={images.companions[character][candidate]} accessible={false} resizeMode="contain" fadeDuration={0} style={[{ position: 'absolute', width: size, height: size, left: inset, top: inset }, style]} />;
}

/** Both atlases stay mounted for decoding before a Check tap. Absolute time picks the frame. */
function FoxAnswerFrames({action,active,size,onLoad}:{action:'success'|'retry';active:boolean;size:number;onLoad:()=>void}){
  const clip=feedback.clips[action],phase=useFeedbackPhase(action,clip.durationMs);
  const style=useAnimatedStyle(()=>{
    const frame=reactionFrame(phase.value,clip.frameCount);
    return {opacity:active?Math.min(1,phase.value*clip.durationMs/POSE_BLEND_MS):0,left:-(frame%clip.columns)*size,top:-Math.floor(frame/clip.columns)*size};
  });
  return <Animated.Image source={images.foxFeedback[action]} onLoad={onLoad} accessible={false} resizeMode="stretch" fadeDuration={0} style={[{position:'absolute',width:size*clip.columns,height:size*clip.rows},style]}/>;
}
