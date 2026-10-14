import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { useMotion } from '@/hooks/useMotion';
export function StreakMoment({count}:{count:number}){
 const enabled=useMotion(),opacity=useSharedValue(0),scale=useSharedValue(.8),rise=useSharedValue(12);
 useEffect(()=>{for(const v of[opacity,scale,rise])cancelAnimation(v);opacity.value=0;if(!count)return;if(!enabled)return;scale.value=.8;rise.value=12;opacity.value=withTiming(1,{duration:100});scale.value=withSpring(1,{damping:18,stiffness:250});rise.value=withTiming(0,{duration:180});opacity.value=withDelay(count%10===0?950:650,withTiming(0,{duration:180}));return()=>{for(const v of[opacity,scale,rise])cancelAnimation(v);};},[count,enabled,opacity,scale,rise]);
 const style=useAnimatedStyle(()=>({opacity:opacity.value,transform:[{translateY:rise.value},{scale:scale.value}]}));
 return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{position:'absolute',left:0,right:0,top:'28%',alignItems:'center'}}><Animated.View style={[{alignItems:'center'},style]}><Ionicons name="flash" size={count%10===0?96:68} color="#FFC800"/><View style={{backgroundColor:'#FFF4CC',borderWidth:3,borderColor:'#FFC800',borderRadius:24,paddingHorizontal:22,paddingVertical:8,marginTop:-15}}><Text style={{fontFamily:'Nunito-ExtraBold',fontSize:26,color:'#AD5700'}}>{count} IN A ROW</Text></View></Animated.View></View>;
}
