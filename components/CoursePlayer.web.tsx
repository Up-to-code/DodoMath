import { createElement, useEffect, useRef, useState } from 'react';
import type { PlayerProps } from './CoursePlayer';
type Player = {getCurrentTime:()=>number;seekTo:(seconds:number,allowSeekAhead:boolean)=>void;destroy:()=>void};
type YouTubeAPI = {Player:new(element:HTMLElement,options:{videoId:string;width:string;height:string;playerVars:Record<string,number>;events:{onReady:()=>void}})=>Player};
declare global {interface Window {YT?:YouTubeAPI;onYouTubeIframeAPIReady?:()=>void}}
let loader:Promise<void>|undefined;
function loadAPI() {
 if(window.YT?.Player)return Promise.resolve();
 if(!loader)loader=new Promise<void>(resolve=>{const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();resolve();};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';document.head.appendChild(script);});
 return loader;
}
export default function CoursePlayer({videoId,seek,onTimeChange}:PlayerProps) {
 const host=useRef<HTMLDivElement>(null);const player=useRef<Player|null>(null);const timeCallback=useRef(onTimeChange);timeCallback.current=onTimeChange;const [ready,setReady]=useState(false);
 useEffect(()=>{let disposed=false;let timer:ReturnType<typeof setInterval>|undefined;void loadAPI().then(()=>{if(disposed||!host.current||!window.YT)return;const target=document.createElement('div');host.current.appendChild(target);player.current=new window.YT.Player(target,{videoId,width:'100%',height:'100%',playerVars:{playsinline:1,cc_load_policy:1},events:{onReady:()=>{setReady(true);timer=setInterval(()=>timeCallback.current(player.current?.getCurrentTime()??0),500);}}});});return ()=>{disposed=true;clearInterval(timer);player.current?.destroy();player.current=null;setReady(false);};},[videoId]);
 useEffect(()=>{if(ready&&seek!==null)player.current?.seekTo(seek.seconds,true);},[seek,ready]);
 return createElement('div',{ref:host,style:{aspectRatio:'16/9',width:'100%',marginBottom:16},'aria-label':'Original YouTube lesson video'});
}
