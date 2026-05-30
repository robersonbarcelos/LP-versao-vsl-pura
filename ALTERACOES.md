# ALTERAÇÕES & GUIA DE OTIMIZAÇÃO — LP "Crie um Super Agente de IA"

**Última atualização:** 2026-05-30
**Resumo:** Auditoria completa (bugs, inconsistências, redundâncias) + otimização de
performance. **PageSpeed: 31 → 96 desktop / 87 mobile.**

> Este documento tem duas partes:
> 1. **O que foi feito** — histórico das correções e otimizações.
> 2. **Guia para desenvolvedores** — como mexer no projeto sem quebrar nada nem a performance (build, imagens, classes, CSS).

---

# PARTE 1 — O QUE FOI FEITO

## 1. Bugs corrigidos

| # | Problema | Correção |
|---|---|---|
| 1.1 | `OrderBump` referenciado mas nunca definido → `ReferenceError` em todo load | Removida toda a fiação (render, toggle, export, flag) |
| 1.2 | `serve.ps1` com caminho hardcoded inexistente | `$root = $PSScriptRoot` |
| 1.3 | Modal de captura sem acessibilidade | `role="dialog"`, `aria-modal`, fecha no `Esc`, trava scroll, autofocus |

## 2. Inconsistências corrigidas

- **Parcelamento hardcoded em 4 lugares** → criado `parseInstallment()`; nav, oferta, marquee e CTA agora derivam do tweak `priceInstallments`.
- **Valor âncora e CTA da oferta** hardcoded → ligados a `t.priceFull` e `t.ctaPrimary`.
- **`alt` do hero** descrevia "Diego Spanevello" numa imagem de chat → corrigido.
- **Docs desatualizados** (README/DESIGN-SYSTEM): `vercel.json`, referência a arquivo inexistente, contagem de módulos/FAQ, headlines, microcopy.

## 3. Redundâncias / código morto removido

- Componentes mortos: `HeroVis`, `ModuleVisGfx`, `Founders`.
- ~200 linhas de CSS morto (`.tg-*`, `.hero-vis*`).
- Arquivo duplicado `Super Agente.html` (divergente do `index.html`).
- `MutationObserver` do scroll-reveal coalescido num `requestAnimationFrame` (o countdown disparava re-scan da página inteira a cada segundo).

## 4. Performance — PageSpeed 31 → 96/87

PageSpeed inicial (desktop): **31** · TBT 6.600ms · payload 4,3MB · main-thread 10,7s.

### 4.1 Eliminado o Babel-no-browser (resolve o TBT)
- Os 4 `.jsx` agora são **pré-compilados por esbuild** (`build.ps1`) → `js/*.min.js` (~83 KB).
- `index.html` carrega **React de produção** com `defer` (não bloqueia render). `@babel/standalone` (~3 MB) e os builds de desenvolvimento do React foram removidos.

### 4.2 React self-hosted
- React de produção movido de `unpkg.com` (terceiro, ~281ms de main-thread + latência) para `vendor/` (servido pelo edge do Vercel, mesma origem).

### 4.3 Imagens redimensionadas + WebP
| Imagem | Antes | Depois |
|---|---|---|
| aspira / clovis | 6,8 / 6,6 MB | ~26 KB cada |
| heeerochat01 (hero/LCP) | 1,3 MB | 66 KB |
| noise-tools | 1,6 MB | 64 KB |
| diego | 1,4 MB | 23 KB |
| depoimentos | até 209 KB | 2–8 KB |

`width`/`height` explícitos adicionados (evita CLS). Conversão via `scripts/optimize-images.js`.

### 4.4 Otimizações de mobile (Style & Layout)
- `btn-sweep` animado via `transform` (compositado) em vez de `left` (reflow por frame).
- `backdrop-filter` (blur) da nav trocado por fundo sólido translúcido em ≤768px.
- Parallax desligado em `pointer: coarse` (touch) e `prefers-reduced-motion`.
- Bloco `@media (prefers-reduced-motion: reduce)` desliga animações contínuas.

### 4.5 Pré-render (LCP / FCP / SEO)
- `prerender.ps1` gera um **shell estático** (~69 KB) dentro do `#root` via Chrome headless (`scripts/prerender.mjs`). O conteúdo pinta antes do JS e crawlers veem HTML real.
- Mantém `createRoot` (substitui o `#root` ao montar) → **sem hidratação, zero risco de hydration mismatch**.
- `useScrollReveal` revela síncrono o que já está visível no mount (evita flicker quando o React reassume).

### Resultado final (PageSpeed Insights)
| | Antes | Depois |
|---|---|---|
| **Desktop** | 31 | **96** |
| **Mobile** | 31 | **87** |
| TBT (desktop) | 6.600 ms | ~30 ms |
| LCP (desktop) | 3,7 s | ~1,0 s |
| Payload | 4.389 KiB | ~464 KiB |

---

# PARTE 2 — GUIA PARA DESENVOLVEDORES

> **Regra de ouro:** o navegador NÃO carrega mais os `.jsx` diretamente. Ele carrega
> os **bundles compilados** em `js/*.min.js`. Editar um `.jsx` **não tem efeito** até
> você rodar o build.

## Fluxo de build — o que rodar e quando

