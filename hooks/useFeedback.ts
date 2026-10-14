import { useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useMathStore } from '@/store/mathStore';
import { FEEDBACK_LEAD_MS, feedbackNow, type FeedbackSound, type FeedbackStart } from '@/lib/feedbackTiming';
export type { FeedbackSound } from '@/lib/feedbackTiming';
export function useFeedback() {
  const lastTap = useRef(-Infinity), lastResult = useRef(-Infinity), generation = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sounds = useMathStore(s => s.sounds), haptics = useMathStore(s => s.haptics);
  const audibleNow = useRef(sounds), hapticsNow = useRef(haptics);
  audibleNow.current = sounds; hapticsNow.current = haptics;
  const tap = useAudioPlayer(require('@/assets/sounds/v4/tap.wav'));
  const correct = useAudioPlayer(require('@/assets/sounds/v4/correct.wav'));
  const retry = useAudioPlayer(require('@/assets/sounds/v4/retry.wav'));
  const complete = useAudioPlayer(require('@/assets/sounds/v4/complete.wav'));
  const combo = useAudioPlayer(require('@/assets/sounds/v4/combo.wav'));
  const combo10 = useAudioPlayer(require('@/assets/sounds/v4/combo10.wav'));
  const fly = useAudioPlayer(require('@/assets/sounds/v4/fly.wav'));
  useEffect(() => {
    if (!sounds) { for (const p of [tap, correct, retry, complete, combo, combo10, fly]) p.pause(); }
  }, [sounds, tap, correct, retry, complete, combo, combo10, fly]);
  useEffect(() => () => { generation.current++; clearTimeout(pending.current); }, []);
  const play = (name: FeedbackSound, onStart?: FeedbackStart) => {
    const now = feedbackNow();
    if (name === 'tap') { if (now - lastTap.current < 140 || now - lastResult.current < 250) return; lastTap.current = now; }
    else lastResult.current = now;
    const players = { tap, correct, retry, complete, combo, combo10, fly }, player = players[name];
    if (name !== 'tap') { generation.current++; clearTimeout(pending.current); for (const p of Object.values(players)) p.pause(); }
    else tap.pause();
    const ticket = generation.current;
    const begin = (audible: boolean) => {
      if (ticket !== generation.current) return;
      const startsAt = feedbackNow() + FEEDBACK_LEAD_MS;
      onStart?.({ id: ticket, startsAt });
      pending.current = setTimeout(() => {
        if (ticket !== generation.current) return;
        if (audible && audibleNow.current) player.play();
        if (hapticsNow.current && Platform.OS !== 'web') {
          const notification = name === 'retry' ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success;
          void (name === 'tap' ? Haptics.selectionAsync() : Haptics.notificationAsync(notification)).catch(() => {});
        }
      }, FEEDBACK_LEAD_MS);
    };
    player.volume = name === 'tap' ? .42 : name === 'retry' ? .58 : .65;
    if (sounds && player.isLoaded) {
      let timeout: ReturnType<typeof setTimeout>;
      void Promise.race([player.seekTo(0).then(() => true).catch(() => false), new Promise<boolean>(resolve => { timeout = setTimeout(() => resolve(false), 180); })])
        .then(audible => { clearTimeout(timeout); begin(audible); });
    } else begin(false);
  };
  return Object.assign(play, { stop: () => {
    generation.current++; clearTimeout(pending.current);
    for (const p of [tap, correct, retry, complete, combo, combo10, fly]) p.pause();
  } });
}
