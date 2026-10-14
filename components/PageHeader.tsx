import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
export function PageHeader({title}:{title:string}) {const router=useRouter();return <View className="border-b-2 border-border"><View className="w-full max-w-[600px] self-center flex-row items-center px-4 py-3"><TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)')} className="w-11 h-11 items-center justify-center"><Ionicons name="chevron-back" size={28} color="#C2410C"/></TouchableOpacity><Text accessibilityRole="header" className="font-poppins-bold text-lg text-text-primary flex-1 text-center mr-11">{title}</Text></View></View>;}
