const header=document.querySelector('.header');
if(header){
  let compact=false;
  function updateHeader(){
    const scroll=window.scrollY;
    const next=compact ? scroll>30 : scroll>100;
    if(next!==compact){compact=next;header.classList.toggle('is-compact',compact);}
  }
  window.addEventListener('scroll',updateHeader,{passive:true});
  window.addEventListener('pageshow',updateHeader);
  updateHeader();
}
