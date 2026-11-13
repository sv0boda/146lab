(() => {
 const main=document.getElementById('main');if(!main)return;
 const labels={en:'English',ru:'Русский',uk:'Українська'},key='146lab-reading-language';
 const article=main.querySelector('[data-language-article]');
 const original=article?.dataset.originalLanguage||document.documentElement.lang||'en';
 const content=new Map([[original,article?.innerHTML]]);
 main.querySelectorAll('template[data-language-content]').forEach(t=>content.set(t.dataset.languageContent,t.innerHTML));
 let preference='en';try{preference=localStorage.getItem(key)||preference;}catch{}
 const query=new URLSearchParams(location.search).get('lang');if(labels[query])preference=query;
 if(!labels[preference])preference='en';
 const bar=document.createElement('div');bar.className='language-toolbar';bar.setAttribute('role','group');bar.setAttribute('aria-label','Reading language');
 const caption=document.createElement('span');caption.className='language-label';caption.textContent='Language';bar.append(caption);
 const buttons=[];
 for(const [lang,label] of Object.entries(labels)){
  const b=document.createElement('button');b.type='button';b.lang=lang;b.textContent=label;b.dataset.readLanguage=lang;b.addEventListener('click',()=>apply(lang,true));buttons.push(b);bar.append(b);
 }
 const note=document.createElement('p');note.className='language-status';note.setAttribute('role','status');
 const controls=document.createElement('div');controls.className='language-controls';controls.append(bar,note);
 main.prepend(controls);
 const titles={en:document.title};let current=original,directory;
 function apply(lang,user=false){
  preference=lang;try{localStorage.setItem(key,lang);}catch{}
  const next=content.has(lang)?lang:original;
  if(article&&next!==current){
   const reflectionOpen=!!article.querySelector('details[data-reflection][open]');
   article.querySelectorAll('video,audio').forEach(m=>m.pause());
   article.innerHTML=content.get(next);article.lang=next;
   if(reflectionOpen){const d=article.querySelector('details[data-reflection]');if(d)d.open=true;}
   current=next;
   document.dispatchEvent(new CustomEvent('lab:languagechange',{detail:{language:next,preference:lang}}));
  }
  if(article){document.documentElement.lang=next;const title=article.querySelector('h1')?.textContent;if(title){titles[next]=title+' · 146 Lab';document.title=titles[next];}}
  buttons.forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.readLanguage===lang));b.dataset.available=String(content.has(b.dataset.readLanguage));});
  const isEntry=article||/\/(writing\/(en|ru)\/[^/]+|questions\/[^/]+)\//.test(document.body.dataset.route||'');
  note.textContent=isEntry?(next===lang?({en:'Reading in English',ru:'Вы читаете по-русски',uk:'Ви читаєте українською'}[lang]):({en:`This entry is available in ${[...content.keys()].map(l=>labels[l]).join(' / ')}. Showing the original.`,ru:`Доступные языки: ${[...content.keys()].map(l=>labels[l]).join(' / ')}. Показан оригинал.`,uk:`Цей запис доступний мовами: ${[...content.keys()].map(l=>labels[l]).join(' / ')}. Показано оригінал.`}[lang])):({en:'Language labels show what is available. Writing stays in its original language.',ru:'Метки показывают доступные языки. Авторские тексты остаются на языке оригинала.',uk:'Позначки показують доступні мови. Авторські тексти залишаються мовою оригіналу.'}[lang]);
  if(user){const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(history.state,'',url);}
  markLinks();
 }
 function canonical(href){try{return new URL(href,location.href).pathname.replace(/^\/study\/[^/]+(?=\/)/,'');}catch{return '';}}
 function markLinks(){
  if(!directory)return;
  const pages=new Map(directory.pages.map(p=>[p.url,p]));
  document.querySelectorAll('.archive-file,.all-pages a,.work-lines a,[role="treeitem"][href],.project-list a,.preview-open').forEach(a=>{
   const p=pages.get(canonical(a.href));if(!p)return;
   const langs=p.languages||[p.lang||'en'];
   if(p.kind==='Index'&&langs.length<2)return;
   let badge=a.querySelector(':scope > .language-badge');
   if(!badge){badge=document.createElement('span');badge.className='language-badge';a.append(badge);}
   const text=langs.map(l=>l.toUpperCase()).join(' / ');if(badge.textContent!==text)badge.textContent=text;
   badge.title='Available languages: '+langs.map(l=>labels[l]||l).join(', ');
   a.classList.toggle('available-in-language',langs.includes(preference));
  });
 }
 apply(preference);
 fetch('/assets/lab-directory.json').then(r=>r.json()).then(data=>{
  directory=data;markLinks();let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;markLinks();});}).observe(document.body,{subtree:true,childList:true});
 }).catch(()=>{});
 addEventListener('popstate',()=>{const lang=new URLSearchParams(location.search).get('lang');if(labels[lang])apply(lang);});
})();
