export type FeedbackSound = 'tap' | 'correct' | 'retry' | 'complete' | 'combo' | 'combo10' | 'fly';
export type FeedbackMoment = { id: number; startsAt: number };
export type FeedbackStart = (moment: FeedbackMoment) => void;

export const FEEDBACK_LEAD_MS = 40;
export const REACTION_DURATION_MS = 860;
export const POSE_BLEND_MS = 140;
export const feedbackNow = () => performance.now();

/** Late React commits catch up to the shared clock instead of restarting the motion. */
export function reactionPosition(startsAt: number, now: number, duration = REACTION_DURATION_MS) {
  return {
    delay: Math.max(0, startsAt - now),
    progress: Math.min(1, Math.max(0, (now - startsAt) / duration)),
    remaining: Math.max(0, duration - Math.max(0, now - startsAt)),
  };
}

export function reactionFrame(progress: number, frameCount: number) {
  'worklet';
  return Math.floor(Math.max(0, Math.min(1, progress)) * (frameCount - 1));
}
