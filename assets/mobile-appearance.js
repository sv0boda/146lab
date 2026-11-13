// Run before paint: touch devices use Archive structure with a palette choice.
(() => {
 const query='(max-width: 800px), (hover: none) and (pointer: coarse)';
 window.labMobileAppearance=matchMedia(query);
 window.labSetMobilePalette=value=>{
  const palette=value==='blue'?'blue':'dark';
  document.documentElement.dataset.mobilePalette=palette;
  try{localStorage.setItem('146lab-mobile-palette',palette);}catch{}
 };
 const apply=()=>{
  let palette;try{palette=localStorage.getItem('146lab-mobile-palette');}catch{}
  const commander=location.pathname.startsWith('/study/commander/');
  document.documentElement.dataset.mobilePalette=palette==='blue'||(!palette&&commander)?'blue':'dark';
  if(window.labMobileAppearance.matches&&commander){
   if(!palette)window.labSetMobilePalette('blue');
   location.replace(location.pathname.replace('/study/commander/','/study/index/')+location.search+location.hash);
  }
 };
 apply();
 window.labMobileAppearance.addEventListener('change',apply);
})();
