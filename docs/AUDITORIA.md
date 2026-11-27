# Auditoria — Habite Certo (habitecerto.dodile.com.br)

Data: 27/11/2026 · Escopo: site no ar + repositório `main` (commit 37cf295) · Método: inspeção de código, cabeçalhos HTTP via `curl`, TLS via `openssl`, renderização em navegador (desktop 1280px e mobile 375px).
Prévia local das correções: branch `auditoria-preview` (não publicado, nada foi alterado em produção).

**Não medido nesta rodada:** Lighthouse/PageSpeed (CWV reais), Google Search Console, Google Business Profile, configuração interna do Nginx Proxy Manager. Nenhuma métrica de performance abaixo é inventada; onde há estimativa, está indicado.

---

## 1. Relatório executivo

| Área | Nota | Resumo |
|---|---|---|
| **Maturidade geral** | **5,5** | Base técnica boa (site estático, rápido, sem backend), mas **credibilidade comprometida por conteúdo fictício** |
| Visual | 6,0 | Moderno, porém com cara de template "glassmorphism"; logotipo do site ≠ logotipo real da marca |
| UX/UI | 6,5 | Jornada clara até o WhatsApp; quiz bom; navegação quebra em ~800px |
| Segurança | 6,5 | Superfície de ataque mínima; faltam redirecionamento HTTP→HTTPS, HSTS e CSP |
| Performance | 7,5 (estimada) | HTML 35 KB, gzip, sem framework; Google Fonts bloqueante e conteúdo oculto até o JS |
| SEO | 7,0 | Titles, canonical, sitemap, JSON-LD e LPs por serviço bem feitos; resquícios de "CAIXA" e rating sem comprovação no schema |
| Conversão | 6,5 | Muitos CTAs de WhatsApp; falta prova social real e fotos reais |

### Os 10 problemas mais importantes
1. **P0 — Depoimentos fictícios** ("Ana Silva", "Carlos Mendes", "Marta Oliveira") publicados como "Histórias reais". Risco ético (Código de Ética CONFEA), CDC (publicidade enganosa) e de reputação.
2. **P0 — Números não comprovados**: "15 anos", "500+ imóveis", "8 cidades", "desde 2011", "6 estados", "500+ regularizados" (também nas 6 LPs). Os próprios dados são contraditórios entre si.
3. **P0 — Garantia indevida**: "Seu imóvel ficará 100% regular ou você não paga". Aprovação depende da prefeitura e do cartório; não pode ser prometida.
4. **P0 — HTTP não redireciona para HTTPS** (comprovado: `curl -I http://…` → `200 OK`). Force SSL do NPM não está ativo.
5. **P1 — "Portfólio: obras e projetos entregues" mostra 5 imagens do logotipo**, não obras. Promessa visual falsa.
6. **P1 — Identidade inconsistente**: o logotipo real (serifado, casa + documento, gradiente azul-turquesa) não aparece no site; o cabeçalho usa um ícone genérico de casa.
7. **P1 — Placeholder visível** "📷 Foto do Eng. Giovani (substituir)".
8. **P1 — Financiamento CAIXA**: removido como serviço, mas continuava no marquee, meta description, keywords, schema e na descrição do blog.
9. **P1 — Promessas operacionais sem processo por trás**: "acompanha em tempo real", "parecer em até 24h" vs "7 dias para diagnóstico".
10. **P2 — Sem CSP/HSTS; `onclick` inline** no menu; conteúdo com `opacity:0` até o JavaScript rodar (sem JS = página vazia; atrasa LCP).

### Corrigir imediatamente (já aplicado na prévia, exceto onde indicado)
Itens 1, 2, 3, 5, 7, 8, 9 e 10 (código) → feitos no branch `auditoria-preview`. **Item 4 depende do NPM** (ativar "Force SSL" + "HSTS" no Proxy Host — ação do responsável pela infra).

### Pode esperar
Redesenho da identidade visual, fotos profissionais, novos conteúdos de blog, captação de leads além do WhatsApp, self-host de fontes.

### Precisa de acesso
- Painel do **Nginx Proxy Manager** (Force SSL, HSTS) — e trocar a senha exposta (pendência antiga).
- **Google Search Console** e **Google Business Profile** (indexação, avaliações reais, NAP).
- **Dados oficiais do Giovani**: anos de atuação, quantidade de imóveis, cidades atendidas, prazos reais, fotos, autorização de depoimentos.
- Arquivo vetorial do logotipo (SVG/AI) para usar no cabeçalho.

