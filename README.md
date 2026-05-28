# LP — Crie um Super Agente de IA · INTUS HUB

Landing page de vendas do curso **Crie um Super Agente de IA**, desenvolvida pela INTUS HUB.

---

## Stack

| Tecnologia | Detalhe |
|---|---|
| HTML5 | Entry point único (`index.html`) |
| React 18 | Carregado via CDN (sem build step) |
| Babel Standalone | Transpila JSX direto no browser |
| CSS puro | Design tokens via variáveis CSS |
| Servidor local | PowerShell HttpListener (`serve.ps1`) |
| Deploy | Vercel — push na `main` dispara deploy automático |

Não existe `node_modules`, `package.json` nem processo de build. Qualquer editor de texto funciona.

---

## Estrutura de arquivos

```
/
├── index.html            # Entry point — carrega scripts, define TWEAK_DEFAULTS
├── app.jsx               # Componente raiz — monta todas as seções
├── sections.jsx          # Todos os componentes de seção da LP
├── effects.jsx           # Hooks compartilhados: scroll reveal, parallax, cursor
├── tweaks-panel.jsx      # Painel lateral de customização visual (dev only)
├── styles.css            # Estilos globais + design tokens CSS
├── serve.ps1             # Servidor local PowerShell
├── vercel.json           # Configuração de deploy Vercel
├── hero-variacoes.html   # Arquivo de referência — 5 variações de hero testadas
├── PRD.md                # Product Requirements Document
├── DESIGN-SYSTEM.md      # Guia de design tokens e componentes
└── img/
    ├── heeerochat01.png  # Imagem principal da hero (celular + Diego)
    ├── diego.png         # Foto do professor Diego Spanevello
    ├── aspira.png        # Avatar do agente Aspira
    ├── clovis.png        # Avatar do agente Clóvis
    ├── denys.jpg         # Depoimento — Denys Buso
    ├── arcanjo.jpg       # Depoimento — Arcanjo
    ├── natanael.jpg      # Depoimento — Natanael
    └── ...               # Variações de foto do Diego usadas em testes
```

---

## Como rodar localmente

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Acesse: [http://localhost:3000](http://localhost:3000)

O servidor serve os arquivos estáticos na porta 3000. Não precisa instalar nada.

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
  "priceNow": "87,90",              // Preço promocional
  "priceFull": "997",               // Preço original riscado
  "priceInstallments": "6x R$16,50",
  "currency": "R$",
  "checkoutUrl": "https://pay.hotmart.com/COLOQUE-AQUI",

  // Copy principal
  "heroTitle": "Chega de IA genérica. *Crie um Super Agente de verdade.*",
  "heroSub": "...",
  "ctaPrimary": "Quero meu Super Agente",

  // Toggles de seção — true/false para mostrar/ocultar
  "showAnnouncement": true,
  "showNav": true,
  "showHero": true,
  "showVideo": false,
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
| 15 | Founders | `showFounders` | Seção do professor |
| 16 | Offer | `showOffer` | Caixa de oferta com countdown timer de 59 min |
| 17 | Order Bump | `showOrderBump` | Oferta adicional (desativado por padrão) |
| 18 | Guarantee | `showGuarantee` | Garantia de 7 dias |
| 19 | FAQ | `showFaq` | Perguntas frequentes |
| 20 | CTA final | `showCta` | Bloco final de conversão |
| 21 | Support | `showSupport` | Link de suporte via WhatsApp |
| 22 | Footer | `showFooter` | Rodapé com links e CNPJ |

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

Conectado ao Vercel via repositório GitHub:
**[github.com/INTUS-AI/LP-Crie-um-Super-Agente-de-IA](https://github.com/INTUS-AI/LP-Crie-um-Super-Agente-de-IA)**

Push na branch `main` dispara deploy automático. Não precisa de build command — o Vercel serve os arquivos estáticos diretamente.

**Configuração (`vercel.json`):**
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Checkout

Substituir a URL de checkout no `TWEAK_DEFAULTS`:

```js
"checkoutUrl": "https://pay.hotmart.com/SEU-LINK-AQUI"
```

Todos os botões CTA da página apontam para `#oferta` (âncora interna) ou para o `checkoutUrl` diretamente no bloco de oferta.

---

## Referências de design

| Arquivo | Descrição |
|---|---|
| `hero-variacoes.html` | 5 variações de hero testadas (V1 a V5) — V1 foi a escolhida |
| `DESIGN-SYSTEM.md` | Tokens de cor, tipografia, espaçamento e componentes |
| `PRD.md` | Requisitos do produto, público-alvo e objetivos |

---

**INTUS HUB** · Curso Rápido — Crie um Super Agente de IA
