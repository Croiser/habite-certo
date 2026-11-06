const WA = '5545999960366';
const waURL = m => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
document.querySelectorAll('.wa-link').forEach(a => { a.href = waURL(a.dataset.msg || 'Olá!'); a.target = '_blank'; a.rel = 'noopener'; });
document.getElementById('y').textContent = new Date().getFullYear();

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// counters
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; co.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || ''; let t0;
  const tick = t => { t0 ??= t; const p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

// cursor glow + spotlight on service cards
const glow = document.querySelector('.cursor-glow');
const fine = matchMedia('(pointer:fine)').matches;
if (!fine) glow.style.display = 'none';
addEventListener('pointermove', e => { if (fine) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; } });
document.querySelectorAll('.svc').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

// 3D tilt hero card
const tilt = document.getElementById('tilt');
if (fine && tilt) {
  tilt.addEventListener('pointermove', e => {
    const r = tilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  tilt.addEventListener('pointerleave', () => tilt.style.transform = '');
}

// nav: close mobile menu on click
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => document.getElementById('menu').classList.remove('open')));

// quiz
const steps = [...document.querySelectorAll('.q-step')], bar = document.getElementById('qbar'), answers = [];
let i = 0;
steps.forEach((s, idx) => s.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
  answers[idx] = `${s.dataset.q}: ${b.textContent}`;
  steps[i].classList.remove('on'); i++; steps[i].classList.add('on');
  bar.style.width = (i / (steps.length - 1) * 100) + '%';
  if (i === steps.length - 1) {
    const ok = answers[1]?.includes('tudo averbado') && answers[2]?.endsWith('Sim');
    if (ok) { document.getElementById('rtitle').textContent = 'Ótimo sinal! Vale uma conferência rápida'; document.getElementById('rtext').textContent = 'Pelo que respondeu, seu imóvel parece em ordem. Envie para o engenheiro confirmar antes de vender ou financiar.'; }
    document.getElementById('qsend').href = waURL('Olá! Fiz o diagnóstico no site:\n• ' + answers.join('\n• '));
    document.getElementById('qsend').target = '_blank';
  }
})));
