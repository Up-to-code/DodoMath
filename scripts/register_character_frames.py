"""Register generated raster frames to a shared body origin; never redraw anatomy.
Run from any directory. Originals are preserved. Requires Pillow, NumPy, Matplotlib.
"""
from pathlib import Path
import argparse,json,hashlib,math,csv
import numpy as np
from PIL import Image,ImageFilter,ImageChops,ImageDraw
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

APP=Path(__file__).resolve().parents[1]
CANVAS=512; ORIGIN=np.array([256.,256.]);BODY_HEIGHT=360.

def clean(im):
    im=im.convert('RGBA');a=np.array(im.getchannel('A'));mask=a>=32;seen=np.zeros(mask.shape,bool);best=[];h,w=mask.shape
    for y,x in zip(*np.where(mask)):
        if seen[y,x]:continue
        q=[(int(y),int(x))];seen[y,x]=True;component=[]
        while q:
            cy,cx=q.pop();component.append((cy,cx))
            for dy,dx in [(-1,0),(1,0),(0,-1),(0,1)]:
                ny,nx=cy+dy,cx+dx
                if 0<=ny<h and 0<=nx<w and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
        if len(component)>len(best):best=component
    keep=np.zeros(mask.shape,np.uint8)
    for y,x in best:keep[y,x]=255
    # Retain antialiasing around the connected character, discard isolated flecks.
    im.putalpha(ImageChops.multiply(im.getchannel('A'),Image.fromarray(keep).filter(ImageFilter.MaxFilter(5))))
    return im

def landmarks(im,character='fox'):
    a=np.array(im.convert('RGBA'));h,w=a.shape[:2];r,g,b,alpha=[a[:,:,i].astype(float) for i in range(4)];yy,xx=np.mgrid[:h,:w]
    if character!='orbit':
        shoes=(alpha>200)&(r>200)&(g>150)&(b<125)&(yy>h*.70)
    else:
        shoes=(alpha>220)&(yy>h*.80)&(xx>w*.20)&(xx<w*.80)
    if shoes.sum()<80:raise ValueError(f'Missing shoe anchor: {character}')
    ground=float(np.quantile(yy[shoes],.99))
    # Horizontal origin comes from the stationary torso, excluding hand/tail.
    if character!='orbit':
        pants=(alpha>200)&(r>35)&(r<115)&(b<150)&(g<95)&(b>50)&(b>r*.85)&(g<r*.9)&(g<b*.8)&(yy>h*.50)&(yy<h*.88)
        row=pants.sum(1);waist=int(np.flatnonzero(row>row.max()*.65)[0]);band=pants&(yy>=waist)&(yy<waist+max(8,round(h*.035)))
        center_x=float(np.median(xx[band]))
    else:
        # Robot has no trousers. Use the midpoint of its planted boot span.
        band=shoes&(yy>ground-h*.025)
        center_x=float((np.quantile(xx[band],.02)+np.quantile(xx[band],.98))/2)
    # Core crown excludes detached decorations and Orbit's independently moving antenna.
    central=(alpha>220)&(abs(xx-center_x)<w*.24)
    row=central.sum(1);threshold=h*(.12 if character=='orbit' else .02)
    top=int(np.flatnonzero(row>threshold)[0]);height=ground-top
    if not .45*h<height<.99*h:raise ValueError(f'Unreliable body span: {height}')
    return {'x':center_x,'y':(top+ground)/2,'crownY':top,'groundY':ground,'bodyHeight':height}

