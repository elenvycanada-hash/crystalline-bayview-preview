/* Glacier redesign interactions — no dependencies. */
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const doc=document.documentElement;
  if(!reduce)doc.classList.add('gx');

  // ambient field + progress bar
    const bar=document.createElement('div');bar.className='ice-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);

  // H1 word-by-word entrance (keeps text accessible)
  const h1=document.querySelector('.hero h1');
  if(h1&&!reduce){let i=0;const wrap=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.append(t);else{const s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=t;f.append(s)}});c.replaceWith(f)}else if(c.nodeName==='EM'){wrap(c)}})};wrap(h1)}

  // floating ice crystals / enamel blobs in hero
  const hv=document.querySelector('.hero-visual');
  if(hv){
    const gem=(id,w,pts,facets)=>`<svg width="${w}" viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#bff3fa" stop-opacity=".75"/><stop offset=".6" stop-color="#72CAD5" stop-opacity=".6"/><stop offset=".8" stop-color="#bfe4ff" stop-opacity=".7"/><stop offset="1" stop-color="#009FB3" stop-opacity=".75"/></linearGradient></defs><polygon points="${pts}" fill="url(#${id})" stroke="rgba(255,255,255,.9)" stroke-width="1.2"/>${facets}</svg>`;
    const crystal=gem('gA',96,'50,2 96,38 74,118 26,118 4,38','<polygon class="facet" points="50,2 96,38 50,52" fill="#fff" opacity=".6"/><polygon points="4,38 50,52 26,118" fill="#007C8B" opacity=".18"/><polyline points="4,38 50,52 96,38 M50,52 50,118" fill="none" stroke="#fff" stroke-opacity=".7"/>');
    const shard=gem('gB',54,'50,0 88,60 50,120 12,60','<polygon class="facet" points="50,0 88,60 50,60" fill="#fff" opacity=".55"/><polygon points="12,60 50,60 50,120" fill="#007C8B" opacity=".2"/>');
    const blob=`<svg width="120" viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="gC" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#e6fbff" stop-opacity=".9"/><stop offset=".6" stop-color="#9fe6f3" stop-opacity=".6"/><stop offset=".85" stop-color="#72CAD5" stop-opacity=".55"/><stop offset="1" stop-color="#009FB3" stop-opacity=".7"/></radialGradient></defs><path d="M60 6c28 0 54 20 54 50s-22 58-54 58S6 92 6 60 32 6 60 6z" fill="url(#gC)"/><ellipse class="facet" cx="40" cy="34" rx="16" ry="9" fill="#fff" transform="rotate(-30 40 34)"/></svg>`;
    const c=document.createElement('div');c.className='crystals';c.setAttribute('aria-hidden','true');
    c.innerHTML=`<span style="right:-22px;top:36%">${shard.replace('width="54"','width="40"').replace('<svg','<svg style="--d:6s;--r:14deg;--dl:-2s"')}</span>
      <span style="left:14px;top:-18px">${shard.replace(/gB/g,'gB2').replace('width="54"','width="30"').replace('<svg','<svg style="--d:7s;--r:-12deg;--dl:-1s"')}</span>`;
    hv.appendChild(c);
  }

  // glass cards: edge + sweep + pointer light
  document.querySelectorAll('.stat-card,.service-card,.review-card,.principle,.location-card,.form-card,.smart-guide,.experience-card').forEach(el=>{
    el.classList.add('glass-fx');
        const s=document.createElement('span');s.className='sweep';s.setAttribute('aria-hidden','true');
    el.append(s);
    if(fine&&!reduce)el.addEventListener('pointermove',ev=>{const r=el.getBoundingClientRect();el.style.setProperty('--px',ev.clientX-r.left+'px');el.style.setProperty('--py',ev.clientY-r.top+'px')});
  });

  // smart guide: thinking state, typed answer, auto-demo until the visitor interacts
  const res=document.querySelector('.guide-result'),copy=document.getElementById('guide-result-copy');
  const opts=[...document.querySelectorAll('.guide-option')];
  const typeOut=()=>{if(reduce||!copy)return;const full=copy.textContent;copy.textContent='';copy.classList.add('caret');let n=0;const t=setInterval(()=>{n+=3;copy.textContent=full.slice(0,n);if(n>=full.length){clearInterval(t);copy.textContent=full;copy.classList.remove('caret')}},16)};
  opts.forEach(b=>b.addEventListener('click',()=>{if(reduce||!res)return;res.classList.add('thinking');setTimeout(()=>{res.classList.remove('thinking');typeOut()},420)}));
  let demo=null,userTouched=false;const stopDemo=()=>{userTouched=true;clearInterval(demo)};
  opts.forEach(b=>b.addEventListener('pointerdown',stopDemo));opts.forEach(b=>b.addEventListener('keydown',stopDemo));
  const guide=document.querySelector('.smart-guide');
  if(guide&&opts.length&&!reduce){new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting&&!userTouched){o.disconnect();let k=Math.max(0,opts.findIndex(b=>b.classList.contains('active')));demo=setInterval(()=>{if(userTouched)return;k=(k+1)%opts.length;opts[k].click();if(k===opts.length-1)clearInterval(demo)},3800)}}),{threshold:.5}).observe(guide)}

  // testimonial ticker: spotlight cycles across review cards while visible
  const reviews=[...document.querySelectorAll('.review-card')];
  if(reviews.length>1&&!reduce){let r=0,timer=null;new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!timer){timer=setInterval(()=>{reviews.forEach(x=>x.classList.remove('spot'));reviews[r%reviews.length].classList.add('spot');r++},2600)}else if(!e.isIntersecting&&timer){clearInterval(timer);timer=null;reviews.forEach(x=>x.classList.remove('spot'))}}),{threshold:.3}).observe(reviews[0].parentElement)}

  // staggered reveal for grid children
  document.querySelectorAll('.services-grid,.stats-grid,.principles').forEach(g=>{g.classList.add('stagger');[...g.children].forEach((c,i)=>c.style.setProperty('--k',i))});

  // sticky CTA (existing button styles) appears after the hero
  const sticky=document.createElement('div');sticky.className='sticky-cta';
  sticky.innerHTML='<a class="btn btn-primary breathe" href="#request">Request an appointment <span aria-hidden="true">↗</span></a>'+(guide?'<a class="btn btn-light ai" href="#'+(guide.id||(guide.id='smart-guide'))+'" aria-label="Open the smart assistant (demo)" title="Smart assistant (demo)">✦</a>':'');
  document.body.appendChild(sticky);
  const heroEl=document.querySelector('.hero'),req=document.getElementById('request');
  let reqVisible=false;if(req)new IntersectionObserver(es=>{reqVisible=es[0].isIntersecting;upd()},{threshold:.1}).observe(req);
  const upd=()=>sticky.classList.toggle('show',heroEl&&heroEl.getBoundingClientRect().bottom<0&&!reqVisible);
  addEventListener('scroll',upd,{passive:true});

  // cursor-reactive hero light + 3D tilt; scroll progress
  const hero=document.querySelector('.hero'),card=document.querySelector('.hero-card'),cr=document.querySelector('.crystals');
  let raf=0,mx=0,my=0;
  if(fine&&!reduce&&hero){
    hero.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{raf=0;const r=hero.getBoundingClientRect();
      hero.style.setProperty('--mx',mx-r.left+'px');hero.style.setProperty('--my',my-r.top+'px');
      const nx=(mx-r.left)/r.width-.5,ny=(my-r.top)/r.height-.5;
      if(card){card.style.setProperty('--ry',(nx*8)+'deg');card.style.setProperty('--rx',(-ny*6)+'deg')}
      if(cr)cr.style.transform=`translate(${nx*-18}px,${ny*-14}px)`;
    })});
    hero.addEventListener('pointerleave',()=>{card&&(card.style.setProperty('--ry','0deg'),card.style.setProperty('--rx','0deg'));cr&&(cr.style.transform='')});
  }
  const onScroll=()=>{const h=doc.scrollHeight-innerHeight;bar.style.setProperty('--sp',h>0?scrollY/h:0)};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // pause heavy infinite animations when tab hidden
  document.addEventListener('visibilitychange',()=>doc.style.setProperty('animation-play-state',document.hidden?'paused':'running'));
})();
