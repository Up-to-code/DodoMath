import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ListPage, ListRow, ListGroup } from '@/components/ListUI';
import { LEARNING_STAGES, SUBJECTS, learningUnits } from '@/data/curriculum';
import { useMathStore } from '@/store/mathStore';
export default function Courses(){
 const router=useRouter();const {level,setLevel}=useMathStore();
 return <ListPage title="Subjects">{LEARNING_STAGES.map(stage=><View key={stage.title}><Text className="font-poppins-bold text-sm text-text-secondary mb-2">{stage.title}</Text><ListGroup>{stage.subjects.map((id,index)=>{const subject=SUBJECTS.find(item=>item.id===id)!;return <ListRow key={id} title={subject.title} icon={id===0?'leaf-outline':id===1?'calculator-outline':id>=6?'analytics-outline':'shapes-outline'} selected={level===id} accessibilityLabel={`${subject.title}, ${learningUnits(id).length} topic units${level===id?', selected':''}`} divider={index<stage.subjects.length-1} onPress={()=>{setLevel(id);router.push('/(tabs)');}}/>;})}</ListGroup></View>)}</ListPage>;
}
