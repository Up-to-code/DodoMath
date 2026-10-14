"""Compose the original DodoMath feedback family from recorded CC0 marimba hits.
Run after placing VSCO C4/G4/B4/F3.wav + LICENSE in .references/vsco.
No Duolingo waveform, melody extraction, or synthesized FM instrument is used.
"""
from pathlib import Path
import subprocess, json, hashlib, wave, shutil
import numpy as np
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / '.references/vsco'
OUT = ROOT / 'assets/sounds/v5'
OUT.mkdir(parents=True, exist_ok=True)
RATE = 44100
samples = {}
source_info = {}
for note in ['C4', 'G4', 'B4', 'F3']:
    path = SOURCE / f'{note}.wav'
    raw = subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac','2','-ar',str(RATE),'-'])
    data = np.frombuffer(raw,dtype='<f4').reshape(-1,2).astype(np.float64)
    # Align the actual mallet attack to time zero, retaining its tiny attack ramp.
    onset = np.flatnonzero(np.max(np.abs(data),axis=1)>.003)
    begin = max(0,int(onset[0])-int(.001*RATE)) if len(onset) else 0
    data = data[begin:]
    data /= max(.01,np.max(np.abs(data)))
    samples[note] = data
    source_info[note] = {'url':f'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master/Percussion/Marimba/Marimba_hit_Outrigger_{note}_loud_01.wav','sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'trimStartMs':round(begin/RATE*1000,3)}

def pitched(note,semitones,seconds):
    source = samples[note]
    positions = np.arange(round(seconds*RATE))*2**(semitones/12)
    sound = np.column_stack([np.interp(positions,np.arange(len(source)),source[:,c],left=0,right=0) for c in range(2)])
    # Keep the recorded attack; shape only the tail so it cannot click on truncation.
    sound *= np.exp(-np.arange(len(sound))/RATE/(seconds*.6))[:,None]
    fade=min(len(sound),round(.035*RATE))
    sound[-fade:] *= np.linspace(1,0,fade)[:,None]**2
    return sound

# Original voicings and rhythm. An upward triadic answer motif is reused for rewards.
# Retry is shorter, lower and quieter, with no buzzer or punishing long tail.
recipes = {
 'tap':(.085,[('C4',7,0,.085,.38)]),
 'correct':(.58,[('C4',4,0,.3,.8),('G4',0,.17,.41,.95)]),
 'retry':(.33,[('F3',7,0,.18,.65),('F3',4,.095,.235,.5)]),
 'combo':(.83,[('C4',4,0,.27,.72),('G4',0,.17,.38,.8),('B4',-2,.37,.46,.9)]),
 'combo10':(1.03,[('C4',4,0,.3,.65),('G4',0,.15,.38,.72),('B4',-2,.32,.44,.8),('C4',12,.54,.49,.9)]),
 'complete':(1.12,[('C4',0,0,.32,.65),('C4',4,.13,.32,.67),('G4',0,.27,.42,.75),('C4',12,.47,.65,.8),('G4',0,.47,.65,.35)]),
 'fly':(.72,[('C4',4,0,.3,.5),('G4',0,.13,.4,.62),('C4',12,.29,.43,.74)]),
}
qa = {}
for name,(seconds,notes) in recipes.items():
    signal=np.zeros((round(seconds*RATE),2),dtype=float)
    for note,shift,time,length,gain in notes:
        hit=pitched(note,shift,length)*gain;start=round(time*RATE);n=min(len(hit),len(signal)-start)
        signal[start:start+n]+=hit[:n]
    # Dry enough to stay clear on phone speakers; natural stereo sample provides room tone.
    target = .31 if name=='retry' else .24 if name=='tap' else .55
    signal*=target/max(.0001,float(np.max(np.abs(signal))))
    fade=round(.018*RATE);signal[-fade:]*=np.linspace(1,0,fade)[:,None]**2
    pcm=np.round(np.clip(signal,-1,1)*32767).astype('<i2')
    with wave.open(str(OUT/f'{name}.wav'),'wb') as wav:
        wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(RATE);wav.writeframes(pcm.tobytes())
    hits=np.flatnonzero(np.max(np.abs(signal),axis=1)>.002)
    qa[name]={'durationMs':round(seconds*1000),'peak':round(float(np.max(np.abs(signal))),4),'rms':round(float(np.sqrt(np.mean(signal**2))),4),'audibleOnsetMs':round((int(hits[0]) if len(hits) else 0)/RATE*1000,3),'notes':[{'source':n,'semitones':s,'startMs':round(t*1000)} for n,s,t,_,_ in notes]}
    assert np.isfinite(signal).all() and np.max(np.abs(signal))<.6
    assert qa[name]['audibleOnsetMs']<8,qa[name]
shutil.copyfile(SOURCE/'LICENSE',OUT/'VSCO-CC0.txt')
(OUT/'provenance.json').write_text(json.dumps({'version':5,'creator':'Original DodoMath compositions using recorded marimba samples','source':'https://versilian-studios.com/vsco-community/','sampleLibrary':'VSCO 2 Community Edition','credit':'Versilian Studios / Sam Gossner','sampleLicense':'CC0 1.0','samples':source_info,'processing':'Attack alignment, original voicing and rhythm, interpolation for note transposition, short natural tails, stereo mixing, level and click-free fades','reference':'Ambrose Yu Duolingo sonic identity and core-product case studies informed palette and reward hierarchy. These are original cues; no Duolingo recording or WaBing voice is bundled.','qa':qa},indent=2))
print(json.dumps(qa,indent=2))
