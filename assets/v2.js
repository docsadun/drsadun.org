(function(){
  var EN=document.documentElement.lang==='en';
  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  if(burger){
    burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')})});
  }
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('video[autoplay]').forEach(function(v){v.removeAttribute('autoplay');try{v.pause()}catch(e){}});
  }
  var fl=document.querySelector('.wa-float');
  if(fl){var onS=function(){fl.classList.toggle('show',window.scrollY>window.innerHeight*.8)};onS();window.addEventListener('scroll',onS,{passive:true})}
  var lv=document.querySelectorAll('video.lazy-v');
  var red=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function wake(v){if(v.dataset.src){v.src=v.dataset.src;v.removeAttribute('data-src');if(red){v.controls=true}else{var p=v.play();if(p&&p.catch)p.catch(function(){})}}}
  if('IntersectionObserver' in window){var vo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){wake(e.target);vo.unobserve(e.target)}})},{rootMargin:'200px'});lv.forEach(function(v){vo.observe(v)})}else{lv.forEach(wake)}
  var PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  var PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
  document.querySelectorAll('video[autoplay],video.lazy-v').forEach(function(v){
    var b=document.createElement('button');b.type='button';b.className='vid-btn';
    function sync(){var on=!v.paused;b.innerHTML=on?PAUSE:PLAY;b.setAttribute('aria-label',on?(EN?'Pause video':'Pausar video'):(EN?'Play video':'Reproducir video'))}
    b.addEventListener('click',function(e){e.stopPropagation();v.dataset.user='1';if(v.dataset.src)wake(v);if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.pause()}});
    v.addEventListener('play',sync);v.addEventListener('pause',sync);
    v.parentNode.appendChild(b);sync();
  });
  var tabs=document.querySelectorAll('.tabs button');
  tabs.forEach(function(b){
    b.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected','false')});
      document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on')});
      b.setAttribute('aria-selected','true');document.getElementById(b.dataset.tab).classList.add('on');
    });
  });
  var lb=document.getElementById('lightbox');
  if(lb){
    var lbi=lb.querySelector('img');
    document.querySelectorAll('.shot img').forEach(function(img){
      img.parentNode.addEventListener('click',function(){
        lbi.src=img.currentSrc||img.src;lbi.alt=img.alt;
        lbi.width=img.naturalWidth||+img.getAttribute('width');lbi.height=img.naturalHeight||+img.getAttribute('height');
        lb.classList.add('on');lb.querySelector('button').focus();
      });
    });
    lb.addEventListener('click',function(){lb.classList.remove('on')});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('on')});
  }
  var form=document.getElementById('form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var n=document.getElementById('f-name').value.trim(),m=document.getElementById('f-motivo').value,t=document.getElementById('f-msg').value.trim();
      var txt=EN
        ? 'Hello Dr. Sadun, my name is '+n+'. I would like to request an appointment. Reason: '+m+'.'+(t?' '+t:'')+' (Writing from drsadun.org)'
        : 'Hola Dr. Sadun, soy '+n+'. Quisiera solicitar una cita. Motivo: '+m+'.'+(t?' '+t:'')+' (Escribo desde drsadun.org)';
      var url='https://wa.me/593980784857?text='+encodeURIComponent(txt);
      var a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
      var st=document.getElementById('f-sent');
      if(st){
        st.textContent='';
        var l=document.createElement('a');l.href=url;l.target='_blank';l.rel='noopener';l.textContent=EN?'write to us at +593 98 078 4857':'escríbanos al +593 98 078 4857';
        st.appendChild(document.createTextNode(EN?'WhatsApp opened with your message ready to send. If it did not open, ':'Se abrió WhatsApp con su mensaje listo para enviar. Si no se abrió, '));
        st.appendChild(l);st.appendChild(document.createTextNode('.'));
      }
    });
  }
  function openCv(){
    var h=location.hash.slice(1);if(!h)return;
    var t=document.getElementById(h),cv=t&&t.closest('details.cv');
    if(cv&&!cv.open){cv.open=true;if(t!==cv)t.scrollIntoView()}
  }
  openCv();window.addEventListener('hashchange',openCv);
  try{localStorage.setItem('lang',EN?'en':'es')}catch(e){}
  var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
})();
