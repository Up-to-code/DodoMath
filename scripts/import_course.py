"""Import yt-dlp playlist metadata and timestamped English captions. No media downloads."""
import json, pathlib, re, sys
root=pathlib.Path(__file__).resolve().parents[1]
playlist=pathlib.Path(sys.argv[1]); captions=pathlib.Path(sys.argv[2])
p=json.loads(playlist.read_text())
levels=[(1,21,'Arithmetic','Build your number sense'),(22,46,'Algebra','Turn questions into equations'),(47,61,'Geometry','Explore shapes and space'),(62,84,'Functions & probability','Connect patterns and possibilities'),(85,97,'Trigonometry','Understand angles and waves'),(98,113,'Differential calculus','Study how things change'),(114,133,'Integral calculus & series','Accumulate, integrate, and sum'),(134,158,'Linear algebra','Think in vectors and matrices'),(159,166,'Multivariable calculus','Explore change in higher dimensions'),(167,183,'Differential equations','Model systems through time'),(184,193,'Partial differential equations','Explore waves, heat, and diffusion')]
lessons=[]; transcripts={}; drafts={}
terms=['addition','subtraction','multiplication','division','numerator','denominator','quotient','product','commutative','associative','fraction','radius','diameter','circumference','perimeter','area','volume','slope','derivative','integral','limit','vector','matrix','determinant','eigenvalue','eigenvector','gradient','divergence','curl','orthogonal','homogeneous','linear','nonlinear','function','domain','range','tangent','sine','cosine','logarithm','exponent','polynomial','coefficient','variable','constant','probability','sequence','series','convergence','basis','dimension','transformation','Laplace','Fourier','diffusion','wave','equation','infinity','prime','triangle','triangles','geometry','bisector','median','altitude','midsegment','quadrilateral','polygon','distance','differentiation','integration','radical','binomial','FOIL','parts','roots','exponents','functions','matrices','derivatives','integrals','transforms','heat','solution','solutions','operator','amplitude','frequency','wavelength','boundary','initial','cofactor','elimination','substitution','factor','factors','diagonal','pivot','sphere','circle','ellipse','parabola','hyperbola','congruent','similar','square','cube','rectangle','sin','cos','tan','log','ln','dx','dy']
for i,x in enumerate(p['entries'],1):
    level=next(j for j,v in enumerate(levels,1) if v[0]<=i<=v[1])
    lesson={'id':x['id'],'order':i,'title':x['title'],'level':level,'duration':x.get('duration') or 0,'url':'https://www.youtube.com/watch?v='+x['id'],'transcriptStatus':'unavailable'}
    f=captions/(x['id']+'.en.json3')
    if f.exists():
        cues=[]
        for e in json.loads(f.read_text()).get('events',[]):
            text=''.join(s.get('utf8','') for s in e.get('segs',[])).strip()
            if text: cues.append({'start':e.get('tStartMs',0)/1000,'duration':e.get('dDurationMs',0)/1000,'text':text.replace('\n',' ')})
        transcripts[x['id']]={'url':lesson['url'],'language':'en','cueCount':len(cues),'captionStatus':'available'}; lesson['transcriptStatus']='available'
        sentences=[]; text=''; start=0
        for cue in cues:
            if not text: start=cue['start']
            text+=' '+cue['text']
            parts=re.split(r'(?<=[.!?])\s+',text.strip())
            for sentence in parts[:-1]: sentences.append((start,sentence))
            text=parts[-1] if parts else ''
            if re.search(r'[.!?]$',text): sentences.append((start,text));text=''
        if text: sentences.append((start,text.strip()))
        questions=[]
        for start,sentence in sentences:
            if not 12<=len(sentence.split())<=48: continue
            matches=[t for t in terms if re.search(r'\b'+re.escape(t)+r'\b',sentence,re.I)]
            if not matches: continue
            term=matches[0]
            if any(q['answer']==term for q in questions): continue
            alternatives=[t for t in terms if t!=term and t not in matches]
            idx=terms.index(term); distractors=[alternatives[(idx+k*7)%len(alternatives)] for k in range(3)]
            options=distractors+[term]; options=options[i%4:]+options[:i%4]
            masked=re.sub(r'\b'+re.escape(term)+r'\b','____',sentence,flags=re.I)
            words=masked.split(); slot=next((j for j,w in enumerate(words) if '____' in w),0)
            excerpt=' '.join(words[max(0,slot-2):max(0,slot-2)+5])
            questions.append({'prompt':'Complete this short source excerpt: “… '+excerpt+' …”','options':options,'answer':term,'explanation':'Review the source video at this question’s timestamp to confirm the term and its meaning.','sourceStart':start})
            if len(questions)==3: break
        if questions: drafts[x['id']]=questions
    lessons.append(lesson)
out=root/'data/course'; out.mkdir(exist_ok=True)
(out/'catalog.json').write_text(json.dumps({'title':p['title'],'playlistUrl':p['webpage_url'],'importedAt':'2026-10-11','levels':[{'id':j,'title':v[2],'description':v[3],'start':v[0],'end':v[1]} for j,v in enumerate(levels,1)],'lessons':lessons},indent=2))
(out/'transcripts.json').write_text(json.dumps(transcripts,ensure_ascii=False))
(out/'draft-exams.json').write_text(json.dumps(drafts,ensure_ascii=False))
print(f'{len(lessons)} lessons, {len(transcripts)} transcripts, {len(drafts)} source-based exam drafts')
