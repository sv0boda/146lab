(() => {
 function reveal(hash,focus=false){
  const target=document.getElementById(hash.slice(1));if(!target?.matches('details[data-reflection]'))return;
  target.open=true;
  if(focus)target.querySelector('summary').focus({preventScroll:true});
  target.scrollIntoView({block:'start',behavior:'instant'});
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('[data-reflection-jump]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;
  e.preventDefault();history.pushState(null,'',a.hash);reveal(a.hash,true);
 });
 addEventListener('hashchange',()=>reveal(location.hash));
 if(location.hash)reveal(location.hash);
})();
