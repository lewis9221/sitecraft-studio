
/* Sitecraft editor appearance is independent of projects and never goes into exported HTML. */
(()=>{'use strict';
 const KEY='sitecraft-ui-appearance-v1';
 const DEFAULTS={theme:'midnight',accent:'#8065e9',density:'comfortable',workspace:'dots'};
 const THEMES=[
  {id:'midnight',label:'Midnight',bg:'#0c1020',surface:'#141c2f',line:'#33415b'},
  {id:'obsidian',label:'Obsidian',bg:'#090b10',surface:'#15171d',line:'#444a58'},
  {id:'ocean',label:'Deep Ocean',bg:'#071922',surface:'#0e2633',line:'#30556a'},
  {id:'forest',label:'Forest',bg:'#0b1918',surface:'#152725',line:'#36594f'},
  {id:'dusk',label:'Purple Dusk',bg:'#1b1324',surface:'#281c35',line:'#584267'},
  {id:'daylight',label:'Daylight',bg:'#edf1f9',surface:'#ffffff',line:'#cbd3e3'}
 ];
 const ACCENTS=[['Violet','#8065e9'],['Blue','#2869c4'],['Turquoise','#008977'],['Pink','#bf4675'],['Amber','#98601c'],['Green','#158064']];
 const $=id=>document.getElementById(id);
 function validHex(hex){return typeof hex==='string'&&/^#[0-9a-f]{6}$/i.test(hex)}
 function load(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');return {...DEFAULTS,...(saved&&typeof saved==='object'?saved:{})}}catch{return {...DEFAULTS}}}
 let prefs=load(),oldFocus=null;
 function normalise(){if(!THEMES.some(t=>t.id===prefs.theme))prefs.theme='midnight';if(!validHex(prefs.accent))prefs.accent=DEFAULTS.accent;if(!['compact','comfortable'].includes(prefs.density))prefs.density='comfortable';if(!['dots','grid','plain'].includes(prefs.workspace))prefs.workspace='dots'}
 function apply(refresh=true){normalise();const root=document.documentElement;root.dataset.scTheme=prefs.theme;root.dataset.scDensity=prefs.density;root.dataset.scWorkspace=prefs.workspace;root.style.setProperty('--sc-accent',prefs.accent);try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}if(refresh)renderOptions()}
 function renderOptions(){
  const area=$('scThemeList');if(!area)return;
  area.innerHTML=THEMES.map(t=>`<button type="button" class="sc-theme-card" data-sc-select-theme="${t.id}" aria-pressed="${t.id===prefs.theme}" title="Use ${t.label} theme"><span class="sc-theme-preview" style="--card-bg:${t.bg};--card-surface:${t.surface};--card-line:${t.line}"><div><i></i><i></i><i></i></div><div><i></i><b></b><i></i></div></span><span class="sc-theme-name">${t.label}<span class="sc-theme-check">${t.id===prefs.theme?'✓':''}</span></span></button>`).join('');
  $('scAccentList').innerHTML=ACCENTS.map(([label,hex])=>`<button type="button" class="sc-accent-swatch" title="${label}" aria-label="${label}" aria-pressed="${prefs.accent.toLowerCase()===hex.toLowerCase()}" data-sc-accent="${hex}" style="background:${hex}"></button>`).join('')+`<label class="sc-accent-custom" for="scCustomAccent">Custom <input type="color" id="scCustomAccent" value="${prefs.accent}" aria-label="Choose custom accent colour"></label>`;
  $('scDensitySelect').value=prefs.density;$('scCanvasSelect').value=prefs.workspace;
 }
 function open(){oldFocus=document.activeElement;renderOptions();$('appearanceModal').hidden=false;document.body.classList.add('sc-appearance-open');$('closeAppearanceBtn').focus()}
 function close(){$('appearanceModal').hidden=true;document.body.classList.remove('sc-appearance-open');oldFocus?.focus?.()}
 document.addEventListener('click',e=>{
  if(e.target.closest('#openAppearanceBtn,[data-open-appearance]')){open();return}
  if(e.target.closest('#closeAppearanceBtn')){close();return}
  if(e.target===$('appearanceModal')){close();return}
  const theme=e.target.closest('[data-sc-select-theme]');if(theme){prefs.theme=theme.dataset.scSelectTheme;apply();return}
  const accent=e.target.closest('[data-sc-accent]');if(accent){prefs.accent=accent.dataset.scAccent;apply();return}
  if(e.target.closest('#resetAppearanceBtn')){prefs={...DEFAULTS};apply()}
 });
 document.addEventListener('input',e=>{if(e.target.id==='scCustomAccent'){prefs.accent=e.target.value;apply(false)}});
 document.addEventListener('change',e=>{if(e.target.id==='scCustomAccent'){prefs.accent=e.target.value;apply()}if(e.target.id==='scDensitySelect'){prefs.density=e.target.value;apply()}if(e.target.id==='scCanvasSelect'){prefs.workspace=e.target.value;apply()}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('appearanceModal').hidden){e.stopImmediatePropagation();close()}} ,true);
 // Trap tab navigation inside the dialog while it is open.
 document.addEventListener('keydown',e=>{if(e.key!=='Tab'||$('appearanceModal').hidden)return;const focusable=[...$('appearanceModal').querySelectorAll('button,input,select')].filter(n=>n.offsetParent!==null);if(!focusable.length)return;const idx=focusable.indexOf(document.activeElement);if(e.shiftKey&&idx<=0){e.preventDefault();focusable[focusable.length-1].focus()}else if(!e.shiftKey&&idx===focusable.length-1){e.preventDefault();focusable[0].focus()}});
 apply();
})();
