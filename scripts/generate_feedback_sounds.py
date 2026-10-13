import math,struct,wave,pathlib,json,random
app=pathlib.Path(__file__).resolve().parents[1];root=app/'assets/sounds';out=app/'outputs/sound-design';out.mkdir(exist_ok=True);rate=44100
D,F,A,HI=587.33,739.99,880.0,1174.66
spec={'tap':(.10,[(0,760,.085,.20)]),'correct':(.52,[(0,D,.30,.31),(.105,F,.37,.34)]),'retry':(.38,[(0,440,.25,.19),(.095,369.99,.26,.17)]),'combo':(.84,[(0,D,.32,.28),(.105,F,.38,.30),(.22,A,.43,.28),(.36,HI,.46,.23)]),'complete':(1.28,[(0,D,.40,.29),(.13,F,.45,.27),(.27,A,.52,.27),(.43,HI,.70,.31),(.68,1760,.48,.085)]),'fly':(.55,[(.13,A,.27,.10),(.24,HI,.30,.12)])}
all_samples={}
for name,(duration,notes) in spec.items():
 rng=random.Random(73);samples=[];noise=0
 for i in range(round(rate*duration)):
  t=i/rate;value=0
  for start,freq,hold,gain in notes:
   dt=t-start
   if 0<=dt<hold:
    attack=1-math.exp(-dt/0.0035);release=min(1,(hold-dt)/.07);decay=math.exp(-dt*(9 if name=='tap' else 5.8));env=attack*release*decay
    # Rounded pluck: slightly inharmonic partials with independent damping.
    tone=math.sin(2*math.pi*freq*dt)+.35*math.exp(-dt*15)*math.sin(2*math.pi*freq*2.01*dt)+.18*math.exp(-dt*22)*math.sin(2*math.pi*freq*3.98*dt)
    # Short, soft pitch scoop at the impact; never a harsh square waveform.
    pop=.22*math.sin(2*math.pi*(freq*.5*dt+4*(1-math.exp(-dt*45))))*math.exp(-dt*35)
    value+=gain*env*(tone+pop)
  if name=='fly':
   noise=.85*noise+.15*rng.uniform(-1,1);value+=noise*.55*(math.sin(math.pi*t/duration)**2)
  if name=='tap':value+=.08*rng.uniform(-1,1)*(1-math.exp(-t*1200))*math.exp(-t*90)
  samples.append(value)
 # Quiet shared room response. Same musical voice, progressively longer reward tails.
 delay=int(.042*rate)
 wet=[s+(samples[i-delay]*.12 if i>=delay else 0) for i,s in enumerate(samples)]
 stereo=[]
 for i,s in enumerate(wet):
  pan=.06*math.sin(i/rate*5);stereo.append((s*(1-pan),s*(1+pan)))
 peak=max(max(abs(l),abs(r)) for l,r in stereo);assert peak<.90
 def save(path,values):
  with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(struct.pack('<hh',round(l*32767),round(r*32767)) for l,r in values))
 save(root/f'{name}.wav',stereo);save(out/f'{name}.wav',stereo);all_samples[name]=stereo
reel=[];timings=[]
for name in ['tap','correct','retry','combo','complete','fly']:
 timings.append({'name':name,'startSeconds':len(reel)/rate});reel+=all_samples[name]+[(0.,0.)]*int(rate*.55)
save(out/'sound-preview.wav',reel)
provenance={'creator':'DodoMath project','created':'2026-10-13','version':2,'method':'Original rounded plucks with inharmonic partials, short pitch scoop, quiet room response and filtered-air fly cue. Deterministic stereo synthesis; no copied recordings.','designReference':'https://ambroseyu.com/work/duolingo-core-product-sounds','sourcesToListen':['https://ambroseyu.com/work/duolingo-sonic-identity','https://ambroseyu.com/work/duolingo-core-product-sounds'],'licenseNote':'Duolingo recordings remain reference-only. Current effects are original project assets. Previous Kenney CC0 attribution retained.','events':{k:{'durationSeconds':v[0],'notesHz':[x[1] for x in v[1]],'peak':max(max(abs(l),abs(r)) for l,r in all_samples[k])} for k,v in spec.items()},'previewTimings':timings,'mixing':'Tap quiet and rate-limited; grading cues cancel earlier grading/tap cues; combo only at 5/10 milestones; mute immediately pauses audio.'}
(root/'provenance.json').write_text(json.dumps(provenance,indent=2));(out/'provenance.json').write_text(json.dumps(provenance,indent=2));print('6 original stereo effects, no clipping')
