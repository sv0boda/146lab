(() => {
 const $=s=>document.querySelector(s);
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
  const switcher=$('.mode-switch');if(switcher&&location.hash)switcher.hash=location.hash;
  for(const [letter,code]of Object.entries(alphabet)){const el=document.createElement('div');const a=document.createElement('span'),b=document.createElement('span');a.textContent=letter;b.textContent=code;el.append(a,b);$('#morse-alphabet').append(el);}
 }
})();
