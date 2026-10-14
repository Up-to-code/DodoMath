// Usage: node scripts/build_feedback_fox.mjs /path/to/QH-Motion-Studio
// Uses the approved raster rig, QH's deterministic renderer and its installed canvas runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const studio = path.resolve(process.argv[2] ?? '../QH-Motion-Studio');
const require = createRequire(path.join(studio, 'package.json'));
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { drawRig, stateAt } = await import(pathToFileURL(path.join(studio, 'core/engine.mjs')));
const root = path.resolve(import.meta.dirname, '..');
const rig = JSON.parse(await fs.readFile(path.join(root, 'assets/animations/fox/rig.json')));
const images = Object.fromEntries(await Promise.all(rig.assets.map(async a => [a, await loadImage(path.join(studio, 'public', a))])));
const out = path.join(root, 'assets/animations/fox/feedback');
await fs.mkdir(out, { recursive: true });
const clips = {};
for (const action of ['success', 'retry']) {
  const duration = action === 'success' ? .96 : .88;
  const clip = { id: `answer-${action}`, name: `Answer ${action}`, duration, fps: 30, loop: false, tracks: [] };
  function track(part, property, values) {
    clip.tracks.push({ part, property, keys: values.map(([t, value]) => ({ time: t * duration, value, ease: 'smooth' })) });
  }
  if (action === 'success') {
    track('upper_arm_right', 'rotation', [[0,0],[.15,5],[.46,-32],[.67,-30],[1,-24]]);
    track('forearm_right', 'rotation', [[0,0],[.17,0],[.48,-14],[.7,-12],[1,-12]]);
    track('hand_right', 'rotation', [[0,0],[.38,-4],[.63,3],[1,0]]);
    track('head', 'rotation', [[0,0],[.16,1.2],[.42,-2],[.7,.6],[1,0]]);
    track('tail', 'rotation', [[0,0],[.18,0],[.48,-4],[.73,2],[1,0]]);
    track('ear_right', 'rotation', [[0,0],[.25,0],[.5,-2.5],[.74,1],[1,0]]);
    track('mouth', 'asset', [[0,rig.parts.find(p=>p.id==='mouth').asset],[.16,'/animations/fox/parts/mouth_happy.png']]);
  } else {
    // Reassuring reconsideration; avoid a droop or full-body shake that reads as sadness.
    track('head', 'rotation', [[0,0],[.28,-2.4],[.58,-1.6],[1,-.7]]);
    track('brow_left', 'rotation', [[0,0],[.3,-5],[.66,-3],[1,-2]]);
    track('brow_right', 'rotation', [[0,0],[.35,3],[.7,1.5],[1,1]]);
    track('upper_arm_right', 'rotation', [[0,0],[.3,-13],[.62,-18],[1,-10]]);
    track('forearm_right', 'rotation', [[0,0],[.4,-9],[.74,-5],[1,-4]]);
    track('tail', 'rotation', [[0,0],[.2,0],[.54,-2],[.8,1],[1,0]]);
  }
  const frameCount = Math.ceil(duration * clip.fps) + 1, columns = 6, rows = Math.ceil(frameCount / columns), cell = 256;
  const atlas = createCanvas(columns * cell, rows * cell), ac = atlas.getContext('2d');
  const sheet = createCanvas(6 * 256, 2 * 256), sc = sheet.getContext('2d');
  sc.fillStyle = '#FFFFFF'; sc.fillRect(0,0,sheet.width,sheet.height);
  const footCanvas=createCanvas(512,512), fc=footCanvas.getContext('2d');
  for(const part of stateAt(rig,clip,0).filter(p=>p.id.startsWith('shoe_'))){fc.save();fc.transform(...part.matrix);fc.drawImage(images[part.asset],0,0,...part.size);fc.restore();}
  const footMask=fc.getImageData(0,0,512,512).data;
  let feetBaseline, dirtyFeet = 0, minMargin = Infinity;
  let maxFootDrift = 0;
  const footJoints = stateAt(rig, clip, 0).filter(p=>p.id.startsWith('shoe_')).map(p=>p.joint);
  for (let i = 0; i < frameCount; i++) {
    const time = i / (frameCount - 1) * duration;
    const canvas = createCanvas(512,512), cx = canvas.getContext('2d');
    drawRig(cx,rig,clip,time,images,{createCanvas});
    const data = cx.getImageData(0,0,512,512).data;
    const feet = [];
    for(let n=0;n<footMask.length;n+=4)if(footMask[n+3]>128)feet.push(data[n],data[n+1],data[n+2],data[n+3]);
    if (!feetBaseline) feetBaseline = feet;
    else for(let n=0;n<feet.length;n++) if(feet[n]!==feetBaseline[n]) dirtyFeet++;
    const joints = stateAt(rig,clip,time).filter(p=>p.id.startsWith('shoe_'));
    for(let j=0;j<joints.length;j++) maxFootDrift=Math.max(maxFootDrift,Math.hypot(joints[j].joint[0]-footJoints[j][0],joints[j].joint[1]-footJoints[j][1]));
    for(let y=0;y<512;y++)for(let x=0;x<512;x++)if(data[(y*512+x)*4+3]>16)minMargin=Math.min(minMargin,x,y,511-x,511-y);
    ac.drawImage(canvas,(i%columns)*cell,Math.floor(i/columns)*cell,cell,cell);
    if(i===frameCount-1) await fs.writeFile(path.join(out,`${action}-hold.png`),canvas.toBuffer('image/png'));
    const index = Math.round(i/(frameCount-1)*11);
    if(i===Math.round(index/11*(frameCount-1)))sc.drawImage(canvas,(index%6)*256,Math.floor(index/6)*256,256,256);
  }
  if(dirtyFeet || maxFootDrift || minMargin<10)throw Error(`Failed ${action}: feet ${dirtyFeet}, drift ${maxFootDrift}, margin ${minMargin}`);
  await fs.writeFile(path.join(out,`${action}-atlas.png`),atlas.toBuffer('image/png'));
  await fs.writeFile(path.join(out,`${action}.json`),JSON.stringify(clip,null,2));
  await fs.mkdir(path.join(root,'.references/fox-feedback'),{recursive:true});
  await fs.writeFile(path.join(root,'.references/fox-feedback',`${action}-sheet.png`),sheet.toBuffer('image/png'));
  clips[action]={durationMs:Math.round(duration*1000),frameCount,columns,rows,cell,feetChangedChannels:dirtyFeet,maxFootDriftPx:maxFootDrift,minSourceMarginPx:minMargin};
}
await fs.writeFile(path.join(out,'runtime.json'),JSON.stringify({version:1,source:'Approved Fox raster rig; deterministic QH renderer',fps:30,canvas:rig.canvas,origin:rig.origin,clips},null,2));
console.log(clips);
