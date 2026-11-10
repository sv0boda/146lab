(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const base='/study/'+document.body.dataset.mode;
 for(const button of $$('[data-question]'))button.addEventListener('click',()=>{
  $$('[data-question]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $$('[data-thread]').forEach(p=>p.hidden=p.dataset.thread!==button.dataset.question);
 });
 const search=$('#page-search');
 if(search){
  let kind='All';const rows=$$('.all-pages>li');
  function filter(){const query=search.value.trim().toLocaleLowerCase();let count=0;for(const row of rows){row.hidden=!(row.dataset.search.includes(query)&&(kind==='All'||row.dataset.kind===kind));if(!row.hidden)count++;}$('#page-count').textContent=`${count} / ${rows.length} pages`;$('.empty-results').hidden=count!==0;}
  search.value=new URLSearchParams(location.search).get('q')||'';filter();search.addEventListener('input',filter);
  for(const b of $$('.index-filters button'))b.addEventListener('click',()=>{kind=b.dataset.kind;$$('.index-filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter();});
 }
 // A browser navigation vocabulary, never a system shell.
 const form=$('#command-form');
 if(form){
  const command=$('#command'),output=$('#command-output');const history=[];let historyAt=0;
  const routes={home:'/',all:'/all/',writing:'/writing/',experiments:'/experiments/',about:'/about/',belka:'/experiments/belka/',dog:'/writing/en/how-i-met-your-dog/',morse:'/morse/',questions:'/questions/',book:'/writing/book/'};
  function run(value){const raw=value.trim(),[cmd,...args]=raw.toLowerCase().split(/\s+/),arg=args.join(' ');if(!raw)return;history.push(raw);historyAt=history.length;command.value='';
   if(cmd==='help'){output.textContent='ls — all pages\nopen belka / dog / writing / experiments / book / about / morse\nfind <words> — search the directory\nhome — return to the entrance\nclear — clear this response\n↑ / ↓ — command history';}
   else if(cmd==='clear')output.textContent='';
   else if(cmd==='ls'||cmd==='home')location.href=base+(cmd==='ls'?'/all/':'/');
   else if(cmd==='find'&&arg)location.href=base+'/all/?q='+encodeURIComponent(raw.slice(raw.indexOf(' ')+1).trim());
   else if((cmd==='open'||cmd==='cd')&&arg){if(routes[arg])location.href=base+routes[arg];else location.href=base+'/all/?q='+encodeURIComponent(arg);}
   else output.textContent='Try help, ls, open belka, or find followed by a word. All links work with a click, too.';
  }
  form.addEventListener('submit',e=>{e.preventDefault();run(command.value);});
  $$('[data-command]').forEach(b=>b.addEventListener('click',()=>run(b.dataset.command)));
  command.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();historyAt=Math.max(0,Math.min(history.length,historyAt+(e.key==='ArrowUp'?-1:1)));command.value=history[historyAt]||'';}});
  // On the entrance, commands sit directly below the directory rather than below all content.
  if(document.body.dataset.route==='/')$('.study-hero').after($('.command-panel'));
 }
 const input=$('#morse-input');
 if(input){
  const alphabet={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.','.':'.-.-.-',',':'--..--','?':'..--..',"'":'.----.','!':'-.-.--','/':'-..-.','(': '-.--.',')':'-.--.-','&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-','"':'.-..-.','$':'...-..-','@':'.--.-.'};
  const reverse=Object.fromEntries(Object.entries(alphabet).map(([a,b])=>[b,a]));const output=$('#morse-output'),status=$('#morse-status');
  function translate(decode){const text=input.value.trim();if(!text){output.textContent='Waiting for a signal.';status.textContent='';return;}const unknown=new Set();
   if(decode){output.textContent=text.replace(/[·•]/g,'.').replace(/[−–—]/g,'-').split(/\s*\/\s*|\s{3,}/).map(word=>word.trim().split(/\s+/).filter(Boolean).map(c=>{if(reverse[c])return reverse[c];unknown.add(c);return '�';}).join('')).join(' ');}
   else{output.textContent=text.toUpperCase().split(/\s+/).map(word=>[...word].map(c=>{if(alphabet[c])return alphabet[c];unknown.add(c);return '�';}).join(' ')).join(' / ');}
   status.textContent=unknown.size?'Unrecognised '+(decode?'signals':'characters')+': '+[...unknown].join(', ')+'. Shown as �.':(decode?'Decoded.':'Encoded.');
  }
  $('#decode').addEventListener('click',()=>translate(true));$('#encode').addEventListener('click',()=>translate(false));$('#morse-clear').addEventListener('click',()=>{input.value='';translate(true);input.focus();});
  function loadHash(){try{input.value=decodeURIComponent(location.hash.slice(1));}catch{status.textContent='This message link could not be read.';}}
  loadHash();window.addEventListener('hashchange',loadHash);
  // Preserve the message when changing study, without revealing the decoded Easter egg.
  const switcher=$('.mode-switch');if(location.hash)switcher.hash=location.hash;
  for(const [letter,code]of Object.entries(alphabet)){const el=document.createElement('div');const a=document.createElement('span'),b=document.createElement('span');a.textContent=letter;b.textContent=code;el.append(a,b);$('#morse-alphabet').append(el);}
 }
})();
