const params=new URLSearchParams(location.search);
let mode=params.get('mode')==='rent'?'rent':'sale',category=['house','apartment','other'].includes(params.get('category'))?params.get('category'):'all';
const grid=document.querySelector('#property-grid');
function renderProperties(){
  let count=0;
  grid.querySelectorAll('.property-card').forEach(card=>{
    const visible=card.dataset.mode===mode&&(category==='all'||card.dataset.category===category);
    card.hidden=!visible;
    if(visible)count++;
  });
  document.querySelector('.empty-state').hidden=count>0;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===category));
  document.querySelectorAll('.mode-switch button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
}
document.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>{mode=el.dataset.mode;category='all';renderProperties()}));
document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{category=el.dataset.filter;renderProperties()}));
document.querySelectorAll('[data-category]').forEach(el=>el.addEventListener('click',()=>{mode='sale';category=el.dataset.category;renderProperties();closeSubmenu()}));
const menuButton=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
const submenuButton=document.querySelector('.submenu-toggle'),submenu=document.querySelector('#categories');
function closeSubmenu(){submenu.hidden=true;submenuButton.setAttribute('aria-expanded','false')}
submenuButton.addEventListener('click',()=>{submenu.hidden=!submenu.hidden;submenuButton.setAttribute('aria-expanded',!submenu.hidden)});
document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))closeSubmenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSubmenu();nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#form-status').textContent='Užklausa paruošta. Tai demonstracinė forma — duomenys nebuvo išsiųsti. Veikiančiai svetainei reikia prijungti užklausų siuntimą.'});
document.querySelector('#year').textContent=new Date().getFullYear();
renderProperties();
