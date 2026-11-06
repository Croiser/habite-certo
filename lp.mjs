export function lpBody(s, { esc, waHref, related }) {
  const wa = (label, cls = 'btn btn-primary') => `<a class="${cls} wa-link" href="${waHref(s.waMsg)}" data-msg="${esc(s.waMsg)}">${label}</a>`;
  const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const faq = s.faq || [];
  return `<section class="lp-hero"><div class="wrap lp-grid">
<div>
<span class="pill"><i class="dot"></i> Atendendo Foz do Iguaçu e região</span>
<h1>${esc(s.h1)}</h1>
<p class="lead">${esc(s.lead)}</p>
<div class="ctas">${wa('Pedir diagnóstico gratuito')}<a class="btn btn-ghost" href="#como">Ver como funciona</a></div>
<ul class="lp-trust"><li>${check}Engenheiro civil com ART</li><li>${check}Diagnóstico gratuito pelo WhatsApp</li><li>${check}Atendimento direto com o engenheiro</li></ul>
</div>
<aside class="lp-card glass">
<span class="eyebrow">Comece agora</span>
<h2>${esc(s.promise)}</h2>
<p>Envie pelo WhatsApp uma foto de:</p>
<ol><li>Matrícula do imóvel</li><li>Carnê do IPTU</li></ol>
<p>O engenheiro analisa e indica o caminho certo para o seu caso, sem compromisso.</p>
${wa('Enviar pelo WhatsApp', 'btn btn-primary full')}
<small>Retorno do diagnóstico em até 24h.</small>
</aside>
</div></section>
<section class="lp-sec"><div class="wrap">
<div class="head"><span class="eyebrow">Vantagens</span><h2>O que você ganha</h2></div>
<div class="lp-benefits">${s.benefits.map((b, i) => `<article class="glass"><span class="n">${i + 1}</span><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></article>`).join('')}</div>
</div></section>
<section class="lp-sec" id="como"><div class="wrap">
<div class="head"><span class="eyebrow">Como funciona</span><h2>4 passos, acompanhados de perto</h2></div>
<div class="lp-steps">${s.steps.map((b, i) => `<div class="glass"><span class="n">${i + 1}</span><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></div>`).join('')}</div>
<div class="center">${wa('Começar pelo diagnóstico gratuito')}</div>
</div></section>
<section class="lp-sec"><div class="wrap narrow"><article class="prose glass">${s.html}</article></div></section>
${faq.length ? `<section class="lp-sec"><div class="wrap narrow"><div class="head"><span class="eyebrow">Dúvidas frequentes</span><h2>${esc(s.faqTitle || 'Perguntas frequentes')}</h2></div><div class="faq">${faq.map(f => `<details class="glass"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div></section>` : ''}
<section class="lp-sec"><div class="wrap"><div class="final glass"><h2>Vamos analisar o <span class="grad">seu caso</span>?</h2><p>Mande a matrícula e o IPTU pelo WhatsApp. O engenheiro responde com o caminho certo, sem compromisso.</p>${wa('Falar com o engenheiro')}</div></div></section>
${related.length ? `<section class="lp-sec"><div class="wrap narrow"><div class="head"><span class="eyebrow">Veja também</span><h2>Outros serviços</h2></div><div class="cards">${related.map(r => `<a class="card glass" href="/${r.slug}/"><h3>${esc(r.nav || r.h1)}</h3><p>${esc(r.description)}</p><span class="more">Saiba mais →</span></a>`).join('')}</div></div></section>` : ''}
<div class="lp-sticky">${wa('Falar no WhatsApp')}</div>`;
}
