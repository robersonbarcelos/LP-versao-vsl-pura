// sections-vsl.jsx — Versão VSL Pura · Super Agente IA · INTUS HUB
// Estrutura: Nav → Hero → VSL → Offer → Guarantee → FAQ → Footer

const { useState, useEffect, useRef } = React;

/* ─── helpers ─── */
function renderEmph(text){
  const parts = (text || '').split(/(\*[^*]+\*)/g);
  return parts.map((p, i) => p.startsWith('*') && p.endsWith('*')
    ? <em key={i}>{p.slice(1, -1)}</em>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}

function withStrong(text){
  return { __html: (text || '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') };
}

function parseInstallment(str, currency){
  const m = (str || '').trim().match(/^(\S+)\s+(.*)$/);
  const count = m ? m[1] : (str || '');
  let value = m ? m[2] : '';
  if (currency) value = value.replace(currency, '').trim();
  return { count, value };
}

function useScrolledFlag(threshold){
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > threshold);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [threshold]);
  return s;
}

const WA_LINK = 'https://wa.me/5551999999999';
function WaIcon(){ return <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>; }

/* ─── NAV ─── */
function Nav({ t }){
  const scrolled = useScrolledFlag(20);
  const inst = parseInstallment(t.priceInstallments, t.currency);
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="brand">
          <svg className="brand-hex" viewBox="0 0 120 120" width="40" height="40" aria-label="Intus Hub">
            <defs>
              <linearGradient id="nav-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6020"/>
                <stop offset="50%" stopColor="#E84000"/>
                <stop offset="100%" stopColor="#8C2000"/>
              </linearGradient>
              <radialGradient id="nav-nuc" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF9055"/>
                <stop offset="45%" stopColor="#E84000"/>
                <stop offset="100%" stopColor="#6A1800"/>
              </radialGradient>
              <filter id="nav-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="nav-core" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <polygon points="60,7 107,33.5 107,86.5 60,113 13,86.5 13,33.5" fill="none" stroke="#E84000" strokeWidth="4" strokeOpacity=".15" filter="url(#nav-glow)"/>
            <polygon points="60,7 107,33.5 107,86.5 60,113 13,86.5 13,33.5" fill="none" stroke="url(#nav-stroke)" strokeWidth="2"/>
            <polygon points="60,28.5 86.5,44 86.5,76 60,91.5 33.5,76 33.5,44" fill="#0a0a0a" stroke="#E84000" strokeOpacity=".3" strokeWidth="1.4"/>
            <g stroke="#E84000" strokeOpacity=".4" strokeWidth="1.1" strokeLinecap="round">
              <line x1="60" y1="60" x2="60" y2="7"/>
              <line x1="60" y1="60" x2="107" y2="33.5"/>
              <line x1="60" y1="60" x2="107" y2="86.5"/>
              <line x1="60" y1="60" x2="60" y2="113"/>
              <line x1="60" y1="60" x2="13" y2="86.5"/>
              <line x1="60" y1="60" x2="13" y2="33.5"/>
            </g>
            <circle cx="60" cy="7" r="5.5" fill="#E84000" filter="url(#nav-glow)"/>
            <circle cx="107" cy="86.5" r="5.5" fill="#E84000" filter="url(#nav-glow)"/>
            <circle cx="13" cy="86.5" r="5.5" fill="#E84000" filter="url(#nav-glow)"/>
            <circle cx="107" cy="33.5" r="3.5" fill="#FF7A33" filter="url(#nav-glow)"/>
            <circle cx="60" cy="113" r="4" fill="#FF7A33" filter="url(#nav-glow)"/>
            <circle cx="13" cy="33.5" r="3.5" fill="#FF7A33" filter="url(#nav-glow)"/>
            <circle cx="60" cy="60" r="11" fill="#6A1800" opacity=".9" filter="url(#nav-core)"/>
            <circle cx="60" cy="60" r="11" fill="url(#nav-nuc)"/>
          </svg>
          <span className="brand-name">
            <span className="brand-wordmark">INTUS <span className="brand-hub">HUB</span></span>
            <span className="brand-sub">CURSO RÁPIDO - SUPER AGENTE</span>
          </span>
        </a>
        <div className="nav-right">
          <div className="nav-price">
            <s className="nav-price-old">{t.currency} {t.priceFull}</s>
            <span className="nav-price-sep">·</span>
            <span className="nav-price-inst">
              <span className="nav-price-times">{inst.count}</span>
              <strong className="nav-price-value">{t.currency}{inst.value}</strong>
            </span>
          </div>
          <a className="btn btn-primary" href="#oferta">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
        </div>
      </div>
    </header>
  );
}

