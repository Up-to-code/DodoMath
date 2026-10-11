import { useEffect, useRef, useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { Question } from '@/data/mathCourse';
import { curveEquation, curveValue, readCoefficients } from '@/data/functionGraph';

export function FunctionGraph({ question, value, onChange, disabled, result }: { question: Question; value: string; onChange: (v: string) => void; disabled: boolean; result?: 'success' | 'retry' }) {
  const family = question.curveFamily ?? 'quadratic';
  const coefficients = readCoefficients(value, family);
  const [range, setRange] = useState(6);
  const [center, setCenter] = useState([0, 0]);
  const [pan, setPan] = useState(false);
  const [width, setWidth] = useState(320);
  const drag = useRef({ x: 0, y: 0, center: [0, 0] });
  const scale = 280 / (range * 2);
  const px = (x: number) => 160 + (x - center[0]) * scale;
  const py = (y: number) => 160 - (y - center[1]) * scale;
  const path = Array.from({ length: 281 }, (_, i) => {
    const x = center[0] - range + i * range * 2 / 280;
    const y = curveValue(family, coefficients, x);
    return `${i ? 'L' : 'M'}${px(x).toFixed(2)},${py(y).toFixed(2)}`;
  }).join(' ');
  const color = result === 'success' ? '#58CC02' : result === 'retry' ? '#EA2B2B' : '#7C3AED';
  function update(index: number, n: number) {
    if (!Number.isFinite(n) || disabled) return;
    onChange(coefficients.map((v, i) => i === index ? Math.max(-6, Math.min(6, n)) : v).join(','));
  }
  const tickStep = range > 6 ? 2 : 1;
  const xs = Array.from({ length: Math.ceil(range * 2 / tickStep) + 2 }, (_, i) => (Math.floor((center[0] - range) / tickStep) + i) * tickStep);
  const ys = Array.from({ length: Math.ceil(range * 2 / tickStep) + 2 }, (_, i) => (Math.floor((center[1] - range) / tickStep) + i) * tickStep);
  return <View>
    <Text selectable accessibilityLiveRegion="polite" className="font-poppins-bold text-2xl text-text-primary text-center mb-3">{curveEquation(family, coefficients)}</Text>
    <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={{ width: '100%', maxWidth: 300, aspectRatio: 1, alignSelf: 'center' }}
      onStartShouldSetResponder={() => pan} onMoveShouldSetResponder={() => pan}
      onResponderGrant={e => { drag.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, center: [...center] }; }}
      onResponderMove={e => { if (pan) setCenter([Math.max(-30, Math.min(30, drag.current.center[0] - (e.nativeEvent.pageX - drag.current.x) * 320 / width / scale)), Math.max(-30, Math.min(30, drag.current.center[1] + (e.nativeEvent.pageY - drag.current.y) * 320 / width / scale))]); }}>
      <Svg width="100%" height="100%" viewBox="0 0 320 320" accessibilityLabel={`Interactive coordinate graph. ${curveEquation(family, coefficients)}. Visible center ${center.map(n => n.toFixed(1)).join(',')}, range ${range}. Targets ${question.targetPoints?.map(p => p.join(',')).join('; ')}.`}>
        <Defs><ClipPath id="plot"><Rect x={20} y={20} width={280} height={280} /></ClipPath></Defs>
        <G clipPath="url(#plot)">
          {xs.map(x => <Line key={`x${x}`} x1={px(x)} y1={20} x2={px(x)} y2={300} stroke={x === 0 ? '#777' : '#E8E8E8'} strokeWidth={x === 0 ? 1.8 : 1} />)}
          {ys.map(y => <Line key={`y${y}`} x1={20} y1={py(y)} x2={300} y2={py(y)} stroke={y === 0 ? '#777' : '#E8E8E8'} strokeWidth={y === 0 ? 1.8 : 1} />)}
          <Path d={path} stroke={color} strokeWidth={3.5} fill="none" />
          {question.targetPoints?.map(([x, y], i) => <Circle key={i} cx={px(x)} cy={py(y)} r={6} fill="white" stroke="#C78700" strokeWidth={3} />)}
        </G>
        {xs.filter(x => x % 2 === 0 && px(x) >= 20 && px(x) <= 300).map(x => <SvgText key={x} x={px(x)} y={Math.max(15, Math.min(315, py(0) + 15))} textAnchor="middle" fontSize={11} fill="#777">{x}</SvgText>)}
        {ys.filter(y => y !== 0 && y % 2 === 0 && py(y) >= 20 && py(y) <= 300).map(y => <SvgText key={y} x={Math.max(10, Math.min(295, px(0) - 8))} y={py(y) + 4} textAnchor="end" fontSize={11} fill="#777">{y}</SvgText>)}
        <SvgText x={305} y={Math.max(15, Math.min(310, py(0) - 6))} fontSize={13} fill="#777">x</SvgText><SvgText x={Math.max(10, Math.min(305, px(0) + 7))} y={14} fontSize={13} fill="#777">y</SvgText>
      </Svg>
    </View>
    <View className="flex-row justify-center gap-3 mb-2">
      {([{ icon: 'remove', label: 'Zoom out', action: () => setRange(r => Math.min(12, r + 2)) }, { icon: 'add', label: 'Zoom in', action: () => setRange(r => Math.max(2, r - 2)) }, { icon: 'move', label: 'Pan graph', action: () => setPan(p => !p) }, { icon: 'locate-outline', label: 'Center graph', action: () => { setCenter([0, 0]); setRange(6); setPan(false); } }] as const).map(b => <TouchableOpacity key={b.label} accessibilityRole="button" accessibilityLabel={b.label} accessibilityState={b.label === 'Pan graph' ? { selected: pan } : {}} onPress={b.action} className="w-11 h-11 items-center justify-center"><Ionicons name={b.icon} size={22} color={b.label === 'Pan graph' && pan ? '#7C3AED' : '#777'} /></TouchableOpacity>)}
    </View>
    {(family === 'linear' ? ['Slope m', 'Intercept b'] : ['a', 'b', 'c']).map((label, i) => <View key={label} className="flex-row items-center gap-3">
      <Text className="font-poppins-bold text-text-primary w-20 text-sm">{label}</Text>
      <CoefficientSlider label={label} value={coefficients[i]} disabled={disabled} onChange={n => update(i, n)} />
      <CoefficientInput label={label} value={coefficients[i]} disabled={disabled} onChange={n => update(i, n)} />
    </View>)}
  </View>;
}
function CoefficientSlider({ label, value, disabled, onChange }: { label: string; value: number; disabled: boolean; onChange: (v: number) => void }) {
  const [width, setWidth] = useState(160);
  const setFromX = (x: number) => onChange(Math.round((Math.max(0, Math.min(width - 20, x - 10)) / (width - 20) * 12 - 6) * 2) / 2);
  return <View tabIndex={disabled?-1:0} accessible accessibilityRole="adjustable" accessibilityLabel={`${label} slider`} accessibilityState={{ disabled }} accessibilityValue={{ min: -6, max: 6, now: value }} aria-valuemin={-6} aria-valuemax={6} aria-valuenow={value} aria-disabled={disabled}
    {...(Platform.OS === 'web' ? { onKeyDown: (e: {key: string; preventDefault: () => void}) => { if (!disabled && ['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End'].includes(e.key)) { e.preventDefault(); onChange(e.key === 'Home' ? -6 : e.key === 'End' ? 6 : Math.max(-6, Math.min(6, value + (['ArrowLeft','ArrowDown'].includes(e.key) ? -.5 : .5)))); } } } : {})} accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
    onAccessibilityAction={e => { if (!disabled) onChange(Math.max(-6, Math.min(6, value + (e.nativeEvent.actionName === 'increment' ? .5 : -.5)))); }}
    onLayout={e => setWidth(e.nativeEvent.layout.width)} onStartShouldSetResponder={() => !disabled} onMoveShouldSetResponder={() => !disabled}
    onResponderGrant={e => { if (!disabled) setFromX(e.nativeEvent.locationX); }} onResponderMove={e => { if (!disabled) setFromX(e.nativeEvent.locationX); }}
    style={{ flex: 1, height: 44, justifyContent: 'center', opacity: disabled ? .6 : 1 }}>
    <View pointerEvents="none" style={{ height: 4, marginHorizontal: 10, backgroundColor: '#E5E5E5', borderRadius: 2 }} />
    <View pointerEvents="none" style={{ position: 'absolute', left: 10, right: width - 10 - (value + 6) / 12 * (width - 20), height: 4, borderRadius: 2, backgroundColor: '#A78BFA' }} />
    <View pointerEvents="none" style={{ position: 'absolute', left: (value + 6) / 12 * (width - 20), width: 20, height: 20, borderRadius: 10, backgroundColor: '#7C3AED' }} />
  </View>;
}

function CoefficientInput({label,value,disabled,onChange}:{label:string;value:number;disabled:boolean;onChange:(n:number)=>void}) {
  const [draft,setDraft]=useState(String(value));
  useEffect(()=>setDraft(String(value)),[value]);
  return <TextInput accessibilityLabel={`${label} value`} value={draft} editable={!disabled} onChangeText={t=>{if(!/^-?\d*(\.\d*)?$/.test(t))return;setDraft(t);if(t!==''&&t!=='-'&&t!=='.'&&t!=='-.'&&Number.isFinite(Number(t)))onChange(Number(t));}} onBlur={()=>setDraft(String(value))} keyboardType="numbers-and-punctuation" selectTextOnFocus maxLength={8} style={{width:42,minHeight:44,textAlign:'center'}} className="font-poppins-bold text-base text-[#7C3AED]"/>;
}
