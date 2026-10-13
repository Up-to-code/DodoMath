import { useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useMathStore } from '@/store/mathStore';
export type FeedbackSound='tap'|'correct'|'retry'|'complete'|'combo'|'fly';
export function useFeedback() {
 const lastTap=useRef(0);const sounds=useMathStore(s=>s.sounds);const haptics=useMathStore(s=>s.haptics);
 const tap=useAudioPlayer(require('@/assets/sounds/tap.wav'));const correct=useAudioPlayer(require('@/assets/sounds/correct.wav'));const retry=useAudioPlayer(require('@/assets/sounds/retry.wav'));const complete=useAudioPlayer(require('@/assets/sounds/complete.wav'));const combo=useAudioPlayer(require('@/assets/sounds/combo.wav'));const fly=useAudioPlayer(require('@/assets/sounds/fly.wav'));
 const players={tap,correct,retry,complete,combo,fly};
 return (name:FeedbackSound)=>{if(name==='tap'){const now=Date.now();if(now-lastTap.current<140)return;lastTap.current=now;}if(sounds){const p=players[name];p.volume=name==='tap'?.25:name==='retry'?.35:.55;void p.seekTo(0).then(()=>p.play()).catch(()=>{});}if(haptics&&Platform.OS!=='web'){if(name==='tap')void Haptics.selectionAsync().catch(()=>{});else void Haptics.notificationAsync(name==='retry'?Haptics.NotificationFeedbackType.Warning:Haptics.NotificationFeedbackType.Success).catch(()=>{});}};
}
