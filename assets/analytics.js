// Public readership only. The release builder supplies the public Umami settings.
(() => {
 'use strict';
 const settings=document.currentScript;
 const hosts=['146lab.com','www.146lab.com'];
 if(location.protocol!=='https:'||!hosts.includes(location.hostname)||/^\/tracker(?:\/|$)/i.test(location.pathname))return;
 // Site policy: collect with Do Not Track enabled; keep the explicit opt-out.
 try{if(localStorage.getItem('umami.disabled'))return;}catch{}
 const route=document.body.dataset.route,variant=document.body.dataset.variant;
 if(!route?.startsWith('/')||!['index','commander'].includes(variant))return;
 // Mobile Commander immediately redirects to Archive; only its destination counts.
 if(variant==='commander'&&window.labMobileAppearance?.matches)return;
 const website=settings?.dataset.websiteId,source=settings?.dataset.analyticsSource;
 if(!website||!source)return;
 const appearance=variant==='index'?'archive':'commander';
 const normalize=path=>path.replace(/^\/study\/(?:index|commander)(?=\/)/,'');
 let referrer='';
 try{const url=new URL(document.referrer);referrer=hosts.includes(url.hostname)?url.origin+normalize(url.pathname):url.origin;}catch{}
 const context=()=>({appearance,language:document.documentElement.lang||'en'});
 const pending=[];
 let ready=false,reflectionCounted=false;
 function send(name,data={}){
  if(!ready){if(name&&pending.length<20)pending.push([name,data]);return;}
  try{
   const request=window.umami.track(payload=>({...payload,url:route,referrer,data:{...context(),...data},...(name?{name}:{})}));
   request?.catch?.(()=>{});
  }catch{}
 }
 const threads=['freedom','feeling','home','desire','care','change'];
 const threadNames={Freedom:'freedom',Feeling:'feeling',Home:'home',Desire:'desire',Care:'care',Becoming:'change'};
 const activeBrowse=()=>document.querySelector('button[data-browse-mode][aria-pressed="true"]')?.dataset.browseMode;
 // A task runs after bubbling handlers and native <details> activation finish.
 const after=callback=>setTimeout(callback,0);
 function reflection(details){
  if(reflectionCounted||!details||details.open)return;
  after(()=>{if(details.open&&!reflectionCounted){reflectionCounted=true;send('reflection_open');}});
 }
 function threadEntry(entry){
  if(!entry||entry.getAttribute('aria-expanded')!=='false')return;
  const thread=entry.dataset.entry.slice(6);
  if(!threads.includes(thread))return;
  // An article's tree opens the directory in a new document.
  if(!document.getElementById('file-preview'))send('thread_select',{thread});
  else after(()=>{if(document.querySelector(`[data-entry="theme-${thread}"]`)?.getAttribute('aria-expanded')==='true')send('thread_select',{thread});});
 }
 // Capture before existing handlers replace translated content, video buttons or trees.
 document.addEventListener('click',event=>{
  if(event.button!==0||!(event.target instanceof Element))return;
  const target=event.target;
  const view=target.closest('[data-view-link]');
  if(view){
   if(variant==='index'&&window.labMobileAppearance?.matches){
    const from=document.documentElement.dataset.mobilePalette||'dark';
    send('appearance_switch',{control:'palette',from,to:from==='blue'?'dark':'blue'});
   }else send('appearance_switch',{control:'layout',from:appearance,to:view.dataset.viewLink==='index'?'archive':'commander'});
  }
  const language=target.closest('[data-read-language]');
  if(language&&language.getAttribute('aria-pressed')!=='true')send('language_switch',{from:document.documentElement.lang,to:language.dataset.readLanguage});
  const summary=target.closest('summary');
  if(summary?.parentElement.matches('details[data-reflection]'))reflection(summary.parentElement);
  const jump=target.closest('[data-reflection-jump]');
  if(jump)reflection(document.getElementById(jump.hash.slice(1)));
  const browse=target.closest('[data-browse-mode]');
  if(browse){
   const from=activeBrowse(),to=browse.dataset.browseMode;
   after(()=>{if(from!==to&&activeBrowse()===to)send('browse_mode',{from:from||'sections',to});});
  }
  const question=target.closest('[data-question]');
  if(question&&question.getAttribute('aria-pressed')!=='true'&&threads[question.dataset.question])send('thread_select',{thread:threads[question.dataset.question]});
  if(summary?.closest('[data-browse-panel="threads"]')&&!summary.parentElement.open){
   const thread=threadNames[summary.textContent.trim()];
   if(thread)after(()=>{if(summary.parentElement.open)send('thread_select',{thread});});
  }
  if(!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey)threadEntry(target.closest('[data-entry^="theme-"]'));
  const contact=target.closest('a[data-contact],a[href^="mailto:"]');
  if(contact)send('contact_click',{channel:contact.dataset.contact||'email'});
  const video=target.closest('[data-video] button');
  if(video)send('video_load',{provider:'youtube',video:video.closest('[data-video]').dataset.video});
 },true);
 // Commander supports Q/E/F5 without generating click events.
 document.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
  if(['Enter','ArrowRight'].includes(event.key)&&event.target instanceof Element)threadEntry(event.target.closest('[data-entry^="theme-"]'));
  if(!['q','e','f5'].includes(event.key.toLowerCase()))return;
  const from=activeBrowse();
  after(()=>{const to=activeBrowse();if(from&&to&&from!==to)send('browse_mode',{from,to});});
 },true);
 const script=document.createElement('script');
 script.src=source;script.defer=true;
 script.dataset.websiteId=website;
 script.dataset.autoTrack='false';
 script.dataset.doNotTrack='false';
 script.dataset.excludeSearch='true';
 script.dataset.excludeHash='true';
 script.dataset.domains=hosts.join(',');
 script.onload=()=>{if(typeof window.umami?.track!=='function')return;ready=true;send();for(const [name,data]of pending.splice(0))send(name,data);};
 document.head.append(script);
})();
