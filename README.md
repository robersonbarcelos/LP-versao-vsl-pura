# Super Agente de IA — Landing Page v2

Landing page do curso **Crie um Super Agente de IA** · INTUS HUB.

## Stack

- HTML + React 18 via CDN (sem build step)
- Babel Standalone para JSX no browser
- CSS puro com design tokens via variáveis CSS
- Servidor local: PowerShell HttpListener (`serve.ps1`)

## Arquivos principais

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Entry point — carrega scripts e define `TWEAK_DEFAULTS` |
| `app.jsx` | Componente raiz — monta todas as seções |
| `sections.jsx` | Todos os componentes de seção da LP |
| `effects.jsx` | Hooks compartilhados: scroll reveal, parallax, cursor |
| `tweaks-panel.jsx` | Painel lateral de customização visual |
| `styles.css` | Estilos globais + design tokens |

## Como rodar localmente

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Customizações via TWEAK_DEFAULTS

No `index.html`, o objeto `window.TWEAK_DEFAULTS` controla:

- **Identidade visual**: accent color, paleta, fonte display, raio, densidade
- **Copy**: título do hero, subtítulo, CTA, preços
- **Seções visíveis**: toggles individuais para cada bloco da página

## Seções da página

1. Announcement bar
2. Nav
3. Hero + HeroPillars
4. StatsBar (contador animado)
5. Problem
6. Challenges
7. Agitation (comparação antes/depois)
8. Modules (4 módulos / 16 aulas)
9. Results
10. ProofBridge (citação tipográfica)
11. Testimonials (Diego + Aspira + Clóvis + carrossel)
12. Marquee
13. Roadmap
14. Offer
15. Order Bump
16. Guarantee
17. FAQ
18. CTA final
19. Support
20. Footer

## Imagens necessárias (`/img`)

| Arquivo | Uso |
|---------|-----|
| `diego.png` | Foto do professor |
| `aspira.png` | Avatar do agente Aspira |
| `clovis.png` | Avatar do agente Clóvis |
| `denys.jpg` | Depoimento — Denys Buso |
| `arcanjo.jpg` | Depoimento — Arcanjo |

## Deploy

Conectado ao Vercel via repositório GitHub. Push na branch `main` dispara deploy automático.

---

**INTUS HUB** · Curso Rápido — Super Agente de IA
