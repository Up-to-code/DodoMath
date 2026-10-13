from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageChops
import cv2,numpy as np,math,json
APP=Path(__file__).resolve().parents[1];base=APP.parent.parent;folder=APP.parent/'character-registration/fox-hello/fullframe';out=APP.parent/'character-registration/rig';out.mkdir(parents=True,exist_ok=True);(out/'fullframe').mkdir(exist_ok=True)
ref=Image.open(folder/'00.png').convert('RGBA');source=Image.open(folder/'09.png').convert('RGBA');arr=np.array(source);yy,xx=np.mgrid[:512,:512];r,g,b,a=[arr[:,:,k].astype(float) for k in range(4)]
purple=(a>32)&(b>r*1.08)&(b>g*1.15)&(b>150)&(r>90)&(yy>180)&(yy<365)&(xx>275)
def tube(ax,ay,bx,by,radius):
 vx=bx-ax;vy=by-ay;t=np.clip(((xx-ax)*vx+(yy-ay)*vy)/(vx*vx+vy*vy),0,1);return (xx-ax-t*vx)**2+(yy-ay-t*vy)**2<=radius**2
purple &= tube(293,255,333,246,17)|tube(333,246,360,218,17)
orange=(a>120)&(r>170)&(g>45)&(g<190)&(b<140)&(r>g*1.18)
count,labels,stats,centers=cv2.connectedComponentsWithStats(orange.astype('uint8'),8)
hand=next(n for n in range(1,count) if 150<stats[n,cv2.CC_STAT_AREA]<4500 and centers[n][0]>350 and centers[n][1]<240)
palm_mask=Image.fromarray(((labels==hand)*255).astype('uint8')).filter(ImageFilter.MaxFilter(5))
arm_mask=Image.fromarray((purple*255).astype('uint8')).filter(ImageFilter.MaxFilter(5))
palm=source.copy();palm.putalpha(ImageChops.multiply(source.getchannel('A'),palm_mask));arm=source.copy();arm.putalpha(ImageChops.multiply(source.getchannel('A'),arm_mask))
palm.save(out/'palm.png');arm.save(out/'sleeve.png')
bodymask=Image.new('L',(512,512),255);d=ImageDraw.Draw(bodymask);d.polygon([(293,251),(304,248),(370,245),(400,385),(291,385),(287,325),(287,291)],fill=0)
body=np.array(ref).copy();r0,g0,b0,a0=[body[:,:,k].astype(float) for k in range(4)];pants=(a0>200)&(r0>35)&(r0<115)&(b0<150)&(g0<95)&(b0>50)&(b0>r0*.85)&(g0<r0*.9)&(g0<b0*.8)&(yy>256)&(yy<451);pants=cv2.dilate(pants.astype('uint8'),np.ones((5,5),np.uint8))>0;bm=np.array(bodymask);bm[pants]=255;bodymask=Image.fromarray(bm);body[:,:,3]=(body[:,:,3].astype(float)*np.array(bodymask)/255).astype('uint8');Image.fromarray(body).save(out/'body-master.png')
# Wrist is at the skin/cuff contact, detected from nearest source-purple pixels.
dist=cv2.distanceTransform((~purple).astype('uint8'),cv2.DIST_L2,5);hy,hx=np.where((labels==hand)&(dist<3.5));wrist=(float(np.mean(hx)),float(np.mean(hy)));shoulder=(293.,255.);print('wrist',wrist)
def rotate(image,pivot,angle):
 rad=math.radians(angle);c=math.cos(rad);s=math.sin(rad);x,y=pivot
 return image.transform((512,512),Image.Transform.AFFINE,(c,s,x-c*x-s*y,-s,c,y+s*x-c*y),Image.Resampling.BICUBIC)
