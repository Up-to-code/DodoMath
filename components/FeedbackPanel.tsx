import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotionEntry } from './Motion';
import type { ReactNode } from 'react';
export function FeedbackPanel({correct,message,children}:{correct:boolean;message:string;children?:ReactNode}){
 return <MotionEntry trigger={correct?'success':'retry'}><ScrollView style={{maxHeight:180}} contentContainerStyle={{paddingBottom:16}}><View accessibilityLiveRegion="polite"><View style={{flexDirection:'row',gap:12,alignItems:'center',marginBottom:8}}><Ionicons name={correct?'checkmark-circle':'close-circle'} size={28} color={correct?'#58A700':'#EA2B2B'} accessible={false}/><Text style={{fontFamily:'Nunito-ExtraBold',fontSize:24,lineHeight:30,color:correct?'#3C7900':'#EA2B2B'}}>{correct?'Nicely done!':'Let’s try again'}</Text></View><Text style={{fontFamily:'Nunito-Regular',fontSize:17,lineHeight:24,color:correct?'#3C7900':'#B72525'}}>{message}</Text>{children}</View></ScrollView></MotionEntry>;
}
