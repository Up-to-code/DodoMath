import { Text, View } from 'react-native';
import { ModeCharacter, type CompanionReaction } from './ModeCharacter';
export function LessonPrompt({prompt,mode,reaction}:{prompt:string;mode:'count'|'algebra'|'graph';reaction:CompanionReaction}){
 return <View className="flex-row items-center gap-3 mb-3"><ModeCharacter mode={mode} size={48} reaction={reaction}/><View className="flex-1 border border-border rounded-xl px-3 py-2"><Text accessibilityRole="header" className="font-poppins text-base leading-6 text-text-primary">{prompt}</Text></View></View>;
}
