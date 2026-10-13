from pathlib import Path
import numpy as np
from PIL import Image
from register_character_frames import APP,landmarks
import hashlib,json
j=json.loads((APP/'assets/characters/fox/rig/manifest.json').read_text());atlas=Image.open(APP/'assets/characters/fox/hello-atlas-rig.png').convert('RGBA');body=np.array(Image.open(APP/'assets/characters/fox/rig/body-master.png').convert('RGBA'));mask=body[:,:,3]>128;yy,xx=np.mgrid[:512,:512]
assert atlas.size==(3072,2048)
first=None
for i in range(24):
 x=i%6*512;y=i//6*512;frame=atlas.crop((x,y,x+512,y+512));a=np.array(frame)
 assert np.array_equal(a[mask],body[mask]),f'Stationary body changed in frame {i}'
 assert hashlib.sha256(frame.tobytes()).hexdigest()==j['frames'][i]['pixelSHA256']
 m=landmarks(frame);assert abs(m['x']-256)<=.5 and abs(m['y']-256)<=.5
 if first is None:first=frame.tobytes()
 if i==23:assert frame.tobytes()==first
idle=Image.open(APP/'assets/characters/fox/rig/idle.png').convert('RGBA');assert idle.tobytes()==first
print('Independent production-PNG checks: all protected head/torso/foot pixels exactly match the master; roots fixed, idle/frame0/frame23 identical.')
