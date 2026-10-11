import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
export type PlayerProps = {videoId:string;seek:{seconds:number;request:number}|null;onTimeChange:(seconds:number)=>void};
export default function CoursePlayer({videoId,seek,onTimeChange}:PlayerProps) {
 const view=useRef<WebView>(null);
 const html=useMemo(()=>`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#player{margin:0;width:100%;height:100%;background:#000}</style></head><body><div id="player"></div><script src="https://www.youtube.com/iframe_api"></script><script>var player;function onYouTubeIframeAPIReady(){player=new YT.Player('player',{width:'100%',height:'100%',videoId:${JSON.stringify(videoId)},playerVars:{playsinline:1,cc_load_policy:1},events:{onReady:function(){setInterval(function(){window.ReactNativeWebView.postMessage(JSON.stringify({time:player.getCurrentTime()}));},500);}}});}window.seekLesson=function(seconds){if(player&&player.seekTo)player.seekTo(seconds,true);};</script></body></html>`,[videoId]);
 useEffect(()=>{if(seek!==null)view.current?.injectJavaScript(`window.seekLesson(${Number(seek.seconds)});true;`);},[seek]);
 return <View style={{aspectRatio:16/9,marginBottom:16}}><WebView ref={view} source={{html,baseUrl:'https://www.youtube.com'}} allowsInlineMediaPlayback mediaPlaybackRequiresUserAction onMessage={event=>{try{const data:unknown=JSON.parse(event.nativeEvent.data);if(typeof data==='object'&&data!==null&&'time' in data&&typeof data.time==='number')onTimeChange(data.time);}catch{ /* Ignore unrelated player messages. */ }}} accessibilityLabel="Original YouTube lesson video" /></View>;
}