---

## 2. Auditoria visual e UX/UI

| ID | Pri | Local | Evidência | Recomendação | Esforço |
|---|---|---|---|---|---|
| V1 | P1 | Cabeçalho / favicon | Ícone de casa genérico ≠ logotipo registrado (®) da marca | Usar o logotipo oficial (versão branca/negativa no fundo escuro) | 2h com SVG |
| V2 | P1 | Portfólio | 5 JPGs = variações do logo | Ocultar até ter fotos reais (feito); depois galeria com legenda: tipo de serviço + cidade | — |
| V3 | P1 | Sobre | Placeholder de foto | Foto profissional do Giovani em obra/escritório; na prévia, logotipo provisório | 1h + sessão de fotos |
| V4 | P2 | Global | Blobs animados, brilho que segue o cursor, tilt 3D, marquee: soma de efeitos "template" | Reduzir a 1 efeito sutil; respeitar `prefers-reduced-motion` (feito) | 2h |
| V5 | P2 | Home | Seção "Engenharia de verdade, não despachante" repetida 2× | Retitulada para "Responsabilidade técnica do início ao fim" (feito) | — |
| V6 | P2 | Serviços | Numeração 01, 02, 04, 05, 06 | Corrigida para 01–05 (feito) | — |
| V7 | P2 | Nav ~800px | "Como funciona" quebra em 2 linhas, "Blog" cortado | Breakpoint do menu hambúrguer em ≤1024px | 30min |
| V8 | P3 | Diferencial | Emojis como ícones (🏗️🤝📊) | Ícones de traço consistentes (feito: cards sem emoji) | — |
| U1 | P2 | Quiz | Sem voltar/refazer | Botão "refazer" e "voltar" | 1h |
| U2 | P2 | LPs | Menu removido nas LPs → visitante não navega para outros serviços além do rodapé | Manter, mas adicionar link "Todos os serviços" no topo | 30min |

**Perfis simulados**
| Perfil | Encontra a solução? | Observação |
|---|---|---|
| Construiu sem regularizar | Sim, em 1 clique (hero → Regularização) | Bom |
| Quer vender | Sim (hero cita "vender", quiz pergunta) | Falta LP "vender imóvel irregular" |
| Financiar construção | **Parcial** | Serviço CAIXA removido; o site ainda cita bancos sem explicar o que é oferecido. Definir com o Giovani |
| Ampliou a casa | Sim (quiz "Fiz ampliação depois", LP averbação) | Falta conteúdo específico "regularizar ampliação" (oportunidade SEO) |
| Precisa de Habite-se | Sim (LP dedicada) | Bom |
| Precisa de laudo | Sim (LP dedicada) | Bom |

---

## 3. Segurança da aplicação

Arquitetura: HTML estático (nginx:alpine) atrás do Nginx Proxy Manager (OpenResty). Sem formulários, banco, login, cookies ou API própria. Toda conversão sai para `wa.me`. **Superfície de ataque muito baixa.**

| Item | Status | Classificação |
|---|---|---|
| Certificado TLS | Let's Encrypt, válido até 04/02/2027 | OK (comprovado) |
| HTTP→HTTPS | `http://` responde **200** com o site | **Vulnerabilidade comprovada (P0)** — ativar Force SSL no NPM |
| HSTS | Ausente | Comprovado (P1) — ativar no NPM; adicionado também no `nginx.conf` |
| CSP | Ausente | Comprovado (P2) — política adicionada no `nginx.conf` (prévia); `onclick` inline removido para permitir `script-src 'self'` |
| X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy | Presentes | OK |
| Herança de cabeçalhos | `location /assets/` usa `add_header` → no nginx isso **anula** os cabeçalhos do `server{}` para CSS/JS/imagens | Indício (P3) — corrigido usando só `expires` |
| `server_tokens` | Nginx interno expõe versão | Risco baixo — `server_tokens off` (feito) |
| Arquivos sensíveis | `/.git/config`, `/package.json` → 404 | OK |
| Cookies | Nenhum | N/A |
| XSS | Conteúdo estático; `build.mjs` escapa textos com `esc()`; Markdown dos posts é confiável (repo) | Risco potencial baixo |
| CSRF / injeção / APIs / rate limiting | Não há endpoints | N/A |
| Dependências | `marked 12.0.2`, `gray-matter 4.0.3` — só em build, não vão ao navegador | Risco baixo; rodar `npm audit` periodicamente |
| Credenciais | Senha do NPM exposta em conversa anterior | **Risco comprovado** — trocar (pendência no CLAUDE.md) |
| Backups | Repositório GitHub = fonte; dist é reconstruído | OK; backup do volume NPM não verificável |
| Integrações | Google Fonts (terceiro, coleta IP do visitante) | LGPD: considerar self-host das fontes |

