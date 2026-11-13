(() => {
 // A small hurdle for HTML-only scrapers, not an access-control boundary.
 const destination=()=>['https:', '', ['t','me'].join('.'), ['vlad','svoboda'].join('')].join('/');
 function prepare(e){const link=e.target.closest('a[data-contact="telegram"]');if(link)link.href=destination();}
 for(const event of ['pointerdown','click','contextmenu','auxclick'])document.addEventListener(event,prepare);
 document.addEventListener('keydown',e=>{if(e.key==='Enter')prepare(e);});
})();
