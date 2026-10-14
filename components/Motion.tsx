import { useEffect } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useMotion } from '@/hooks/useMotion';
import type { ReactNode } from 'react';
import { useFeedbackPhase } from '@/hooks/useFeedbackPhase';
const spring={damping:22,stiffness:360,mass:.65};
export function MotionPressable({children,containerStyle,onPressIn,onPressOut,disabled,...props}:PressableProps&{className?:string;containerStyle?:StyleProp<ViewStyle>}) {
 const enabled=useMotion(),press=useSharedValue(0);
 const style=useAnimatedStyle(()=>({transform:[{translateY:press.value*2.5},{scale:1-press.value*.018}]}));
 useEffect(()=>{if(!enabled||disabled){cancelAnimation(press);press.value=0;}return()=>cancelAnimation(press);},[enabled,disabled,press]);
 return <Animated.View style={[containerStyle,style]}><Pressable {...props} disabled={disabled} onPressIn={e=>{if(enabled)press.value=withTiming(1,{duration:70});onPressIn?.(e);}} onPressOut={e=>{press.value=enabled?withSpring(0,spring):0;onPressOut?.(e);}}>{children}</Pressable></Animated.View>;
}
export function MotionEntry({children,trigger,style}:{children:ReactNode;trigger?:string|number;style?:StyleProp<ViewStyle>}){
 const enabled=useMotion(),phase=useSharedValue(1);
 useEffect(()=>{cancelAnimation(phase);if(!enabled){phase.value=1;return;}phase.value=0;phase.value=withTiming(1,{duration:210,easing:Easing.out(Easing.cubic)});return()=>cancelAnimation(phase);},[enabled,trigger,phase]);
 const entry=useAnimatedStyle(()=>({opacity:phase.value,transform:[{translateY:(1-phase.value)*8}]}));
 return <Animated.View style={[style,entry]}>{children}</Animated.View>;
}
export function MotionReaction({children,reaction,style}:{children:ReactNode;reaction:string;style?:StyleProp<ViewStyle>}){
 const phase=useFeedbackPhase(reaction);
 const motion=useAnimatedStyle(()=>{
  const p=phase.value;
  const times=reaction==='success'?[0,.14,.4,.7,1]:[0,.2,.55,1];
  const values=reaction==='success'?[1,.987,1.035,1.008,1]:[1,.988,1.006,1];
  let scale=1;
  if(reaction==='success'||reaction==='retry')for(let i=1;i<times.length;i++){
   if(p<=times[i]){const t=(p-times[i-1])/(times[i]-times[i-1]);const eased=t*t*(3-2*t);scale=values[i-1]+(values[i]-values[i-1])*eased;break;}
  }
  return {transform:[{scale}]};
 });
 return <Animated.View style={[{transformOrigin:'50% 85%'},style,motion]}>{children}</Animated.View>;
}
export function MotionProgress({value}:{value:number}){
 const enabled=useMotion(),progress=useSharedValue(Math.max(0,Math.min(1,value)));
 useEffect(()=>{const next=Math.max(0,Math.min(1,value));progress.value=enabled?withTiming(next,{duration:320,easing:Easing.out(Easing.cubic)}):next;return()=>cancelAnimation(progress);},[value,enabled,progress]);
 const fill=useAnimatedStyle(()=>({width:`${5+progress.value*95}%` as `${number}%`}));return <Animated.View style={[{height:16,borderRadius:16,backgroundColor:'#58CC02',overflow:'hidden'},fill]}><Animated.View style={{height:4,marginHorizontal:8,marginTop:3,borderRadius:4,backgroundColor:'#91E54A'}}/></Animated.View>;
}