---

## 4. Performance e SEO

**Performance** (sem Lighthouse nesta rodada — medir antes/depois):
- HTML home 34,6 KB (gzip ativo), CSS 1 arquivo, JS 54 linhas `defer`. Cache 7 dias em assets. ✅
- Google Fonts com 2 famílias/7 pesos: render-blocking e terceiro → self-host 2–3 pesos em WOFF2 com `preload`.
- `.reveal{opacity:0}`: conteúdo acima da dobra fica invisível até o JS → risco para LCP. Recomendação: não aplicar `reveal` no hero.
- Imagens: 5 JPGs de 1600×1600 px (77–136 KB) para exibir a 200 px de altura → quando houver fotos reais, usar WebP/AVIF com `srcset` e `loading="lazy"`.
- Console: sem erros (verificado).

**SEO**
| Item | Status |
|---|---|
| Title/description/canonical/OG | ✅ em todas as páginas |
| Sitemap (12 URLs) e robots.txt | ✅ |
| LPs por serviço com FAQ + schema | ✅ ponto forte |
| "Financiamento CAIXA" em meta/keywords/schema | Corrigido na prévia |
| `aggregateRating` 5.0/8 no schema da própria empresa | ⚠️ O Google não exibe estrelas para avaliações autodeclaradas de LocalBusiness e pode considerar marcação enganosa → remover ou garantir que bata com o GBP |
| Domínio `habitecerto.dodile.com.br` (subdomínio de terceiro) | ⚠️ Limita autoridade e confiança → registrar domínio próprio (ex.: habitecerto.eng.br) e redirecionar 301 |
| Search Console / GBP | Não verificável |
| Oportunidades de conteúdo | "regularizar ampliação de casa", "como regularizar casa sem habite-se", "engenheiro para regularização de imóvel Foz", "quanto custa averbação em Foz" |

---

## 5. Matriz de riscos

| # | Risco | Prob. | Impacto | Pri | Status |
|---|---|---|---|---|---|
| R1 | Depoimentos fictícios | Certa | Alto (ético/legal/reputação) | P0 | Corrigido na prévia |
| R2 | Números e garantia sem comprovação | Certa | Alto | P0 | Corrigido na prévia |
| R3 | HTTP sem redirecionamento | Certa | Médio | P0 | **Depende do NPM** |
| R4 | Senha NPM exposta | Alta | Alto (afeta ~15 apps na VPS) | P0 | **Pendente** |
| R5 | Portfólio falso / placeholder | Certa | Médio | P1 | Corrigido na prévia |
| R6 | Sem CSP/HSTS | Média | Baixo | P2 | Prévia (nginx.conf) + NPM |
| R7 | Rating no schema | Média | Baixo | P2 | Pendente decisão |
| R8 | Subdomínio de terceiro | Certa | Médio (SEO/confiança) | P2 | Pendente |

---

## 6. Plano de profissionalização
1. **Verdade antes de estética**: só publicar fatos validados pelo Giovani (registro, ART, avaliações reais do Google). Cada número precisa de fonte.
2. **Prova social real**: incorporar avaliações do Google com nome abreviado e autorização; 3–6 casos reais (antes/depois, cidade, tipo de serviço, sem dados pessoais do cliente).
3. **Fotos reais**: Giovani em obra com EPI, vistoria, prancheta/projeto, fachadas entregues.
4. **Marca única**: logotipo oficial em todo lugar; paleta derivada do logo.
5. **Infra**: Force SSL + HSTS no NPM; domínio próprio; trocar senha do NPM.
6. **Leads**: além do WhatsApp, formulário curto opcional (nome, cidade, tipo de serviço) enviando para e-mail — só se houver política de privacidade (LGPD).