def register(im,character):
    source=clean(im);m=landmarks(source,character);scale=BODY_HEIGHT/m['bodyHeight'];t=ORIGIN-scale*np.array([m['x'],m['y']])
    # One inverse affine resample, uniform scale + translation only. No rotation, limb warp or auto-fit silhouette.
    coeff=(1/scale,0,-t[0]/scale,0,1/scale,-t[1]/scale)
    aligned=source.transform((CANVAS,CANVAS),Image.Transform.AFFINE,coeff,Image.Resampling.BICUBIC)
    after=landmarks(aligned,character)
    raster_delta=np.round(ORIGIN-np.array([after['x'],after['y']])).astype(int)
    if np.any(raster_delta):
        corrected=Image.new('RGBA',(512,512));corrected.alpha_composite(aligned,tuple(raster_delta));aligned=corrected;t=t+raster_delta
    coeff=(1/scale,0,-t[0]/scale,0,1/scale,-t[1]/scale)
    after=landmarks(aligned,character);residual=[after['x']-256,after['y']-256]
    bbox=aligned.getbbox()
    if not bbox or min(bbox[:2])<2 or max(bbox[2:])>510:raise ValueError(f'Clipped frame: {character}, {bbox}')
    if max(map(abs,residual))>.5:raise ValueError(f'Pixel registration residual {residual}')
    return aligned,{'sourceAnchor':m,'scale':scale,'translation':t.tolist(),'matrix':[[scale,0,float(t[0])],[0,scale,float(t[1])],[0,0,1]],'inverseSampling':list(coeff),'rasterCalibrationPx':raster_delta.tolist(),'calibratedSourceOrigin':((ORIGIN-t)/scale).tolist(),'afterAnchor':after,'residualPx':residual,'bbox':bbox,'sourceSHA256':hashlib.sha256(im.tobytes()).hexdigest(),'registeredPixelSHA256':hashlib.sha256(aligned.tobytes()).hexdigest()}

