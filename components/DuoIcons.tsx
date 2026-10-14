import Svg, { Path, Rect, Circle } from 'react-native-svg';
type Name='home'|'practice'|'chest'|'shield'|'profile'|'math'|'gem';
export function DuoIcon({name,size=34}: {name:Name;size?:number}) {
 return <Svg width={size} height={size} viewBox="0 0 40 40">
 {name==='home'&&<><Path d="M7 19h26v15a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3Z" fill="#FFC800"/><Path d="m3 19 17-15 17 15" stroke="#FF4B4B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><Rect x="16" y="24" width="9" height="13" rx="3" fill="#FF9600"/><Rect x="14" y="15" width="12" height="7" rx="3" fill="#FF9600"/></>}
 {name==='practice'&&<><Path d="m11 10 18 19" stroke="#1899D6" strokeWidth="7"/><Path d="m4 12 7-7m-3 14L19 8m2 24 11-11m-3 14 7-7" stroke="#1CB0F6" strokeWidth="7" strokeLinecap="round"/></>}
 {name==='chest'&&<><Rect x="4" y="12" width="32" height="24" rx="5" fill="#C87F00"/><Rect x="4" y="7" width="32" height="16" rx="6" fill="#FFC800"/><Path d="M8 9v25m24-25v25" stroke="#FF9600" strokeWidth="4"/><Rect x="16" y="19" width="8" height="10" rx="2" fill="#FFF5BB"/></>}
 {name==='shield'&&<><Path d="M5 5h30v17c0 8-15 15-15 15S5 30 5 22Z" fill="#FDBA74"/><Path d="M11 10h18v11c0 4-9 9-9 9s-9-5-9-9Z" fill="#EA580C"/><Path d="m20 12 2 5 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" fill="#FFEDD5"/></>}
 {name==='profile'&&<><Circle cx="20" cy="20" r="18" fill="#EA580C"/><Path d="M8 35v-5c0-10 24-10 24 0v5" fill="#FF9600"/><Circle cx="20" cy="17" r="9" fill="#FFD8A8"/><Path d="M11 17V9h18v7l-5-5-3 4-4-2Z" fill="#A56644"/><Circle cx="17" cy="18" r="1.5" fill="#4B4B4B"/><Circle cx="24" cy="18" r="1.5" fill="#4B4B4B"/></>}
 {name==='math'&&<><Rect x="2" y="2" width="36" height="36" rx="9" fill="#EA580C"/><Path d="M10 12h8m-4-4v8m10-4h8M10 25l7 7m0-7-7 7m15-4h8" stroke="white" strokeWidth="3" strokeLinecap="round"/></>}
 {name==='gem'&&<><Path d="m20 3 13 8v18l-13 8L7 29V11Z" fill="#EA580C"/><Path d="m20 7 9 6v14l-9 6-9-6V13Z" fill="#FDBA74"/><Path d="m20 10 7 5v11l-7 4-7-4V15Z" fill="#EA580C"/><Path d="m16 13 4-2 4 2" stroke="white" strokeWidth="3" strokeLinecap="round"/></>}
 </Svg>;
}
