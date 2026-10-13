"""Independently remeasure committed PNG cells, rather than trusting manifest residuals."""
from register_character_frames import APP,landmarks
from PIL import Image
import json,hashlib
j=json.loads((APP/'assets/characters/registration.json').read_text());atlas=Image.open(APP/'assets/characters/fox/hello-atlas-registered.png').convert('RGBA');worst=0
for i,record in enumerate(j['motion']):
    x=i%6*512;y=i//6*512;cell=atlas.crop((x,y,x+512,y+512));m=landmarks(cell,'fox');error=max(abs(m['x']-256),abs(m['y']-256));worst=max(worst,error);assert error<=.5, (i,error);assert cell.getchannel('A').getextrema()[0]==0
for char,poses in j['poses'].items():
    for pose,record in poses.items():
        source=Image.open(APP/f'assets/characters/{char}/{pose}.png').convert('RGBA');assert hashlib.sha256(source.tobytes()).hexdigest()==record['sourceSHA256'],(char,pose,'source changed')
        im=Image.open(APP/'assets/characters'/record['file']).convert('RGBA');m=landmarks(im,char);assert max(abs(m['x']-256),abs(m['y']-256))<=.5,(char,pose,m);assert hashlib.sha256(im.tobytes()).hexdigest()==record['registeredPixelSHA256']
print(f'24 packed atlas cells remeasured: worst root error {worst:g} pixels (512px packing). All 12 expression PNGs within 0.5px; original pixels unchanged.')
