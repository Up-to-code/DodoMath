import { SUBJECTS } from '@/data/curriculum';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MathScreen, Action, Heading } from '@/components/MathUI';
import { PageHeader } from '@/components/PageHeader';
import { Dodo } from '@/components/Dodo';
import { useMathStore } from '@/store/mathStore';
export default function Welcome(){
 const [step,setStep]=useState(0);const {level,setLevel,dailyGoal,setGoal,finishOnboarding}=useMathStore();
 const titles=['Hi, I’m Fox!','Where shall we begin?','A little math, every day','Ready for takeoff?'];
 return <MathScreen header={<PageHeader title="Welcome"/>}><View className="h-3 bg-[#FFEDD5] rounded-full mb-8"><View style={{width:`${(step+1)*25}%`}} className="h-3 bg-[#C2410C] rounded-full"/></View><View className="items-center py-8"><Dodo size={180} mood={step===3?'flying':'happy'}/></View><Heading title={titles[step]} subtitle={step===0?'Start with Basics, then explore each math subject.':step===1?'Choose a subject. You can switch anytime.':step===2?'Choose your daily question target.':'Your mathematics journey starts with one small step.'}/>{step===1&&SUBJECTS.map(section=><TouchableOpacity accessibilityRole="button" accessibilityState={{selected:level===section.id}} key={section.id} onPress={()=>setLevel(section.id)} className={`border-2 rounded-2xl p-4 mb-3 ${level===section.id?'border-[#C2410C] bg-[#FFF7ED]':'border-border'}`}><Text className="font-poppins-bold text-lg text-text-primary">{section.title}</Text></TouchableOpacity>)}{step===2&&[5,10,15,20].map(goal=><TouchableOpacity accessibilityRole="button" accessibilityState={{selected:dailyGoal===goal}} key={goal} onPress={()=>setGoal(goal)} className={`border-2 rounded-2xl p-4 mb-3 ${dailyGoal===goal?'border-[#C2410C] bg-[#FFF7ED]':'border-border'}`}><Text className="font-poppins-bold text-lg text-text-primary">{goal} questions a day</Text></TouchableOpacity>)}<View className="mt-6"><Action label={step===0?'Get started':step===3?'Start learning':'Continue'} onPress={()=>{if(step===3){finishOnboarding();router.replace('/(tabs)');}else setStep(step+1);}}/></View>{step>0&&<View className="mt-3"><Action label="Previous" secondary onPress={()=>setStep(step-1)}/></View>}</MathScreen>;
}
