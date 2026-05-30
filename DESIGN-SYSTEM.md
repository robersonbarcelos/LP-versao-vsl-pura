# DESIGN SYSTEM — Crie um Super Agente de IA
**Produto:** Curso low-ticket · INTUS HUB  
**URL produção:** https://superagente.intushub.com.br  
**Stack:** React 18 (produção, self-hosted) · JSX pré-compilado com esbuild · shell pré-renderizado · CSS custom properties · Vercel  
**Build:** `build.ps1` (esbuild) e `prerender.ps1` — ver `ALTERACOES.md` (Guia para desenvolvedores)  
**Última atualização:** 2026-05-29

---

## ÍNDICE

1. [Identidade do produto](#1-identidade-do-produto)
2. [Paleta de cores](#2-paleta-de-cores)
3. [Tipografia](#3-tipografia)
4. [Espaçamento e raios](#4-espaçamento-e-raios)
5. [Botões](#5-botões)
6. [Componentes de seção](#6-componentes-de-seção)
7. [Animações e efeitos](#7-animações-e-efeitos)
8. [Estrutura de copy (AIDA)](#8-estrutura-de-copy-aida)
9. [Preços e oferta](#9-preços-e-oferta)
10. [Arquitetura de arquivos](#10-arquitetura-de-arquivos)

---

## 1. IDENTIDADE DO PRODUTO

| Propriedade | Valor |
|---|---|
| **Nome do produto** | Crie um Super Agente de IA |
| **Marca** | INTUS HUB |
| **Fundador** | Diego Spanevello |
| **Agentes reais de prova** | Aspira (operação) · Clóvis (estrutura) |
| **Posicionamento** | Curso prático low-ticket — do zero ao agente operando no celular |
| **Promessa principal** | A primeira versão do seu agente no ar rápido, sem saber programar — e a estrutura para evoluir |
| **Diferencial** | Um agente com identidade, memória persistente e contexto real — não 50 genéricos |

---

## 2. PALETA DE CORES

### Tokens CSS (`:root`)

```css
/* Accent principal — laranja */
--accent:   #E84000   /* usado em CTAs, destaques, itálicos, bordas ativas */
--accent-2: #FF7A33   /* hover e variações mais claras */
--accent-ink: #ffffff /* texto sobre fundo accent */

/* Fundos — preto puro (palette: black) */
--bg:   #0a0a0a   /* fundo principal */
--bg-2: #131313   /* cards, seções alternadas */
--bg-3: #1c1c1c   /* elementos elevados, col negativa */

/* Texto */
--ink:   #fafafa              /* texto primário */
--ink-2: rgba(250,250,250,.72) /* texto secundário / corpo */
--ink-3: rgba(250,250,250,.48) /* texto terciário / meta */

/* Linhas */
--line:   rgba(250,250,250,.10) /* bordas */
--line-2: rgba(250,250,250,.06) /* separadores sutis */
```

### Gradiente do botão primário

```css
background: radial-gradient(
  67.54% 100.03% at 50% 0%,
  #FF6020 0%,
  #E84000 25%,
  #C03000 62%,
  #8C2000 100%
);
```

### Paletas alternativas (data-palette)

| Palette | --bg | --bg-2 | --bg-3 |
|---|---|---|---|
| `black` *(padrão)* | `#0a0a0a` | `#131313` | `#1c1c1c` |
| `navy` | `#0a1525` | `#0f1d33` | `#15263f` |
| `forest` | `#0c1410` | `#13201a` | `#1a2b22` |

### Regras de uso

- Fundo **sempre escuro** — jamais branco
- Accent `#E84000` em CTAs, eyebrows, `<em>` nos títulos, ícones ativos
- Texto sobre accent sempre `#ffffff`
- Glow boxes: `color-mix(in oklab, var(--accent) 8–22%, transparent)`

---

## 3. TIPOGRAFIA

### Fontes carregadas

```html
<link href="https://fonts.googleapis.com/css2?
  family=Inter+Tight:wght@400;500;600;700;800
  &family=JetBrains+Mono:wght@400;500;700
  &family=Instrument+Serif:ital@0;1
  &display=swap" rel="stylesheet">
```

### Tokens

| Token | Fonte | Uso |
|---|---|---|
| `--f-display` | Inter Tight | Headlines, h1–h4, botões grandes |
| `--f-body` | Inter Tight | Corpo, parágrafos, leads |
| `--f-mono` | JetBrains Mono | Eyebrows, tags, labels técnicos, nav price |
| `--f-serif` | Instrument Serif | Disponível, não usado no padrão atual |

### Escala tipográfica

| Classe | Tamanho | Peso | Uso |
|---|---|---|---|
| `.h1` | `clamp(44px, 8vw, 108px)` | 800 | Hero title |
| `.h2` | `clamp(34px, 5.5vw, 76px)` | 800 | Section headlines |
| `.h3` | `clamp(22px, 2.8vw, 36px)` | 700 | Sub-seções, cards de destaque |
| `.h4` | `clamp(18px, 2vw, 24px)` | 700 | Títulos de cards |
| `.lead` | `clamp(16px, 1.45vw, 19px)` | 400 | Parágrafos introdutórios |
| `.eyebrow` | `11px` | 500 | Badge pulsante no topo de seção |
| `.section-eyebrow` | `11.5px` | 500 | Label simples antes do h2 |

### Itálico destacado

Todo `<em>` dentro de `.h-display` recebe:

```css
.h-display em {
  font-style: italic;
  font-weight: inherit;
  color: var(--accent); /* #E84000 */
}
```

### Letter-spacing padrão

| Contexto | Valor |
|---|---|
| Headlines display | `-0.03em` |
| Botão big | `-0.005em` |
| Eyebrow / mono | `+0.14em` |
| Label DIAS (selo) | `+3px` |

---

## 4. ESPAÇAMENTO E RAIOS

```css
--r-sm: 8px   /* inputs, badges pequenos */
--r:    14px  /* cards padrão */
--r-lg: 22px  /* cards grandes, tabelas */
--r-xl: 28px  /* modais, blocos hero */

--pad-section: clamp(80px, 10vw, 144px) /* padding vertical das seções */
--container:   1240px                   /* largura máxima do content */
```

| Density | pad-section |
|---|---|
| `compact` | `clamp(56px, 8vw, 96px)` |
| `regular` *(padrão)* | `clamp(80px, 10vw, 144px)` |
| `comfy` | `clamp(96px, 12vw, 180px)` |

---

## 5. BOTÕES

### Botão Primário `.btn-primary`

```
Estilo: MVM — radial gradient + sweep de luz + círculo com seta deslizante
```

#### Estados

| Estado | Efeito |
|---|---|
| Default | Gradiente radial laranja · glow duplo |
| Hover (todos) | `filter: brightness(1.15)` · shadow ampliado |
| Hover (big) | Padding muda · ícone desliza da esquerda para direita |
| Active | `scale(0.98)` via `:active` |

#### Variante Big `.btn-primary.btn-big`

```css
/* Default */
padding: 20px 44px 20px 58px;

/* Ícone (::after) — círculo branco com seta */
left: 16px; width: 28px; height: 28px;
background: rgba(255,255,255,.92);
border-radius: 50%;
color: #C03000;

/* Hover */
padding: 20px 58px 20px 44px;
left: calc(100% - 44px); width: 32px; height: 32px;
```

#### Sweep de luz (::before)

```css
animation: btn-sweep 2.6s linear infinite;
/* 0% opacidade → 50% pico 0.30 → 100% opacidade zero */
/* Traversa da left:-20% até left:110% */
mix-blend-mode: plus-lighter;
```

#### Botão WhatsApp `.btn-wa`

```css
background: #25D366;
color: #fff;
/* Mesmo shape big, ícone SVG do WA à esquerda */
```

### Botão Ghost `.btn-ghost`

```css
background: transparent;
border: 1px solid var(--line);
color: var(--ink);
/* hover: bg-2, border ink-3 */
```

---

## 6. COMPONENTES DE SEÇÃO

### Announcement Bar
- Fundo `var(--accent)` · texto branco · link sublinhado
- Copy: `"Crie seu Super Agente de IA: Trabalhando 24/7 por você. [Criar meu agente →]"`

### Nav
- Sticky · blur backdrop no scroll
- Logo: `INTUS HUB` (HUB em accent) + sub `CURSO RÁPIDO - SUPER AGENTE`
- Direita: preço riscado `R$ 997` + parcelamento `6x R$16,50` + CTA small

### Hero
- Grid full-bleed 2 colunas: copy left · imagem right
- Imagem: `img/heeerochat01.png` (print de conversa real com o agente) com máscara dissolve dupla
- Bullets: 4 pontos com `<strong>` em branco (abaixo, em grid 2 colunas)
- Pillars bar: 4 colunas com `tag / name / desc`

### Eyebrow (badge pulsante)
```css
/* Dot animado + borda + fundo suave accent */
border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
background: color-mix(in oklab, var(--accent) 8%, transparent);
```

### Problem (Atenção)
- Eyebrow: `"O mercado de IA"`
- H2: headline de gancho + `<em>` accent
- Bloco narrativo `.problem-narrative` com `.problem-punch` (borda esquerda laranja)

### Challenges (Interesse)
- Grid 2×2 de cards
- 4 barreiras no registro "você"
- Número `01–04` em destaque
- Sem answer-card (removida na reestruturação AIDA)

### Comparison / Agitation (Desejo)
- Grid flat 2 colunas: "O que vendem por aí" × "O que você vai construir"
- Headers com ícone ✗ / ✓
- 6 pares de rows alinhadas automaticamente pelo grid CSS
- `.problem-conclusion` como fecho abaixo do grid

### Modules
- Desktop: dois painéis — tabs clicáveis à esquerda + painel de conteúdo à direita
- Mobile: accordion
- 4 módulos numerados `00–03`
- Sticky tabs a `top: 90px`

### Offer (Oferta)
- Grid: value stack esquerda + price box direita
- Value stack: lista de itens com badges `R$ 497 / R$ 197 / R$ 97` + `incluso` + `Bônus`
- Âncora: só `R$ 997,00` riscado (branco · risco laranja 1.5px · 22px)
- Price box: `6x` em mono pequeno · `R$16,50` em display grande · `ou R$ 87,90 à vista`
- CTA big centralizado no price box

### Guarantee (Garantia)
- Selo animado SVG — `.guarantee-badge`
- Pulse ring externo (borda laranja, expande e some, 2.6s)
- Texto rotativo lento: `"GARANTIA TOTAL · 7 DIAS ·"` 20s
- Anel gradiente interno laranja→escuro
- Número `7` nítido + glow separado atrás
- Label `DIAS` em mono 45% branco

### FAQ
- Accordion — pergunta + `+` → expande resposta
- 8 perguntas cobrindo: programação, customização, tempo, custo, kit, acesso, garantia

---

## 7. ANIMAÇÕES E EFEITOS

| Animação | Descrição | Duração |
|---|---|---|
| `btn-sweep` | Faixa de luz varrendo o botão | 2.6s linear infinite |
| `pulse` | Dot do eyebrow pulsando | 2.2s infinite |
| `guar-spin` | Texto do selo girando | 20s linear infinite |
| `guar-pulse` | Anel externo do selo expandindo | 2.6s ease-out infinite |
| `scroll-reveal` | Fade-in + translateY ao entrar na viewport | 0.6s ease |
| `parallax` | Orbs do hero com velocidade diferente no scroll | — |
| `marquee` | Faixa de texto horizontal contínua | variável via `--marquee-dur` |

### Scroll Reveal

```css
.reveal { opacity: 0; transform: translateY(24px); }
.reveal.visible { opacity: 1; transform: none; transition: .6s ease; }
--reveal-delay: 0ms; /* stagger via inline style */
```

### GPU / Anti-serrilhado

```css
backface-visibility: hidden;
will-change: left; /* botão big */
transform: translateZ(0); /* ícone ::after */
```

---

## 8. ESTRUTURA DE COPY (AIDA)

### Sequência de seções

```
Announcement → Nav → Hero → StatsBar → Problem → Challenges → Comparison
→ Modules → Results → Testimonials → Marquee → Roadmap
→ Offer → Guarantee → FAQ → CTA Final → Support → Footer
```

### AIDA por seção

| Fase | Seção | Função |
|---|---|---|
| **A** — Atenção | Hero, Announcement | Promessa + urgência |
| **A** — Atenção | Problem | Gancho de mercado — "camelô de agentes" |
| **I** — Interesse | Challenges | 4 barreiras no registro "você" |
| **D** — Desejo | Comparison | Grid Sem × Com — transformação concreta |
| **D** — Desejo | Modules, Results | Prova de entrega e profundidade |
| **D** — Desejo | Testimonials | Prova social — Aspira e Clóvis reais + carrossel de alunos |
| **A** — Ação | Offer, CTA Final | Âncora + preço + garantia |

### Headlines principais

| Seção | Headline |
|---|---|
| Hero | "Chega de IA genérica. *Crie um Super Agente de verdade.*" |
| Problem | "O mercado virou um camelô de agentes. *Você não precisa de 50. Precisa de um.*" |
| Challenges | "Você já tentou. Você já investiu. *Por que ainda não deu certo?*" |
| Comparison | "O que muda quando o agente *é construído do jeito certo.*" |
| Modules | "Do entendimento inicial ao agente no ar, *com contexto, memória, segurança e capacidades reais.*" |
| Results | "Ao terminar o curso, *você terá:*" |
| Testimonials | "Um Humano. *Dois Super Agentes.*" |
| Guarantee | "Teste por *7 dias.* Não foi pra você, devolvemos 100%." |
| CTA final | "Você já perdeu tempo suficiente *com agentes que não prestam.*" |

> A copy do hero (`heroTitle`, `heroSub`, `ctaPrimary`) é editável via `TWEAK_DEFAULTS` / painel de tweaks.

### CTA principal

```
"Quero meu Super Agente"
```

### Micro-copy de suporte

- Announcement: `"Crie seu Super Agente de IA: Trabalhando 24/7 por você."`
- Below CTA (hero): `"7 dias de garantia"`
- CTA meta: `"6x R$16,50 · ou R$87,90 à vista · acesso imediato"`
- Lock (oferta): `"🔒 1 ano de acesso · 7 dias de garantia"`

---

## 9. PREÇOS E OFERTA

| Campo | Valor |
|---|---|
| Preço âncora | R$ 997,00 |
| Preço à vista | R$ 87,90 |
| Parcelamento | 6x de R$ 16,50 |
| Checkout | `https://pay.hotmart.com/COLOQUE-AQUI` |
| Garantia | 7 dias incondicional |
| Upgrade (no checkout) | Acesso vitalício por R$ 67,90 — oferecido no checkout Hotmart, não há seção de order bump na LP |

### Value Stack (itens da oferta)

| Item | Valor exibido |
|---|---|
| Curso completo · 4 módulos, 16 aulas base e atualizações futuras | R$ 497 |
| Kit de Ignição · configuração guiada de identidade e memória | R$ 197 |
| Materiais visuais de cada aula | R$ 97 |
| Comunidade de suporte no WhatsApp · 12 meses | R$ 197 |
| Atualizações do produto e novas aulas futuras | incluso |
| Garantia incondicional · 7 dias | incluso |
| Mais cases reais de aplicação | Bônus |
| Integrações avançadas (agenda, CRM, planilhas) | Bônus |
| Novos arquivos-base e templates | Bônus |

### Regra de ancoragem

> Mostrar valores individuais somando ~R$ 988 **antes** de revelar o preço.  
> O único valor riscado é `R$ 997,00` — sem fabricar soma falsa.  
> O choque vem de: valor percebido acumulado → riscado → R$ 87,90.

---

## 10. ARQUITETURA DE ARQUIVOS

```
LP-Crie-um-Super-Agente-de-IA/
├── index.html          ← Entry point + TWEAK_DEFAULTS; #root tem o shell pré-renderizado
├── styles.css          ← Todo o CSS do produto (carregado direto, sem build)
├── sections.jsx        ← Componentes React (CÓDIGO-FONTE — compilado para js/)
├── app.jsx             ← Root: ordem das seções + TweaksPanel
├── effects.jsx         ← useScrollReveal, useParallax, useCustomCursor
├── tweaks-panel.jsx    ← Painel de edição ao vivo (TweakColor, TweakToggle…)
├── js/*.min.js         ← Bundles compilados (esbuild) — o que o navegador roda
├── vendor/*.min.js     ← React de produção self-hosted
├── build.ps1           ← esbuild: .jsx → js/*.min.js
├── prerender.ps1       ← build + snapshot do #root (shell estático)
├── scripts/            ← optimize-images.js (WebP) · prerender.mjs (snapshot headless)
├── serve.ps1           ← Servidor local (PowerShell HttpListener, porta 3000)
├── vercel.json         ← Config de deploy (cleanUrls; serve estático, sem build no Vercel)
├── ALTERACOES.md      ← Otimizações + Guia para desenvolvedores
├── DESIGN-SYSTEM.md   ← Este arquivo
└── PRD.md              ← Product Requirements Document
```

> O build roda **localmente** (`build.ps1` / `prerender.ps1`) e o resultado é commitado;
> o Vercel só serve os arquivos estáticos. Detalhes e regras em `ALTERACOES.md`.

### TWEAK_DEFAULTS (editáveis no HTML)

```json
{
  "brandName": "INTUS HUB",
  "brandTag": "Curso · Crie um Super Agente de IA",
  "accent": "#E84000",
  "palette": "black",
  "fontDisplay": "Inter Tight",
  "radius": 14,
  "density": "regular",
  "priceNow": "87,90",
  "priceFull": "997",
  "currency": "R$",
  "ctaPrimary": "Quero meu Super Agente",
  "checkoutUrl": "https://pay.hotmart.com/COLOQUE-AQUI"
}
```

### Deploy

```powershell
# 1. Se mudou .jsx/estrutura, compile e regenere o shell antes de commitar:
powershell -ExecutionPolicy Bypass -File prerender.ps1
# 2. Push na main dispara deploy automático no Vercel (serve estático):
git push origin main
# → https://superagente.intushub.com.br  (e https://super-agente-v2.vercel.app)
```
