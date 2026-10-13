import { useEffect, useRef } from 'react';
import { resolveSource } from 'expo-audio/build/utils/resolveSource';
import { useMathStore } from '@/store/mathStore';
export type FeedbackSound = 'tap' | 'correct' | 'retry' | 'complete' | 'combo' | 'fly';
const sources = {
 tap: require('@/assets/sounds/tap.wav'), correct: require('@/assets/sounds/correct.wav'),
 retry: require('@/assets/sounds/retry.wav'), complete: require('@/assets/sounds/complete.wav'),
 combo: require('@/assets/sounds/combo.wav'), fly: require('@/assets/sounds/fly.wav'),
};
/** Expo's pinned web player discards HTMLMediaElement.play()'s promise.
 * Own that promise so a quick pause, navigation, or mute cannot cause an unhandled AbortError.
 * Reuse its installed Metro asset resolver; native audio/haptics remain in useFeedback.ts.
 */
export function useFeedback() {
 const sounds=useMathStore(s=>s.sounds);const players=useRef<Partial<Record<FeedbackSound,HTMLAudioElement>>>({});
 const lastTap=useRef(0);const lastResult=useRef(0);
 useEffect(()=>{
  const owned:Partial<Record<FeedbackSound,HTMLAudioElement>>={};
  for(const [name,source] of Object.entries(sources)){
   const resolved=resolveSource(source);const uri=typeof resolved==='string'?resolved:typeof resolved==='object'&&resolved!==null?resolved.uri:undefined;
   if(uri){const audio=new Audio(uri);audio.preload='auto';owned[name as FeedbackSound]=audio;}
  }
  players.current=owned;
  return()=>{for(const audio of Object.values(owned)){audio.pause();audio.removeAttribute('src');audio.load();}players.current={};};
 },[]);
 useEffect(()=>{if(!sounds)for(const audio of Object.values(players.current))audio.pause();},[sounds]);
 return (name:FeedbackSound)=>{
  const now=Date.now();if(name==='tap'){if(now-lastTap.current<140||now-lastResult.current<250)return;lastTap.current=now;}else lastResult.current=now;
  if(!sounds)return;const audio=players.current[name];if(!audio)return;
  if(name!=='tap')for(const player of Object.values(players.current))player.pause();else audio.pause();
  audio.volume=name==='tap'?.24:name==='retry'?.40:.65;
  audio.currentTime=0;void audio.play().catch(()=>{ /* A later interaction, navigation or browser policy may cancel playback. */ });
 };
}
