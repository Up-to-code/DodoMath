import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import CoursePlayer from '@/components/CoursePlayer';
import { Action } from '@/components/MathUI';
import { ListPage, ListRow } from '@/components/ListUI';
import { COURSE } from '@/data/mathCourse';
import { useMathStore } from '@/store/mathStore';
export default function Lesson(){const {id,t}=useLocalSearchParams<{id:string;t?:string}>();const router=useRouter();const lesson=COURSE.lessons.find(l=>l.id===id);const {watched,markWatched}=useMathStore();if(!lesson)return <ListPage title="Lesson not found" back><View/></ListPage>;const studied=watched.includes(id);const seek=t&&Number.isFinite(Number(t))?{seconds:Math.max(0,Number(t)),request:1}:null;return <ListPage title="Lesson" back footer={<Action label={studied?'Practice':'Video studied'} onPress={()=>studied?router.push(`/exam/${id}`):markWatched(id)}/>}><View className="mt-2 mb-4 overflow-hidden rounded-2xl"><CoursePlayer videoId={id} seek={seek} onTimeChange={()=>{}}/></View><Text selectable className="font-poppins-bold text-base leading-6 text-text-primary mb-2">{lesson.title}</Text><Text className="font-poppins text-sm text-text-secondary mb-3">Professor Dave Explains · {Math.ceil(lesson.duration/60)} min</Text><ListRow title="Method" icon="list-outline" onPress={()=>router.push(`/lesson-method/${id}`)}/><ListRow title="Source transcript" icon="document-text-outline" onPress={()=>{void WebBrowser.openBrowserAsync(lesson.url);}}/></ListPage>;}
