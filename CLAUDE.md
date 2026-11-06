# Habite Certo — Site institucional

Site de alta conversão + SEO local para a **Habite Certo Engenharia e Regularizações** (Foz do Iguaçu - PR).
Responsável técnico: Eng. Civil Giovani. Instagram: @habite.certo. WhatsApp: +55 45 99996-0366.
No ar em https://habitecerto.dodile.com.br · Repositório: https://github.com/Croiser/habite-certo (branch `main`).

## Stack
- Gerador estático próprio: `build.mjs` (Node 22, `marked` + `gray-matter`) gera `dist/`. Comandos: `npm install`, `npm run build`.
- Home: `src/pages/home.html` + JSON-LD em `src/pages/home.ld*.json`. Partes comuns em `src/partials/` (nav, footer, bg).
- Landing pages de serviço: `content/servicos/*.md` (frontmatter: slug, title, description, h1, lead, promise, benefits, steps, faq, related, waMsg). Layout em `lp.mjs`.
- Blog: `content/blog/*.md` (frontmatter: slug, title, description, date, read, tags; `draft: true` oculta). Gera `/blog/`, posts e `/blog/feed.xml`.
- `build.mjs` também gera `sitemap.xml`, `robots.txt`, `404.html`, JSON-LD (Service, FAQPage, BlogPosting, BreadcrumbList).
- CSS/JS/imagens em `public/` (`assets/style.css`, `assets/app.js`, `og-image.png`, `favicon.svg`). `legacy/` = versão antiga de arquivo único (fora do build).
- Fontes: Montserrat (títulos) + Inter (texto). Visual: glassmorphism, azul-marinho, scroll reveal, tilt 3D, contadores.
- Atenção YAML: textos com `: ` no frontmatter precisam de aspas.

## Páginas no ar
- `/` home · `/blog/` (4 posts-modelo)
- Landing pages: `/regularizacao-de-imoveis/`, `/averbacao-de-construcao/`, `/habite-se/`, `/laudos-tecnicos/`, `/financiamento-caixa/`, `/execucao-de-obras/`, `/projetos-e-acessibilidade/` (menu enxuto, hero com cartão de diagnóstico, benefícios, 4 passos, FAQ, CTA e barra fixa de WhatsApp no celular).

## Infra (VPS Hostinger)
- VPS id `1386409` (AlmaLinux 10, IP `187.77.45.37`), compartilhada com ~15 outros apps. Não mexer nos demais projetos Docker.
- DNS: registro A `habitecerto` -> `187.77.45.37` na zona `dodile.com.br` (Hostinger DNS).
- Projeto Docker `habitecerto` (via MCP/API Hostinger): serviço `builder` (node:22-alpine) clona o GitHub, roda `npm ci` + `node build.mjs`, copia `dist/` para o volume `dist` e `nginx.conf` para o volume `conf`; serviço `site` (nginx:alpine, container `habitecerto-site`) serve o volume na porta host `3200`.
- HTTPS: Nginx Proxy Manager (`npm.dodile.com.br`) tem um Proxy Host `habitecerto.dodile.com.br` -> `http://187.77.45.37:3200` com Let's Encrypt + Force SSL (criado pelo usuário).
- Portas fora de 80/443 não são acessíveis de fora (firewall); só o NPM alcança a 3200.
- Atualizar o site: `git push` na `main` e reiniciar o projeto `habitecerto` (operação `vps_docker_restart`); o `builder` reroda e o nginx serve o conteúdo novo.
- Limites da API Hostinger: `vps_docker_create` aceita no máximo 8192 caracteres de compose e NÃO faz `docker build` (por isso o container `builder`). Não existe upload de arquivos nem exec; transcrever arquivos grandes pela conversa corrompe base64 (já causou 502).
- Nunca guardar credenciais no repositório nem em chat. A senha do NPM foi exposta na conversa e deve ser trocada.

## Identidade
- Cores: navy `#0B2545`, azul `#1E6FD9`, azul claro `#5AB0FF`, amarelo `#FFC93C`.
- Tom: técnico, educativo, confiável. Slogan: "Seu imóvel do jeito certo!" / "Regularize hoje, valorize o futuro".

## SEO
- Palavra-chave principal: "regularização de imóveis Foz do Iguaçu".
- Secundárias: averbação de construção, Habite-se Foz do Iguaçu, engenheiro civil Foz do Iguaçu, laudo técnico, financiamento CAIXA construção.
- JSON-LD: ProfessionalService/LocalBusiness + FAQPage (manter FAQ visível e schema sincronizados). Canonical/og:url já em habitecerto.dodile.com.br.

## Conversão
- Todos os CTAs usam `.wa-link` com `data-msg` (mensagem pré-preenchida do WhatsApp).
- Quiz de diagnóstico (3 perguntas) na home envia respostas no WhatsApp.

## Pendências (TODO)
- [ ] Trocar a senha do Nginx Proxy Manager (exposta em chat)
- [ ] Número do CREA real (buscar "CREA-PR 000000" em `src/pages/home.html` e `src/partials/footer.html`)
- [ ] Foto do Giovani e fotos reais de obras (hero, portfólio)
- [ ] Números reais na faixa de estatísticas (hoje: 100%, 6+, 50+, 24h são provisórios)
- [ ] Giovani revisar textos das landing pages e dos 4 posts (rascunhos sem dados inventados)
- [ ] Converter posts reais do Instagram em artigos do blog
- [ ] Google Business Profile vinculado ao site
- [ ] Enviar `sitemap.xml` ao Google Search Console
- [x] Limpar projeto `habitecerto-up` e volume `habitecerto_site` na VPS
- [x] Domínio habitecerto.dodile.com.br + DNS + HTTPS
- [x] og-image.png, sitemap.xml, robots.txt, 404
- [x] Landing pages por serviço (todas as 7 frentes) e blog com 4 posts-modelo
- [x] Repositório GitHub e deploy na VPS via container builder
