export function initTree({folders,pages}){
 const $=s=>document.querySelector(s),list=$('#folder-list')||$('.reading-file-list'),preview=$('#file-preview'),search=$('#folder-search')||$('#reading-file-search'),base='/study/commander/',key='146lab-tree';
 const article=!preview,main=$('#main'),pane=article?$('.commander-reading-index'):$('.file-pane'),route=document.body.dataset.route;
 if(article)main.tabIndex=-1;
 const descriptions={personal:'Places I’ve made for myself, and the experience of living in them. Beginning with an apartment in Kyiv and Kurin.',art:'Participatory art and performance. Experiments in what people do, feel and discover when they become part of the work.',film:'Films and theatre: long productions, collaborations and experiments with moving images and live experience.',community:'Courses, events and production ventures that created opportunities for other people to make things together.',tech:'Experiments with technology as a way to explore human experience.',start:'Selected entries from different parts of the website. A few places to begin, without having to know what you’re looking for. Each project tells the story of what happened. Under “Looking back,” I return to it: what worked, what didn’t, and what I think differently about now.',experiments:'Films, performances, collaborations and ideas I wanted to try. What I made, what happened, and what I think about it now.',writing:'Essays, observations and fiction, in English and Russian. There’s also a book taking shape.',en:'Standalone essays, stories and observations. The book has its own section.',ru:'Тексты на русском: истории, наблюдения и размышления.',book:'Published excerpts from a book taking shape. Read them together, in sequence.',questions:'Questions that keep coming up across different projects and pieces of writing. Follow one to see how otherwise unrelated work connects.'};
 const page=url=>pages.find(p=>p.url===url)||{url,title:url};
 const expanded=new Set();try{for(const id of JSON.parse(sessionStorage.getItem(key)||'[]'))if(folders[id])expanded.add(id);}catch{}
 const params=new URLSearchParams(location.search),origin=folders[params.get('folder')]?params.get('folder'):Object.keys(folders).find(id=>folders[id].overview===route)||Object.keys(folders).find(id=>!['root','start'].includes(id)&&!id.startsWith('question')&&!id.startsWith('theme-')&&folders[id].items.some(x=>x.url===route));
 document.querySelectorAll('[data-main-menu]').forEach(a=>{a.href=base+'?folder='+encodeURIComponent(origin||'root')+'&selected='+encodeURIComponent(route);a.addEventListener('click',()=>{const u=new URL(a.href);u.searchParams.set('browse',mode);a.href=u.href;});});
 function reveal(id){while(id&&id!=='root'&&folders[id]){expanded.add(id);id=folders[id].parent;}}
 const previewFolder=!article&&folders[params.get('preview-folder')]?params.get('preview-folder'):null;
 reveal(previewFolder?folders[previewFolder].parent:origin);
 let active=null,rows=[];
 let savedMode;try{savedMode=sessionStorage.getItem('146lab-browse');}catch{}
 let mode=params.get('browse')||((origin==='questions'||origin?.startsWith('theme-'))?'threads':savedMode)||'sections';
 if(!['sections','threads'].includes(mode))mode='sections';
 const treeRoot=()=>mode==='threads'?'questions':'root';
 function updateModeControls(){
  document.querySelectorAll('button[data-browse-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.browseMode===mode)));
  const note=pane.querySelector('[data-browse-explanation]');if(note)note.textContent=mode==='threads'?'The same work, connected by questions. A piece can appear more than once.':'Writing, experiments and personal projects.';
  pane.dataset.browse=mode;
 }
 function setMode(next){
  mode=next;search.value='';try{sessionStorage.setItem('146lab-browse',mode);}catch{}
  const url=new URL(location.href);url.searchParams.set('browse',mode);history.replaceState(null,'',url);
  const current=article?route:active?.url;
  const parent=Object.keys(folders).find(id=>(mode==='threads'?id.startsWith('theme-'):!id.startsWith('theme-')&&!['questions','start','root'].includes(id))&&folders[id].items.some(x=>x.url===current));
  if(parent)reveal(parent);
  active=null;updateModeControls();render(parent?parent+':'+current:undefined);save();
  if(preview&&!parent){preview.replaceChildren();const h=document.createElement('h2');h.textContent=mode==='threads'?'Follow a thread':'Browse by section';const p=document.createElement('p');p.className='preview-description';p.textContent=mode==='threads'?'The same work, arranged by the questions it raises. Select a thread to cross between writing, experiments and personal projects.':'Choose a section on the left to explore the work.';preview.append(h,p);}
 }
 document.querySelectorAll('[data-browse-mode]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();setMode(b.dataset.browseMode);}));
 updateModeControls();
 const save=()=>{try{sessionStorage.setItem(key,JSON.stringify([...expanded]));}catch{}};
 const fileURL=item=>base+item.url.slice(1)+'?folder='+encodeURIComponent(item.parent)+'&browse='+mode;
 function show(item){active=item;list.querySelectorAll('[data-entry]').forEach(a=>a.dataset.selected=String(a.dataset.entry===item.id));if(!preview)return;preview.replaceChildren();
  const h=document.createElement('h2');h.textContent=item.folder&&folders[item.folder].overview?folders[item.folder].title:item.title;preview.append(h);if(!item.folder){const tag=document.createElement('p');tag.className='preview-meta';tag.textContent=item.contentType||item.kind||'Page';preview.append(tag);}const p=document.createElement('p');p.className='preview-description';p.textContent=item.folder?(folders[item.folder].description||descriptions[item.folder]||folders[item.folder].title+' Follow this question through the work collected here.'):(item.connection||item.desc||item.excerpt||'Open this page to read more.');preview.append(p);
  if(item.folder){if(folders[item.folder].overview){const link=document.createElement('a');link.className='preview-open';link.href=base+folders[item.folder].overview.slice(1);link.textContent=item.folder==='questions'?'[ Explore the threads ]':'[ Follow this route ]';preview.append(link);}const hint=document.createElement('p');hint.className='preview-meta';hint.textContent=folders[item.folder].items.length+' entries · Enter to '+(expanded.has(item.folder)?'collapse':'expand');preview.append(hint);}else{const a=document.createElement('a');a.href=fileURL(item);a.className='preview-open';a.textContent='[ Enter / read file ]';preview.append(a);}}
 function matches(item,q){return (item.folder?item.title:page(item.url).title).toLocaleLowerCase().includes(q)||(item.folder&&folders[item.folder].items.some(x=>matches(x,q)));}
 function keepVisible(a){const box=list.getBoundingClientRect(),row=a.getBoundingClientRect(),top=box.top+list.clientTop,bottom=top+list.clientHeight;if(row.top<top)list.scrollTop-=top-row.top;else if(row.bottom>bottom)list.scrollTop+=row.bottom-bottom;}
 function render(selected,focus=false){rows=[];list.replaceChildren();list.setAttribute('role','tree');list.setAttribute('aria-label',mode==='threads'?'Threads through the work':'Laboratory sections and pages');const q=search.value.trim().toLocaleLowerCase();
  function branch(parent,depth){for(const raw of folders[parent].items){if(q&&!matches(raw,q))continue;const item=raw.folder?{...raw,parent,id:raw.folder}:{...page(raw.url),...raw,parent,id:parent+':'+raw.url};item.depth=depth;rows.push(item);
   const a=document.createElement('a');a.href=item.folder?base+'?folder='+encodeURIComponent(item.folder)+'&preview-folder='+encodeURIComponent(item.folder):fileURL(item);a.dataset.entry=item.id;a.dataset.parent=parent;if(item.url===route)a.setAttribute('aria-current','page');a.style.setProperty('--tree-depth',depth);a.setAttribute('role','treeitem');a.setAttribute('aria-level',depth+1);if(item.folder)a.setAttribute('aria-expanded',String(q?true:expanded.has(item.folder)));a.textContent=(item.folder?(expanded.has(item.folder)||q?'▾ ':'▸ '):'  ')+item.title+(item.folder?'/':'');a.tabIndex=-1;
   a.onfocus=()=>show(item);a.onclick=e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if(item.folder||!article){e.preventDefault();show(item);if(item.folder)toggle(item);}};a.ondblclick=()=>{if(!item.folder)location.href=fileURL(item);};a.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(item.folder)toggle(item);else location.href=fileURL(item);}};list.append(a);
   if(item.folder&&(expanded.has(item.folder)||q))branch(item.folder,depth+1);
  }}branch(treeRoot(),0);
  const found=rows.find(x=>x.id===selected)||rows[0];if(found){const a=[...list.children].find(a=>a.dataset.entry===found.id);a.tabIndex=0;if(focus){a.focus({preventScroll:true});keepVisible(a);}else if(selected){show(found);keepVisible(a);}}else if(preview)preview.textContent='No matching pages.';
 }
 function focus(id){const a=[...list.children].find(a=>a.dataset.entry===id);if(a){list.querySelectorAll('[data-entry]').forEach(x=>x.tabIndex=-1);a.tabIndex=0;a.focus({preventScroll:true});keepVisible(a);}}
 function toggle(item){if(expanded.has(item.folder))expanded.delete(item.folder);else expanded.add(item.folder);save();if(article){location.href=base+'?folder='+encodeURIComponent(item.folder)+'&preview-folder='+encodeURIComponent(item.folder)+'&browse='+mode;return;}render(item.id,true);}
 const selected=params.get('selected')||(article?route:null);render(previewFolder||(origin&&folders[origin].overview===route?origin:selected?(origin||'root')+':'+selected:undefined),!!(previewFolder||selected)&&!article);save();
 search.addEventListener('input',()=>{render();if(rows.length)show(rows[0]);});
 document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||document.fullscreenElement||document.querySelector('dialog[open]'))return;
  const shortcut=[...document.querySelectorAll('[data-fkey]')].find(a=>a.dataset.fkey===e.key);if(shortcut){e.preventDefault();if(shortcut.dataset.browseMode)setMode(shortcut.dataset.browseMode);else location.href=shortcut.href;return;}
  if(e.target.closest('input,textarea,select,video,audio,[role=slider]')||e.target.isContentEditable)return;
  const letter=e.key.toLowerCase();
  if(letter==='q'||letter==='e'){e.preventDefault();if(!e.repeat)setMode(letter==='q'?'sections':'threads');return;}
  const inTree=pane.contains(document.activeElement),wide=matchMedia('(min-width:1280px)').matches;
  if(article){
   if(['Escape','ArrowLeft'].includes(e.key)&&!inTree){e.preventDefault();if(e.repeat)return;if(wide){const target=active||rows.find(x=>x.url===route)||rows[0];if(target)focus(target.id);}else location.href=base+'?folder='+encodeURIComponent(origin||'root')+'&selected='+encodeURIComponent(route)+'&browse='+mode;return;}
   if(e.key==='ArrowRight'&&inTree&&!active?.folder){e.preventDefault();main.focus({preventScroll:true});return;}
   if(['Escape','ArrowLeft'].includes(e.key)&&inTree){e.preventDefault();if(!e.repeat)location.href=base+'?folder='+encodeURIComponent(origin||'root')+'&selected='+encodeURIComponent(route)+'&browse='+mode;return;}
   if(!inTree)return;
  }
  if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const i=rows.findIndex(x=>x.id===document.activeElement.dataset.entry);const n=rows[Math.max(0,Math.min(rows.length-1,i+(e.key==='ArrowDown'?1:-1)))];if(n)focus(n.id);}
  else if(e.key==='ArrowRight'&&active?.folder){e.preventDefault();if(!expanded.has(active.folder))toggle(active);else{const child=rows.find(x=>x.parent===active.folder);if(child)focus(child.id);}}
  else if(['ArrowLeft','Backspace','Escape'].includes(e.key)&&active){e.preventDefault();if(e.repeat)return;if(active.folder&&expanded.has(active.folder))toggle(active);else if(active.parent!==treeRoot())focus(active.parent);else{expanded.clear();save();active=null;render();if(preview)preview.replaceChildren($('#commander-welcome').content.cloneNode(true));}}
 });
}
