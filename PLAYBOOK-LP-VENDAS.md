# Playbook — Otimização & Desenvolvimento de Landing Pages de Vendas

> **Última atualização:** 2026-06-11
> **Escopo:** ferramentas (plugins/MCPs) e lições técnicas reutilizáveis para futuras LPs de
> vendas estáticas/React, destiladas do trabalho nesta página (PageSpeed mobile 31 → 95).
> Histórico detalhado das mudanças desta página: ver `ALTERACOES.md`.

---

## 1. Plugins pertinentes

### 1.1 Já instalados (úteis para LP) — verificados em uso

| Plugin | Para quê serve numa LP | Quando usar |
|--------|------------------------|-------------|
| **frontend-design** | Criar/redesenhar UI com estética distintiva (evita "AI slop"). **Não é ferramenta de performance** — é de criação visual. | Nova seção/hero, redesign, prototipar variações. Princípio aproveitável em perf: *preservar o visual distintivo* ao otimizar. |
| **code-review** | Revisão multi-agente (5 agentes, score ≥80) | Antes de mergear código crítico: checkout, auth, dados, CSP |
| **feature-dev** | Exploração de codebase + arquitetura para features complexas | Mudanças que tocam vários arquivos (ex.: a migração p/ hydrateRoot) |
| **code-simplifier** (`/simplify`) | Enxugar código após implementar | Depois de uma feature, antes do commit |
| **security-guidance** | Hook automático: alerta XSS/injection/secrets ao editar | Sempre ativo (alertou sobre SRI ao add script de terceiro) |
| **commit-commands** | `/commit`, `/commit-push-pr` | Fluxo git |

### 1.2 Marketplace — eixo CONVERSÃO (comunidade, **não-verificados**)

> A performance desta página está esgotada; o próximo lever de **receita** é conversão/copy.
> Estes plugins atacam esse eixo (complementar, não substituto, do trabalho de perf).

| Plugin/Skill | O que entrega | Vale a pena? |
|--------------|---------------|--------------|
| **Page CRO** (skill) | Analisa 7 dimensões: proposta de valor, headline, CTA, hierarquia visual, prova social, **objeções**, fricção → Quick Wins + ideias de A/B test + variações de copy | **Sim**, quando o foco virar conversão. O mais relevante. |
| **marketingskills** | CRO + copywriting + SEO + growth | Sobreposto ao Page CRO |
| **webshop-ux-expert** | UX de conversão com base em dados, acessibilidade | Mais focado em e-commerce |
| landing-page-optimizer-suite | (sem doc legível na avaliação) | Não avaliável |

⚠️ **Plugins de comunidade não são verificados.** Revise o código antes de instalar.

---

## 2. MCPs pertinentes

### 2.1 Já configurados (usados nesta otimização)

| MCP | Papel na otimização de LP |
|-----|---------------------------|
| **playwright** | **O mais usado.** Medir FCP/LCP/CLS via `PerformanceObserver`, screenshot antes/depois, validar hidratação (console), testar interatividade (checkout/FAQ), inspecionar `document.fonts`, achar o elemento LCP, medir paint caro above-the-fold. |
| **context7** | Docs de libs/SDKs (React, etc.) — preferir à busca web para APIs |
| **github** | PRs, issues, busca de código |
| **sequential-thinking** | Debug com múltiplas causas / decisões arquiteturais |
| **stripe** | Integração/erros de pagamento (aqui o checkout é Lastlink/outro dev) |

### 2.2 Recomendados para ADICIONAR

| MCP | Por quê | Custo |
|-----|---------|-------|
| **PageSpeed Insights MCP** (`ruslanlap/pagespeed-insights-mcp`) | **Resolveria a dor que tivemos:** o PSI deu **429 (rate-limit) a sessão toda** e medimos por Lighthouse local na mão. Roda PSI mobile/desktop + **dados de campo CrUX** direto no Claude. | Precisa de **API key grátis** do Google (PageSpeed Insights API) — sem ela, o 429 volta. |
| **Chrome DevTools MCP** | Auditorias Lighthouse locais (lab data) sem instalar nada manualmente | Local |

⚠️ MCP roda com **acesso ao ambiente** — instale só de fontes confiáveis.

---

## 3. Lições técnicas para FUTURAS páginas (aprendidas hoje)

### 3.1 Arquitetura de render / TBT
- **NÃO use `ReactDOM.createRoot().render()` numa página pré-renderizada.** Isso **descarta o
  shell e reconstrói tudo** na main thread → TBT alto e score oscilando. Use **`hydrateRoot`**
  (reaproveita o DOM). Mediu-se **TBT 530 → 210 ms (−60%)** só com essa troca. (`ALTERACOES.md §4.8`)
