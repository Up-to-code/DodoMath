import { createContext, useContext } from 'react';
import type { FeedbackMoment } from '@/lib/feedbackTiming';

export const FeedbackClock = createContext<FeedbackMoment | null>(null);
export const useFeedbackClock = () => useContext(FeedbackClock);
