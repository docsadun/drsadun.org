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
        ? 'Hello Dr. Sadun, my name is '+n+'. I would like to book an appointment. Reason: '+m+'.'+(t?' '+t:'')
        : 'Hola Dr. Sadun, soy '+n+'. Quisiera agendar una cita. Motivo: '+m+'.'+(t?' '+t:'');
      var a=document.createElement('a');a.href='https://wa.me/593980784857?text='+encodeURIComponent(txt);a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    });
  }
  try{localStorage.setItem('lang',EN?'en':'es')}catch(e){}
  var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
})();
