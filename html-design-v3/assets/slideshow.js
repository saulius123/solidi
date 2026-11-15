const hero=document.querySelector('[data-slideshow]');
if(hero){
  const slides=[...hero.querySelectorAll('.hero-slide')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,timer=null;
  function show(next){
    index=(next+slides.length)%slides.length;
    slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',i!==index);});
  }
  function updateTimer(){
    clearInterval(timer);
    if(!reduced.matches&&!document.hidden&&!hero.matches(':hover')&&!hero.contains(document.activeElement))timer=setInterval(()=>show(index+1),6500);
  }
  hero.addEventListener('mouseenter',updateTimer);
  hero.addEventListener('mouseleave',updateTimer);
  hero.addEventListener('focusin',updateTimer);
  hero.addEventListener('focusout',()=>requestAnimationFrame(updateTimer));
  document.addEventListener('visibilitychange',updateTimer);
  reduced.addEventListener('change',updateTimer);
  show(0);updateTimer();
}
