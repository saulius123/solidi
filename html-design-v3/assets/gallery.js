const gallery=document.querySelector('[data-gallery]');
const viewer=document.querySelector('#gallery-viewer');
if(gallery){
  const strip=gallery.querySelector('.gallery-thumbnails');
  const controls=[...gallery.querySelectorAll('[data-gallery-scroll]')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateScrollControls(){
    controls.forEach(button=>{
      const previous=button.dataset.galleryScroll==='previous';
      button.disabled=previous ? strip.scrollLeft<=2 : strip.scrollLeft+strip.clientWidth>=strip.scrollWidth-2;
    });
  }
  controls.forEach(button=>button.addEventListener('click',()=>{
    strip.scrollBy({left:(button.dataset.galleryScroll==='previous'?-1:1)*strip.clientWidth*.75,behavior:reduced.matches?'instant':'smooth'});
  }));
  strip.addEventListener('scroll',updateScrollControls,{passive:true});
  new ResizeObserver(updateScrollControls).observe(strip);
  updateScrollControls();
}
if(gallery&&viewer&&typeof viewer.showModal==='function'){
  const photos=[...gallery.querySelectorAll('[data-gallery-photo]')];
  const image=viewer.querySelector('.viewer-image');
  const counter=viewer.querySelector('.viewer-counter');
  const caption=viewer.querySelector('.viewer-caption');
  const thumbs=[...viewer.querySelectorAll('[data-viewer-index]')];
  let current=0;
  function show(index){
    current=(index+photos.length)%photos.length;
    const photo=photos[current];
    image.src=photo.href;
    image.alt=photo.querySelector('img').alt;
    counter.textContent=`${current+1} / ${photos.length}`;
    caption.textContent=image.alt;
    thumbs.forEach((button,i)=>button.setAttribute('aria-pressed',i===current));
    thumbs[current].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
    const next=new Image();next.src=photos[(current+1)%photos.length].href;
  }
  gallery.querySelectorAll('[data-open-gallery]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();show(Number(link.dataset.openGallery));viewer.showModal();
  }));
  viewer.querySelector('[data-close-gallery]').addEventListener('click',()=>viewer.close());
  viewer.querySelector('[data-previous-photo]').addEventListener('click',()=>show(current-1));
  viewer.querySelector('[data-next-photo]').addEventListener('click',()=>show(current+1));
  thumbs.forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.viewerIndex))));
  viewer.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
    if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
  });
  viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
  let touchStart=null;
  image.addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX;},{passive:true});
  image.addEventListener('touchend',event=>{if(touchStart===null)return;const delta=event.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>50)show(current+(delta<0?1:-1));touchStart=null;},{passive:true});
}
