(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var root=document.documentElement;

/* Theme */
try{var t=localStorage.getItem('theme');if(t)root.dataset.theme=t;else if(window.matchMedia('(prefers-color-scheme: light)').matches)root.dataset.theme='light'}catch(e){}
$('#theme').addEventListener('click',function(){
 root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';
 try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}
});

/* Mobile menu */
var menu=$('#menu'),burger=$('#burger');
burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.textContent=o?'✕':'☰'});
$$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.textContent='☰'})});

/* Scroll progress */
var bar=$('#progress'),ticking=false;
window.addEventListener('scroll',function(){
 if(ticking)return;ticking=true;
 requestAnimationFrame(function(){
  var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100||0)+'%';ticking=false;
 });
},{passive:true});

/* Reveal with stagger */
$$('.grid,.timeline').forEach(function(g){$$('.reveal',g).forEach(function(el,i){el.style.setProperty('--d',(i*0.09)+'s')})});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
$$('.reveal').forEach(function(el){io.observe(el)});

/* Nav indicator + active link */
var links=$$('#menu a'),ind=$('#ind');
function moveInd(a){if(!a||getComputedStyle(ind).display==='none')return;ind.style.opacity=1;ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px'}
var so=new IntersectionObserver(function(es){es.forEach(function(e){
 if(e.isIntersecting){links.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('on',on);if(on)moveInd(a)})}
})},{rootMargin:'-45% 0px -50% 0px'});
$$('main section').forEach(function(s){so.observe(s)});
links.forEach(function(a){a.addEventListener('mouseenter',function(){moveInd(a)});a.addEventListener('mouseleave',function(){moveInd($('#menu a.on'))})});

/* Typing role */
var role=$('#role'),words=role.dataset.words.split('|'),wi=0,ci=0,del=false;
function decode(s){var d=document.createElement('textarea');d.innerHTML=s;return d.value}
words=words.map(decode);
if(reduce){role.textContent=words[0]}else{(function tick(){
 var w=words[wi];ci+=del?-1:1;role.textContent=w.slice(0,ci);
 var delay=del?35:75;
 if(!del&&ci===w.length){del=true;delay=1500}else if(del&&ci===0){del=false;wi=(wi+1)%words.length;delay=300}
 setTimeout(tick,delay);
})()}

/* Card tilt */
if(!reduce&&window.matchMedia('(hover:hover)').matches){
 $$('.tilt').forEach(function(c){
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.style.transform='perspective(800px) rotateX('+(-y*7)+'deg) rotateY('+(x*7)+'deg)'});
  c.addEventListener('pointerleave',function(){c.style.transform=''});
 });
}

/* Copy email */
$('#copy').addEventListener('click',function(){
 var email='mohammadmushahid217@gmail.com',toast=$('#toast');
 function ok(){toast.textContent='Email copied to clipboard.'}
 function fail(){toast.textContent='Copy failed. Email: '+email}
 if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(email).then(ok,fail)}
 else{var ta=document.createElement('textarea');ta.value=email;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')?ok():fail()}catch(e){fail()}document.body.removeChild(ta)}
 setTimeout(function(){toast.textContent=''},3000);
});
$('#yr').textContent=new Date().getFullYear();

/* Particles */
var cv=$('#bg'),cx=cv.getContext('2d'),W,H,P=[],mouse={x:-999,y:-999},cols=['#7c5cff','#00d4ff','#ff5fa2'];
function size(){var d=Math.min(window.devicePixelRatio||1,2);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d;cx.setTransform(d,0,0,d,0,0);W=innerWidth;H=innerHeight}
function init(){var n=Math.min(70,Math.floor(innerWidth/18));P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*2.2+.8,c:cols[i%3]})}
function draw(){
 cx.clearRect(0,0,W,H);
 for(var i=0;i<P.length;i++){var p=P[i];
  if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
   var dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){p.x+=dx/d*1.2;p.y+=dy/d*1.2}}
  cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fillStyle=p.c;cx.globalAlpha=.8;cx.fill();
  for(var j=i+1;j<P.length;j++){var q=P[j],ax=p.x-q.x,ay=p.y-q.y,dd=ax*ax+ay*ay;
   if(dd<12000){cx.globalAlpha=(1-dd/12000)*.25;cx.strokeStyle=p.c;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
 }
 cx.globalAlpha=1;
 if(!reduce&&!document.hidden)requestAnimationFrame(draw);
}
size();init();draw();
window.addEventListener('resize',function(){size();init();if(reduce)draw()});
window.addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&!reduce)requestAnimationFrame(draw)});
})();
