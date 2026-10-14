import { useEffect } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useMotion } from '@/hooks/useMotion';
import type { ReactNode } from 'react';
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
 const enabled=useMotion(),scale=useSharedValue(1);
 useEffect(()=>{cancelAnimation(scale);scale.value=1;if(enabled&&reaction==='success')scale.value=withSequence(withTiming(1.045,{duration:100}),withSpring(1,spring));if(enabled&&reaction==='retry')scale.value=withSequence(withTiming(.985,{duration:80}),withSpring(1,spring));return()=>cancelAnimation(scale);},[reaction,enabled,scale]);
 const motion=useAnimatedStyle(()=>({transform:[{scale:scale.value}]}));return <Animated.View style={[style,motion]}>{children}</Animated.View>;
}
export function MotionProgress({value}:{value:number}){
 const enabled=useMotion(),progress=useSharedValue(Math.max(0,Math.min(1,value)));
 useEffect(()=>{const next=Math.max(0,Math.min(1,value));progress.value=enabled?withTiming(next,{duration:320,easing:Easing.out(Easing.cubic)}):next;return()=>cancelAnimation(progress);},[value,enabled,progress]);
 const fill=useAnimatedStyle(()=>({width:`${5+progress.value*95}%` as `${number}%`}));return <Animated.View style={[{height:16,borderRadius:16,backgroundColor:'#58CC02',overflow:'hidden'},fill]}><Animated.View style={{height:4,marginHorizontal:8,marginTop:3,borderRadius:4,backgroundColor:'#91E54A'}}/></Animated.View>;
}
