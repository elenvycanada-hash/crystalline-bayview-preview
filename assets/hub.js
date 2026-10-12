/* Patient hub — FRONT-END DEMO ONLY. Nothing is sent, stored or transmitted.
   No clinic facts are invented: answers reuse the page's own FAQ copy or say "to be confirmed". */
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PHONE='(000) 000-0000'; // TODO: placeholder until the clinic provides a number
  const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const faqs=[...document.querySelectorAll('.faq-item')].map(i=>({q:i.querySelector('.faq-question').childNodes[0].textContent.trim(),a:i.querySelector('.faq-answer').textContent.trim()}));
  const services=['Family dentistry','Emergency dental care','Dental implants','Cosmetic dentistry'];
  const hub=document.createElement('div');hub.className='hub';hub.id='patient-hub';hub.setAttribute('role','dialog');hub.setAttribute('aria-label','Patient hub (demo)');hub.setAttribute('aria-hidden','true');
  const tabs=[['chat','Assistant'],['book','Book'],['quiz','Find treatment'],['np','New-patient form'],['remind','Reminders'],['stories','Stories']];
  hub.innerHTML=`<div class="hub-head"><span class="hub-dot" aria-hidden="true"></span><div><strong>Crystalline smart assistant</strong><small>Demo · in-browser only · nothing is sent or stored</small></div><button class="hub-close" type="button" aria-label="Close">×</button></div>
  <div class="hub-tabs" role="tablist">${tabs.map(([k,l],i)=>`<button type="button" role="tab" data-tab="${k}" aria-selected="${i===0}">${l}</button>`).join('')}</div>
  <div class="hub-body">
   <section class="hub-pane" data-pane="chat"><span class="hub-demo">Demo assistant — answers come from this page's FAQ. Not medical advice.</span><div class="chat" aria-live="polite"></div>
     <div class="chips">${faqs.map((f,i)=>`<button type="button" data-q="${i}">${esc(f.q)}</button>`).join('')}</div>
     <form class="chat-form"><input aria-label="Ask a question" placeholder="Ask about opening, location, services…"><button class="btn btn-primary">Ask</button></form></section>
   <section class="hub-pane" data-pane="book" hidden><span class="hub-demo">Demo booking flow — no request is submitted.</span><div class="steps"><i class="on"></i><i></i><i></i></div><form class="book"></form></section>
   <section class="hub-pane" data-pane="quiz" hidden><span class="hub-demo">Demo quiz — suggests a page section; not a diagnosis. Cost estimates: TODO (to be provided by the clinic).</span><div class="quiz"></div></section>
   <section class="hub-pane" data-pane="np" hidden><span class="hub-demo">Preview only — the final new-patient form will be provided by the clinic.</span><p>The new-patient form would typically ask for:</p><ul class="preview-list"><li>Contact details</li><li>Previous dental care &amp; concerns</li><li>Medical history &amp; medications</li><li>Insurance details (if applicable)</li><li>Consent &amp; privacy acknowledgement</li></ul><div class="field" style="margin-top:12px"><label>Full name (preview)</label><input disabled placeholder="Disabled in demo"></div><div class="field"><label>Date of birth (preview)</label><input disabled placeholder="Disabled in demo"></div></section>
   <section class="hub-pane" data-pane="remind" hidden><span class="hub-demo">Demo signup — no contact details are stored or sent.</span><form class="remind"><div class="field"><label for="rm-c">Email or mobile</label><input id="rm-c" required placeholder="you@example.com"></div><div class="field"><label for="rm-w">Remind me</label><select id="rm-w"><option>1 day before</option><option>2 days before</option><option>1 week before</option></select></div><button class="btn btn-primary">Sign up for reminders</button></form></section>
   <section class="hub-pane" data-pane="stories" hidden><span class="hub-demo">Demo carousel — placeholder text only. Real reviews will appear after consent &amp; verification.</span><div class="slides">${[1,2,3].map(n=>`<div class="slide${n===1?' on':''}"><strong>★★★★★ · Placeholder review ${n}</strong><p style="margin:8px 0 0;color:#47696e">Approved patient feedback will be shown here. No review text has been invented for this demo.</p></div>`).join('')}</div><div class="dots">${[0,1,2].map(n=>`<button type="button" aria-label="Show story ${n+1}"${n?'':' class="on"'}></button>`).join('')}</div></section>
  </div>
  <div class="contact-row"><a class="btn btn-light" href="tel:0000000000" title="Placeholder number">📞 Call ${PHONE}</a><a class="btn btn-light" href="sms:0000000000" title="Placeholder number">💬 Text us</a></div>`;
  document.body.appendChild(hub);
  const $=s=>hub.querySelector(s);
  const open=(tab)=>{hub.classList.add('open');hub.setAttribute('aria-hidden','false');if(tab)show(tab);if(!chatStarted)startChat()};
  const close=()=>{hub.classList.remove('open');hub.setAttribute('aria-hidden','true')};
  $('.hub-close').onclick=close;addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  const show=k=>{hub.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===k));hub.querySelectorAll('.hub-pane').forEach(p=>p.hidden=p.dataset.pane!==k)};
  hub.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>show(b.dataset.tab));

  // chat
  const chat=$('.chat');let chatStarted=false;
  const say=(t,who='bot')=>{const m=document.createElement('div');m.className='msg '+who;m.textContent=t;chat.append(m);chat.parentElement.parentElement.scrollTop=1e6;return m};
  const botSay=t=>{if(reduce)return say(t);const m=say('');m.classList.add('typing');setTimeout(()=>{m.classList.remove('typing');m.textContent=t},650)};
  function startChat(){chatStarted=true;botSay('Hi! I can answer common questions about the upcoming Bayview Village location, or help you start a booking request. (Demo)')}
  const answer=q=>{const t=q.toLowerCase();const hit=faqs.find(f=>f.q.toLowerCase().split(/\W+/).filter(w=>w.length>4).some(w=>t.includes(w)));
    if(/book|appoint|visit/.test(t))return 'You can start a demo booking request in the "Book" tab — the clinic would follow up to confirm.';
    if(hit)return hit.a;
    if(/price|cost|fee|insur/.test(t))return 'Fees and insurance details are to be confirmed by the clinic (TODO).';
    if(/hour|phone|address|parking/.test(t))return 'That detail is still a placeholder — it will be added once the clinic confirms it.';
    return "I don't have that answer yet in this demo. Please use the request form and the team can follow up.";};
  hub.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const f=faqs[b.dataset.q];say(f.q,'me');botSay(f.a)});
  $('.chat-form').onsubmit=e=>{e.preventDefault();const i=e.target.querySelector('input');if(!i.value.trim())return;say(i.value,'me');botSay(answer(i.value));i.value=''};

  // booking flow (3 steps)
  const book=$('.book');const data={};let step=0;
  const stepsUI=()=>hub.querySelectorAll('.steps i').forEach((s,i)=>s.classList.toggle('on',i<=step));
  const renderBook=()=>{stepsUI();
    if(step===0)book.innerHTML=`<label>What is the visit for?</label><div class="chips">${services.concat('Not sure').map(s=>`<button type="button" data-v="${s}">${s}</button>`).join('')}</div>`;
    if(step===1)book.innerHTML=`<label>Preferred time</label><div class="chips">${['Weekday morning','Weekday afternoon','Evening','Weekend','Flexible'].map(s=>`<button type="button" data-v="${s}">${s}</button>`).join('')}</div><p style="font-size:.74rem;color:#47696e">Actual availability and hours are to be confirmed (TODO).</p>`;
    if(step===2)book.innerHTML=`<div class="field"><label for="bk-n">Name</label><input id="bk-n" required></div><div class="field"><label for="bk-c">Email or phone</label><input id="bk-c" required></div><button class="btn btn-primary">Review request</button>`;
    if(step===3)book.innerHTML=`<div class="hub-ok">Demo complete — nothing was sent.<br>${esc(data.n||'')} · ${esc(data[0]||'')} · ${esc(data[1]||'')}</div><button type="button" class="btn btn-light" style="margin-top:10px" data-restart>Start over</button>`;
    book.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{data[step]=b.dataset.v;step++;renderBook()});
    const r=book.querySelector('[data-restart]');if(r)r.onclick=()=>{step=0;renderBook()};};
  book.onsubmit=e=>{e.preventDefault();data.n=book.querySelector('#bk-n').value;step=3;renderBook()};renderBook();

  // find-your-treatment quiz
  const quiz=$('.quiz');const Q=[['Is anything painful or urgent right now?',['Yes','No']],['What matters most?',['Checkups & cleaning','Replacing a missing tooth','Improving appearance']]];let qa=[];
  const renderQuiz=()=>{if(qa.length<Q.length){const [q,o]=Q[qa.length];quiz.innerHTML=`<p><strong>${q}</strong></p><div class="chips">${o.map(x=>`<button type="button">${x}</button>`).join('')}</div>`;quiz.querySelectorAll('button').forEach(b=>b.onclick=()=>{qa.push(b.textContent);if(qa[0]==='Yes')qa.length=Q.length;renderQuiz()});return}
    const s=qa[0]==='Yes'?'Emergency dental care':qa[1]==='Replacing a missing tooth'?'Dental implants':qa[1]==='Improving appearance'?'Cosmetic dentistry':'Family dentistry';
    quiz.innerHTML=`<div class="hub-ok">Suggested starting point: ${s}</div><p style="font-size:.78rem;color:#47696e">Availability at Bayview Village and cost estimates are to be confirmed by the clinic. A dentist determines suitable treatment.</p><a class="btn btn-primary" href="#services">See care options</a> <button type="button" class="btn btn-light" data-r>Retake</button>`;
    quiz.querySelector('[data-r]').onclick=()=>{qa=[];renderQuiz()};quiz.querySelector('a').onclick=close};renderQuiz();

  // reminders
  $('.remind').onsubmit=e=>{e.preventDefault();e.target.outerHTML='<div class="hub-ok">Demo: you would receive reminders '+esc($('#rm-w')?$('#rm-w').value:'')+'. Nothing was stored.</div>'};

  // stories carousel (auto-advance, pauses on hover)
  const slides=[...hub.querySelectorAll('.slide')],dots=[...hub.querySelectorAll('.dots button')];let si=0,paused=false;
  const go=i=>{si=(i+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('on',k===si));dots.forEach((d,k)=>d.classList.toggle('on',k===si))};
  dots.forEach((d,k)=>d.onclick=()=>go(k));$('.slides').onmouseenter=()=>paused=true;$('.slides').onmouseleave=()=>paused=false;
  if(!reduce)setInterval(()=>{if(!paused&&hub.classList.contains('open'))go(si+1)},4000);

  // launchers: sticky ✦ button, plus deep links
  document.addEventListener('click',e=>{const a=e.target.closest('.sticky-cta .ai');if(a){e.preventDefault();hub.classList.contains('open')?close():open('chat')}});
  window.CrystallineHub={open,close};
})();
