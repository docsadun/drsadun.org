(function(){
  var EN=document.documentElement.lang==='en';
  var red=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menú de especialidades */
  var trig=document.querySelector('.nav-trigger'),mega=document.getElementById('mega');
  function megaSet(o){if(!trig)return;trig.setAttribute('aria-expanded',o?'true':'false');mega.classList.toggle('on',o)}
  if(trig){
    trig.addEventListener('click',function(e){e.stopPropagation();megaSet(trig.getAttribute('aria-expanded')!=='true')});
    document.addEventListener('click',function(e){if(!mega.contains(e.target))megaSet(false)});
    trig.parentNode.addEventListener('focusout',function(e){if(!trig.parentNode.contains(e.relatedTarget))megaSet(false)});
  }

  /* cajón móvil */
  var burger=document.getElementById('burger'),drawer=document.getElementById('drawer');
  function drawerSet(o){if(!burger)return;burger.setAttribute('aria-expanded',o?'true':'false');burger.setAttribute('aria-label',o?(EN?'Close menu':'Cerrar menú'):(EN?'Open menu':'Abrir menú'));drawer.classList.toggle('on',o)}
  if(burger){
    burger.addEventListener('click',function(){drawerSet(burger.getAttribute('aria-expanded')!=='true')});
    drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){drawerSet(false)})});
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(trig&&trig.getAttribute('aria-expanded')==='true'){megaSet(false);trig.focus()}if(burger&&burger.getAttribute('aria-expanded')==='true'){drawerSet(false);burger.focus()}}});

  /* videos: con ahorro de datos, conexión lenta o menos movimiento se queda la foto */
  var nc=navigator.connection,lite=!!(nc&&(nc.saveData||/2g|3g/.test(nc.effectiveType||'')));
  var lv=document.querySelectorAll('video.lazy-v');
  function wake(v){if(v.dataset.src){v.src=v.dataset.src;v.removeAttribute('data-src');if(red){v.controls=true}else{var p=v.play();if(p&&p.catch)p.catch(function(){})}}}
  if(lite||red){}else if('IntersectionObserver' in window){var vo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){wake(e.target);vo.unobserve(e.target)}})},{rootMargin:'200px'});lv.forEach(function(v){vo.observe(v)})}else{lv.forEach(wake)}
  var PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  var PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
  lv.forEach(function(v){
    var b=document.createElement('button');b.type='button';b.className='vid-btn';
    function sync(){var on=!v.paused;b.innerHTML=on?PAUSE:PLAY;b.setAttribute('aria-label',on?(EN?'Pause video':'Pausar video'):(EN?'Play video':'Reproducir video'))}
    b.addEventListener('click',function(e){e.stopPropagation();if(v.dataset.src)wake(v);if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.pause()}});
    v.addEventListener('play',sync);v.addEventListener('pause',sync);
    v.parentNode.appendChild(b);sync();
  });

  /* pestañas de cursos y congresos */
  var tabs=document.querySelectorAll('.tabs button');
  tabs.forEach(function(b){
    b.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected','false')});
      document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on')});
      b.setAttribute('aria-selected','true');document.getElementById(b.dataset.tab).classList.add('on');
    });
  });

  /* fotos ampliadas */
  var lb=document.getElementById('lightbox');
  if(lb){
    var lbi=lb.querySelector('img'),last=null;
    document.querySelectorAll('.shot img').forEach(function(img){
      var f=img.parentNode,cap=f.querySelector('figcaption'),txt=cap?cap.textContent:img.alt;
      var o=document.createElement('button');o.type='button';o.className='shot-open';o.setAttribute('aria-label',(EN?'Enlarge photo: ':'Ampliar foto: ')+txt);f.appendChild(o);
      o.addEventListener('click',function(){last=o;lbi.src=img.currentSrc||img.src;lbi.alt=txt;lbi.width=img.naturalWidth||+img.getAttribute('width');lbi.height=img.naturalHeight||+img.getAttribute('height');lb.classList.add('on');lb.querySelector('button').focus()});
    });
    function close(){lb.classList.remove('on');if(last)last.focus()}
    lb.addEventListener('click',close);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('on'))close()});
  }

  /* formulario de cita: arma el mensaje de WhatsApp, no guarda nada */
  var form=document.getElementById('form');
  if(form){
    var MSG={'f-name':EN?'Please write your full name.':'Escriba su nombre completo.','f-motivo':EN?'Please choose the reason for your visit.':'Elija el motivo de consulta.'};
    Object.keys(MSG).forEach(function(id){var el=document.getElementById(id);if(!el)return;
      el.addEventListener('invalid',function(){el.setCustomValidity(MSG[id])});
      ['input','change'].forEach(function(ev){el.addEventListener(ev,function(){el.setCustomValidity('')})});
    });
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

  /* botón flotante: aparece al bajar y se oculta en contacto y en el pie */
  var fl=document.querySelector('.wa-float');
  if(fl){
    var hide=document.querySelectorAll('#contacto,#contact,.site-footer'),inHide=new Set();
    function upd(){fl.classList.toggle('show',window.scrollY>window.innerHeight*.6&&inHide.size===0)}
    if('IntersectionObserver' in window){var ho=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)inHide.add(e.target);else inHide.delete(e.target)});upd()});hide.forEach(function(h){ho.observe(h)})}
    upd();window.addEventListener('scroll',upd,{passive:true});
  }

  /* índice lateral: marca la sección que se está leyendo */
  var tl=document.querySelectorAll('.toc a[href^="#"]');
  if(tl.length&&'IntersectionObserver' in window){
    var map={},secs=[];
    tl.forEach(function(a){var s=document.getElementById(a.getAttribute('href').slice(1));if(s){map[s.id]=a;secs.push(s)}});
    var vis={};
    var so=new IntersectionObserver(function(es){
      es.forEach(function(e){vis[e.target.id]=e.isIntersecting});
      var cur=null;for(var i=0;i<secs.length;i++){if(vis[secs[i].id]){cur=secs[i].id;break}}
      if(cur){tl.forEach(function(a){a.classList.remove('on');a.removeAttribute('aria-current')});map[cur].classList.add('on');map[cur].setAttribute('aria-current','true')}
    },{rootMargin:'-20% 0px -60% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }

  /* trayectoria: abrir al llegar por enlace */
  function openCv(){
    var h=location.hash.slice(1);if(!h)return;
    var t=document.getElementById(h),cv=t&&t.closest('details.cv');
    if(cv&&!cv.open){cv.open=true;if(t!==cv)t.scrollIntoView()}
  }
  openCv();window.addEventListener('hashchange',openCv);
  try{localStorage.setItem('lang',EN?'en':'es')}catch(e){}
  var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
})();