- **Para hidratar limpo, o prerender precisa gerar markup com `ReactDOMServer.renderToString`**,
  **não** `innerHTML` do cliente. O `renderToString` insere os marcadores de texto entre nós
  adjacentes (ex.: `{moeda} {preço}`) que o `hydrateRoot` espera; o `innerHTML` não os tem →
  **mismatch em todo texto com múltiplas expressões** → o React desiste (`#418/#423`) e
  re-renderiza tudo (anula o ganho).
- **Render inicial determinístico**: qualquer estado que muda em `useEffect` (contadores
  `useCountUp`, countdown com `Date.now()`, contadores animados) precisa ter **valor inicial
  fixo** e/ou **não rodar no prerender** (flag `window.__PRERENDER__`), senão o snapshot
  diverge do 1º render do cliente. `suppressHydrationWarning` **não** evita o bail em produção.
- **Bug latente clássico:** `html.replace(regex, '$1' + markup + '$2')` — a string de replace
  **interpreta `$16` de um preço "R$16,50" como backreference** e corrompe o output. **Use
  função de substituição:** `replace(re, (_, p1, p2) => p1 + markup + p2)`.

### 3.2 FCP / LCP
- **Saiba QUAL é o elemento LCP.** No mobile costuma ser o **texto do título** (a imagem do
  hero fica abaixo da dobra); no desktop, a imagem. Meça com `PerformanceObserver` →
  `e.element`. A otimização certa depende disso.
- **LCP de texto travado depois do FCP = swap de fonte.** Se `LCP − FCP ≈ 1–2s` sem recurso
  bloqueante, o título está esperando a fonte (que re-renderiza no swap). **Fix: self-host a
  fonte do título + `<link rel="preload" as="font" crossorigin>`.** Tira as 2 origens de
  terceiros do Google Fonts (googleapis + gstatic) do caminho crítico. (`ALTERACOES.md §4.10`)
  - Inter Tight (e muitas Google Fonts) é **variável**: um único `.woff2` cobre todos os pesos
    (`@font-face { font-weight: 400 800 }`). Subset **latin** já cobre acentos pt-BR.
  - `@font-face` deve estar no **critical CSS inline** (o gerador mantém `@font-face`), senão o
    1º paint não conhece a fonte preloadada.
- **Imagem do hero/LCP**: `<img>` com `fetchpriority="high"` + `decoding="async"` + `width`/
  `height` (evita CLS) + `<link rel="preload" as="image">`. Antes de **reduzir dimensão**,
  cheque o DPR: celulares hiDPI (2,6–3×) precisam de fonte maior — reduzir amacia. Prefira
  **re-encodar em resolução cheia** com qualidade webp eficiente (Pillow `quality≈75`,
  PSNR ≥40 = sem perda visível). (`ALTERACOES.md §4.7`)

### 3.3 Paint caro above-the-fold
- **`filter: blur(Npx)` sobre área grande é dos paints mais caros no mobile** — entra no
  caminho do 1º paint. Troque por **`radial-gradient`** (mesmo halo, rasterização trivial).
  Tirou a página de 90 → 95. (`ALTERACOES.md §4.9`)
- **Filtros SVG** (`feGaussianBlur`, `filter="url(#…)"`) também custam; se forem identidade de
  marca e custo pequeno, mantenha (preserve o visual). Valide o trade-off com medição.

### 3.4 Recursos bloqueantes & terceiros
- **CSS não-bloqueante**: critical CSS inline (above-the-fold) + `styles.css` via
  `preload`→`onload→rel=stylesheet` + `<noscript>` fallback.
- **Google Fonts não-bloqueante**: `preload as=style` + `media="print" onload="this.media='all'"`
  + `display=swap`. (Mas para a fonte do **LCP**, self-host > não-bloqueante — ver 3.2.)
- **Scripts de terceiros (pixel, etc.)**: adie para **1ª interação OU `requestIdleCallback`**
  (com fallback `setTimeout` p/ Safari). Tira ~370 KB (ex.: fbevents.js) do caminho crítico.
- **Cada terceiro precisa de entrada na CSP** (`script-src` + `connect-src`, às vezes `img-src`).
  Loaders dinâmicos (`latest.js` da Utmify, `fbevents.js`) **não levam SRI** (`integrity`):
  o hash fixo quebraria a cada atualização do provedor.

### 3.5 Medição (não se enganar)
- **PSI tem rate-limit (429)** sem API key — tenha a key ou um **PageSpeed MCP**, ou rode
  **Lighthouse local** (`npx lighthouse@11 … --form-factor=mobile`). O score local é mais
  severo que o do PSI (CPU da máquina), mas o **diagnóstico** (fases do LCP, oportunidades) vale.
- **Oscilação de score (ex.: 80↔88) = ruído de TBT.** Rode 2–3× antes de concluir.
- **Cuidado com falsos positivos do Lighthouse**: "Enable text compression" apareceu mesmo com
  **Brotli ativo** — confirme o `Content-Encoding` real via `curl --compressed -D -`.
