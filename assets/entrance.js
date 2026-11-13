(() => {
 const mobile=window.labMobileAppearance;
 const isMobile=()=>mobile?.matches;
 let saved,palette;
 try{saved=localStorage.getItem('146lab-view');palette=localStorage.getItem('146lab-mobile-palette');}catch{}
 if(!new URLSearchParams(location.search).has('choose')){
  if(isMobile()){
   if(['dark','blue'].includes(palette))location.replace('/study/index/');
  }else if(['index','commander'].includes(saved))location.replace('/study/'+saved+'/');
 }
 document.querySelectorAll('[data-view]').forEach(a=>{
  const update=()=>a.href=isMobile()?'/study/index/':'/study/'+a.dataset.view+'/';
  update();mobile?.addEventListener('change',update);
  a.addEventListener('click',()=>{
   if(isMobile())window.labSetMobilePalette(a.dataset.view==='commander'?'blue':'dark');
   else try{localStorage.setItem('146lab-view',a.dataset.view);}catch{}
  });
 });
})();
