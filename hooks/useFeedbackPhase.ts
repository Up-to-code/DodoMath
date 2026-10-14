import { useLayoutEffect } from 'react';
import { cancelAnimation, Easing, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useFeedbackClock } from '@/components/FeedbackClock';
import { feedbackNow, reactionPosition, REACTION_DURATION_MS } from '@/lib/feedbackTiming';
import { useMotion } from './useMotion';

export function useFeedbackPhase(trigger: string | number, duration = REACTION_DURATION_MS) {
  const moment = useFeedbackClock(), enabled = useMotion(), phase = useSharedValue(1);
  useLayoutEffect(() => {
    cancelAnimation(phase);
    if (!enabled) { phase.value = 1; return; }
    const now = feedbackNow();
    const { delay, progress, remaining } = reactionPosition(moment?.startsAt ?? now, now, duration);
    phase.value = progress;
    if (remaining > 0) phase.value = withDelay(delay, withTiming(1, { duration: remaining, easing: Easing.linear }));
    return () => cancelAnimation(phase);
  }, [moment, enabled, trigger, duration, phase]);
  return phase;
}
