# Habite Certo — Site institucional

Site de alta conversão + SEO local para a **Habite Certo Engenharia e Regularizações** (Foz do Iguaçu - PR).
Responsável técnico: Eng. Civil Giovani. Instagram: @habite.certo. WhatsApp: +55 45 99996-0366.

## Stack
- Gerador estático próprio (`build.mjs`, Node + marked + gray-matter) -> `dist/`. Home em `src/pages/home.html`; landing pages de serviço em `content/servicos/*.md` (layout em `lp.mjs`); blog em `content/blog/*.md` (`draft: true` oculta o post).
- CSS/JS em `public/assets/`. `legacy/` guarda a versão de arquivo único (não usada no build).
- Deploy: `Dockerfile` (build + nginx) e `docker-compose.yml` (build direto do GitHub, porta 3200 na VPS, atrás do Nginx Proxy Manager).
- Comandos: `npm install` e `npm run build`.
- Fontes: Montserrat (títulos) + Inter (texto) via Google Fonts.
- Visual: glassmorphism, fundo escuro azul-marinho, efeitos de scroll, tilt 3D, contadores.

## Identidade
- Cores: navy `#0B2545`, azul `#1E6FD9`, azul claro `#5AB0FF`, amarelo `#FFC93C`.
- Tom: técnico, educativo, confiável. Slogan: "Seu imóvel do jeito certo!" / "Regularize hoje, valorize o futuro".

## SEO
- Palavra-chave principal: "regularização de imóveis Foz do Iguaçu".
- Secundárias: averbação de construção, Habite-se Foz do Iguaçu, engenheiro civil Foz do Iguaçu, laudo técnico, financiamento CAIXA construção.
- JSON-LD: ProfessionalService/LocalBusiness + FAQPage (manter FAQ visível e schema sincronizados).

## Conversão
- Todos os CTAs usam `.wa-link` com `data-msg` (mensagem pré-preenchida do WhatsApp).
- Quiz de diagnóstico (3 perguntas) envia respostas no WhatsApp.

## Pendências (TODO)
- [ ] Número do CREA real (buscar "CREA-PR 000000")
- [x] Domínio: habitecerto.dodile.com.br
- [ ] Foto do Giovani e fotos reais de obras (hero, portfólio)
- [ ] Números reais na faixa de estatísticas
- [x] og-image.png (public/og-image.png)
- [x] Landing pages por serviço (rascunho de texto para revisão do Giovani)
- [ ] Blog: 4 posts-modelo criados; converter posts reais do Instagram
- [x] sitemap.xml e robots.txt (gerados no build)
- [ ] Google Business Profile vinculado
