import { foundationFor } from '@/data/foundations';
import { FeedbackClock } from '@/components/FeedbackClock';
import type { FeedbackMoment } from '@/lib/feedbackTiming';
import { StreakMoment } from '@/components/StreakMoment';
import { MotionEntry, MotionProgress } from '@/components/Motion';
import { FeedbackFooter, FeedbackPanel } from '@/components/FeedbackPanel';
import { CompletionMoment } from '@/components/CompletionMoment';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Action, Heading, MathScreen } from '@/components/MathUI';
import { LessonPrompt } from '@/components/LessonPrompt';
import { ListPage } from '@/components/ListUI';
import { PuzzleScene } from '@/components/PuzzleScene';
import { Fox } from '@/components/Fox';
import { MathExample, QuestionInteraction } from '@/components/QuestionInteraction';
import { COURSE, REVIEWED_EXAMS, examFor, type Question } from '@/data/mathCourse';
import { SKILL_PRACTICE } from '@/data/skillPractice';
import { isCorrectAnswer } from '@/data/answerValidation';
import { useMathStore } from '@/store/mathStore';
import { useFeedback } from '@/hooks/useFeedback';

function retryHint(question:Question) {
 if(question.answerForm==='prime-product')return 'Use prime factors only. Keep the multiplication visible.';
 if(question.answerForm==='factorized')return 'Keep the factors visible. Expand them to check the original expression.';
 if(question.answerForm==='sum-products')return 'Distribute to every term and keep the products visible.';
 if(question.grading==='ordered-values')return 'Check each value and its position in the requested order.';
 if(question.grading==='unordered-values')return 'Check every solution, including signs and repeated roots.';
 switch(question.kind??'choice') {
  case 'function-graph': return 'Use the targets to check direction, intercepts, and the shape of the curve.';
  case 'graph': return 'Check the horizontal coordinate first, then the vertical coordinate.';
  case 'fraction-model': return 'Count the selected parts and compare them with the whole.';
  case 'fraction': return question.requireReduced?'Check the numerator and denominator, then reduce the fraction.':'Check how many equal parts make one whole.';
  case 'number-line': return 'Check the sign, direction, and distance from zero.';
  case 'order': return 'Put each step in the order used in the example.';
  case 'expression': return 'Follow the current step in the example. Check signs, powers, and the required form.';
  case 'number': return 'Recheck this step in the example, including the sign and place value.';
  default: return 'Compare the options with the method in the example.';
 }
}
export default function Exam() {
 const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();const {watched,completed,completedFoundations,completeFoundation,complete,recordCorrect,rememberMistake,setLevel,}=useMathStore();const starter=foundationFor(id);const skill=SKILL_PRACTICE[id];const questions=skill?.questions??examFor(id);const reviewed=!!REVIEWED_EXAMS[id]||!!skill;const feedback=useFeedback();const [index,setIndex]=useState(0);const [selected,setSelected]=useState('');const [checked,setChecked]=useState(false);const [finished,setFinished]=useState(false);const [mistakes,setMistakes]=useState(0);const [combo,setCombo]=useState(0);const [quit,setQuit]=useState(false);const [earned,setEarned]=useState(0);const [work,setWork]=useState<{prompt:string;answer:string}[]>([]);const [showWork,setShowWork]=useState(false);const scroll=useRef<ScrollView>(null);const [moment,setMoment]=useState<FeedbackMoment|null>(null);const [grading,setGrading]=useState(false);const answerLock=useRef(false);const attempt=useRef(0);const advancing=useRef(false);const cancelAttempt=useCallback(()=>{attempt.current++;},[]);
 useEffect(()=>{setIndex(0);setSelected('');setChecked(false);setFinished(false);setMistakes(0);setCombo(0);setQuit(false);setEarned(0);setWork([]);setShowWork(false);setMoment(null);setGrading(false);answerLock.current=false;advancing.current=false;cancelAttempt();return cancelAttempt;},[id,cancelAttempt]);
 useEffect(()=>{advancing.current=false;},[index]);

 const lesson=COURSE.lessons.find(l=>l.id===id);
 if((!lesson&&!skill)||!questions.length)return <MathScreen><Heading title="Practice is being prepared"/><Action label="Back to practice" onPress={()=>router.replace('/(tabs)/ai-teacher')}/></MathScreen>;
 if(!skill&&!watched.includes(id))return <MathScreen><View className="items-center my-6"><Fox size={170} mood="thinking"/></View><Heading title="Start with the teaching" subtitle="Study the video before practicing its method."/><Action label="Open lesson" onPress={()=>router.replace(`/lesson/${id}`)}/></MathScreen>;
 if(finished)return <FeedbackClock.Provider value={moment}><ListPage title={starter?'Lesson complete':skill?'Puzzle complete':'Lesson complete'} footer={<Action label="Continue" onPress={()=>{if(starter)setLevel(0);router.replace(skill&&!starter?'/(tabs)/ai-teacher':'/(tabs)');}}/>}><CompletionMoment steps={questions.length} xp={earned} mode={skill?.questions[0]?.buddy??'algebra'} perfect={mistakes===0}/></ListPage></FeedbackClock.Provider>;

 const question=questions[index];const correct=isCorrectAnswer(question,selected);const kind=question.kind??'choice';const ready=kind==='order'?(()=>{try{return JSON.parse(selected||'[]').length===question.options.length;}catch{return false;}})():!!selected.trim();
 const mode=question.buddy??(kind==='graph'||kind==='function-graph'||kind==='number-line'||(lesson?.level??0)>=9?'graph':(lesson?.level??0)<=2?'count':'algebra');
 function next(){
  if(advancing.current)return;advancing.current=true;feedback.stop();
  if(index===questions.length-1){
   setGrading(true);
   const ticket=++attempt.current;
   feedback('complete',start=>{if(ticket!==attempt.current)return;if(starter){setEarned(completedFoundations.includes(id)?0:10);completeFoundation(id);}else if(reviewed&&!skill){setEarned(completed.includes(id)?0:20);complete(id);}setMoment(start);setGrading(false);setFinished(true);});
  }else{answerLock.current=false;setMoment(null);setIndex(index+1);setSelected('');setChecked(false);scroll.current?.scrollTo({y:0,animated:false});}
 }
 function check(){
  Keyboard.dismiss();
  if(checked){if(correct){next();}else{feedback.stop();answerLock.current=false;setMoment(null);setChecked(false);if(kind!=='function-graph')setSelected('');}return;}
  if(answerLock.current||!ready)return;
  answerLock.current=true;setGrading(true);
  const ticket=++attempt.current;
  const sound=correct?((combo+1)%10===0?'combo10':(combo+1)%5===0?'combo':'correct'):'retry';
  feedback(sound,start=>{
   if(ticket!==attempt.current)return;
   setMoment(start);setChecked(true);setGrading(false);
   if(correct){setWork(w=>[...w,{prompt:question.prompt,answer:selected}]);if(reviewed)recordCorrect();setCombo(c=>c+1);}
   else{setCombo(0);setMistakes(m=>m+1);rememberMistake(id,question.prompt);}
  });
 }
 return <FeedbackClock.Provider value={moment}><SafeAreaView edges={['top','bottom','left','right']} style={{flex:1,backgroundColor:'white'}}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':Platform.OS==='android'?'height':undefined}>
 <View className="w-full max-w-[520px] self-center flex-row items-center gap-2 px-3 py-2"><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close practice" onPress={()=>setQuit(true)} className="w-11 h-11 items-center justify-center"><Ionicons name="close" size={25} color="#AFAFAF"/></TouchableOpacity><View accessibilityRole="progressbar" accessibilityLabel="Lesson progress" accessibilityValue={{min:0,max:questions.length,now:index}} className="h-3 bg-border rounded-full flex-1 overflow-hidden"><MotionProgress value={questions.length?index/questions.length:0}/></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="Sound and motion settings" onPress={()=>router.push('/settings')} className="w-11 h-11 items-center justify-center"><Ionicons name="volume-medium" size={25} color="#777777"/></TouchableOpacity></View>
 <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,paddingTop:10,width:'100%',maxWidth:520,alignSelf:'center',flexGrow:1}}><MotionEntry trigger={`${id}-${index}`} style={{flexGrow:1}}>
 
 <LessonPrompt prompt={question.prompt} mode={mode} reaction={checked?(correct?'success':'retry'):selected?'thinking':'idle'}/>
 <View style={{flexGrow:1,justifyContent:'center',paddingVertical:16,minHeight:question.equation||question.problem||question.visual||question.scene?120:24}}>
 {question.equation&&<Text selectable className="font-poppins-bold text-[32px] leading-10 text-text-primary text-center py-4">{question.equation}</Text>}
 {!question.equation&&question.problem&&<Text selectable className="font-poppins-bold text-2xl leading-8 text-text-primary text-center py-4">{question.problem}</Text>}
 <PuzzleScene question={question} success={checked&&correct}/>
 {question.visual&&question.visual!=='pizza'&&<MathExample type={question.visual}/>}
 </View>
 <QuestionInteraction key={`${id}-${index}`} question={question} value={selected} onChange={v=>{setSelected(v);feedback('tap');}} disabled={checked||grading} result={checked?(correct?'success':'retry'):undefined}/> {work.length>0&&<View className="mt-5"><TouchableOpacity accessibilityRole="button" accessibilityLabel="Show or hide your previous steps" accessibilityState={{expanded:showWork}} onPress={()=>setShowWork(!showWork)} className="min-h-11 justify-center"><Text className="font-poppins-bold text-[#C2410C]">Your steps</Text></TouchableOpacity>{showWork&&work.map((item,i)=><View key={i} className="border-l-2 border-[#FDBA74] pl-3 py-2"><Text className="body-sm text-text-secondary">{i+1}. {item.prompt}</Text><Text selectable className="font-poppins-bold text-base text-[#9A3412]">{item.answer}</Text></View>)}</View>}{!reviewed&&<Text className="body-sm text-text-secondary mt-5">Caption-based recall draft. Teaching review is pending.</Text>}
 </MotionEntry></ScrollView>
 <FeedbackFooter result={checked?(correct?'success':'retry'):undefined}><View className="w-full max-w-[480px] self-center">{checked&&<FeedbackPanel mode={mode} correct={correct} message={correct?question.explanation.replace(' This is the current step; continue with the demonstrated method.',''):retryHint(question)}>{!correct&&!skill&&<TouchableOpacity accessibilityRole="button" accessibilityLabel="Review the source example" onPress={()=>router.push(`/lesson/${id}?t=${question.sourceStart}`)} className="min-h-11 justify-center"><Text className="font-poppins-bold text-[#B72525]">REVIEW THE EXAMPLE</Text></TouchableOpacity>}</FeedbackPanel>}<Action tone={checked&&!correct?'error':'success'} label={checked?(correct?'Continue':'Try again'):'Check'} disabled={!ready||grading} onPress={check}/></View></FeedbackFooter>
 {quit&&<View className="absolute inset-0 bg-black/40 justify-end"><View accessibilityViewIsModal className="bg-white rounded-t-3xl p-6"><View className="items-center mb-4"><Fox size={110} mood="encouraging"/></View><Text accessibilityRole="header" className="h2 text-center mb-5">You’re making progress!</Text><Action label="Keep learning" onPress={()=>setQuit(false)}/><View className="mt-3"><Action label="Leave practice" secondary onPress={()=>{if(starter)setLevel(0);router.replace(starter?'/(tabs)':skill?'/(tabs)/ai-teacher':`/lesson/${id}`);}}/></View></View></View>}
 <StreakMoment count={checked&&correct&&combo>0&&combo%5===0?combo:0}/>
 </KeyboardAvoidingView></SafeAreaView></FeedbackClock.Provider>;
}
