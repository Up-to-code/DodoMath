import { useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useMathStore } from '@/store/mathStore';
export type FeedbackSound='tap'|'correct'|'retry'|'complete'|'combo'|'combo10'|'fly';
export function useFeedback() {
 const lastTap=useRef(0);const lastResult=useRef(0);const generation=useRef(0);
 const sounds=useMathStore(s=>s.sounds);const haptics=useMathStore(s=>s.haptics);
 const tap=useAudioPlayer(require('@/assets/sounds/v4/tap.wav'));const correct=useAudioPlayer(require('@/assets/sounds/v4/correct.wav'));const retry=useAudioPlayer(require('@/assets/sounds/v4/retry.wav'));const complete=useAudioPlayer(require('@/assets/sounds/v4/complete.wav'));const combo=useAudioPlayer(require('@/assets/sounds/v4/combo.wav'));const combo10=useAudioPlayer(require('@/assets/sounds/v4/combo10.wav'));const fly=useAudioPlayer(require('@/assets/sounds/v4/fly.wav'));
 useEffect(()=>{if(!sounds){generation.current++;for(const player of [tap,correct,retry,complete,combo,combo10,fly])player.pause();}},[sounds,tap,correct,retry,complete,combo,combo10,fly]);
 return (name:FeedbackSound)=>{
  const now=Date.now();if(name==='tap'){if(now-lastTap.current<140||now-lastResult.current<250)return;lastTap.current=now;}else lastResult.current=now;
  if(sounds){
   const players={tap,correct,retry,complete,combo,combo10,fly};const player=players[name];
   if(name!=='tap'){generation.current++;for(const p of Object.values(players))p.pause();}else tap.pause();
   const ticket=generation.current;player.volume=name==='tap'?.42:name==='retry'?.58:.65;
   void player.seekTo(0).then(()=>{if(ticket===generation.current)player.play();}).catch(()=>{});
  }
  if(haptics&&Platform.OS!=='web'){if(name==='tap')void Haptics.selectionAsync().catch(()=>{});else void Haptics.notificationAsync(name==='retry'?Haptics.NotificationFeedbackType.Warning:Haptics.NotificationFeedbackType.Success).catch(()=>{});}
 };
}
