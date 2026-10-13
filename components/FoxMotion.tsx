import { useEffect, useState } from 'react';
import { AppState, Image, View } from 'react-native';
import { images } from '@/constants/images';
import runtime from '@/assets/animations/fox/runtime.json';
import { useMotion } from '@/hooks/useMotion';
/** Baked layered Fox motion; root and clothing attachments are authored in QH Studio. */
export function FoxMotion({ playId, size = 300 }: { playId: number; size?: number }) {
 const moving=useMotion();const [frame,setFrame]=useState(0);const [ready,setReady]=useState(false);
 useEffect(()=>{
  let request=0;let active=true;setFrame(0);
  if(!ready||!moving||playId===0)return;
  const start=performance.now();
  const tick=()=>{if(!active)return;const elapsed=performance.now()-start;if(elapsed>=runtime.durationSeconds*1000){setFrame(0);return;}setFrame(Math.min(runtime.frameCount-1,Math.floor(elapsed*runtime.fps/1000)));request=requestAnimationFrame(tick);};
  request=requestAnimationFrame(tick);
  const subscription=AppState.addEventListener('change',state=>{if(state!=='active'){active=false;cancelAnimationFrame(request);setFrame(0);}});
  return()=>{active=false;cancelAnimationFrame(request);subscription.remove();};
 },[playId,moving,ready]);
 return <View accessible accessibilityLabel="Fox waving hello" testID={`fox-hello-frame-${frame}`} style={{width:size,height:size,overflow:'hidden'}}>
  <Image source={images.foxHelloAtlas} onLoad={()=>setReady(true)} accessible={false} resizeMode="stretch" style={{position:'absolute',width:size*runtime.columns,height:size*runtime.rows,left:-(frame%runtime.columns)*size,top:-Math.floor(frame/runtime.columns)*size}} />
 </View>;
}
