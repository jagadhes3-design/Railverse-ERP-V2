(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const siteSearch=$('siteSearch');
 function filterSites(){const q=(siteSearch?.value||'').trim().toLowerCase();document.querySelectorAll('#list-projects .rv-project-card').forEach(card=>{card.hidden=!card.textContent.toLowerCase().includes(q)});}
 siteSearch?.addEventListener('input',filterSites);
 const list=$('list-projects');
 if(list&&window.MutationObserver)new MutationObserver(filterSites).observe(list,{childList:true,subtree:true});
})();