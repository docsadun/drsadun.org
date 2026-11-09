(function(){
  var EN=document.documentElement.lang==='en';
  var nav=document.getElementById('nav');
  function onScroll(){nav.classList.toggle('solid',window.scrollY>40)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});

  var hv=document.getElementById('heroVideo');
  if(hv&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){hv.removeAttribute('autoplay');try{hv.pause()}catch(e){}}

  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
  document.querySelectorAll('.reveal').forEach(function(el){io?io.observe(el):el.classList.add('in')});

  document.querySelectorAll('.tabs button').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('.tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});
      document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on')});
      b.setAttribute('aria-selected','true');document.getElementById(b.dataset.tab).classList.add('on');
    });
  });

  var lb=document.getElementById('lightbox');
  if(lb){
    var lbi=lb.querySelector('img');
    document.querySelectorAll('.gallery figure img').forEach(function(img){
      img.parentNode.addEventListener('click',function(){lbi.src=img.src;lbi.alt=img.alt;lb.classList.add('on')});
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
  document.getElementById('yr').textContent=new Date().getFullYear();
})();
