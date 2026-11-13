(() => {
 let dialog,photo,caption,opener,previousOverflow,previous,next,counter,items=[],index=0;
 const isImage=a=>a.querySelector('img')&&!a.hasAttribute('download')&&/\.(jpe?g|png|webp|gif|avif)$/i.test(new URL(a.href,location.href).pathname);
 function show(step=0){
  index=(index+step+items.length)%items.length;
  const a=items[index],img=a.querySelector('img');photo.src=a.href;photo.alt=img.alt;
  caption.textContent=a.closest('figure')?.querySelector('figcaption')?.textContent.trim()||img.alt;
  counter.textContent=`${index+1} / ${items.length}`;previous.hidden=next.hidden=items.length<2;
 }
 function create(){
  dialog=document.createElement('dialog');dialog.className='image-viewer';dialog.setAttribute('aria-label','Full-size images');
  const close=document.createElement('button');close.type='button';close.className='image-viewer-close';close.textContent='Close [Esc]';close.setAttribute('aria-label','Close image');close.onclick=()=>dialog.close();
  const controls=document.createElement('div');controls.className='image-viewer-controls';
  previous=document.createElement('button');previous.type='button';previous.textContent='←';previous.setAttribute('aria-label','Previous image');previous.onclick=()=>show(-1);
  next=document.createElement('button');next.type='button';next.textContent='→';next.setAttribute('aria-label','Next image');next.onclick=()=>show(1);
  counter=document.createElement('span');counter.setAttribute('aria-live','polite');counter.setAttribute('aria-atomic','true');controls.append(previous,counter,next);
  photo=document.createElement('img');caption=document.createElement('p');caption.className='image-viewer-caption';
  dialog.append(close,controls,photo,caption);document.body.append(dialog);
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',e=>{
   if(!['Escape','ArrowLeft','ArrowRight'].includes(e.key)||e.ctrlKey||e.metaKey||e.altKey)return;
   e.preventDefault();e.stopPropagation();
   if(e.key==='Escape')dialog.close();else show(e.key==='ArrowLeft'?-1:1);
  });
  dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;opener?.focus({preventScroll:true});photo.removeAttribute('src');items=[];});
 }
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a');if(!a||!isImage(a))return;
  if(!dialog)create();e.preventDefault();opener=a;
  const scope=a.closest('.apartment-photo-grid')||a.closest('main')||document.body;
  items=[...scope.querySelectorAll('a[href]')].filter(isImage);index=items.indexOf(a);show();
  previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();
 });
})();
