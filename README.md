# LP — Crie um Super Agente de IA · INTUS HUB

Landing page de vendas do curso **Crie um Super Agente de IA**, desenvolvida pela INTUS HUB.

---

## Stack

| Tecnologia | Detalhe |
|---|---|
| HTML5 | Entry point único (`index.html`) |
| React 18 | `react.production.min.js` **self-hosted** (`public/vendor/`), com `defer` (não bloqueia render) |
| esbuild | Pré-compila os `.jsx` → `public/js/*.min.js` (via `build.ps1`, sem Babel-no-browser) |
| CSS puro | Design tokens via variáveis CSS |
| Vídeo (VSL) | Player **Vturb/ConverteAI** (script lazy via IntersectionObserver) |
| Servidor local | PowerShell HttpListener (`serve.ps1`, serve `public/`) |
| Deploy | **Cloudflare Pages** — push na `main` dispara deploy automático (output `public/`) |

O código-fonte são os arquivos `.jsx`; o navegador carrega os bundles compilados em `js/`.
**Sempre que alterar um `.jsx`, rode `build.ps1` antes de commitar.** Edições só no bloco
`TWEAK_DEFAULTS` do `index.html` (copy, preços, toggles) **não** exigem rebuild.

---

## Estrutura de arquivos

> **O Cloudflare Pages serve a pasta `public/`** (Build output directory = `public`). Tudo que é
> servido vive em `public/`; o código-fonte (`.jsx`), build scripts e docs ficam na **raiz** e
> **não são servidos** (caem no fallback do Pages).

```
/
├── index.html            # (FONTE) editado pelo pipeline; o servido fica em public/index.html
├── app.jsx               # Componente raiz — monta todas as seções
├── sections.jsx          # Componentes de seção da LP (inclui o embed do player Vturb)
├── effects.jsx           # Hooks compartilhados: scroll reveal, parallax, cursor
├── tweaks-panel.jsx      # Painel lateral de customização visual (dev only)
├── build.ps1             # Pré-compila os .jsx → public/js/*.min.js (esbuild via npx)
├── prerender.ps1         # build + gera o shell estático no #root (LCP/SEO)
├── critical-css.ps1      # Inline do CSS above-the-fold no public/index.html
├── scripts/
│   ├── optimize-images.js # Redimensiona + converte imagens em uso para WebP (sharp)
│   ├── prerender.mjs      # Snapshot do #root via Chrome headless (puppeteer-core)
│   └── critical-css.mjs   # Extrai/inline o critical CSS
├── serve.ps1             # Servidor local PowerShell (serve public/)
├── vendor/               # react-dom-server-legacy (build-only; não servido)
├── PRD.md                # Product Requirements Document
├── DESIGN-SYSTEM.md      # Guia de design tokens e componentes
├── CLOUDFLARE-PAGES.md   # Hospedagem, headers/CSP e rollback (CF Pages)
└── public/               # ← SERVIDO pelo Cloudflare Pages (Build output directory)
    ├── index.html        # Entry point — carrega scripts, define TWEAK_DEFAULTS
    ├── styles.css        # Estilos globais + design tokens CSS
    ├── _headers          # CSP + headers de segurança (fonte da verdade ÚNICA)
    ├── js/               # Bundles compilados (gerados por build.ps1)
    ├── vendor/           # React de produção self-hosted (react / react-dom .min.js)
    ├── fonts/            # Fontes self-hosted (.woff2)
    └── img/              # Imagens (.webp em uso; hero, professor, avatares, depoimentos)
```

---

## Como rodar localmente

```powershell
# 1. Compile os bundles + gere o shell estático (rode após alterar .jsx)
powershell -ExecutionPolicy Bypass -File prerender.ps1
#    (ou só `build.ps1` se não quiser regenerar o pré-render durante o dev)

# 2. Suba o servidor estático
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Acesse: [http://localhost:3000](http://localhost:3000)

`build.ps1` usa o esbuild via `npx`; `prerender.ps1` usa puppeteer-core + o Chrome/Edge
instalado (ambos baixados sob demanda, sem instalar nada permanente).

**Antes de fazer deploy de mudanças estruturais nos `.jsx`, rode `prerender.ps1`** para
atualizar o shell estático embutido no `#root`. O React substitui esse shell ao montar
(via `createRoot`, sem hidratação), então ele serve só para o primeiro paint / LCP / SEO —
edições só de `TWEAK_DEFAULTS` não exigem regenerar.

### Otimizar imagens

Ao adicionar/trocar imagens em uso, ajuste a lista em `scripts/optimize-images.js` e rode:

```powershell
npm install --no-save sharp@0.33.5
node scripts/optimize-images.js
Remove-Item -Recurse -Force node_modules
```

Gera `.webp` redimensionados ao lado dos originais. Atualize os `src` no `sections.jsx` e rode `build.ps1`.

---

## Customização via TWEAK_DEFAULTS

Todo o conteúdo editável fica no objeto `window.TWEAK_DEFAULTS` dentro do `index.html`. Altere os valores e recarregue o browser.

```js
window.TWEAK_DEFAULTS = {
  // Identidade
  "brandName": "INTUS HUB",
  "brandTag": "Curso · Crie um Super Agente de IA",
  "accent": "#E84000",              // Cor de destaque (laranja INTUS)
  "palette": "black",               // Paleta base
  "fontDisplay": "Inter Tight",

  // Preços
  "priceNow": "87,95",              // Preço promocional (à vista)
  "priceFull": "997",               // Preço original riscado
  "priceInstallments": "6x R$16,50",
  "currency": "R$",
  "checkoutUrl": "https://lastlink.com/p/C5C385BB1/checkout-payment",

  // Copy principal
  "heroTitle": "Chega de IA genérica. *Crie um Super Agente de verdade.*",
  "heroSub": "...",
  "ctaPrimary": "Quero meu Super Agente",

  // Toggles de seção — true/false para mostrar/ocultar
  "showAnnouncement": true,
  "showNav": true,
  "showHero": true,
  "showProblem": true,
  "showModules": true,
  "showTestimonials": true,
  "showOffer": true,
  "showGuarantee": true,
  "showFaq": true,
  // ... (todos os toggles estão no index.html)
}
```