- **"Properly size images"** pode apontar imagens **abaixo da dobra** (não o LCP) — não confunda.

### 3.6 Build & deploy (este projeto)
- **`.jsx` são pré-compilados** por `build.ps1` → `js/*.min.js`. Editar `.jsx` exige rebuild.
  Mudou estrutura de seção → **`prerender.ps1`** (build + snapshot). Mudou CSS **above-the-fold**
  → **`critical-css.ps1`**. Ordem: `prerender.ps1` depois `critical-css.ps1`.
- **`prerender.mjs` depende de `vendor/react-dom-server-legacy.browser.production.min.js`**
  (build de DEV/prerender, commitado; não referenciado em produção).
- **Arquivos binários** (`.woff2`) commitam normalmente — o git **não** os corrompe com
  CRLF (confirme com `cmp` / `git cat-file -s` se desconfiar). Não precisa `.gitattributes`.
- **Deploy na Vercel pode demorar** (vimos de 3 a ~20 min). Valide **depois** de propagar:
  cheque um asset novo (ex.: a fonte) retornando **200** antes de declarar concluído. Use
  cache-buster (`?v=…`) ao medir; o edge serve HTML em cache (`X-Vercel-Cache: HIT`, `Age` alto).
- **Merge de PR via `gh`/API pode NÃO disparar o deploy da Vercel.** Ao mergear o PR do
  Speed Insights via `gh pr merge --squash`, o commit do merge **nunca chegou** ao deployment
  da Vercel (o webhook do GitHub App não pegou o push). Sintoma: produção fica no commit
  anterior, e `gh api repos/<r>/deployments` **não lista** o SHA do merge.
  - **Diagnóstico:** `gh api "repos/<owner>/<repo>/deployments?per_page=5" --jq '.[]|{sha:.sha[0:7],created:.created_at}'`
    — se o SHA novo não aparece, o deploy não foi acionado (≠ falhou no build).
  - **Fix:** force um novo push na `main` (qualquer commit — ex.: o próprio commit de doc/memória
    serve de retrigger; não precisa commit vazio) **ou** "Redeploy" no dashboard da Vercel.
  - **Preferir:** quando o objetivo é deployar, fazer `git push` direto (sempre dispara o webhook)
    em vez de merge via API; ou checar a lista de deployments após qualquer merge via `gh`.
- **DNS na Vercel — cluster de edge pode ficar inalcançável; escape com A record fixo.**
  A página caiu "do nada" (deploy **"Ready"**, mas **TCP 443 em timeout intermitente**): o
  CNAME (mesmo o padrão `cname.vercel-dns.com`) roteava o domínio para o cluster
  `cname.vercel-dns-017.com`, cujos IPs (`216.198.79.1`, `64.29.17.1`) estavam **mortos** —
  como o DNS devolvia 1 IP morto + 1 vivo, o navegador caía ora num ora noutro (timeout
  intermitente, difícil de diagnosticar).
  - **Diagnóstico (sequência que funcionou):** (1) `curl -w "%{http_code}"` em loop → vê
    intermitência; (2) `nslookup` em 2+ resolvers (`1.1.1.1`, `8.8.8.8`) → vê IPs diferentes/
    um morto; (3) `bash -c 'cat </dev/null >/dev/tcp/<ip>/443'` → testa cada IP; (4)
    `curl --resolve dominio:443:<ip-bom>` retorna **200 + conteúdo certo** ⇒ é DNS, não código.
    `vercel.com`/`vercel.app` carregando confirma que o edge da Vercel está no ar (problema é
    o cluster/IP do seu domínio).
  - **Fix que destravou:** trocar o registro para **`A → 76.76.21.21`** (IP anycast estável da
    Vercel, de outro cluster, que serve qualquer domínio anexado), **DNS-only / nuvem cinza**,
    TTL mínimo. O `cname.vercel-dns.com` NÃO resolveu porque continuava caindo no cluster 017.
  - **Alternativa robusta:** proxy do Cloudflare (nuvem laranja) + **SSL Full** — o Cloudflare
    alcança a Vercel mesmo em IPs que o ISP do visitante não alcança.
  - **TTL baixo** nesse registro desde o começo = correções de DNS propagam em minutos, não horas.

### 3.7 Princípios gerais (que se pagaram)
- **Valide visualmente toda mudança que toca o visual** (screenshot antes/depois) e
  **funcionalmente** o que converte (checkout, CTAs) **antes do push**.
- **Corrija a causa, não remende** (ex.: o `$` no replace, o createRoot) — mas **preserve o
  visual distintivo** e **não toque no que converte** sem validação.
- Página de vendas pública: **sem proteção de deploy/WAF**, sem prejudicar SEO/conversão.

---

*Documento vivo — atualize ao aprender novas lições em futuras LPs.*
