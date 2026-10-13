import { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
export function MathScreen({children,header}: {children: ReactNode;header?:ReactNode}) {
  return <SafeAreaView style={{flex:1,backgroundColor:'#fff'}} edges={['top','left','right']}>{header}<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,paddingBottom:32,maxWidth:520,width:'100%',alignSelf:'center'}}>{children}</ScrollView></SafeAreaView>;
}
export function Action({label,onPress,disabled=false,secondary=false,tone="brand"}: {label:string;onPress:()=>void;disabled?:boolean;secondary?:boolean;tone?:"brand"|"success"}) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} className={`min-h-14 rounded-2xl px-5 py-3 items-center justify-center border-2 border-b-4 ${disabled?'bg-[#E5E5E5] border-[#E5E5E5]':secondary?'bg-white border-[#E5E5E5]':tone==='success'?'bg-[#58CC02] border-[#459B00]':'bg-[#7C3AED] border-[#5B21B6]'}`}><Text className={`font-poppins-bold text-base tracking-wider ${disabled?'text-[#777777]':secondary?'text-[#7C3AED]':tone==='success'?'text-[#245400]':'text-white'}`}>{label.toUpperCase()}</Text></TouchableOpacity>;
}
export function Heading({eyebrow,title,subtitle}: {eyebrow?:string;title:string;subtitle?:string}) {
  return <View className="mb-5">{eyebrow&&<Text className="font-poppins-bold text-sm text-[#5B21B6] mb-2">{eyebrow.toUpperCase()}</Text>}<Text accessibilityRole="header" className="h1">{title}</Text>{subtitle&&<Text className="body-md text-text-secondary mt-2">{subtitle}</Text>}</View>;
}
export function CourseCard({title,subtitle,icon='play',onPress,completed=false}: {title:string;subtitle:string;icon?:keyof typeof Ionicons.glyphMap;onPress:()=>void;completed?:boolean}) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${title}. ${subtitle}${completed?'. Completed':''}`} onPress={onPress} className="flex-row items-center border-2 border-b-4 border-border bg-white rounded-2xl p-4 mb-3 min-h-20"><View className="w-12 h-12 rounded-2xl bg-[#F5F3FF] items-center justify-center mr-3"><Ionicons name={completed?'checkmark':icon} size={26} color={completed?'#5B21B6':'#8B5CF6'} /></View><View className="flex-1"><Text className="font-poppins-bold text-base text-text-primary">{title}</Text><Text className="body-sm text-text-secondary mt-1">{subtitle}</Text></View><Ionicons name="chevron-forward" size={20} color="#AFAFAF" /></TouchableOpacity>;
}