## 7. Proposta de nova identidade visual
- **Base**: o logotipo registrado (serifa "Habite" + "Certo" em gradiente azul→turquesa, casa sobre documento).
- **Paleta**: grafite-petróleo `#13272F` (texto/fundo escuro), azul `#2F6BB5`, turquesa `#0FB5AE`, off-white `#F7F7F5`, amarelo `#FFC93C` só para CTA. Reduzir o navy saturado e o "glass" translúcido.
- **Tipografia**: títulos em serifa de alto contraste (coerente com o logo, ex.: Fraunces ou DM Serif Display), texto em Inter. Fim do CAIXA ALTA em todos os H1/H2.
- **Linguagem gráfica**: linhas de cota, malha de prancheta sutil, carimbo/selo "ART"; fotos reais em vez de ilustrações; seções alternando fundo claro e escuro (mais "escritório de engenharia", menos "app").
- **Movimento**: apenas fade-in curto; remover cursor-glow, tilt e blobs.

## 8. Roadmap técnico
| Fase | Itens | Dependência | Esforço |
|---|---|---|---|
| 0 (hoje) | Revisar e publicar `auditoria-preview`; Force SSL + HSTS no NPM; trocar senha NPM | Aprovação | 1h |
| 1 (1 semana) | Dados oficiais do Giovani → faixa de números; avaliações reais; foto | Cliente | 4h |
| 2 (2 semanas) | Logotipo SVG no header/favicon/og-image; breakpoint do menu; quiz voltar/refazer; hero sem `reveal` | SVG do logo | 6h |
| 3 (1 mês) | Nova identidade (paleta/tipografia/fotos); fontes self-hosted; domínio próprio + 301 | Fotos, domínio | 2–3 dias |
| 4 (contínuo) | Search Console, GBP, 2 posts/mês, LPs "ampliação" e "vender imóvel irregular" | Acessos | contínuo |

## 9. Checklist de homologação
- [ ] Nenhum depoimento, número, prazo ou garantia sem validação escrita do Giovani
- [ ] `curl -I http://habitecerto.dodile.com.br` → 301 para https
- [ ] Cabeçalhos presentes: `Strict-Transport-Security`, `Content-Security-Policy` (verificar em securityheaders.com: nota ≥ A)
- [ ] Console sem erros e sem violações de CSP em todas as 12 páginas
- [ ] Todos os botões de WhatsApp abrem `wa.me/5545999960366` com a mensagem correta
- [ ] Quiz: 3 respostas → mensagem com as 3 respostas no WhatsApp
- [ ] Menu mobile abre/fecha e `aria-expanded` alterna
- [ ] Layout ok em 375px, 768px, 1024px e 1440px
- [ ] Lighthouse mobile: Performance ≥ 90, Acessibilidade ≥ 95, SEO = 100
- [ ] Rich Results Test sem erros no JSON-LD; FAQ visível = FAQ do schema
- [ ] Nenhuma menção a "Financiamento CAIXA" como serviço
- [ ] Sitemap enviado ao Search Console

---

## Alterações feitas na prévia (`auditoria-preview`)
- `src/pages/home.html`: depoimentos fictícios → bloco de avaliações reais do Google; números → credenciais verificáveis; portfólio de logos oculto; placeholder de foto → logotipo oficial; seção duplicada reescrita sem "resultado garantido/tempo real/desde 2011/6 estados"; marquee sem CAIXA; numeração 01–05; nome completo do RT.
- `src/pages/home.ld1.json`: removida oferta CAIXA; fundador com nome completo e CREA.
- `lp.mjs`: selo "500+ regularizados" → "ART em todo serviço"; "retorno em 24h" → "diagnóstico gratuito".
- `build.mjs`: CAIXA removido de description/keywords da home e do blog.
- `src/partials/nav.html` + `public/assets/app.js`: menu sem `onclick` inline, com `aria-expanded`; efeitos respeitam `prefers-reduced-motion`.
- `public/assets/style.css`: estilos dos novos blocos + `prefers-reduced-motion` completo.
- `nginx.conf`: HSTS, CSP, X-Frame-Options, Permissions-Policy, `server_tokens off`, correção da herança de `add_header`.
