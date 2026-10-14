"""Original DodoMath feedback pack: mallets, soft percussion and airy movement."""
from pathlib import Path
import numpy as np
import wave,json,hashlib
root=Path(__file__).resolve().parents[1];out=root/'assets/sounds/v3';preview=root/'outputs/sound-design-v3';out.mkdir(parents=True,exist_ok=True);preview.mkdir(parents=True,exist_ok=True)
SR=44100;rng=np.random.default_rng(3014)
def note(hz,duration=.25,gain=.5):
 t=np.arange(round(duration*SR))/SR
 attack=1-np.exp(-t/0.0025);env=attack*np.exp(-t/0.095)
 # A round mallet with a brief inharmonic transient, not a sustained pure beep.
 phase=2*np.pi*hz*t+1.25*np.exp(-t/0.012)*np.sin(2*np.pi*hz*2*t)
 y=gain*env*(np.sin(phase)+.24*np.exp(-t/.05)*np.sin(2*np.pi*hz*2.76*t)+.08*np.sin(2*np.pi*hz*4*t))
 y[-round(.012*SR):]*=np.linspace(1,0,round(.012*SR));return y
def render(length,events,noise=0):
 n=round(length*SR);a=np.zeros(n)
 for start,hz,duration,gain in events:
  s=round(start*SR);v=note(hz,duration,gain);k=min(len(v),n-s);a[s:s+k]+=v[:k]
 if noise:
  t=np.arange(n)/SR;white=rng.normal(size=n);filtered=np.convolve(white,np.ones(13)/13,'same');a+=noise*filtered*(1-np.exp(-t/.02))*np.exp(-t/.11)
 # Quiet short room reflection, shared across the sound family.
 stereo=np.column_stack([a,a]);delay=round(.024*SR);stereo[delay:,1]+=.08*a[:-delay];delay2=round(.039*SR);stereo[delay2:,0]+=.05*a[:-delay2]
 stereo[:round(.002*SR)]*=np.linspace(0,1,round(.002*SR))[:,None];stereo[-round(.016*SR):]*=np.linspace(1,0,round(.016*SR))[:,None]
 peak=np.max(np.abs(stereo));stereo*=min(1,.72/max(peak,1e-8));return stereo
def save(path,a):
 with wave.open(str(path),'wb')as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
spec={
 'tap':(.085,[(0,420,.085,.32)],.07),
 'correct':(.38,[(0,659.25,.19,.53),(.065,880,.24,.48),(.065,1318.5,.21,.12)],0),
 'retry':(.28,[(0,329.63,.15,.32),(.085,293.66,.17,.25)],.025),
 'combo':(.52,[(0,659.25,.17,.38),(.07,880,.17,.40),(.14,987.77,.18,.40),(.22,1318.5,.27,.43)],0),
 'combo10':(.70,[(0,659.25,.16,.36),(.065,880,.17,.36),(.13,987.77,.19,.37),(.2,1318.5,.24,.4),(.31,1760,.32,.36),(.31,880,.32,.25)],.016),
 'complete':(.95,[(0,440,.24,.40),(0,659.25,.24,.22),(.14,659.25,.22,.40),(.28,880,.26,.43),(.42,1108.73,.30,.35),(.42,1318.5,.32,.29),(.42,440,.42,.22)],0),
 'fly':(.42,[(.13,880,.18,.17),(.21,1318.5,.18,.17)],.10)}
reel=[];metadata={};cursor=0
for name,(duration,events,noise)in spec.items():
 a=render(duration,events,noise)
 if name=='fly':
  t=np.arange(len(a))/SR;phase=2*np.pi*(290*t+520*t*t);env=np.sin(np.pi*t/duration)**2;a+=np.column_stack([np.sin(phase),np.sin(phase+.04)])*env[:,None]*.065
 save(out/f'{name}.wav',a);save(preview/f'{name}.wav',a)
 metadata[name]={'durationSeconds':duration,'peakDbFS':round(20*np.log10(max(np.max(np.abs(a)),1e-9)),2),'rmsDbFS':round(20*np.log10(max(np.sqrt(np.mean(a*a)),1e-9)),2),'sha256':hashlib.sha256((out/f'{name}.wav').read_bytes()).hexdigest(),'previewStartSeconds':cursor};reel.extend([a,np.zeros((round(.35*SR),2))]);cursor+=duration+.35
save(preview/'preview.wav',np.concatenate(reel));(preview/'manifest.json').write_text(json.dumps({'version':3,'method':'Original deterministic DSP synthesis: short FM mallets, filtered soft percussion, airy pitch glide; no sampled Duolingo recordings.','reference':'https://ambroseyu.com/work/duolingo-core-product-sounds','order':list(spec),'events':metadata},indent=2));print(json.dumps(metadata,indent=2))