| O que você mudou | Comando antes de commitar |
|---|---|
| Só `TWEAK_DEFAULTS` no `index.html` (copy, preço, toggles, cor) | **nada** — é lido em runtime |
| Só `styles.css` | **nada** (mas veja o flash do shell abaixo) |
| Qualquer `.jsx` (componente, classe, lógica) | **`build.ps1`** |
| Mudança **estrutural** de seções/layout, antes do deploy | **`prerender.ps1`** (já roda o build por dentro) |
| Trocou/adicionou imagem | `scripts/optimize-images.js` → atualizar `src` → `build.ps1` |

```powershell
powershell -ExecutionPolicy Bypass -File build.ps1      # compila .jsx -> js/*.min.js
powershell -ExecutionPolicy Bypass -File prerender.ps1  # build + atualiza o shell estático do #root
```

> O **shell pré-renderizado** no `#root` é só o primeiro paint. Se você mudar a estrutura
> e **não** rodar `prerender.ps1`, a página ainda funciona — só mostra o conteúdo antigo
> por ~400ms até o React assumir. Rode `prerender.ps1` antes do deploy para evitar isso.

## ➕ Adicionando ou trocando IMAGENS

Imagens **nunca** entram em tamanho original (uma foto de 6 MB destrói a performance).
Sempre redimensione + converta para **WebP**:

1. Coloque o original em `img/`.
2. Adicione uma entrada em `scripts/optimize-images.js` (arquivo, largura-alvo, qualidade):
   ```js
   { src: 'minha-foto.png', width: 800, q: 80 },
   ```
   Largura-alvo ≈ o **dobro** do tamanho que a imagem aparece na tela (retina).
3. Gere o `.webp`:
   ```powershell
   npm install --no-save sharp@0.33.5
   node scripts/optimize-images.js
   Remove-Item -Recurse -Force node_modules
   ```
4. Use o `.webp` no `sections.jsx` **sempre com `width`/`height`** (evita CLS):
   ```jsx
   <img src="img/minha-foto.webp" width="800" height="600" loading="lazy" decoding="async" />
   ```
5. Regras de `loading`:
   - **Acima da dobra (hero):** `fetchpriority="high"`, **sem** `loading="lazy"`.
   - **Abaixo da dobra (estática):** `loading="lazy"`.
   - **No carrossel de depoimentos:** **NÃO** use `loading="lazy"` — as imagens vivem
     numa faixa animada por `transform`, e o lazy-load não dispara para elementos
     deslocados por animação (ficariam em branco). Use só `decoding="async"`.
6. Rode `build.ps1` (e `prerender.ps1` antes do deploy).

## 🏷️ Mudando CLASSES ou JSX

- Edite o `.jsx` correspondente (`sections.jsx`, `app.jsx`, `effects.jsx`, `tweaks-panel.jsx`).
- **Rode `build.ps1`** — sem isso o navegador continua com o bundle antigo.
- Se criou um componente novo que o `app.jsx` usa, exponha-o no `Object.assign(window, {...})`
  no fim do `sections.jsx` (o `app.jsx` referencia os componentes como globais).
- Antes do deploy, rode `prerender.ps1` se a mudança afeta o que aparece no primeiro paint.

## 🎨 Mexendo no CSS (`styles.css`)

CSS é carregado direto (sem build). Mas para **não regredir a performance**, siga:

- **Anime só `transform` e `opacity`** (compositados na GPU). **Nunca** anime
  `left`/`top`/`width`/`height`/`margin`/`inset` em loop — cada frame força reflow
  (foi exatamente o problema do `btn-sweep`, que animava `left`).
- **`backdrop-filter: blur()` é caro no mobile** (recalcula a cada frame de scroll).
  Se usar, desligue em telas pequenas com `@media (max-width: 768px)` (ver a nav).
- **Respeite `prefers-reduced-motion`** — já existe um bloco no fim do `styles.css` que
  desliga animações contínuas; animações novas devem se enquadrar nele.
- **Reveal on scroll:** elementos com a classe `reveal` começam invisíveis (`opacity:0`)
  e ganham `.in` ao entrar na viewport (via `effects.jsx`). Não remova a classe `reveal`
  achando que está "escondendo" algo — é o efeito de entrada.
- Use os **design tokens** (variáveis CSS em `:root`: `--accent`, `--bg`, `--ink`, `--r`…)
  em vez de cores/raios hardcoded.

## ✅ Checklist antes de commitar/deploy

- [ ] Mudou `.jsx`? Rodei **`build.ps1`**.
- [ ] Mudança estrutural/visual? Rodei **`prerender.ps1`**.
- [ ] Imagem nova está em **WebP**, com `width`/`height` e a regra de `loading` correta.
- [ ] Nenhuma animação nova em loop mexendo em `left/top/width/height`.
- [ ] Testei: abre sem erro no console, modal fecha no `Esc`, FAQ/tabs funcionam.
- [ ] (Opcional) Rodei o PageSpeed em `pagespeed.web.dev` para conferir que não regrediu.

## Arquitetura dos arquivos

```
index.html          ← entry; carrega vendor/React + js/*.min.js; #root tem o shell pré-renderizado
*.jsx               ← CÓDIGO-FONTE (não é carregado direto pelo navegador)
js/*.min.js         ← bundles compilados (gerados por build.ps1) — É o que o navegador roda
vendor/*.min.js     ← React de produção self-hosted
styles.css          ← CSS (carregado direto, sem build)
build.ps1           ← esbuild: .jsx → js/*.min.js
prerender.ps1       ← build + snapshot do #root (shell estático)
scripts/optimize-images.js ← sharp: redimensiona + WebP
scripts/prerender.mjs      ← puppeteer-core: snapshot headless
serve.ps1           ← servidor local (porta 3000)
```
