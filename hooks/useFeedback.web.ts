import { useEffect, useRef } from 'react';
import { resolveSource } from 'expo-audio/build/utils/resolveSource';
import { useMathStore } from '@/store/mathStore';
import { createFeedbackAudio } from '@/lib/feedbackAudio';
import { FEEDBACK_LEAD_MS, feedbackNow, type FeedbackSound, type FeedbackStart } from '@/lib/feedbackTiming';
export type { FeedbackSound } from '@/lib/feedbackTiming';
const sources = {
  tap: require('@/assets/sounds/v4/tap.wav'), correct: require('@/assets/sounds/v4/correct.wav'),
  retry: require('@/assets/sounds/v4/retry.wav'), complete: require('@/assets/sounds/v4/complete.wav'),
  combo: require('@/assets/sounds/v4/combo.wav'), combo10: require('@/assets/sounds/v4/combo10.wav'), fly: require('@/assets/sounds/v4/fly.wav'),
};

export function useFeedback() {
  const sounds = useMathStore(s => s.sounds);
  const engine = useRef<ReturnType<typeof createFeedbackAudio> | null>(null);
  const lastTap = useRef(-Infinity), lastResult = useRef(-Infinity), sequence = useRef(0);
  useEffect(() => {
    if (typeof AudioContext === 'undefined') return;
    const urls = Object.fromEntries(Object.entries(sources).map(([name, source]) => {
      const resolved = resolveSource(source);
      return [name, typeof resolved === 'string' ? resolved : typeof resolved === 'object' && resolved !== null ? resolved.uri ?? '' : ''];
    })) as Record<FeedbackSound, string>;
    const owned = createFeedbackAudio(new AudioContext({ latencyHint: 'interactive' }), urls);
    engine.current = owned;
    return () => { owned.dispose(); engine.current = null; };
  }, []);
  useEffect(() => { engine.current?.setMuted(!sounds); }, [sounds]);
  const play = (name: FeedbackSound, onStart?: FeedbackStart) => {
    const now = feedbackNow();
    if (name === 'tap') {
      if (now - lastTap.current < 140 || now - lastResult.current < 250) return;
      lastTap.current = now;
    } else lastResult.current = now;
    if (engine.current) void engine.current.play(name, sounds, onStart);
    else onStart?.({ id: ++sequence.current, startsAt: now + FEEDBACK_LEAD_MS });
  };
  return Object.assign(play, { stop: () => engine.current?.stop() });
}
