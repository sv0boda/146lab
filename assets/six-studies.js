(() => {
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const variant=document.body.dataset.variant,base='/study/'+variant;
 $$('[data-view-link]').forEach(a=>{const url=new URL(a.href);url.search=location.search;url.hash=location.hash;a.href=url.href;a.addEventListener('click',e=>{
  if(window.labMobileAppearance?.matches&&variant==='index'){
   e.preventDefault();
   window.labSetMobilePalette(document.documentElement.dataset.mobilePalette==='blue'?'dark':'blue');
  }else try{localStorage.setItem('146lab-view',a.dataset.viewLink);}catch{}
 });});

 let directoryPromise;
 const directory=()=>directoryPromise??=(fetch('/assets/lab-directory.json').then(r=>{if(!r.ok)throw new Error('The directory could not be loaded.');return r.json();}).catch(e=>{directoryPromise=undefined;throw e;}));
 $('.version-picker select')?.addEventListener('change',e=>{const url=new URL(e.target.value,location.origin);url.search=location.search;url.hash=location.hash;try{localStorage.setItem('146lab-view',url.pathname.split('/')[2]);}catch{}location.href=url.href;});
 for(const b of $$('[data-question]'))b.addEventListener('click',()=>{
  $$('[data-question]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  $$('[data-thread]').forEach(x=>x.hidden=x.dataset.thread!==b.dataset.question);
  const links=[...document.querySelector(`[data-thread="${b.dataset.question}"]`).querySelectorAll('a')].map(a=>a.getAttribute('href'));
  $$('[data-map-url]').forEach(a=>a.classList.toggle('is-connected',links.includes(a.getAttribute('href'))));
 });
 const search=$('#page-search');
 if(search){let kind='All';const rows=$$('.all-pages>li');function filter(){const q=search.value.trim().toLocaleLowerCase();let n=0;for(const r of rows){r.hidden=!(r.dataset.search.includes(q)&&(kind==='All'||r.dataset.kind===kind));if(!r.hidden)n++;}$('#page-count').textContent=`${n} / ${rows.length} pages`;$('.empty-results').hidden=n!==0;}
  search.value=new URLSearchParams(location.search).get('q')||'';filter();search.addEventListener('input',filter);
  $$('.index-filters button').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;$$('.index-filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter();}));
 }
 const typing=target=>target instanceof Element&&Boolean(target.closest('input,textarea,select,[contenteditable=true]'));
 // BBS numbers are shortcuts for the visible numbered menu, with ordinary links as fallback.
 if(variant==='bbs')document.addEventListener('keydown',e=>{if(typing(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;const fixed={'0':'/','5':'/all/'};const a=$$('[data-bbs-key]').find(n=>n.dataset.bbsKey===e.key);if(a){e.preventDefault();location.href=a.href;}else if(fixed[e.key]){e.preventDefault();location.href=base+fixed[e.key];}});
 const files=$$('[data-file]');
 // T1: a small virtual filesystem of published pages. Commands never execute on the host.
 const form=$('#shell-form');
 if(form){
  const input=$('#shell-input'),log=$('#shell-log');let cwd='/',busy=false,historyAt=0;const history=[];
  const commands=['help','ls','cd','pwd','tree','cat','open','find','clear','home'];
  const aliases={home:'/',all:'/all/',belka:'/experiments/belka/',dog:'/writing/en/how-i-met-your-dog/',writing:'/writing/',experiments:'/experiments/',questions:'/questions/',about:'/about/',morse:'/morse/',book:'/writing/book/'};
  const norm=path=>{const parts=[];for(const part of path.split('/')){if(part==='..')parts.pop();else if(part&&part!=='.')parts.push(part);}return '/'+(parts.length?parts.join('/')+'/':'');};
  async function resolve(name){if(!name||name==='~')return cwd;if(aliases[name])return aliases[name];const {pages}=await directory();const p=norm(name.startsWith('/')?name:cwd+name);if(pages.some(x=>x.url===p)||['/all/','/morse/'].includes(p))return p;const needle=name.toLocaleLowerCase().replace(/\.(txt|md)$/,'');const found=pages.find(x=>x.url.split('/').filter(Boolean).at(-1)===needle||x.title.toLocaleLowerCase().replace(/\.$/,'')===needle);return found?.url;}
  function result(cmd){const section=document.createElement('section');section.className='shell-result';const echo=document.createElement('p');echo.className='command-echo';const prompt=document.createElement('span');prompt.textContent=`guest@146lab:${cwd==='/'?'~':cwd} $ `;echo.append(prompt,document.createTextNode(cmd));section.append(echo);log.append(section);return section;}
  function say(holder,text){const pre=document.createElement('pre');pre.textContent=text;holder.append(pre);}
  function list(holder,pages){const ul=document.createElement('ul');ul.className='shell-list';pages.forEach(p=>{const li=document.createElement('li'),a=document.createElement('a'),meta=document.createElement('span');a.href=base+p.url;a.textContent=p.title+(p.kind==='Index'?'/':'');meta.textContent=p.kind.toLowerCase();li.append(a,meta);ul.append(li);});holder.append(ul);}
  function finish(holder){busy=false;input.removeAttribute('aria-busy');if(holder)holder.scrollIntoView({block:'start',behavior:'instant'});}
  async function run(raw){const command=raw.trim();if(!command||busy)return;history.push(command);historyAt=history.length;input.value='';const words=command.match(/"[^"]*"|'[^']*'|\S+/g).map(x=>x.replace(/^["']|["']$/g,''));const cmd=words.shift().toLowerCase(),arg=words.join(' ');
   if(cmd==='clear'){log.replaceChildren();$('#shell-page').hidden=true;input.focus();return;}
   const holder=result(command);busy=true;input.setAttribute('aria-busy','true');
   try{
    if(cmd==='help')say(holder,'146 LAB / COMMANDS\n\nls [directory]     list pages\ncd experiments     enter a directory\ncd ..              go up one level\npwd                show current path\ntree               map the archive\ncat belka          read a page here\nopen belka         open its full page\nfind freedom       search titles\nclear              clear the screen\nhome               return to the entrance\n\nTab completes a command or page name. ↑ / ↓ recall commands.\nEvery underlined name can also be clicked.');
    else if(cmd==='pwd')say(holder,cwd);
    else if(cmd==='home'){location.href=base+'/';return;}
   else if(cmd==='ls'){
     const target=arg?await resolve(arg):cwd;if(!target){say(holder,'No such directory. Try ls or tree.');}
     else{const {pages}=await directory();let rows=pages.filter(p=>p.url!==target&&p.url.startsWith(target)&&p.url.slice(target.length).split('/').filter(Boolean).length===1);if(target==='/')rows=pages.filter(p=>['/writing/','/experiments/','/questions/','/about/','/morse/'].includes(p.url));if(rows.length)list(holder,rows);else say(holder,'No child pages here. Use cat to read this page.');}
    }else if(cmd==='cd'){
     const target=arg==='~'||!arg?'/':await resolve(arg);if(!target)say(holder,'No such directory. Use tree to see the available paths.');else if(target!=='/'&&!['/writing/','/writing/en/','/writing/ru/','/experiments/'].includes(target))say(holder,'That is a page. Use cat '+arg+' or open '+arg+'.');else{cwd=target;$('#cwd-label').textContent=cwd==='/'?'~':cwd;say(holder,cwd);}
    }else if(cmd==='tree'){
     const {pages}=await directory();const rows=pages.filter(p=>p.url!=='/').sort((a,b)=>a.url.localeCompare(b.url));const ul=document.createElement('ul');ul.className='shell-tree';rows.forEach(p=>{const li=document.createElement('li'),a=document.createElement('a');a.href=base+p.url;a.textContent='  '.repeat(Math.max(0,p.url.split('/').filter(Boolean).length-1))+'└── '+p.title;li.append(a);ul.append(li);});holder.append(ul);
    }else if(cmd==='find'){
     if(!arg)say(holder,'Usage: find <word>');else{const {pages}=await directory();const rows=pages.filter(p=>(p.title+' '+p.kind).toLocaleLowerCase().includes(arg.toLocaleLowerCase()));if(rows.length)list(holder,rows);else say(holder,'No matching pages.');}
    }else if(cmd==='cat'&&['welcome.txt','start-here.txt','all-pages.txt'].includes(arg)){
     if(arg==='welcome.txt')say(holder,'Vlad Svoboda’s personal laboratory.\nWriting, experiments and the experience of being human.\n22 texts. 9 experiments. A few unfinished questions.');
     else{const {pages}=await directory();const starts=['/experiments/belka/','/writing/en/how-i-met-your-dog/','/experiments/greed-is-god/','/experiments/ocean-within/'];list(holder,arg==='all-pages.txt'?pages:starts.map(url=>pages.find(p=>p.url===url)).filter(Boolean));}
    }else if(cmd==='cat'||cmd==='open'){
     if(!arg)say(holder,'Usage: '+cmd+' <page name or path>');else{const url=await resolve(arg);if(!url)say(holder,'Page not found. Try find '+arg+'.');else if(cmd==='open'){location.href=base+url;return;}else{
      const response=await fetch(base+url);if(!response.ok)throw new Error('This page could not be loaded. The directory is still available.');const doc=new DOMParser().parseFromString(await response.text(),'text/html');const main=doc.querySelector('#main');if(!main)throw new Error('No readable content on that page.');
      const article=document.createElement('article');article.className='shell-reader';article.innerHTML=main.innerHTML;
      article.querySelectorAll('script,#shell-log').forEach(n=>n.remove());article.querySelectorAll('h1').forEach(n=>{const h=document.createElement('h2');h.innerHTML=n.innerHTML;n.replaceWith(h);});
      const prefix='read-'+history.length+'-';article.querySelectorAll('[id]').forEach(n=>{const old=n.id;n.id=prefix+old;article.querySelectorAll('[href="#'+old+'"]').forEach(a=>a.setAttribute('href','#'+prefix+old));});
      const controls=document.createElement('div');controls.className='reader-controls';const link=document.createElement('a');link.href=base+url;link.textContent='[ open full page ]';controls.append(link);
      if(article.querySelector('.prose')){const font=document.createElement('button');font.textContent='[ reading font ]';font.setAttribute('aria-pressed','false');font.addEventListener('click',()=>{const enabled=article.classList.toggle('reader-font');font.setAttribute('aria-pressed',String(enabled));});controls.append(font);}
      holder.append(controls,article);
      // Interactive utilities have their own page; keep transcript previews read-only.
      if(url==='/morse/'){article.replaceChildren();const note=document.createElement('p');note.textContent='Open the full page to encode or decode a message.';article.append(note);}
      article.querySelectorAll('[data-video]').forEach(box=>box.querySelector('button')?.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+box.dataset.video+'?autoplay=1';frame.title='Project video';frame.allowFullscreen=true;box.replaceChildren(frame);}));
     }}
    }else say(holder,`Command not found: ${cmd}. Type help for the available commands.`);
   }catch(e){say(holder,e.message);}finally{finish(holder);}
  }
  form.addEventListener('submit',e=>{e.preventDefault();run(input.value);});$$('[data-run]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.run)));
  input.addEventListener('keydown',async e=>{
   if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();historyAt=Math.max(0,Math.min(history.length,historyAt+(e.key==='ArrowUp'?-1:1)));input.value=history[historyAt]||'';}
   if(e.key==='Tab'){
    if(e.shiftKey||!input.value.trim())return;e.preventDefault();const snapshot=input.value,parts=snapshot.split(/\s+/),last=parts.at(-1).toLowerCase();
    try{const candidates=parts.length===1?commands:[...new Set([...Object.keys(aliases),...(await directory()).pages.map(p=>p.url.split('/').filter(Boolean).at(-1)).filter(Boolean)])];if(input.value!==snapshot)return;const found=candidates.filter(x=>x.startsWith(last));if(found.length===1){parts[parts.length-1]=found[0];input.value=parts.join(' ')+(parts.length===1?' ':'');}else if(found.length>1)say(result('complete '+last),found.join('  '));}
    catch(e2){say(result('complete'),e2.message);}
   }
  });
 }
})();