/* ─── HERO MÍNIMO ─── */
function Hero({ t }){
  return (
    <section id="top" className="hero hero--vsl">
      <div className="hero-orb a"/>
      <div className="hero-orb b"/>
      <div className="container">
        <div className="hero-vsl-content">
          <h1 className="h-display hero-title">
            Pare de perder dinheiro com IA genérica.<br/>
            <em>Crie hoje mesmo um Super Agente IA</em><br/>
            que trabalha por você.
          </h1>
          <a className="btn btn-primary btn-big hero-vsl-cta" href="#vsl">
            Assista na prática como é fácil criar um Super Agente IA <span className="btn-arrow">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── VSL ─── */
function Vsl({ t }){
  const sectionRef = useRef(null);

  useEffect(() => {
    let loaded = false;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loaded) {
        loaded = true;
        io.disconnect();
        const s = document.createElement('script');
        s.src = 'https://scripts.converteai.net/f97abc9e-45e1-4dac-8da4-c30d174c11bd/players/6a357e8356040260db51da8e/v4/player.js';
        s.async = true;
        document.head.appendChild(s);
      }
    }, { rootMargin: '0px' });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="vsl vsl--pura" id="vsl">
      <div className="container">
        <div ref={sectionRef} className="vsl-player vsl-player--vturb">
          <vturb-smartplayer
            id="vid-6a357e8356040260db51da8e"
            style={{display:'block', margin:'0 auto', width:'100%'}}
          ></vturb-smartplayer>
        </div>
      </div>
    </section>
  );
}

