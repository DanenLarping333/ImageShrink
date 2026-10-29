'use strict';
const $=s=>document.querySelector(s);
let source=null,originalURL='',resultURL='',revision=0,loadId=0,loading=false,busy=false;
const MAX_BYTES=25*1024*1024,MAX_PIXELS=24000000;
function message(text,error=false){$('#status').textContent=text;$('#status').classList.toggle('error',error);}
function buttons(){$('#convert').disabled=!source||busy||loading;}
function discardResult(){if(resultURL)URL.revokeObjectURL(resultURL);resultURL='';$('#download').hidden=true;$('#download').removeAttribute('href');$('#result-tab').disabled=true;$('#after').textContent='—';$('#after-dim').textContent='Waiting for conversion';$('#saving').textContent='A smaller file is a lighter load.';if(source)preview(false);}
function preview(result){$('#preview-image').src=result?resultURL:originalURL;$('#original-tab').setAttribute('aria-pressed',String(!result));$('#result-tab').setAttribute('aria-pressed',String(result));}
function changed(){revision++;discardResult();const png=$('#format').value==='image/png';$('#quality').disabled=png;$('#quality-value').textContent=png?'Lossless':$('#quality').value+'%';$('#quality-note').textContent=png?'PNG ignores quality. Resize it to reduce dimensions.':'Lower quality usually makes a smaller file.';if(source)message('Settings changed. Shrink again to update the result.');}
async function load(file){
 if(!file)return;const id=++loadId;revision++;loading=true;buttons();message('Reading image…');
 let url='',bitmap;
 try{
 if(file.size>MAX_BYTES)throw Error('Choose an image smaller than 25 MB.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Please choose a JPEG, PNG or WebP image.');
 url=URL.createObjectURL(file);bitmap=new Image();bitmap.src=url;await bitmap.decode();
 if(id!==loadId){URL.revokeObjectURL(url);return;}
 if(!bitmap.naturalWidth||bitmap.naturalWidth*bitmap.naturalHeight>MAX_PIXELS||Math.max(bitmap.naturalWidth,bitmap.naturalHeight)>16000)throw Error('This image is too large to process. Use an image up to 24 megapixels and 16,000 px per side.');
 discardResult();if(originalURL)URL.revokeObjectURL(originalURL);source={file,image:bitmap};originalURL=url;url='';
 $('#empty').hidden=true;$('#preview-image').hidden=false;$('#original-tab').disabled=false;$('#file-title').textContent=file.name;
 $('#before').textContent=Shrink.bytes(file.size);$('#before-dim').textContent=bitmap.naturalWidth+' × '+bitmap.naturalHeight+' px';preview(false);message('Ready when you are. Adjust settings, then shrink.');
 }catch(error){if(id===loadId)message(error.message||'Could not read this image.',true);}
 finally{if(url)URL.revokeObjectURL(url);if(id===loadId){loading=false;buttons();}}
}
$('#file').onchange=e=>{load(e.target.files[0]);e.target.value='';};
$('#drop').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#file').click();}};
for(const event of ['dragover','dragenter'])$('#drop').addEventListener(event,e=>{e.preventDefault();$('#drop').classList.add('dragover');});
$('#drop').ondragleave=()=>$('#drop').classList.remove('dragover');
$('#drop').ondrop=e=>{e.preventDefault();$('#drop').classList.remove('dragover');if(e.dataTransfer.files.length!==1){message('Choose one image at a time.',true);return;}load(e.dataTransfer.files[0]);};
for(const id of ['format','quality','size'])$('#'+id).addEventListener('input',changed);
$('#original-tab').onclick=()=>preview(false);$('#result-tab').onclick=()=>preview(true);
$('#convert').onclick=async()=>{
 if(!source||busy||loading)return;busy=true;buttons();const version=revision;const selected=source;const canvas=document.createElement('canvas');
 message('Creating your image…');
 try{
 const size=Shrink.dimensions(selected.image.naturalWidth,selected.image.naturalHeight,Number($('#size').value));
 canvas.width=size.width;canvas.height=size.height;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image processing is unavailable in this browser.');
 const requested=$('#format').value;
 if(requested==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,size.width,size.height);}
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(selected.image,0,0,size.width,size.height);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Conversion failed. Try a smaller output size.')),requested,Number($('#quality').value)/100));
 if(version!==revision)return;
 discardResult();resultURL=URL.createObjectURL(blob);$('#result-tab').disabled=false;preview(true);
 $('#after').textContent=Shrink.bytes(blob.size);$('#after-dim').textContent=size.width+' × '+size.height+' px · '+blob.type.split('/')[1].toUpperCase();
 const change=(1-blob.size/selected.file.size)*100;
 $('#saving').textContent=change>=0?change.toFixed(1)+'% smaller · '+Shrink.bytes(selected.file.size-blob.size)+' saved':Math.abs(change).toFixed(1)+'% larger. Try lower quality or dimensions.';
 const link=$('#download');link.href=resultURL;link.download=Shrink.filename(selected.file.name,blob.type);link.hidden=false;
 message(blob.type===requested?'Done. Compare the preview and download your result.':'Your browser used '+blob.type+' instead. The download extension matches the actual format.');
 }catch(error){if(version===revision)message(error.message||'Conversion failed.',true);}
 finally{canvas.width=canvas.height=0;busy=false;buttons();}
};
