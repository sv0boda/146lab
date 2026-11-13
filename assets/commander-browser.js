(async()=>{
 const $=s=>document.querySelector(s),base='/study/commander/',browser=$('#folder-browser'),main=$('#main');
 const typing=e=>e.target.closest('input,textarea,select,[contenteditable=true],video,audio,[role=slider]');
 let data;try{const r=await fetch('/assets/lab-directory.json');if(!r.ok)throw Error();data=await r.json();}catch{return;}
 if(browser||$('.reading-file-list')){const {initTree}=await import('./commander-tree.js');initTree(data);return;}
 const {folders,pages}=data,route=document.body.dataset.route;
 const params=new URLSearchParams(location.search);
 const canonical=url=>url.startsWith('/experiments/')?'experiments':url.startsWith('/writing/en/')?'en':url.startsWith('/writing/ru/')?'ru':url==='/writing/book/'?'writing':'root';
 let dir=folders[params.get('folder')]?params.get('folder'):(browser?'root':canonical(route)),active=null;
 const list=browser?$('#folder-list'):$('.reading-file-list'),search=browser?$('#folder-search'):$('#reading-file-search');
 const pane=browser?$('.file-pane'):$('.commander-reading-index');
 if(!list){document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||typing(e))return;const a=[...document.querySelectorAll('[data-fkey]')].find(a=>a.dataset.fkey===e.key);if(a){e.preventDefault();location.href=a.href;}else if(e.key==='Escape'){e.preventDefault();location.href=base+'?folder='+encodeURIComponent(dir)+'&selected='+encodeURIComponent(route);}});return;}
 const page=url=>pages.find(p=>p.url===url)||{title:url,url,desc:''};
 const entries=()=>folders[dir].items.map(x=>x.folder?{...x,title:x.title+'/'}:{...page(x.url),...x});
 const folderURL=(id,selected)=>base+'?folder='+encodeURIComponent(id)+(selected?'&selected='+encodeURIComponent(selected):'');
 const fileURL=url=>base+url.slice(1)+'?folder='+encodeURIComponent(dir);
 function link(item){const a=document.createElement('a');a.textContent=item.title;a.href=item.folder?folderURL(item.folder):fileURL(item.url);return a;}
 function preview(item){if(!browser)return;const holder=$('#file-preview');holder.replaceChildren();const title=document.createElement('h2');title.textContent=item.title.replace(/\/$/,'');holder.append(title);
  if(item.folder){const note=document.createElement('p');note.className='preview-description';note.textContent=folders[item.folder].items.length+' entries · Enter or → to open';holder.append(note);const ul=document.createElement('div');ul.className='folder-contents';for(const child of folders[item.folder].items){const x=child.folder?{...child,title:child.title+'/'}:page(child.url),a=link(x);a.href=child.folder?folderURL(child.folder):base+child.url.slice(1)+'?folder='+item.folder;a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;if(child.folder){e.preventDefault();enter(child.folder);}});ul.append(a);}holder.append(ul);const open=document.createElement('a');open.className='preview-open';open.href=folderURL(item.folder);open.textContent='[ Open folder ]';open.onclick=e=>{e.preventDefault();enter(item.folder);};holder.append(open);
  }else{const p=document.createElement('p');p.className='preview-description';p.textContent=item.desc||item.excerpt||'Open this page to read more.';holder.append(p);const a=link(item);a.className='preview-open';a.textContent='[ Enter / read file ]';holder.append(a);}}
 function select(a,item){active={a,item};list.querySelectorAll('a').forEach(x=>x.removeAttribute('data-selected'));a.dataset.selected='true';preview(item);}
 function render(selected,focus=false){list.replaceChildren();active=null;if(search)search.value='';const label=browser?$('#folder-path'):pane.querySelector('.pane-title');label.textContent='┤ '+folders[dir].title+' ├';
  if(folders[dir].parent){const up=document.createElement('a');up.href=folderURL(folders[dir].parent);up.textContent='../';up.dataset.up='true';up.onclick=e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(browser)goUp();else location.href=up.href;};list.append(up);}
  for(const item of entries()){const a=link(item);a.dataset.entry=item.folder||item.url;if(item.url===route)a.setAttribute('aria-current','page');a.onfocus=()=>select(a,item);a.onclick=e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;if(browser){e.preventDefault();select(a,item);}};if(browser)a.ondblclick=()=>open(item);a.onkeydown=e=>{if(e.key==='Enter'&&browser){e.preventDefault();open(item);}};list.append(a);}
  const target=[...list.querySelectorAll('[data-entry]')].find(a=>a.dataset.entry===selected)||list.querySelector('[aria-current=page]')||list.querySelector('[data-entry]');
  if(target&&(focus||!browser||dir!=='root')){if(focus)target.focus();else{const item=entries().find(x=>(x.folder||x.url)===target.dataset.entry);select(target,item);}}
  else if(browser){$('#file-preview').replaceChildren($('#commander-welcome').content.cloneNode(true));}
 }
 function enter(id,selected){dir=id;history.pushState({},'',folderURL(dir,selected));render(selected,true);}
 function goUp(){const old=dir,parent=folders[dir].parent;if(parent)enter(parent,old);}
 function open(item){if(item.folder)enter(item.folder);else location.href=fileURL(item.url);}
 render(params.get('selected'),!!params.get('selected'));
 if(main)main.tabIndex=-1;
 search?.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase();list.querySelectorAll('a').forEach(a=>a.hidden=!a.dataset.up&&!a.textContent.toLocaleLowerCase().includes(q));const empty=browser?null:$('.reading-index-empty');if(empty)empty.hidden=[...list.querySelectorAll('[data-entry]')].some(a=>!a.hidden);});
 if(browser)addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);dir=folders[p.get('folder')]?p.get('folder'):'root';render(p.get('selected'),true);});
 const focusList=()=>{const a=(active&&!active.a.hidden?active.a:null)||list.querySelector('[aria-current=page]:not([hidden])')||list.querySelector('[data-entry]:not([hidden])');a?.focus({preventScroll:true});a?.scrollIntoView({block:'nearest'});};
 document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing||e.defaultPrevented||document.fullscreenElement||document.querySelector('dialog[open]'))return;
  const shortcut=[...document.querySelectorAll('[data-fkey]')].find(a=>a.dataset.fkey===e.key);if(shortcut){e.preventDefault();location.href=shortcut.href;return;}
  if(typing(e))return;
  const inList=pane.contains(document.activeElement),wide=matchMedia('(min-width:1280px)').matches;
  if(['ArrowUp','ArrowDown'].includes(e.key)&&(browser||inList)){const items=[...list.querySelectorAll('a:not([hidden])')];if(!items.length)return;e.preventDefault();const i=items.indexOf(document.activeElement);items[Math.max(0,Math.min(items.length-1,i+(e.key==='ArrowDown'?1:-1)))].focus();return;}
  if(browser){if(['Backspace','ArrowLeft','Escape'].includes(e.key)){e.preventDefault();if(!e.repeat)goUp();}else if(e.key==='ArrowRight'||(e.key==='Enter'&&!e.target.closest('a,button'))){if(active){e.preventDefault();open(active.item);}}}
  else if(e.key==='Escape'){e.preventDefault();if(e.repeat)return;if(wide&&!inList)focusList();else location.href=folderURL(dir,route);}
  else if(e.key==='ArrowLeft'){e.preventDefault();if(wide&&!inList)focusList();else location.href=folderURL(dir,route);}
  else if(e.key==='ArrowRight'&&inList){e.preventDefault();main.focus({preventScroll:true});}
  else if(e.key==='Backspace'&&inList){e.preventDefault();location.href=folderURL(folders[dir].parent||'root',dir);}
 });
})();