def annotate(im,anchor):
    out=Image.new('RGB',(512,512),'#FAFAFC');out.paste(im,mask=im.getchannel('A'));d=ImageDraw.Draw(out)
    for v in range(0,512,32):d.line((v,0,v,512),fill='#EEEEF3');d.line((0,v,512,v),fill='#EEEEF3')
    d.line((256,0,256,512),fill='#9F7AEA',width=2);d.line((0,256,512,256),fill='#9F7AEA',width=2)
    x,y=anchor['x'],anchor['y'];d.line((x-9,y,x+9,y),fill='#EA580C',width=3);d.line((x,y-9,x,y+9),fill='#EA580C',width=3)
    d.line((0,anchor['groundY'],512,anchor['groundY']),fill='#18A46F',width=2)
    return out

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--motion-dir',type=Path,default=APP.parent/'fox-wave');parser.add_argument('--output',type=Path,default=APP.parent/'character-registration');args=parser.parse_args()
    out=args.output;out.mkdir(parents=True,exist_ok=True);motion=out/'fox-hello';(motion/'fullframe').mkdir(parents=True,exist_ok=True);(out/'original').mkdir(exist_ok=True)
    records=[];atlas=Image.new('RGBA',(3072,2048));contact=Image.new('RGB',(1536,1024),'white');before_contact=Image.new('RGB',(1536,1024),'white');gif=[];comparison=[]
    for i,p in enumerate(sorted((args.motion_dir/'fullframe').glob('*.png'))):
        im=Image.open(p).convert('RGBA');im.save(out/'original'/f'{i:02}.png');aligned,record=register(im,'fox');record.update(index=i,file=f'fox-hello/fullframe/{i:02}.png');records.append(record);aligned.save(motion/'fullframe'/f'{i:02}.png')
        atlas.alpha_composite(aligned,((i%6)*512,(i//6)*512));marked=annotate(aligned,record['afterAnchor']);contact.paste(marked.resize((256,256)),((i%6)*256,(i//6)*256));before_contact.paste(annotate(im,record['sourceAnchor']).resize((256,256)),((i%6)*256,(i//6)*256));gif.append(marked)
        panel=Image.new('RGB',(1024,512),'white');panel.paste(annotate(im,record['sourceAnchor']),(0,0));panel.paste(marked,(512,0));comparison.append(panel)
    assert len(records)==24
    atlas.save(motion/'spritesheet.png');contact.save(out/'aligned-contact-sheet.png');before_contact.save(out/'original-contact-sheet.png');durations=[50 if i in [5,11,17,23] else 40 for i in range(24)]
    gif[0].save(out/'aligned-axes.gif',save_all=True,append_images=gif[1:],duration=durations,loop=0,disposal=2)
    comparison[0].save(out/'comparison.gif',save_all=True,append_images=comparison[1:],duration=durations,loop=0,disposal=2)
    raw=[]
    for i in range(24):
        im=Image.open(motion/'fullframe'/f'{i:02}.png');flat=Image.new('RGB',(512,512),'white');flat.paste(im,mask=im.getchannel('A'));raw.append(flat)
    raw[0].save(motion/'preview.gif',save_all=True,append_images=raw[1:],duration=durations,loop=0,disposal=2)
    atlas.save(APP/'assets/characters/fox/hello-atlas-registered.png')
    poses={}
    for character in ['fox','nia','orbit']:
        folder=APP/'assets/characters'/character/'registered';folder.mkdir(exist_ok=True);poses[character]={}
        for pose in ['idle','thinking','success','retry']:
            original=Image.open(APP/'assets/characters'/character/f'{pose}.png').convert('RGBA');aligned,record=register(original,character);aligned.save(folder/f'{pose}.png');record['file']=f'{character}/registered/{pose}.png';poses[character][pose]=record
    summary={}
    for axis in ['x','y']:
        before=np.array([r['sourceAnchor'][axis] for r in records]);after=np.array([r['afterAnchor'][axis] for r in records]);target=256
        summary[axis]={'beforeRangePx':float(np.ptp(before)),'beforeMaxAdjacentStepPx':float(np.max(abs(np.diff(before)))),'afterRangePx':float(np.ptp(after)),'afterMaxAdjacentStepPx':float(np.max(abs(np.diff(after)))),'afterMaxErrorPx':float(np.max(abs(after-target)))}
    manifest={'version':2,'created':'2026-10-13','canvas':[512,512],'origin':[256,256],'bodyHeightPx':360,'groundY':436,'coordinateConvention':'screen: +x right,+y down; local math: +x right,+y up; each atlas cell has its own identical origin','method':'Measured core-body crown, planted shoe line and hip/boot midpoint. Uniform scale and X/Y placement per frame, explicitly requested by user. No rotation, anatomical warping, limb replacement or new artwork. Original sources preserved.','qualityLimit':'Anchor drift removed to raster tolerance; authored internal head, face and limb shape variation remains.','runtimeAtlas':{'file':'fox/hello-atlas-registered.png','columns':6,'rows':4,'cell':[512,512],'fps':24,'durationSeconds':1},'motion':records,'poses':poses,'displayScale':{character:min(1.25,248/max(abs(x-256) for v in group.values() for x in v['bbox'])) for character,group in poses.items()},'metrics':summary}
    (out/'registration.json').write_text(json.dumps(manifest,indent=2));(APP/'assets/characters/registration.json').write_text(json.dumps(manifest,indent=2))
    with (out/'frame-transforms.csv').open('w') as f:
        writer=csv.writer(f);writer.writerow(['frame','source_x','source_y','scale','tx','ty','after_x','after_y','residual_x','residual_y'])
        for r in records:writer.writerow([r['index'],r['sourceAnchor']['x'],r['sourceAnchor']['y'],r['scale'],*r['translation'],r['afterAnchor']['x'],r['afterAnchor']['y'],*r['residualPx']])
    fig,axes=plt.subplots(2,1,figsize=(10,6),layout='constrained')
    for ax,axis in zip(axes,['x','y']):
        before=np.array([r['sourceAnchor'][axis] for r in records]);after=np.array([r['afterAnchor'][axis] for r in records]);ax.plot(range(24),before-before[0],color='#EA580C',marker='o',label='Original: displacement from frame 0');ax.plot(range(24),after-256,color='#7C3AED',marker='.',label='Registered: error from shared origin');ax.axhline(0,color='#777777',linewidth=.8);ax.set_ylabel(f'{axis.upper()} displacement (px)');ax.grid(alpha=.15);ax.set_xticks(range(0,24,3));ax.legend(loc='upper right',fontsize=8)
    axes[-1].set_xlabel('Authored frame at 24 fps');fig.suptitle('Fox body anchor: measured pixel drift before and after registration');fig.savefig(out/'anchor-drift.png',dpi=160);plt.close(fig)
    assert raw[0].tobytes()==raw[-1].tobytes()
    print(json.dumps(summary,indent=2));print('24 motion frames and 12 expression poses registered; originals preserved')
if __name__=='__main__':main()
