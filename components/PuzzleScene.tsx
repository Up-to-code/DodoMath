import { View } from 'react-native';
import Svg, { Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { Question } from '@/data/mathCourse';
export function PuzzleScene({question,success}:{question:Question;success:boolean}){
 if(!question.scene)return null;
 if(question.scene==='matrix')return <View className="items-center mb-5"><Svg width={180} height={110} viewBox="0 0 180 110" accessibilityLabel="Two by two matrix: first row one, two; second row three, four"><Path d="M45 10H30V100H45M135 10H150V100H135" fill="none" stroke="#4B4B4B" strokeWidth={3}/>{[1,2,3,4].map((n,i)=><SvgText key={n} x={i%2?112:65} y={i<2?43:82} textAnchor="middle" fontSize={25} fill="#4B4B4B">{n}</SvgText>)}</Svg></View>;
 const total=question.sceneTotal??9,count=question.sceneCount??5;
 return <View className="items-center mb-5"><Svg width="100%" height={115} viewBox="0 0 330 115" accessibilityLabel={`${count} of ${total} bridge planks fitted${success?'. Bridge section repaired':''}`}><Path d="M10 92H60L90 102L105 91L220 91L235 104L273 90H320" stroke="#D3D3D3" strokeWidth={3} fill="none"/><Line x1={42} y1={42} x2={290} y2={42} stroke="#AFAFAF" strokeWidth={3}/><Line x1={42} y1={82} x2={290} y2={82} stroke="#AFAFAF" strokeWidth={3}/>{Array.from({length:total},(_,i)=><Rect key={i} x={45+i*240/total} y={49} width={240/total-5} height={26} rx={4} fill={success?'#58CC02':i<count?'#A78BFA':'white'} stroke={success?'#459B00':i<count?'#7C3AED':'#D3D3D3'} strokeWidth={2} strokeDasharray={i>=count&&!success?'3 3':undefined}/>)}<Path d="M35 32V95M297 32V95" stroke="#777" strokeWidth={5} strokeLinecap="round"/></Svg></View>;
}