/* ─── OFFER ─── */
function CountdownTimer(){
  const DURATION = 59 * 60;
  function getRemaining(){
    const key = 'sa_offer_end';
    let end = parseInt(sessionStorage.getItem(key) || '0', 10);
    if(!end || end < Date.now()){
      end = Date.now() + DURATION * 1000;
      sessionStorage.setItem(key, end);
    }
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
  }
  const [secs, setSecs] = useState(DURATION);
  useEffect(() => {
    if(window.__PRERENDER__) return;
    setSecs(getRemaining());
    const id = setInterval(() => setSecs(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return (
    <div className="offer-countdown">
      <span className="offer-countdown-label">⏳ ESSA OFERTA EXPIRA EM:</span>
      <div className="offer-countdown-clock">
        <div className="ocd-unit"><span className="ocd-num">{h}</span><span className="ocd-sub">HORAS</span></div>
        <span className="ocd-sep">:</span>
        <div className="ocd-unit"><span className="ocd-num">{m}</span><span className="ocd-sub">MIN</span></div>
        <span className="ocd-sep">:</span>
        <div className="ocd-unit"><span className="ocd-num">{s}</span><span className="ocd-sub">SEG</span></div>
      </div>
    </div>
  );
}

function Proof(){
  return (
    <section className="proof-section">
      <div className="container">
        <div className="proof-hero reveal">
          <div className="proof-hero-text">
            <span className="eyebrow">É isso que o seu agente vai fazer</span>
            <h2 className="h-display proof-hero-title">
              Responde, analisa,<br/>
              executa e reporta<br/>
              <em>enquanto você lidera.</em>
            </h2>
          </div>
          <div className="proof-hero-img">
            <img
              src="img/heeerochat01.webp"
              srcSet="img/heeerochat01-720.webp 720w, img/heeerochat01-900.webp 900w, img/heeerochat01.webp 1000w"
              sizes="(max-width: 920px) 100vw, 50vw"
              alt="Super Agente respondendo no WhatsApp em tempo real"
              width="1000" height="1000"
              loading="lazy" decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Offer({ t }){
  const valueStack = [
    { name: 'Curso completo · 4 módulos, 16 aulas base e atualizações futuras', price: 'R$ 497'  },
    { name: 'Kit de Ignição · configuração guiada de identidade e memória',     price: 'R$ 197'  },
    { name: 'Materiais visuais de cada aula',                                   price: 'R$ 97'   },
    { name: 'Comunidade de suporte no WhatsApp · 12 meses',                     price: 'R$ 197'  },
    { name: 'Atualizações do produto e novas aulas futuras',                    price: 'incluso' },
    { name: 'Garantia incondicional · 7 dias',                                  price: 'incluso' },
    { name: 'Mais cases reais de aplicação',                                    price: 'bônus'   },
    { name: 'Integrações e atualizações constantes',                            price: 'bônus'   },
    { name: 'Novos arquivos-base e templates',                                  price: 'bônus'   },
  ];

  /* prova social — imagem do celular com WhatsApp */
  const inst = parseInstallment(t.priceInstallments, t.currency);

  return (
    <section id="oferta" className="offer">
      <div className="container">

        <div className="offer-card reveal">
          <span className="section-eyebrow">Oferta especial · Válida por tempo limitado</span>
          <h2 className="h-display h2">Tudo o que você leva <em>hoje.</em></h2>

          <div className="offer-grid" style={{marginTop:'40px'}}>
            <div>
              <div className="value-stack">
                {valueStack.map((v, i) => (
                  <div key={i} className={`value-item${v.price === 'bônus' ? ' value-item-bonus' : ''}`}>
                    <span className="value-name">{v.name}</span>
                    {v.price === 'bônus'   && <span className="value-badge-bonus">Bônus</span>}
                    {v.price === 'incluso' && <span className="value-price value-free">incluso</span>}
                    {v.price !== 'bônus' && v.price !== 'incluso' && <span className="value-price">{v.price}</span>}
                  </div>
                ))}
              </div>
              <div className="value-total">
                <span className="value-total-label">Tudo isso custaria</span>
                <span className="value-total-num">{t.currency} {t.priceFull},00</span>
              </div>
            </div>

            <div className="offer-price">
              <div className="offer-price-launch-label">Mas hoje você paga apenas:</div>
              <div className="offer-price-installment">
                <span className="price-times">{inst.count}</span>
                <div className="price-main">
                  <span className="currency">{t.currency}</span>{inst.value}
                </div>
              </div>
              <div className="offer-price-vista">ou {t.currency} {t.priceNow} à vista</div>
              <CountdownTimer />
              <a href="#" className="btn btn-primary btn-big">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
              <div className="offer-price-note">🔒 1 ano de acesso · 7 dias de garantia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── GUARANTEE ─── */
function Guarantee({ t }){
  return (
    <section className="guarantee">
      <div className="container">
        <div className="guarantee-card reveal">
          <div className="guarantee-badge">
            <div className="guarantee-pulse-ring"/>
            <svg className="guarantee-spin" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
              <defs><path id="guar-tp" d="M 90,10 A 80,80 0 1,1 89.9,10"/></defs>
              <text fontFamily="Inter Tight, sans-serif" fontSize="8.5" fontWeight="600"
                    fill="rgba(255,255,255,0.45)" letterSpacing="5">
                <textPath href="#guar-tp" startOffset="0%">
                  GARANTIA TOTAL  ·  7 DIAS  ·  GARANTIA TOTAL  ·
                </textPath>
              </text>
            </svg>
            <svg className="guarantee-static" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="guar-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6020"/>
                  <stop offset="100%" stopColor="#8C2000"/>
                </linearGradient>
                <radialGradient id="guar-bg" cx="38%" cy="28%">
                  <stop offset="0%" stopColor="rgba(232,64,0,0.16)"/>
                  <stop offset="100%" stopColor="#0a0a0a"/>
                </radialGradient>
                <filter id="guar-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" result="blur"/>
                  <feComposite in="blur" in2="SourceGraphic" operator="out" result="glow"/>
                  <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <circle cx="90" cy="90" r="76" fill="url(#guar-bg)" stroke="url(#guar-ring)" strokeWidth="1.5"/>
              <circle cx="90" cy="90" r="71" fill="none" stroke="rgba(232,64,0,0.2)" strokeWidth="1"/>
              <text x="90" y="104" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="60"
                    fontWeight="900" fill="#E84000" opacity="0.4" filter="url(#guar-glow)">7</text>
              <text x="90" y="104" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="60"
                    fontWeight="900" fill="#E84000">7</text>
              <text x="90" y="122" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="10"
                    fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="3">DIAS</text>
            </svg>
          </div>
          <div>
            <span className="section-eyebrow">Garantia incondicional</span>
            <h2 className="h-display h2">Teste por <em>7 dias.</em> Não foi pra você, devolvemos 100%.</h2>
            <p>Você entra, faz o curso, instala o agente, conversa com ele, usa o Kit de Ignição. Se sentir que não fez sentido, é só pedir reembolso. Sem perguntas, sem letra miúda. {t.currency} {t.priceNow} é um teste seguro.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ (3 perguntas) ─── */
function Faq({ t }){
  const [open, setOpen] = useState(0);
  const faqs = [
    {
      q: 'Preciso saber programar?',
      a: 'Não. O curso foi pensado para configuração guiada, não para ensinar programação. Você vai seguir uma rota prática para colocar o agente no ar, configurar a base e evoluir com o Kit de Ignição. Se travar em algum ponto, usa o suporte para destravar.'
    },
    {
      q: 'Já tentei IA antes e ficou genérico. Por que seria diferente?',
      a: 'Porque o problema não era a ferramenta. Era a falta de estrutura. Um agente sem identidade, sem contexto e sem memória vai parecer ChatGPT com nome diferente. O que muda aqui é a fundação: identidade clara, arquivos-base com seu contexto real, memória persistente e estrutura de evolução.'
    },
    {
      q: 'Quanto tempo leva pra ter o agente no ar?',
      a: 'A primeira versão pode ir ao ar em poucos minutos quando a rota está pronta. O que leva mais tempo, e é o que realmente diferencia o curso, é configurar identidade, contexto, memória, segurança e capacidades. A ideia é sair com um agente funcional e uma base para evoluir.'
    },
    {
      q: 'Qual o custo mensal pra rodar o agente?',
      a: 'O custo depende da rota escolhida, do provider de IA e da infraestrutura. No curso você entende as opções antes de instalar, para escolher uma configuração compatível com seu orçamento e seu nível de controle.'
    },
    {
      q: 'O que é o Kit de Ignição?',
      a: 'É o guia prático que conduz a configuração do seu agente depois que ele está no ar. Ele ajuda a definir identidade, contexto do usuário, regras, limites, memória e registros úteis, para o agente deixar de ser genérico e começar a operar com base própria.'
    },
    {
      q: 'O acesso ao curso e ao grupo do WhatsApp é vitalício?',
      a: 'Não. O acesso ao curso e à comunidade WhatsApp é por 12 meses: tempo mais que suficiente para aplicar tudo e evoluir. No checkout, você pode optar pelo upgrade de acesso vitalício por apenas R$ 67,90 uma única vez.'
    },
    {
      q: 'Tem garantia?',
      a: '7 dias incondicionais. Não gostou, pede reembolso, recebe 100%. Sem perguntas, sem burocracia.'
    },
  ];
  return (
    <section id="faq" className="faq">
      <div className="container faq-grid">
        <div>
          <h2 className="h-display h2 reveal" style={{marginTop:'8px'}}><em>Perguntas</em> frequentes</h2>
        </div>
        <div className="faq-list reveal">
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item ${open===i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open===i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA FINAL ─── */
function Cta({ t }){
  return (
    <section className="cta">
      <div className="container cta-inner">
        <span className="eyebrow" style={{marginBottom:'24px'}}>Comece hoje</span>
        <h2 className="h-display h2 reveal" style={{marginTop:'16px'}}>Você já perdeu tempo suficiente <em>com agentes que não prestam.</em></h2>
        <div className="cta-narrative reveal" style={{'--reveal-delay':'60ms'}}>
          <p>Enquanto você estava testando workflow atrás de workflow, acumulando pastas de automações que nunca usou de verdade. Eu estava construindo uma operação inteira com dois agentes funcionando 24 horas por dia.</p>
          <p>Não porque sou mais técnico. <strong>Porque aprendi a estruturar.</strong></p>
          <p>Agora é a sua vez. A primeira versão do seu agente pode ir ao ar rápido. No curso, você aprende o que realmente importa: transformar esse agente em uma base operacional com contexto, memória, identidade, segurança e rotina real.</p>
        </div>
        <div className="cta-offer-recap reveal" style={{'--reveal-delay':'100ms'}}>
          <span>✓ 4 módulos, 16 aulas base + atualizações</span>
          <span>✓ Kit de Ignição incluso</span>
          <span>✓ WhatsApp 12 meses</span>
          <span>✓ Garantia 7 dias</span>
        </div>
        <a className="btn btn-primary btn-big reveal" href="#oferta" style={{'--reveal-delay':'140ms'}}>{t.ctaPrimary} <span className="btn-arrow">→</span></a>
        <div className="cta-meta">{t.priceInstallments} · ou {t.currency}{t.priceNow} à vista · acesso imediato</div>
      </div>
    </section>
  );
}

/* ─── WHATSAPP FLOAT ─── */
function WhatsappFloat(){
  return (
    <a href={WA_LINK} className="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
      <span className="wa-float-icon"><WaIcon/></span>
      <span className="wa-float-pulse"/>
    </a>
  );
}

/* ─── CHECKOUT REDIRECT ─── */
function CheckoutRedirect({ t }){
  useEffect(() => {
    function intercept(e){
      const link = e.target.closest('a[href="#oferta"], a[href="#"], .btn-primary');
      if(!link) return;
      const href = link.getAttribute('href');
      if(href === '#vsl' || href === '#faq') return;
      e.preventDefault();
      if(t.checkoutUrl) window.open(t.checkoutUrl, '_blank');
    }
    document.addEventListener('click', intercept);
    return () => document.removeEventListener('click', intercept);
  }, [t.checkoutUrl]);
  return null;
}

/* ─── FOOTER ─── */
function Footer({ t }){
  const socials = [
    { label:'Instagram', href:'https://www.instagram.com/diego.spanevello/',
      icon:<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
    { label:'YouTube', href:'https://www.youtube.com/@diego.spanevello',
      icon:<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
    { label:'X', href:'https://x.com/diegospanevello',
      icon:<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-logo">
              <svg viewBox="0 0 120 120" width="36" height="36" aria-hidden="true" style={{flexShrink:0,filter:'drop-shadow(0 0 8px rgba(232,64,0,.2))'}}>
                <defs>
                  <linearGradient id="ft-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6020"/>
                    <stop offset="50%" stopColor="#E84000"/>
                    <stop offset="100%" stopColor="#8C2000"/>
                  </linearGradient>
                  <radialGradient id="ft-nuc" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FF9055"/>
                    <stop offset="45%" stopColor="#E84000"/>
                    <stop offset="100%" stopColor="#6A1800"/>
                  </radialGradient>
                  <filter id="ft-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <polygon points="60,7 107,33.5 107,86.5 60,113 13,86.5 13,33.5" fill="none" stroke="url(#ft-stroke)" strokeWidth="2"/>
                <polygon points="60,28.5 86.5,44 86.5,76 60,91.5 33.5,76 33.5,44" fill="#0a0a0a" stroke="#E84000" strokeOpacity=".3" strokeWidth="1.4"/>
                <g stroke="#E84000" strokeOpacity=".4" strokeWidth="1.1" strokeLinecap="round">
                  <line x1="60" y1="60" x2="60" y2="7"/>
                  <line x1="60" y1="60" x2="107" y2="33.5"/>
                  <line x1="60" y1="60" x2="107" y2="86.5"/>
                  <line x1="60" y1="60" x2="60" y2="113"/>
                  <line x1="60" y1="60" x2="13" y2="86.5"/>
                  <line x1="60" y1="60" x2="13" y2="33.5"/>
                </g>
                <circle cx="60" cy="7" r="5.5" fill="#E84000" filter="url(#ft-glow)"/>
                <circle cx="107" cy="86.5" r="5.5" fill="#E84000" filter="url(#ft-glow)"/>
                <circle cx="13" cy="86.5" r="5.5" fill="#E84000" filter="url(#ft-glow)"/>
                <circle cx="107" cy="33.5" r="3.5" fill="#FF7A33" filter="url(#ft-glow)"/>
                <circle cx="60" cy="113" r="4" fill="#FF7A33" filter="url(#ft-glow)"/>
                <circle cx="13" cy="33.5" r="3.5" fill="#FF7A33" filter="url(#ft-glow)"/>
                <circle cx="60" cy="60" r="11" fill="url(#ft-nuc)"/>
              </svg>
              <span className="footer-logo-name">INTUS <span style={{color:'var(--accent)'}}>HUB</span></span>
            </div>
            <p className="footer-desc">IA, Cripto e Negócios. O hub de quem constrói renda no digital.</p>
          </div>
          <div className="footer-socials">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="social-icon" aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 INTUS HUB · Todos os direitos reservados.</span>
          <span style={{fontFamily:'var(--f-mono)', fontSize:'11px', letterSpacing:'.04em', color:'var(--ink-3)'}}>intushub.com.br</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, Vsl, Proof, Offer, Guarantee, Faq, Cta, WhatsappFloat, CheckoutRedirect, Footer
});
