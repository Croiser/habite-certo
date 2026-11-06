import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { lpBody } from './lp.mjs';

const SITE = 'https://habitecerto.dodile.com.br';
const WA = '5545999960366';
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');
const rd = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (rel, data) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
};
const waHref = m => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const fmtDate = d => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });

const bg = rd('src/partials/bg.html');
const nav = rd('src/partials/nav.html');
const footer = rd('src/partials/footer.html');
const brand = nav.match(/<a href="\/" class="brand".*?<\/a>/s)[0];
const lpNav = `<header class="nav"><div class="wrap"><nav class="bar glass" aria-label="Principal">${brand}<a class="btn btn-primary btn-sm wa-link" href="${waHref('Olá! Vim pela página do site e quero um diagnóstico gratuito.')}" data-msg="Olá! Vim pela página do site e quero um diagnóstico gratuito.">Falar no WhatsApp</a></nav></div></header>`;

function layout({ title, description, urlPath, body, ld = [], keywords, ogType = 'website', lp = false }) {
  const url = SITE + urlPath;
  const ldTags = ld.map(j => `<script type="application/ld+json">\n${typeof j === 'string' ? j : JSON.stringify(j)}\n</script>`).join('\n');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">\n` : ''}<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="BR-PR">
<meta name="geo.placename" content="Foz do Iguaçu">
<meta name="theme-color" content="#0B2545">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Habite Certo Engenharia">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/og-image.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="Blog Habite Certo" href="/blog/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
${ldTags}
</head>
<body>

${bg}

${lp ? lpNav : nav}

<main>
${body}
</main>

${footer}
<script src="/assets/app.js" defer></script>
</body>
</html>
`;
}

const breadcrumbLd = items => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: SITE + it[1] })),
});
const faqLd = faq => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
const crumbs = items => `<nav class="crumbs" aria-label="Você está em">${items.map((it, i) => (i < items.length - 1 ? `<a href="${it[1]}">${esc(it[0])}</a>` : `<span>${esc(it[0])}</span>`)).join(' <i>/</i> ')}</nav>`;
const cta = (h, p, msg, label = 'Falar com o engenheiro') => `<section><div class="wrap"><div class="final glass"><h2>${h}</h2><p>${p}</p><a class="btn btn-primary wa-link" href="${waHref(msg)}" data-msg="${esc(msg)}">${label}</a></div></div></section>`;
const readDir = d => fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.md')).map(f => {
  const { data, content } = matter(rd(d, f));
  return { ...data, html: marked.parse(content), file: f };
});

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });
const urls = [];
const today = new Date().toISOString().slice(0, 10);

// HOME
{
  const home = rd('src/pages/home.html');
  write('index.html', layout({
    title: 'Regularização de Imóveis em Foz do Iguaçu | Habite Certo Engenharia',
    description: 'Regularização de imóveis, averbação de construção, Habite-se, laudos e obras com financiamento CAIXA em Foz do Iguaçu e região. Engenheiro civil responsável. Diagnóstico gratuito pelo WhatsApp.',
    keywords: 'regularização de imóveis Foz do Iguaçu, averbação de construção, habite-se Foz do Iguaçu, engenheiro civil Foz do Iguaçu, laudo técnico, financiamento CAIXA construção',
    urlPath: '/', body: home, ld: [rd('src/pages/home.ld1.json'), rd('src/pages/home.ld2.json')],
  }));
  urls.push(['/', today, '1.0']);
}

// SERVIÇOS
const servicos = readDir('content/servicos').sort((a, b) => a.order - b.order);
for (const s of servicos) {
  const p = `/${s.slug}/`;
  const trail = [['Início', '/'], [s.nav || s.h1, p]];
  const faq = s.faq || [];
  const related = (s.related || []).map(r => servicos.find(x => x.slug === r)).filter(Boolean);
  const body = lpBody(s, { esc, waHref, related });
  write(`${s.slug}/index.html`, layout({
    title: s.title, description: s.description, keywords: s.keywords, urlPath: p, body, lp: true,
    ld: [breadcrumbLd(trail), { '@context': 'https://schema.org', '@type': 'Service', name: s.h1, description: s.description, areaServed: 'Foz do Iguaçu, PR', provider: { '@type': 'ProfessionalService', name: 'Habite Certo Engenharia e Regularizações', url: SITE + '/', telephone: '+55-45-99996-0366' } }, ...(faq.length ? [faqLd(faq)] : [])],
  }));
  urls.push([p, today, '0.9']);
}

// BLOG
const posts = readDir('content/blog').filter(p => !p.draft).sort((a, b) => new Date(b.date) - new Date(a.date));
for (const [i, post] of posts.entries()) {
  const p = `/blog/${post.slug}/`;
  const trail = [['Início', '/'], ['Blog', '/blog/'], [post.title, p]];
  const more = posts.filter(x => x.slug !== post.slug).slice(0, 2);
  const msg = post.waMsg || `Olá! Li o artigo "${post.title}" e quero tirar uma dúvida sobre meu imóvel.`;
  const body = `<section class="page-hero"><div class="wrap narrow">
${crumbs(trail)}
<span class="eyebrow">${esc((post.tags && post.tags[0]) || 'Artigo')}</span>
<h1>${esc(post.title)}</h1>
<p class="meta">Por Eng. Civil Giovani · <time datetime="${new Date(post.date).toISOString().slice(0, 10)}">${fmtDate(post.date)}</time> · ${post.read || 4} min de leitura</p>
</div></section>
<section class="page-body"><div class="wrap narrow"><article class="prose glass">${post.html}</article></div></section>
${more.length ? `<section class="page-body"><div class="wrap narrow"><div class="head"><h2>Continue lendo</h2></div><div class="cards">${more.map(r => `<a class="card glass" href="/blog/${r.slug}/"><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><span class="more">Ler artigo →</span></a>`).join('')}</div></div></section>` : ''}
${cta('Seu imóvel está regular?', 'Mande a matrícula ou o IPTU pelo WhatsApp e receba uma orientação do engenheiro, sem compromisso.', msg)}`;
  write(`blog/${post.slug}/index.html`, layout({
    title: `${post.title} | Habite Certo`, description: post.description, urlPath: p, body, ogType: 'article',
    ld: [breadcrumbLd(trail), { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: new Date(post.date).toISOString(), dateModified: new Date(post.updated || post.date).toISOString(), mainEntityOfPage: SITE + p, image: SITE + '/og-image.png', author: { '@type': 'Person', name: 'Giovani', jobTitle: 'Engenheiro Civil' }, publisher: { '@type': 'Organization', name: 'Habite Certo Engenharia e Regularizações', url: SITE + '/' } }],
  }));
  urls.push([p, new Date(post.updated || post.date).toISOString().slice(0, 10), '0.7']);
}
{
  const trail = [['Início', '/'], ['Blog', '/blog/']];
  const body = `<section class="page-hero"><div class="wrap narrow">
${crumbs(trail)}
<span class="eyebrow">Blog</span>
<h1>Regularização de imóveis explicada com clareza</h1>
<p class="lead">Guias práticos do engenheiro civil Giovani sobre averbação, Habite-se, laudos, financiamento e documentação de imóveis em Foz do Iguaçu e região.</p>
</div></section>
<section class="page-body"><div class="wrap narrow"><div class="cards one">${posts.map(r => `<a class="card glass" href="/blog/${r.slug}/"><span class="tagline">${esc((r.tags && r.tags[0]) || 'Artigo')} · ${fmtDate(r.date)}</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><span class="more">Ler artigo →</span></a>`).join('')}</div></div></section>
${cta('Ficou com dúvida?', 'Fale direto com o engenheiro pelo WhatsApp e tire a sua dúvida sobre regularização.', 'Olá! Vim pelo blog e tenho uma dúvida sobre regularização de imóvel.')}`;
  write('blog/index.html', layout({ title: 'Blog sobre Regularização de Imóveis em Foz do Iguaçu | Habite Certo', description: 'Artigos sobre regularização de imóveis, averbação, Habite-se, laudos técnicos e financiamento CAIXA, escritos por engenheiro civil de Foz do Iguaçu.', urlPath: '/blog/', body, ld: [breadcrumbLd(trail)] }));
  urls.push(['/blog/', today, '0.8']);
  const items = posts.map(r => `<item><title>${esc(r.title)}</title><link>${SITE}/blog/${r.slug}/</link><guid>${SITE}/blog/${r.slug}/</guid><pubDate>${new Date(r.date).toUTCString()}</pubDate><description>${esc(r.description)}</description></item>`).join('');
  write('blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Blog Habite Certo</title><link>${SITE}/blog/</link><description>Regularização de imóveis em Foz do Iguaçu</description><language>pt-BR</language>${items}</channel></rss>`);
}

// 404, sitemap, robots
write('404.html', layout({ title: 'Página não encontrada | Habite Certo', description: 'Página não encontrada.', urlPath: '/404.html', body: `<section class="page-hero"><div class="wrap narrow"><h1>Página não encontrada</h1><p class="lead">O endereço que você tentou abrir não existe mais ou mudou de lugar.</p><div class="ctas"><a class="btn btn-primary" href="/">Voltar ao início</a><a class="btn btn-ghost" href="/blog/">Ver o blog</a></div></div></section>` }).replace('index, follow', 'noindex'));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u[0]}</loc><lastmod>${u[1]}</lastmod><priority>${u[2]}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`ok: ${urls.length} páginas (${servicos.length} serviços, ${posts.length} posts)`);
