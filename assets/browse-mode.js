// Switch the directory and homepage recommendations, leaving articles intact.
for(const panel of document.querySelectorAll('[data-archive-browse]')){
 let mode='sections';try{mode=sessionStorage.getItem('146lab-browse')||mode;}catch{}
 function select(next){mode=next==='threads'?'threads':'sections';
  panel.closest('.index-shelves')?.querySelectorAll('[data-browse-content]').forEach(p=>p.hidden=p.dataset.browseContent!==mode);
  panel.querySelectorAll('[data-browse-panel]').forEach(p=>p.hidden=p.dataset.browsePanel!==mode);
  panel.querySelectorAll('[data-browse-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.browseMode===mode)));
  panel.querySelector('[data-browse-explanation]').textContent=mode==='threads'?'The same work, connected by questions. A piece can appear more than once.':'Writing, experiments and personal projects.';
 }
 panel.querySelectorAll('[data-browse-mode]').forEach(b=>b.addEventListener('click',()=>{select(b.dataset.browseMode);try{sessionStorage.setItem('146lab-browse',mode);}catch{}}));
 select(mode);
}


// Move the same directory into a modal sheet on smaller screens.
const sidebar = document.querySelector('.archive-sidebar .archive-browse');
if(sidebar){
 const wide = matchMedia('(min-width: 1280px)');
 const host = sidebar.parentElement;
 const current = location.pathname.replace(/\/$/,'');
 sidebar.querySelectorAll('a[href]').forEach(a=>{
  if(new URL(a.href).pathname.replace(/\/$/,'')!==current)return;
  a.setAttribute('aria-current','page');
  for(let folder=a.closest('details.archive-folder');folder;folder=folder.parentElement.closest('details.archive-folder'))folder.open=true;
 });
 const button=document.createElement('button');
 button.className='mobile-browse-trigger';
 button.textContent='Browse +';
 button.setAttribute('aria-haspopup','dialog');
 button.setAttribute('aria-controls','mobile-browse');
 button.setAttribute('aria-expanded','false');
 const sheet=document.createElement('dialog');
 sheet.id='mobile-browse';
 sheet.className='mobile-browse-sheet';
 sheet.setAttribute('aria-label','Browse the work');
 const header=document.createElement('div');
 header.className='mobile-browse-header';
 const home=document.createElement('a');
 home.href='/study/index/';
 home.textContent='146 Lab / Home';
 const close=document.createElement('button');
 close.type='button';
 close.textContent='Close ×';
 close.setAttribute('aria-label','Close navigation');
 header.append(home,close);
 sheet.append(header);
 document.body.append(button,sheet);
 document.body.classList.add('mobile-browse-ready');
 let savedScroll=0, locked=false;
 const savedStyle={};
 function unlock(){
  if(!locked)return;
  for(const key of Object.keys(savedStyle))document.body.style[key]=savedStyle[key];
  locked=false;
  window.scrollTo({top:savedScroll,behavior:'instant'});
  button.setAttribute('aria-expanded','false');
  if(!wide.matches)button.focus({preventScroll:true});
 }
 function open(){
  savedScroll=window.scrollY;
  for(const key of ['position','top','width','overflow'])savedStyle[key]=document.body.style[key];
  Object.assign(document.body.style,{position:'fixed',top:-savedScroll+'px',width:'100%',overflow:'hidden'});
  locked=true;
  sheet.showModal();
  button.setAttribute('aria-expanded','true');
  close.focus({preventScroll:true});
 }
 button.addEventListener('click',open);
 close.addEventListener('click',()=>sheet.close());
 sheet.addEventListener('close',unlock);
 sheet.addEventListener('click',e=>{
  if(e.target!==sheet)return;
  const r=sheet.getBoundingClientRect();
  if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)sheet.close();
 });
 function resize(){
  if(sheet.open){sheet.close();unlock();}
  if(wide.matches)host.append(sidebar);
  else sheet.append(sidebar);
  sidebar.open=true;
 }
 wide.addEventListener('change',resize);
 resize();
 window.addEventListener('pagehide',()=>{if(sheet.open)sheet.close();unlock();});
}