---

## Seções da página

| # | Seção | Toggle | Descrição |
|---|---|---|---|
| 1 | Announcement bar | `showAnnouncement` | Barra laranja de urgência no topo |
| 2 | Nav | `showNav` | Barra de navegação com preço + CTA |
| 3 | Hero | `showHero` | Full-bleed grid: título + foto com efeito dissolve |
| 4 | HeroPillars | — | 4 cards de diferenciais abaixo do hero |
| 5 | StatsBar | — | Contadores animados (alunos, YouTube, Instagram) |
| 6 | Problem | `showProblem` | Seção de problema e identificação |
| 7 | Agitation | `showAgitation` | Comparação antes/depois |
| 8 | Challenges | `showChallenges` | Desafios que o aluno enfrenta |
| 9 | Modules | `showModules` | Grade dos 4 módulos / 16 aulas |
| 10 | Results | `showResults` | Resultados esperados do curso |
| 11 | ProofBridge | — | Citação tipográfica de transição |
| 12 | Testimonials | `showTestimonials` | Depoimentos (Diego + Aspira + Clóvis + carrossel) |
| 13 | Marquee | `showMarquee` | Faixa animada horizontal |
| 14 | Roadmap | `showRoadmap` | Linha do tempo de evolução do agente |
| 15 | Offer | `showOffer` | Caixa de oferta com countdown timer de 59 min |
| 16 | Guarantee | `showGuarantee` | Garantia de 7 dias |
| 17 | FAQ | `showFaq` | Perguntas frequentes |
| 18 | CTA final | `showCta` | Bloco final de conversão |
| 19 | Support | `showSupport` | Link de suporte via WhatsApp |
| 20 | Footer | `showFooter` | Rodapé com links e CNPJ |

---

## Hero — estilo V1 (Gradient Dissolve)

A hero usa layout **full-bleed** (borda a borda da viewport), sem container limitando a largura.

**Estrutura JSX:**
```
<section.hero>
  └── <div.hero-bleed-grid>           ← grid 1fr 1fr, 100vw
       ├── <div.hero-content-col>     ← coluna de texto (padding fixo)
       │    └── <div.hero-content>    ← eyebrow + h1 + lead + CTA
       └── <div.hero-foto-c>          ← coluna de imagem (full-height)
            └── <img>                 ← dissolve com CSS mask dual gradient
  └── <div.container>
       ├── <ul.hero-bullets-below>    ← 4 bullets em grid 2 colunas
       └── <HeroPillars>
```

**Efeito dissolve (CSS mask):**
```css
-webkit-mask-image:
  linear-gradient(to right, transparent 0%, black 35%, black 80%, transparent 100%),
  linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
-webkit-mask-composite: source-in;
```

> Nota: `mask-composite: intersect` não funciona no Chrome. Usar `-webkit-mask-composite: source-in`.

---

## Countdown Timer

O bloco de oferta contém um timer regressivo de 59 minutos. O tempo de expiração é salvo em `sessionStorage`, ou seja: persiste se o usuário recarregar a página, mas reseta ao fechar o browser.

```js
// Chave: 'sa_offer_end' — timestamp de expiração em ms
sessionStorage.setItem('sa_offer_end', Date.now() + 59 * 60 * 1000);
```

---

## Deploy

Hospedado no **Cloudflare Pages**, conectado ao repositório GitHub:
**[github.com/INTUS-AI/LP-SUPER-AGENTE-IA-VSL](https://github.com/INTUS-AI/LP-SUPER-AGENTE-IA-VSL)**

Push na branch `main` dispara deploy automático. Não há build no servidor — o Cloudflare Pages
serve a pasta **`public/`** (estático) e faz clean URLs por padrão.

**Configuração (dashboard CF Pages):** Framework preset **None** · Build command **vazio** ·
**Build output directory `public`** · Root `/`. Headers e CSP ficam em `public/_headers`
(fonte da verdade — não há mais `vercel.json`).

> **Vercel descontinuada (19/06/2026).** Rollback agora é nativo do CF Pages
> (Deployments → *Rollback to this deployment*) ou `git revert` + push. Detalhes em
> `CLOUDFLARE-PAGES.md`.

---

## Checkout

A URL de checkout fica no `TWEAK_DEFAULTS` (`index.html`):

```js
"checkoutUrl": "https://lastlink.com/p/C5C385BB1/checkout-payment"
```

Fluxo dos botões: todos os CTAs primários apontam para `#oferta` como âncora
semântica, mas o clique é interceptado pelo componente `CheckoutRedirect`
(`sections.jsx`) e o usuário vai **direto** para o `checkoutUrl` — não há modal de
captura de dados. Para trocar o link, basta editar esse valor — é lido em runtime,
**não** exige rebuild (mas rode `prerender.ps1` se quiser o shell estático atualizado).

---

## Referências de design

| Arquivo | Descrição |
|---|---|
| `DESIGN-SYSTEM.md` | Tokens de cor, tipografia, espaçamento e componentes |
| `PRD.md` | Requisitos do produto, público-alvo e objetivos |

---

**INTUS HUB** · Curso Rápido — Crie um Super Agente de IA
