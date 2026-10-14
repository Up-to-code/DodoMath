export type FeedbackSound = 'tap' | 'correct' | 'retry' | 'complete' | 'combo' | 'combo10' | 'fly';
export type FeedbackMoment = { id: number; startsAt: number };
export type FeedbackStart = (moment: FeedbackMoment) => void;

export const FEEDBACK_LEAD_MS = 40;
export const REACTION_DURATION_MS = 520;
export const feedbackNow = () => performance.now();

/** Late React commits catch up to the shared clock instead of restarting the motion. */
export function reactionPosition(startsAt: number, now: number, duration = REACTION_DURATION_MS) {
  return {
    delay: Math.max(0, startsAt - now),
    progress: Math.min(1, Math.max(0, (now - startsAt) / duration)),
    remaining: Math.max(0, duration - Math.max(0, now - startsAt)),
  };
}
