import { Text, View } from 'react-native';
import { ModeCharacter, type CompanionReaction } from './ModeCharacter';
import type { QuestionKind } from '@/data/mathCourse';
const titles: Record<QuestionKind, string> = { choice: 'Choose the next step', number: 'Find the value', fraction: 'Write the fraction', expression: 'Complete the step', order: 'Put the steps in order', 'fraction-model': 'Build the fraction', 'number-line': 'Mark the number', graph: 'Plot the point', 'function-graph': 'Shape the function' };
export function LessonPrompt({ kind, prompt, mode, reaction }: { kind: QuestionKind; prompt: string; mode: 'count' | 'algebra' | 'graph'; reaction: CompanionReaction }) {
  return <View className="mb-4">
    <Text accessibilityRole="header" className="font-poppins-bold text-xl text-text-primary mb-4">{titles[kind]}</Text>
    <View className="flex-row items-center gap-3">
      <ModeCharacter mode={mode} size={64} reaction={reaction} />
      <View className="flex-1 border-2 border-border rounded-2xl px-3 py-3 bg-white">
        <View accessible={false} style={{ position: 'absolute', left: -7, top: 22, width: 12, height: 12, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#E5E5E5', backgroundColor: 'white', transform: [{ rotate: '45deg' }] }} />
        <Text className="font-poppins text-[17px] leading-6 text-text-primary">{prompt}</Text>
      </View>
    </View>
  </View>;
}
