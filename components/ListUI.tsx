import { MotionEntry, MotionPressable } from './Motion';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
export function ListPage({title,children,back=false,footer,action,compactTitle=false}:{title:string;children:ReactNode;back?:boolean;footer?:ReactNode;action?:ReactNode;compactTitle?:boolean}){
 const router=useRouter();
 return <SafeAreaView edges={footer?['top','bottom','left','right']:['top','left','right']} style={{flex:1,backgroundColor:'white'}}>
  <View className="w-full max-w-[520px] self-center flex-row items-center gap-2 px-5 py-2 border-b border-[#F1F1F1]">
   {back&&<MotionPressable accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)')} className="w-11 h-11 items-center justify-center -ml-2"><Ionicons name="chevron-back" size={24} color="#4B4B4B"/></MotionPressable>}
   <Text accessibilityRole="header" numberOfLines={compactTitle?2:1} className="font-poppins-bold text-text-primary flex-1 text-[22px] leading-[28px] py-2">{title}</Text>{action}
  </View>
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{width:'100%',maxWidth:520,alignSelf:'center',paddingHorizontal:20,paddingTop:16,paddingBottom:24,flexGrow:1}}><MotionEntry trigger={title} style={{flexGrow:1}}>{children}</MotionEntry></ScrollView>
  {footer&&<View className="w-full max-w-[520px] self-center px-5 py-4 border-t border-[#F1F1F1]">{footer}</View>}
 </SafeAreaView>;
}
export function ListGroup({children}:{children:ReactNode}){
 return <View className="border-2 border-border rounded-2xl px-4 mb-4 overflow-hidden">{children}</View>;
}
export function ListRow({title,icon,onPress,value,selected=false,color='#C2410C',detail,divider=true,accessibilityLabel,disabled=false}:{title:string;icon:keyof typeof Ionicons.glyphMap;onPress:()=>void;value?:string;selected?:boolean;color?:string;detail?:string;divider?:boolean;accessibilityLabel?:string;disabled?:boolean}){
 return <MotionPressable accessibilityRole="button" accessibilityLabel={accessibilityLabel??`${title}${value?`, ${value}`:''}${detail?`. ${detail}`:''}`} accessibilityState={{selected,disabled}} disabled={disabled} onPress={onPress} className={`min-h-16 py-3 flex-row items-center gap-3 ${divider?'border-b border-[#EEEEEE]':''}`}>
  <Ionicons name={icon} size={23} color={color} accessible={false}/>
  <View className="flex-1"><Text numberOfLines={2} className={`font-poppins-bold text-base leading-[22px] ${selected?'text-[#C2410C]':'text-text-primary'}`}>{title}</Text>{detail&&<Text numberOfLines={1} className="font-poppins text-sm text-text-secondary mt-0.5">{detail}</Text>}</View>
  {value&&<Text className="font-poppins-bold text-sm text-text-secondary">{value}</Text>}<Ionicons name={selected?'checkmark':'chevron-forward'} size={selected?20:16} color={selected?'#C2410C':'#AFAFAF'} accessible={false}/>
 </MotionPressable>;
}
export function EmptyList({message,icon='document-outline'}:{message:string;icon?:keyof typeof Ionicons.glyphMap}){
 return <View className="flex-1 items-center justify-center py-16 gap-4"><Ionicons name={icon} size={38} color="#AFAFAF" accessible={false}/><Text className="font-poppins text-base text-text-secondary text-center">{message}</Text></View>;
}
