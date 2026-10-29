(function(root){
 function dimensions(width,height,maxSide){if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1)throw Error('Invalid image dimensions.');const ratio=maxSide>0?Math.min(1,maxSide/Math.max(width,height)):1;return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio))};}
 function bytes(n){return n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
 function filename(name,type){const stem=name.replace(/\.[^.]+$/,'').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,100)||'image';return stem+'-small.'+({'image/jpeg':'jpg','image/webp':'webp','image/png':'png'}[type]||'png');}
 const api={dimensions,bytes,filename};if(typeof module!=='undefined')module.exports=api;else root.Shrink=api;
})(globalThis);
