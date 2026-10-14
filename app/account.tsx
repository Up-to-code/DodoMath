import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import { Action } from '@/components/MathUI';
import { ListGroup, ListPage, ListRow } from '@/components/ListUI';
import { useMathStore } from '@/store/mathStore';
export default function Account(){
 const router=useRouter();const name=useMathStore(s=>s.learnerName),setName=useMathStore(s=>s.setName);const [draft,setDraft]=useState(name);
 return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':Platform.OS==='android'?'height':undefined}>
  <ListPage title="Account" back footer={<Action label="Save" disabled={!draft.trim()||draft.trim()===name} onPress={()=>{setName(draft.trim());router.back();}}/>}>
   <Text className="font-poppins-bold text-sm text-text-secondary mb-2">Display name</Text><TextInput accessibilityLabel="Display name" value={draft} onChangeText={setDraft} maxLength={40} placeholder="Your name" placeholderTextColor="#AFAFAF" autoCapitalize="words" returnKeyType="done" className="border-2 border-border rounded-xl px-4 py-3 min-h-14 font-poppins text-lg text-text-primary"/>
   {!!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY&&<ConnectedAccount/>}
  </ListPage>
 </KeyboardAvoidingView>;
}
function ConnectedAccount(){
 const router=useRouter();const {user,isLoaded}=useUser();if(!isLoaded)return null;
 const email=user?.primaryEmailAddress?.emailAddress;
 return <View className="mt-6">{user?<><Text className="font-poppins-bold text-sm text-text-secondary mb-2">Email</Text><Text selectable className="font-poppins text-base text-text-primary">{email??'No email address'}</Text></>:<ListGroup><ListRow title="Sign in" icon="log-in-outline" onPress={()=>router.push('/(auth)/sign-in')}/><ListRow title="Create account" icon="person-add-outline" divider={false} onPress={()=>router.push('/(auth)/sign-up')}/></ListGroup>}</View>;
}
