# Migração para Cloudflare Pages

> Última atualização: 13/06/2026
> Motivo: o webhook de deploy da Vercel é instável (merge via API não disparava deploy) e o
> domínio já está na Cloudflare — o CF Pages elimina o registro DNS externo que causou o
> outage e roda no plano free com **uso comercial permitido + banda ilimitada**.

A página é **100% estática** (HTML pré-renderizado + `js/*.min.js` + assets, tudo commitado).
**Não há build no servidor** — o CF Pages só serve a raiz do repo.

## Estado do repo (já preparado)
- ✅ `_headers` — CSP + headers de segurança (paridade com o `vercel.json`). **Fonte da verdade** no CF Pages.
- ✅ Speed Insights da Vercel **removido** (era Vercel-only; não funciona no CF Pages).
- ✅ `vercel.json` **mantido** apenas para rollback (CF Pages o ignora).
- ✅ Clean URLs: o CF Pages faz por padrão (serve `/` → `index.html`). Sem `_redirects` necessário.

## Setup no dashboard da Cloudflare (passo único — precisa de você)
1. **Workers & Pages → Create → Pages → Connect to Git** → repo `INTUS-AI/LP-Crie-um-Super-Agente-de-IA`, branch `main`.
2. **Build settings:**
   - Framework preset: **None**
   - Build command: **(vazio)**
   - Build output directory: **`/`** (raiz)
   - Root directory: **`/`**
3. **Save and Deploy.** O CF builda um preview em `https://<projeto>.pages.dev`.
4. **Validar o `.pages.dev`** antes de mexer no domínio (ver checklist abaixo).

## Repontar o domínio (depois que o `.pages.dev` validar)
5. No projeto Pages → **Custom domains → Set up a domain** → `superagente.intushub.com.br`.
   - Como o DNS já está na Cloudflare, ela **substitui** o registro `A 76.76.21.21` (Vercel)
     por um **CNAME proxied** (nuvem laranja) para o projeto Pages. É isso que mata a classe
     de problema do outage de DNS da Vercel.
6. Validar o domínio custom servindo **200 + headers** (checklist abaixo).

## Checklist de validação (rodar no `.pages.dev` e depois no domínio)
- [ ] `curl -sI <url>` → `200`, e os headers do `_headers` presentes (CSP, X-Frame-Options, etc.).
- [ ] Página renderiza e **hidrata sem erro** (console limpo, sem React #418/#423).
- [ ] Hero usa a variante responsiva (`heeerochat01-720.webp` no mobile).
- [ ] **Meta Pixel e Utmify carregam** (fbq definido, `fbevents.js` e `utms/latest.js` no DOM) — CSP não bloqueia.
- [ ] Checkout/CTAs apontam pro destino certo (Lastlink).
- [ ] PageSpeed mobile (medir depois de propagar).

## Rollback (se algo der errado)
- Repontar o DNS de `superagente` de volta para **`A → 76.76.21.21`** (Vercel, DNS-only/nuvem
  cinza, TTL mínimo). O `vercel.json` continua no repo, então a Vercel volta a servir igual.

## Analytics (substituto do Speed Insights) — ATIVO
- **Cloudflare Web Analytics** — free, ilimitado, cookieless, traz Core Web Vitals (RUM).
  Com o domínio proxied a Cloudflare **auto-injeta o beacon** `beacon.min.js` (zero código).
- O CSP (`_headers` e `vercel.json`) já libera: `script-src https://static.cloudflareinsights.com`
  e `connect-src https://cloudflareinsights.com`. Sem isso o beacon é **bloqueado pelo CSP**
  (foi o que apareceu no console na primeira validação pós-migração).
- Dados aparecem em *Cloudflare → Analytics & Logs → Web Analytics*. Pra desligar, é só
  desabilitar o auto-injection lá (não precisa mexer no CSP).
