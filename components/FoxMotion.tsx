import { useEffect, useState } from 'react';
import { AppState, Image, View } from 'react-native';
import { images } from '@/constants/images';
import { useMotion } from '@/hooks/useMotion';
/** Authored 24-frame PNG atlas, timed from elapsed milliseconds rather than screen refreshes. */
export function FoxMotion({ playId, size = 300 }: { playId: number; size?: number }) {
 const moving=useMotion();const [frame,setFrame]=useState(0);const [ready,setReady]=useState(false);
 useEffect(()=>{
  let request=0;let active=true;setFrame(0);
  if(!ready||!moving||playId===0)return;
  const start=performance.now();
  const tick=()=>{if(!active)return;const elapsed=performance.now()-start;if(elapsed>=1000){setFrame(23);return;}setFrame(Math.min(23,Math.floor(elapsed*24/1000)));request=requestAnimationFrame(tick);};
  request=requestAnimationFrame(tick);
  const subscription=AppState.addEventListener('change',state=>{if(state!=='active'){active=false;cancelAnimationFrame(request);setFrame(0);}});
  return()=>{active=false;cancelAnimationFrame(request);subscription.remove();};
 },[playId,moving,ready]);
 return <View accessible accessibilityLabel="Fox waving hello" testID={`fox-hello-frame-${frame}`} style={{width:size,height:size,overflow:'hidden'}}>
  <Image source={images.foxHelloAtlas} onLoad={()=>setReady(true)} accessible={false} resizeMode="stretch" style={{position:'absolute',width:size*6,height:size*4,left:-(frame%6)*size,top:-Math.floor(frame/6)*size}} />
 </View>;
}
