import { ListGroup, ListPage, ListRow } from '@/components/ListUI';
import { FeedbackSound, useFeedback } from '@/hooks/useFeedback';
import { useMathStore } from '@/store/mathStore';
const cues:[FeedbackSound,string][]=[['tap','Tap'],['correct','Correct'],['retry','Retry'],['combo','5 in a row'],['combo10','10 in a row'],['fly','Flight'],['complete','Complete']];
export default function Sounds(){
 const play=useFeedback(),enabled=useMathStore(s=>s.sounds);
 return <ListPage title="Sounds" back><ListGroup>{cues.map(([name,label],index)=><ListRow key={name} title={label} icon="play-circle-outline" accessibilityLabel={`Preview ${label} sound`} disabled={!enabled} color={enabled?'#C2410C':'#AFAFAF'} divider={index<cues.length-1} onPress={()=>play(name)}/>)}</ListGroup></ListPage>;
}
