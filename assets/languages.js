(() => {
 const main=document.getElementById('main');
 const article=main?.querySelector('[data-language-article]');
 if(!article)return;
 const labels={en:'English',ru:'Русский',uk:'Українська'};
 const original=article.dataset.originalLanguage||'en';
 const content=new Map([[original,article.innerHTML]]);
 main.querySelectorAll('template[data-language-content]').forEach(t=>content.set(t.dataset.languageContent,t.innerHTML));
 const browserLanguage=(navigator.languages?.[0]||navigator.language||'').toLowerCase().split('-')[0];
 const allowed=[original];
 if(content.has('uk')&&original!=='uk')allowed.push('uk');
 if(browserLanguage==='ru'&&content.has('ru')&&original!=='ru')allowed.push('ru');
 if(allowed.length<2)return;
 const notices={
  ru:'Этот текст изначально написан на английском. Перевод автоматически выполнен большой языковой моделью, поэтому некоторые формулировки могут звучать непривычно или неточно передавать оригинал.',
  uk:'Цей текст спочатку написано англійською. Переклад автоматично виконала велика мовна модель, тому деякі формулювання можуть звучати незвично або неточно передавати оригінал.'
 };
 const bar=document.createElement('div');bar.className='language-toolbar';bar.setAttribute('role','group');bar.setAttribute('aria-label','Language for this page');
 const buttons=[];
 for(const lang of allowed){
  const b=document.createElement('button');b.type='button';b.lang=lang;b.textContent=labels[lang]||lang;b.dataset.readLanguage=lang;
  b.addEventListener('click',()=>apply(lang,true));buttons.push(b);bar.append(b);
 }
 const note=document.createElement('p');note.className='language-status';note.setAttribute('role','status');note.hidden=true;
 const controls=document.createElement('div');controls.className='language-controls';controls.append(bar,note);article.before(controls);
 let current=original;
 function apply(lang,user=false){
  const next=allowed.includes(lang)?lang:original;
  if(next!==current){
   const reflectionOpen=!!article.querySelector('details[data-reflection][open]');
   article.querySelectorAll('video,audio').forEach(m=>m.pause());
   article.innerHTML=content.get(next);article.lang=next;
   if(reflectionOpen){const d=article.querySelector('details[data-reflection]');if(d)d.open=true;}
   current=next;
   document.dispatchEvent(new CustomEvent('lab:languagechange',{detail:{language:next}}));
  }
  document.documentElement.lang=next;
  const title=article.querySelector('h1')?.textContent;if(title)document.title=title+' · 146 Lab';
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.readLanguage===next)));
  note.hidden=next===original;note.lang=next;note.textContent=next===original?'':notices[next]||'';
  if(user){const url=new URL(location.href);if(next===original)url.searchParams.delete('lang');else url.searchParams.set('lang',next);history.replaceState(history.state,'',url);}
 }
 apply(new URLSearchParams(location.search).get('lang'));
 addEventListener('popstate',()=>apply(new URLSearchParams(location.search).get('lang')));
})();
