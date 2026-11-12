(function(){
  var nav=document.querySelector('nav');
  if(!nav)return;
  var links=[].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var tabs=links.map(function(a){return {a:a,s:document.getElementById(a.getAttribute('href').slice(1))}}).filter(function(t){return t.s});
  if(!tabs.length)return;

  var css=document.createElement('style');
  css.textContent=
    'body.tabbed section[data-tab]{display:none}'+
    'body.tabbed section[data-tab].on{display:block}'+
    'nav a.on{background:var(--accent);color:var(--accent-fg)}'+
    'nav a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}'+
    '.tabnext{display:flex;justify-content:space-between;gap:10px;margin-top:22px;flex-wrap:wrap}'+
    '.tabnext a{font-size:14px;font-weight:500;text-decoration:none;color:var(--fg);background:var(--chip);padding:8px 14px;border-radius:99px}'+
    '.tabnext a.nx{margin-left:auto;background:var(--accent);color:var(--accent-fg)}';
  document.head.appendChild(css);

  nav.setAttribute('role','tablist');
  tabs.forEach(function(t,i){
    t.s.setAttribute('data-tab','');
    t.s.setAttribute('role','tabpanel');
    t.a.setAttribute('role','tab');
    var bar=document.createElement('div');bar.className='tabnext';
    if(i>0){var p=document.createElement('a');p.href='#'+tabs[i-1].s.id;p.textContent='← '+tabs[i-1].a.textContent;bar.appendChild(p);}
    if(i<tabs.length-1){var n=document.createElement('a');n.href='#'+tabs[i+1].s.id;n.className='nx';n.textContent=tabs[i+1].a.textContent+' →';bar.appendChild(n);}
    t.s.appendChild(bar);
  });
  document.body.classList.add('tabbed');

  function topOfTabs(){var h=document.querySelector('header');return h?h.offsetTop+h.offsetHeight:0}
  function show(id,scroll){
    var hit=tabs.filter(function(t){return t.s.id===id})[0]||tabs[0];
    tabs.forEach(function(t){
      var on=t===hit;
      t.s.classList.toggle('on',on);
      t.a.classList.toggle('on',on);
      t.a.setAttribute('aria-selected',on?'true':'false');
    });
    try{hit.a.scrollIntoView({block:'nearest',inline:'nearest'})}catch(e){}
    if(scroll&&window.scrollY>topOfTabs())window.scrollTo({top:topOfTabs(),behavior:'instant'});
    return hit;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute('href').slice(1);
    if(!tabs.some(function(t){return t.s.id===id}))return;
    e.preventDefault();
    show(id,true);
    try{history.replaceState(null,'','#'+id)}catch(x){}
  });
  addEventListener('hashchange',function(){show(location.hash.slice(1),true)});
  show(location.hash.slice(1),false);
})();
