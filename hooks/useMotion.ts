import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useMathStore } from '@/store/mathStore';
export function useMotion(){const enabled=useMathStore(s=>s.animations);const [reduced,setReduced]=useState(true);useEffect(()=>{let mounted=true;AccessibilityInfo.isReduceMotionEnabled().then(v=>{if(mounted)setReduced(v);});const listener=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);return()=>{mounted=false;listener.remove();};},[]);return enabled&&!reduced;}
