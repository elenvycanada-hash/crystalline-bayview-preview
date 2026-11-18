/* Day/night toggle. The initial theme is applied by the inline script in <head>
   (before first paint); this file wires the header button and keeps the clock in sync. */
(()=>{
  const T=window.CrystallineTheme;if(!T)return;
  const btn=document.querySelector('.theme-toggle');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const label=()=>{if(!btn)return;const dark=document.documentElement.getAttribute('data-theme')==='dark';
    btn.setAttribute('aria-label',dark?'Switch to day theme':'Switch to night theme');
    btn.setAttribute('title',dark?'Day theme':'Night theme');btn.setAttribute('aria-pressed',String(dark))};
  const swap=fn=>{if(!reduce.matches&&document.startViewTransition&&document.visibilityState==='visible'){document.startViewTransition(()=>{fn();label()})}else{fn();label()}};
  label();
  if(btn)btn.addEventListener('click',()=>{const next=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';swap(()=>T.set(next))});
  // Clock: when there is no manual choice (or it expired at 7am/7pm), follow local time.
  const sync=()=>{const want=T.current();if(want!==document.documentElement.getAttribute('data-theme'))swap(()=>T.apply(want))};
  setInterval(sync,60000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync()});
  // Keep tabs in step if the visitor toggles in another tab.
  addEventListener('storage',e=>{if(e.key===T.key)sync()});
})();
