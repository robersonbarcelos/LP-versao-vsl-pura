# ALTERAÇÕES — Auditoria completa da LP

**Data:** 2026-05-30
**Escopo:** Auditoria de brechas, incompatibilidades, inconsistências e redundâncias na landing page "Crie um Super Agente de IA" + correções.
**Validação:** Página carregada no navegador (Playwright) após cada bloco de correção — **0 erros de console** (resta apenas o aviso esperado do Babel in-browser). Hero, mobile, modal, preços e carrossel verificados.

---

## 1. Brechas / bugs corrigidos

### 1.1 `OrderBump` indefinido → `ReferenceError` em todo carregamento
- **Problema:** o componente `OrderBump` era referenciado em `app.jsx` e no `Object.assign` final de `sections.jsx`, mas **nunca foi definido**. Isso lançava `ReferenceError: OrderBump is not defined` em todo load. Com `showOrderBump: true` (caso do antigo `Super Agente.html`), quebrava o render da página inteira.
- **Correção:** removida toda a fiação quebrada — render em `app.jsx`, toggle do painel, entrada no `Object.assign` (`sections.jsx`) e a flag `showOrderBump` em `index.html`.
- **Nota:** order bump é uma oferta complementar de checkout (ex.: "adicione acesso vitalício por +R$X"), pertencente à página de pagamento (Hotmart), não à landing. Pode ser construído como seção no futuro, se desejado.

### 1.2 `serve.ps1` com caminho hardcoded inexistente
- **Problema:** `$root = "C:\Users\User\super-agente-lp"` — pasta que não existe nesta máquina, deixando o servidor local inutilizável.
- **Correção:** `$root = $PSScriptRoot` (usa o diretório do próprio script).

