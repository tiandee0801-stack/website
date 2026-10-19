(() => {
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
 function closeMenu(){if(!toggle||!nav)return;toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav?.classList.toggle('is-open',open)});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
 document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());let timer;
 function toast(message){const el=document.querySelector('.toast');if(!el)return;el.textContent=message;clearTimeout(timer);timer=setTimeout(()=>el.textContent='',4200)}
 document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const value=b.dataset.copy;try{await navigator.clipboard.writeText(value);toast('网站链接已复制：'+value)}catch{const f=document.createElement('textarea');f.value=value;f.style.cssText='position:fixed;left:-9999px';document.body.append(f);f.select();let done=false;try{done=document.execCommand('copy')}catch{}f.remove();b.focus();toast(done?'网站链接已复制：'+value:'请手动复制网站链接：'+value)}}));
 const scenarios={task:{title:'规则先确定服务阶段',text:'用户查看当前阶段任务，按已确认的条件执行并留下记录。任务与训练卡承接具体操作，AI 辅助解释知识，不自行改变训练阶段。',route:['任务与记录','规则与条件','知识解释','阶段复盘']},knowledge:{title:'把回答限定在可追溯的知识范围',text:'问答链路设计为：识别问题 → 补全信息 → 检索知识 → 重排 → 生成回答。答复需要说明依据；未检索到可靠信息时，不补写结论。',route:['问题与上下文','知识检索','重排与生成','来源与反馈']},handoff:{title:'异常信号进入人工处理流程',text:'方案设计中，医学限制或风险信号优先触发风险提示与人工介入，进入工单和教练反馈流程。此处展示产品分工，不提供个人训练建议。',route:['输入与记录','风险规则','暂停自动建议','人工接力']}};
 document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{const d=scenarios[b.dataset.scenario];if(!d)return;document.querySelectorAll('[data-scenario]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#scenario-title').textContent=d.title;document.querySelector('#scenario-text').textContent=d.text;document.querySelectorAll('[data-route-step]').forEach((x,i)=>x.textContent=d.route[i])}));
 const sections=[...document.querySelectorAll('.case-article section[id]')];if(sections.length&&'IntersectionObserver'in window){const o=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)document.querySelectorAll('.case-toc a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-15% 0px -65% 0px'});sections.forEach(e=>o.observe(e))}
})();

// Local motion and appearance controls. All content stays readable without JS.
(() => {
 const body=document.body;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const picker=document.querySelector('.appearance-toggle');
 function applyTheme(value,save=false){
  const theme=value==='night'?'night':'day';body.dataset.theme=theme;
  if(picker){picker.textContent=theme==='night'?'日间 ☀':'夜间 ◐';picker.setAttribute('aria-pressed',String(theme==='night'));picker.setAttribute('aria-label',theme==='night'?'切换至日间模式':'切换至夜间模式')}
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='night'?'#161f19':'#f5f5ef';
  if(save)try{localStorage.setItem('dee-appearance',theme)}catch{}
 }
 let saved;try{saved=localStorage.getItem('dee-appearance')}catch{}
 applyTheme(saved||'day');
 picker?.addEventListener('click',()=>applyTheme(body.dataset.theme==='night'?'day':'night',true));
 document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target instanceof Element&&e.target.closest('input,textarea,select,[contenteditable="true"]'))return;if(e.key.toLowerCase()==='d')applyTheme('day',true);if(e.key.toLowerCase()==='n')applyTheme('night',true)});
 const selectors=['.section-heading','.featured-case','.work-card','.method-grid article','.about-photo','.about-copy','.content-item','.contact-top','.case-article section'];
 const targets=[...document.querySelectorAll(selectors.join(','))];
 if(!reduced.matches&&'IntersectionObserver'in window){
  body.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  targets.forEach((el,i)=>{el.dataset.reveal='';el.style.setProperty('--reveal-delay',Math.min(i%3,2)*70+'ms');observer.observe(el)});
  reduced.addEventListener('change',e=>{if(e.matches){body.classList.remove('motion-ready');observer.disconnect()}},{once:true});
 }
 const hero=document.querySelector('.hero');
 if(hero&&!reduced.matches&&matchMedia('(hover:hover) and (pointer:fine)').matches){let frame=0;hero.addEventListener('pointermove',e=>{if(frame)return;frame=requestAnimationFrame(()=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--pointer-x',Math.round((e.clientX-r.left)/r.width*100)+'%');hero.style.setProperty('--pointer-y',Math.round((e.clientY-r.top)/r.height*100)+'%');frame=0})},{passive:true});hero.addEventListener('pointerleave',()=>{hero.style.removeProperty('--pointer-x');hero.style.removeProperty('--pointer-y')})}
 document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{const panel=document.querySelector('.scenario-output');if(panel&&!reduced.matches){panel.classList.remove('is-changing');requestAnimationFrame(()=>{void panel.offsetWidth;panel.classList.add('is-changing')})}}));
})();