def ease(u):return 6*u**5-15*u**4+10*u**3
contact=Image.new('RGB',(1536,1024),'white');frames=[];tracks=[]
for i in range(24):
 t=i/23
 if t<.32:shoulder_angle=112*(1-ease(t/.32));wave=0
 elif t<.72:
  shoulder_angle=0;u=(t-.32)/.4;wave=14*math.sin(4*math.pi*u)*math.sin(math.pi*u)**2
 else:shoulder_angle=112*ease((t-.72)/.28);wave=0
 local=Image.new('RGBA',(512,512));local.alpha_composite(arm);local.alpha_composite(rotate(palm,wrist,wave));moving=rotate(local,shoulder,shoulder_angle)
 comp=np.array(moving).copy();owned=body[:,:,3]>0;comp[owned]=body[owned];comp[comp[:,:,3]==0,:3]=0;im=Image.fromarray(comp);im.save(out/'fullframe'/f'{i:02}.png');frames.append(im);small=im.resize((256,256));contact.paste(small,((i%6)*256,(i//6)*256),small);tracks.append({'frame':i,'shoulderAngleDeg':shoulder_angle,'wristAngleDeg':wave})
contact.save(out/'contact-sheet.png');flat=[]
for im in frames:
 bg=Image.new('RGB',(512,512),'white');bg.paste(im,mask=im.getchannel('A'));flat.append(bg)
flat[0].save(out/'preview.gif',save_all=True,append_images=flat[1:],duration=[50 if i in [5,11,17,23] else 40 for i in range(24)],loop=0,disposal=2)
(out/'fk-tracks.json').write_text(json.dumps({'shoulder':shoulder,'wrist':wrist,'tracks':tracks},indent=2))

# Numeric rig handoff, full-resolution atlas, and stationary-pixel QA.
import hashlib
from register_character_frames import landmarks
atlas=Image.new('RGBA',(3072,2048))
for i,im in enumerate(frames):atlas.alpha_composite(im,((i%6)*512,(i//6)*512))
atlas.save(out/'spritesheet.png');atlas.save(APP/'assets/characters/fox/hello-atlas-rig.png')
assetdir=APP/'assets/characters/fox/rig';assetdir.mkdir(exist_ok=True)
for file in ['body-master.png','sleeve.png','palm.png']:Image.open(out/file).save(assetdir/file)
frames[0].save(assetdir/'idle.png')
# Exactly the same body pixels are owned by the body layer in every frame.
protected=body[:,:,3]>128;head=protected&(yy<244);torso=protected&(yy>=244)&(yy<375);feet=protected&(yy>=375)
metrics={};first=np.array(frames[0])
for name,mask in [('head',head),('torso',torso),('feet',feet)]:
 values=[float(np.mean((np.array(im).astype(float)[mask]-first.astype(float)[mask])**2)) for im in frames]
 assert max(values)==0,(name,values);metrics[name]={'rgbaMSE':values,'maxChangedPixels':max(int(np.any(np.array(im)[mask]!=first[mask],axis=1).sum()) for im in frames),'pixelCount':int(mask.sum())}
assert frames[0].tobytes()==frames[-1].tobytes()
components=[]
for i,im in enumerate(frames):
 image=np.array(im);n,l,stats,c=cv2.connectedComponentsWithStats((image[:,:,3]>128).astype('uint8'),8)
 areas=sorted(stats[1:,cv2.CC_STAT_AREA],reverse=True);ratio=areas[0]/sum(areas);assert ratio>.995,(i,ratio)
 components.append(ratio)
recorded=[{'index':i,'file':f'rig/fullframe/{i:02}.png','afterAnchor':landmarks(im,'fox'),'pixelSHA256':hashlib.sha256(im.tobytes()).hexdigest(),**tracks[i]} for i,im in enumerate(frames)]
manifest={'version':3,'method':'Raster cutout rig: one immutable head/body master, extracted generated sleeve and palm, fixed shoulder and wrist pivots, hierarchical forward kinematics. No SVG character art.','durationSeconds':1,'fps':24,'frameCount':24,'canvas':[512,512],'origin':[256,256],'atlas':{'file':'fox/hello-atlas-rig.png','columns':6,'rows':4,'cell':[512,512]},'sourceMaster':str(folder/'00.png'),'sourceArm':str(folder/'09.png'),'shoulder':shoulder,'wrist':wrist,'rotationConvention':'Degrees clockwise in screen coordinates','matrixOrder':'palm = T(shoulder) R(shoulderAngle) T(-shoulder) T(wrist) R(wristAngle) T(-wrist) p; sleeve uses only shoulder transform; body transform is identity.','ease':'6u^5 - 15u^4 + 10u^3; zero first/second derivative at phase endpoints','rootCap':'Stationary master owns every nontransparent body pixel; moving parts are behind this foreground master.','timing':'Raise over 0..0.32, wave over0.32..0.72, lower over0.72..1; 24 equally timed baked frames.','metrics':metrics,'connectedBodyRatio':components,'frames':recorded,'provenance':'Original image_gen artwork extracted and technically rigged with numeric pivots. The new24 frames are rig renders; they are not24 new model-generated drawings.','skills':['https://github.com/Sunwood-ai-labs/generate2d-assets-clean-align','https://github.com/calesthio/generative-media-skills/blob/main/skills/production/creative-direction/2d-character-rig-animation/SKILL.md']}
(out/'rig-manifest.json').write_text(json.dumps(manifest,indent=2));(APP/'assets/characters/fox/rig/manifest.json').write_text(json.dumps(manifest,indent=2))
print('24 raster rig frames complete: protected head/body/feet pixel error is exactlyzero')