### 1.3 Modal de captura sem acessibilidade
- **Problema:** o `LeadModal` não fechava com `Esc`, não travava o scroll do fundo, não levava foco ao primeiro campo e não tinha semântica de diálogo.
- **Correção:** adicionados `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, fechamento com **Esc**, trava de scroll do `body` (restaurada ao fechar) e **autofocus** no primeiro campo. Tudo testado.

---

## 2. Inconsistências corrigidas

### 2.1 Parcelamento hardcoded em 4 lugares
- **Problema:** `6x R$16,50` estava escrito à mão na nav, na oferta, no marquee e no CTA final, enquanto o tweak `priceInstallments` existia mas **nunca era usado**. Mudar o preço no painel quebrava a consistência.
- **Correção:** criado o helper `parseInstallment()` que quebra `priceInstallments` em `{ count, value }`. Nav, oferta, marquee e CTA agora derivam do tweak. Mudar o preço propaga em toda a página.

### 2.2 Valor âncora e CTA da oferta hardcoded
- **Problema:** "R$ 997,00" e o texto do botão da oferta estavam fixos.
- **Correção:** ligados a `t.priceFull` (`{currency} {priceFull},00`) e `t.ctaPrimary`.

### 2.3 `alt` incorreto na imagem do hero
- **Problema:** `alt="Diego Spanevello"` numa imagem que é um print de conversa (`heeerochat01.png`).
- **Correção:** `alt="Conversa real com um Super Agente de IA no Telegram"` + `fetchpriority="high"` (imagem acima da dobra).

### 2.4 Documentação desatualizada
- **`README.md`:** removida referência a `hero-variacoes.html` (arquivo inexistente); removidas as linhas das seções Founders e Order Bump da tabela; corrigido o snippet de `vercel.json` (mostrava `rewrites`, o real usa `cleanUrls`).
- **`DESIGN-SYSTEM.md`:** corrigido número de módulos (9 → 4), contagem de FAQ (9 → 8), arquitetura de arquivos (removido `Super Agente.html`, adicionados `serve.ps1`/`vercel.json`), comando de deploy (era `Copy-Item` de arquivo apagado → `git push`), sequência de seções, tabela AIDA, headlines e microcopy (alinhados ao produto real: "12 meses" em vez de "vitalício", "rápido" em vez de "5min"), descrição do hero (imagem com máscara dissolve em vez do mockup Telegram), value stack e upgrade de checkout (R$ 67,90).

> **Não alterado por decisão do cliente:** a divergência entre "16 aulas base" (copy) e as 19 aulas listadas nos módulos (4+4+5+6). Mantido como está.

---

## 3. Redundâncias / código morto removido

### 3.1 Componentes mortos (JSX)
- **`HeroVis`** — mockup de Telegram (~80 linhas) que não era mais renderizado (o hero usa uma imagem).
- **`ModuleVisGfx`** — retornava `null`, sem referências.
- **`Founders`** — retornava `null` (conteúdo migrado para `Testimonials`); removida também a fiação (render, toggle, flag).

### 3.2 CSS morto (`styles.css`, ~200 linhas)
- Bloco `.tg-*` (mockup Telegram do `HeroVis`).
- Bloco `.hero-vis*` (visual de hero de uma versão anterior).

### 3.3 Arquivo duplicado
- **`Super Agente.html`** — duplicado divergente do `index.html` (copy antiga do hero, `showOrderBump: true`, sem favicon). O Vercel serve `index.html`; o duplicado só gerava divergência. **Apagado.**

### 3.4 `MutationObserver` ineficiente (`effects.jsx`)
- **Problema:** o observer do scroll-reveal rodava `querySelectorAll` na página inteira a **cada mutação** do DOM. O countdown (que muda o DOM a cada segundo) disparava esse re-scan completo continuamente.
- **Correção:** as rajadas são coalescidas num único `requestAnimationFrame` (no máximo um re-scan por frame).

---

## 4. Correção pós-auditoria (imagens do carrossel)

- **Problema:** o `loading="lazy"` que adicionei às fotos do **carrossel de depoimentos** fazia as imagens ficarem em branco. O carrossel é um marquee infinito (32 cópias) animado por `transform`; o lazy-load decide o que carregar pela proximidade do scroll e **ignora deslocamento por animação CSS** — então as cópias "fora da tela" nunca carregavam.
- **Correção:** removido o `loading="lazy"` **apenas do carrossel** (`sections.jsx`), mantendo `decoding="async"`. As imagens estáticas abaixo da dobra (hero, diego, aspira, clóvis, noise-tools) seguem com `lazy`, onde funciona corretamente.

---

## 5. Recomendações (não aplicadas — fora do escopo de "correção")

- **React `.development.js` + Babel in-browser:** ok para protótipo, mas em produção pesa (recompila 4 arquivos JSX a cada load). O ideal seria um build step que pré-compila o JSX. Mudança arquitetural maior.
- **`checkoutUrl`** ainda é o placeholder `https://pay.hotmart.com/COLOQUE-AQUI` — preencher com o link real do checkout.
- **Imagens não usadas** em `img/` (`diego-1..11`, `avatar.jpg`, `DIEGOHERO02.png`, `diego hero2.png`, etc.) — bloat de repositório, sem custo de deploy (não referenciadas). Podem ser removidas após confirmação.

---

## 6. Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `sections.jsx` | Helper de parcelamento, wiring de preços, alt do hero, a11y do modal, lazy nas imagens, remoção de `HeroVis`/`ModuleVisGfx`/`Founders`, fix do `Object.assign` |
| `app.jsx` | Remoção de render e toggles de `OrderBump` e `Founders` |
| `effects.jsx` | Debounce do `MutationObserver` (rAF) |
| `index.html` | Remoção das flags `showOrderBump` e `showFounders` |
| `styles.css` | Remoção de ~200 linhas de CSS morto (`.tg-*`, `.hero-vis*`) |
| `serve.ps1` | Caminho dinâmico (`$PSScriptRoot`) |
| `README.md` | Correção de referências e config de deploy |
| `DESIGN-SYSTEM.md` | Alinhamento de specs ao produto atual |
| `Super Agente.html` | **Removido** (duplicado) |

**Saldo:** ~−260 linhas líquidas (remoção de código morto).
