// sections.jsx — Super Agente IA · INTUS HUB
// Base: estrutura T2 (Pré-Lançamento). Copy adaptada para o produto.

const { useState, useEffect, useRef } = React;

function renderEmph(text){
  const parts = (text || '').split(/(\*[^*]+\*)/g);
  return parts.map((p, i) => p.startsWith('*') && p.endsWith('*')
    ? <em key={i}>{p.slice(1, -1)}</em>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}

function withStrong(text){
  return { __html: (text || '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') };
}

/* ───────────── COUNT-UP HOOK + STATS BAR ───────────── */
function useCountUp(target, duration, started){
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let t0 = null;
    function step(ts){
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
}

function StatNum({ target, duration, suffix, format, started }){
  const n = useCountUp(target, duration, started);
  const display = format === 'br' ? n.toLocaleString('pt-BR') : String(n);
  return (
    <span className="stat-num">
      {display}<span className="stat-suffix">{suffix}</span>
    </span>
  );
}

function StatsBar(){
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting){ setStarted(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const stats = [
    { target: 6000, suffix: '+',  format: 'br',    label: 'Alunos\nFormados',             duration: 1200 },
    { target: 17,   suffix: 'K',  format: 'plain', label: 'YouTube\nInscritos',           duration: 1350 },
    { target: 40,   suffix: 'K',  format: 'plain', label: 'Instagram\nSeguidores',        duration: 1500 },
    { target: 1,    suffix: 'K+', format: 'plain', label: 'Membros\nIntuscripto Club',    duration: 1650 },
  ];
  return (
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar-eyebrow">Intus Hub em números</div>
      {stats.map((s, i) => (
        <div key={i} className="stats-bar-item">
          <StatNum {...s} started={started}/>
          <span className="stats-bar-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ───────────── ANNOUNCEMENT ───────────── */
function Announcement({ t }){
  return (
    <div className="announce">
      Crie seu Super Agente de IA: Trabalhando 24/7 por você. <a href="#oferta">Criar meu agente →</a>
    </div>
  );
}

/* ───────────── NAV ───────────── */
function Nav({ t }){
  const scrolled = useScrolledFlag(20);
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
              <span className="nav-price-times">6x</span>
              <strong className="nav-price-value">R$16,50</strong>
            </span>
          </div>
          <a className="btn btn-primary" href="#oferta">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
        </div>
      </div>
    </header>
  );
}

/* ───────────── HERO ───────────── */
function Hero({ t }){
  return (
    <section id="top" className="hero">
      <div className="hero-orb a" data-parallax={t.parallax ? "0.06" : ""}/>
      <div className="hero-orb b" data-parallax={t.parallax ? "-0.04" : ""}/>
      <div className="hero-bleed-grid">
        <div className="hero-content-col">
          <div className="hero-content">
            <span className="eyebrow">{t.brandTag}</span>
            <h1 className="h-display hero-title reveal">{renderEmph(t.heroTitle)}</h1>
            <p className="lead reveal" style={{'--reveal-delay':'60ms'}}>{t.heroSub}</p>
            <div className="hero-actions reveal" style={{'--reveal-delay':'120ms'}}>
              <div className="hero-actions-wrap">
                <a className="btn btn-primary btn-big" href="#oferta">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
                <span className="hero-actions-meta">7 dias de garantia</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-foto-c">
          <img src="img/heeerochat01.png" alt="Diego Spanevello"/>
        </div>
      </div>
      <div className="container">
        <ul className="hero-bullets hero-bullets-below reveal" style={{'--reveal-delay':'200ms'}}>
          <li><span><strong>Primeira versão do agente</strong> no ar rapidamente</span></li>
          <li><span>Com <strong>contexto, identidade, regras</strong> e memória organizada</span></li>
          <li><span>Começando pelo <strong>Telegram</strong> e preparado para evoluir para novos canais</span></li>
          <li><span>Com <strong>4 módulos, 16 aulas base + atualizações futuras</strong> e o Kit de Ignição</span></li>
        </ul>
        <HeroPillars />
      </div>
    </section>
  );
}

function HeroVis(){
  return (
    <div className="hero-vis reveal tg-shell" style={{'--reveal-delay':'200ms'}}>

      {/* Telegram top bar */}
      <div className="tg-bar">
        <div className="tg-bar-left">
          <div className="tg-avatar">
            <span>A</span>
            <span className="tg-online-dot"/>
          </div>
          <div className="tg-bar-info">
            <div className="tg-bar-name">Aspira</div>
            <div className="tg-bar-status">online</div>
          </div>
        </div>
        <div className="tg-bar-icons">
          <span className="tg-icon">⋯</span>
        </div>
      </div>

      {/* Wallpaper + messages */}
      <div className="tg-body">

        {/* date divider */}
        <div className="tg-date-divider">Hoje</div>

        {/* outgoing */}
        <div className="tg-bubble out">
          <span className="tg-text">Aspira, me lembra os 3 pontos da reunião de ontem com o time?</span>
          <span className="tg-meta">14:01 <span className="tg-check">✓✓</span></span>
        </div>

        {/* incoming */}
        <div className="tg-bubble in">
          <span className="tg-sender">Aspira</span>
          <span className="tg-text">Resumi tudo na sua memória ontem. Os 3 pontos:<br/>1) revisão do funil<br/>2) ajuste de preço do bump<br/>3) registro útil da semana</span>
          <span className="tg-meta">14:02</span>
        </div>

        {/* incoming follow-up */}
        <div className="tg-bubble in">
          <span className="tg-text">Quer que eu já agende a próxima reunião com a equipe? Tem 2 janelas livres amanhã às 10h e 15h. 📅</span>
          <span className="tg-meta">14:02</span>
        </div>

        {/* outgoing */}
        <div className="tg-bubble out">
          <span className="tg-text">Sim, marca às 10h e manda o resumo de hoje pro canal do time.</span>
          <span className="tg-meta">14:03 <span className="tg-check">✓✓</span></span>
        </div>

        {/* incoming */}
        <div className="tg-bubble in">
          <span className="tg-text">Feito. Reunião agendada e resumo enviado. Mais alguma coisa? ✅</span>
          <span className="tg-meta">14:03</span>
        </div>

        {/* typing indicator */}
        <div className="tg-typing">
          <div className="tg-typing-dot"/>
          <div className="tg-typing-dot"/>
          <div className="tg-typing-dot"/>
        </div>

      </div>

      {/* Fake input bar */}
      <div className="tg-input-bar">
        <div className="tg-input-field">Digite uma mensagem…</div>
        <button className="tg-send-btn" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  );
}

function HeroPillars(){
  const pillars = [
    { tag: '01 Curso', name: '4 módulos / 16 aulas base + atualizações futuras', desc: 'Direto ao ponto, com execução real' },
    { tag: '02 Kit de Ignição', name: 'Configuração guiada', desc: 'Identidade, contexto, regras e memória' },
    { tag: '03 Suporte', name: 'Grupo do Whatsapp - Comunidade Viva', desc: 'Apoio para dúvidas gerais e técnicas' },
    { tag: '04 Curso Vivo', name: 'Sempre Atualizado', desc: 'Novas aulas adicionadas conforme a IA avança. Você nunca fica para trás.' },
  ];
  return (
    <div className="hero-pillars reveal" style={{'--reveal-delay':'260ms'}}>
      {pillars.map((p, i) => (
        <div key={i} className="pillar">
          <div className="pillar-tag">{p.tag}</div>
          <div className="pillar-name">{p.name}</div>
          <div className="pillar-desc">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ───────────── VIDEO ───────────── */
function Video({ t }){
  return (
    <section className="video">
      <div className="container">
        <div className="video-frame reveal">
          <div className="video-meta"><strong>diego spanevello</strong> · apresentação · 04:32</div>
          <div className="video-play">
            <button className="video-play-btn" aria-label="Reproduzir">▶</button>
          </div>
        </div>
        <p className="video-caption">Assista a apresentação rápida e veja como funciona um Super Agente real, criado em poucos minutos.</p>
      </div>
    </section>
  );
}

/* ───────────── PROBLEM ───────────── */
function Problem({ t }){
  const noiseCards = [
    { icon: '📦', label: '50 agentes prontos',         price: 'R$197'      },
    { icon: '▶',  label: 'Tutorial no YouTube',        price: '3h'         },
    { icon: '🧵', label: 'Thread com 12 GPTs',         price: null         },
    { icon: '✨', label: 'App que vai mudar tudo',     price: 'essa semana'},
    { icon: '📋', label: 'Curso completo de IA',       price: 'R$397'      },
    { icon: '🗂️', label: 'Dezenas de skills bagunçadas', price: null       },
  ];
  const resultLines = [
    'Uma pasta com arquivos que você nunca mais abriu',
    'Um curso parado no módulo 2',
    'Um agente que esquece tudo. Toda vez.',
  ];
  return (
    <section className="problem">
      <div className="container">
        <div className="problem-hd problem-hd-split">
          <div className="problem-hd-text">
            <span className="section-eyebrow">O mercado de IA</span>
            <h2 className="h-display h2 reveal">O mercado virou um camelô de agentes. <em>Você não precisa de 50. Precisa de um.</em></h2>
          </div>
          <div className="problem-hd-img reveal" style={{'--reveal-delay':'80ms'}}>
            <img src="img/noise-tools.png" alt="O camelô de ferramentas de IA" className="problem-camel-img"/>
          </div>
        </div>

        {/* Ruído acumulado */}
        <div className="noise-strip-label reveal">O que você já tentou</div>
        <div className="noise-strip reveal">
          {noiseCards.map((c, i) => (
            <div key={i} className="noise-card">
              <span className="noise-icon">{c.icon}</span>
              <span className="noise-label">{c.label}</span>
              {c.price && <span className="noise-price">{c.price}</span>}
            </div>
          ))}
        </div>

        {/* Seta resultado */}
        <div className="noise-arrow reveal">
          <div className="noise-arrow-line"/>
          <span className="noise-arrow-label">O que sobrou</span>
        </div>

        {/* Resultado vazio — tipografia grande riscada */}
        <div className="noise-result reveal">
          <div className="result-items">
            {resultLines.map((line, i) => (
              <div key={i} className="result-line">
                <div className="result-dot"/>
                <span className={`result-text${i === resultLines.length - 1 ? ' last' : ''}`}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Punchline */}
        <div className="problem-punch-block reveal">
          <span className="punch-1">Isso não é agente.</span>
          <span className="punch-2">É promessa enrolada em ilusão.</span>
        </div>

        {/* Bridge */}
        <div className="problem-bridge reveal">
          <div className="bridge-dot"/>
          <p className="bridge-text">O problema não é você. <strong>É que ninguém te ensinou a estrutura.</strong></p>
        </div>

      </div>
    </section>
  );
}

/* ───────────── COMPARISON (contraste tipográfico) ───────────── */
function Agitation({ t }){
  const contrasts = [
    { bad: '50 agentes genéricos que você nunca vai usar de verdade',           good: 'Um agente que te conhece e trabalha por você todo dia',       desc: '"Agente, me faz um resumo dos leads de ontem". Ele já sabe qual funil, qual produto, qual tom usar.' },
    { bad: 'Esquece tudo a cada conversa. Você começa do zero toda vez.',       good: 'Memória organizada: ele não começa do zero toda vez',            desc: '7h da manhã, no café. Você recebe o briefing do dia. Todo dia, pontualmente.' },
    { bad: 'Só funciona no navegador, longe de onde você vive',                 good: 'Acessível pelo celular. Começa pelo Telegram e evolui para novos canais.'          },
    { bad: 'Você continua fazendo tudo. O agente só responde quando perguntado.', good: 'O agente organiza, lembra e executa tarefas guiadas. Você decide o que importa.',               desc: 'Resumo de reunião, resposta de suporte, análise de campanha: acontece sem você abrir o computador.' },
    { bad: 'Semanas de setup. Nada funciona de verdade.',                       good: 'Primeira versão no ar rápido. Depois, adaptada à sua realidade.',            desc: 'No ar em poucos minutos. Trabalhando 24/7 e evoluindo com você.' },
  ];
  return (
    <section className="comparison-section">
      <div className="container">
        <div className="comparison-hd">
          <span className="section-eyebrow">A diferença na prática</span>
          <h2 className="h-display h2 reveal">O que muda quando o agente <em>é construído do jeito certo.</em></h2>
        </div>

        <div className="contrast-list reveal">
          {contrasts.map((c, i) => (
            <div key={i} className="contrast-item">
              <div className="contrast-before">
                <span className="before-label">O que vendem por aí</span>
                <p className="before-text">{c.bad}</p>
              </div>
              <div className="contrast-after">
                <span className="after-label">O que você vai ter</span>
                <p className="after-text">{c.good}</p>
                {c.desc && <p className="after-desc">{c.desc}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="comp-close reveal">
          <div className="close-copy">
            <span className="comp-close-label">Do zero ao agente no ar</span>
            <p className="comp-close-title">Você sai com um agente rodando <em>no seu celular. Hoje.</em></p>
            <p className="comp-close-sub">Sem curso parado no módulo 2.<br/>Sem ferramenta que você nunca mais abre.</p>
          </div>
          <a className="btn btn-primary btn-big" href="#oferta">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── CHALLENGES ───────────── */
function Challenges({ t }){
  const ch = [
    { tag: 'Você comprou, assistiu, salvou: mas nunca saiu do lugar', text: 'Seguiu perfis, assistiu tutoriais, salvou posts sobre IA. Tinha vontade. Tinha interesse. **Mas na hora de colocar em prática, algo sempre travou: e você ficou no mesmo lugar.**' },
    { tag: 'Achou que era muito técnico, para "programador". E desistiu antes de tentar.', text: 'Parecia complicado demais. Palavras que você nunca ouviu, telas sem explicação, passos que não faziam sentido. **Você chegou à conclusão de que aquilo era pra outro perfil de pessoa. Não pra você.**' },
    { tag: 'Tentou de tudo um pouco. Nada funcionou.', text: 'ChatGPT um dia, outra ferramenta na semana seguinte, aquele app que um amigo indicou. Cada um diferente, cada um com suas regras. **No final, você voltou a fazer tudo na mão mesmo. Como sempre.**' },
    { tag: 'Você investiu. A estrutura nunca foi entregue.', text: 'Já assinou plataforma, comprou pacote de ferramentas, seguiu o passo a passo de alguém na internet. A promessa era grande. **O que faltou não foi esforço. Foi método. Ninguém te ensinou como montar a fundação.**' },
  ];
  return (
    <section className="challenges">
      <div className="container">
        <div className="challenges-hd reveal">
          <span className="section-eyebrow">Por que não funcionou antes</span>
          <h2 className="h-display h2">Você já tentou. Você já investiu. <em>Por que ainda não deu certo?</em></h2>
        </div>
        <div className="challenges-grid">
          {ch.map((c, i) => (
            <div key={i} className="challenge reveal" style={{'--reveal-delay': `${i*60}ms`}}>
              <div className="challenge-num">{String(i+1).padStart(2,'0')}</div>
              <div className="challenge-content">
                <div className="challenge-tag">{c.tag}</div>
                <div className="challenge-text" dangerouslySetInnerHTML={withStrong(c.text)}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── MODULES (5 destaques agrupando os 9) ───────────── */
function Modules({ t }){
  const [active, setActive] = useState(0);

  const modules = [
    {
      num: '00', name: 'Visão e preparação',
      sub: 'Entenda por que agentes de IA estão virando uma camada de execução em vários mercados. Escolha onde seu Super Agente pode gerar mais valor.',
      lessons: [
        'Cenário dos agentes de IA e assimetria de capacidade',
        'O que você vai construir ao longo do curso',
        'Casos de uso em serviços, cripto, negócios e agenda pessoal',
        'Pré-requisitos, custos, rotas e cuidados antes da instalação',
      ]
    },
    {
      num: '01', name: 'Agente no ar',
      sub: 'Aqui você tira o agente do papel. A primeira versão nasce simples, mas funcional: o objetivo é colocar o agente respondendo em um canal real.',
      lessons: [
        'Como preparar sua conta e provider de IA',
        'Como funciona a infraestrutura básica do agente',
        'Como instalar e configurar o OpenClaw',
        'Como validar o primeiro contato do agente no Telegram',
      ]
    },
    {
      num: '02', name: 'Kit de Ignição',
      sub: 'Depois que o agente responde, começa a parte que mais importa: transformar um agente genérico em um agente com contexto, identidade, memória e regras próprias.',
      lessons: [
        'Como ativar o Kit de Ignição no agente',
        'Como diagnosticar a base inicial do seu agente',
        'Como definir identidade, função, tom e limites',
        'Como registrar contexto do usuário e regras de trabalho',
        'Como criar memória e registros úteis para evolução',
      ]
    },
    {
      num: '03', name: 'Segurança e capacidades',
      sub: 'Com a base pronta, você aprende a proteger o agente e ampliar o que ele consegue fazer sem transformar tudo em risco.',
      lessons: [
        'Como tratar credenciais com segurança',
        'Quando usar painel seguro, .env local protegido ou 1Password',
        'Como ativar memória semântica com claude-mem',
        'Como pensar skills, integrações e workflows',
        'Como usar grupos, tópicos, WhatsApp e outros canais com cuidado',
        'Como proteger o agente contra prompt injection e instruções externas maliciosas',
      ]
    },
  ];

  // Toggle para mobile accordion
  function toggle(i) { setActive(active === i ? -1 : i); }

  return (
    <section id="modules" className="modules">
      <div className="container">
        <div className="modules-hd reveal">
          <span className="section-eyebrow">O curso · 4 módulos e 16 aulas base + atualizações futuras</span>
          <h2 className="h-display h2">Do entendimento inicial ao agente no ar, <em>com contexto, memória, segurança e capacidades reais.</em></h2>
        </div>

        {/* ── DESKTOP: dois painéis ── */}
        <div className="modules-ui reveal">
          <div className="modules-tabs">
            <div className="modules-tabs-label">MÓDULOS</div>
            {modules.map((m, i) => (
              <button key={i}
                className={`module-tab${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}>
                <span className="module-tab-name">{m.name}</span>
                <span className="module-tab-badge">{m.num}</span>
              </button>
            ))}
          </div>
          {active >= 0 && (
          <div className="module-panel" key={active}>
            <div className="module-panel-hd">
              <span className="module-panel-num">{modules[active].num}</span>
              <div>
                <h3 className="module-panel-title">{modules[active].name}</h3>
                <p className="module-panel-sub">{modules[active].sub}</p>
              </div>
            </div>
            <ul className="module-lessons">
              {modules[active].lessons.map((l, i) => (
                <li key={i} className="module-lesson">
                  <span className="module-lesson-icon">▶</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>

        {/* ── MOBILE: accordion ── */}
        <div className="modules-accordion reveal">
          {modules.map((m, i) => (
            <div key={i} className={`module-acc${active === i ? ' open' : ''}`}>
              <button className="module-acc-hd" onClick={() => toggle(i)}>
                <span className="module-acc-num">{m.num}</span>
                <span className="module-acc-name">{m.name}</span>
                <span className="module-acc-arrow">{active === i ? '−' : '+'}</span>
              </button>
              {active === i && (
                <div className="module-acc-body">
                  <p className="module-acc-sub">{m.sub}</p>
                  <ul className="module-lessons">
                    {m.lessons.map((l, j) => (
                      <li key={j} className="module-lesson">
                        <span className="module-lesson-icon">▶</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Faixa CTA */}
        <div className="modules-cta-band reveal">
          <p className="modules-cta-text">Em menos de uma tarde, seu agente estará respondendo no seu celular.</p>
          <a className="btn btn-primary" href="#oferta">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
        </div>

      </div>
    </section>
  );
}

/* ───────────── BRIDGE QUOTE (Results → Testimonials) ───────────── */
function ProofBridge(){
  return (
    <div className="proof-bridge reveal">
      <div className="proof-bridge-rule"/>
      <p className="proof-bridge-quote"><em>Não é demonstração. É o que roda minha empresa todo dia.</em></p>
      <span className="proof-bridge-attr">Diego Spanevello · Fundador, INTUS HUB</span>
    </div>
  );
}

/* REMOVIDO: ModuleVisGfx — não usado no novo layout */
function ModuleVisGfx({ index }){
  return null; /* mantido por compatibilidade, não renderiza nada */
}


/* ───────────── RESULTS ───────────── */
function Results({ t }){
  const items = [
    { icon: '⚡', title: 'Seu Super Agente no ar', desc: 'Uma primeira versão funcional, acessível pelo celular e pronta para ser adaptada à sua rotina.' },
    { icon: '🪪', title: 'Identidade configurada', desc: 'Ele sabe exatamente quem é, qual o papel dele e o que não deve fazer. Nunca mais genérico.' },
    { icon: '🧠', title: 'Memória organizada', desc: 'Registros úteis e memória para o agente não começar do zero toda vez.' },
    { icon: '📁', title: 'Contexto real sobre você', desc: 'Arquivos-base com suas informações, objetivos e preferências. A fundação que torna o agente útil de verdade.' },
    { icon: '🗺️', title: 'Mapa do workspace', desc: 'O agente se localiza e executa sem se perder. Organização que escala.' },
    { icon: '▶️', title: 'Primeiras tarefas reais', desc: 'Organização, apoio operacional, registros e tarefas guiadas para começar a usar o agente na prática.' },
    { icon: '🧭', title: 'Kit de Ignição incluso', desc: 'A condução guiada para configurar identidade, contexto, regras, memória e registros úteis depois que o agente já está respondendo.' },
    { icon: '📈', title: 'Fundação para evoluir', desc: 'Estrutura para adicionar ferramentas, canais e automações conforme você avança. O agente de amanhã é melhor que o de hoje.' },
  ];
  return (
    <section className="results">
      <div className="container">
        <div className="results-hd reveal">
          <span className="section-eyebrow">O que você leva</span>
          <h2 className="h-display h2">Ao terminar o curso, <em>você terá:</em></h2>
        </div>
        <div className="results-grid">
          {items.map((item, i) => (
            <div key={i} className="result-item reveal" style={{'--reveal-delay': `${(i%4)*50}ms`}}>
              <div className="result-icon">{item.icon}</div>
              <div className="result-body">
                <div className="result-title">{item.title}</div>
                <div className="result-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="results-footer reveal">
          <p>Não é um agente de demonstração. <strong>É o seu agente funcionando de verdade.</strong></p>
          <a className="btn btn-primary btn-big" href="#oferta">{t.ctaPrimary} <span className="btn-arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── PROOF SECTION (Diego + Agentes + Carrossel) ───────────── */
function Testimonials({ t }){
  const aspira = [
    'Suporte do IntusCripto Club: responde, filtra, escala',
    'Analytics de redes, Instagram e newsletter',
    'Meta Ads e carrosséis: análise e otimização',
    'Briefing diário de cripto, trade, DeFi e mercado',
    'Agenda pessoal, sem eu precisar pedir',
  ];
  const clovis = [
    'Documentação viva: captura e organiza tudo',
    'Decisões dos sócios registradas com contexto',
    'Mapas de produtos e processos sempre atualizados',
    'Mantém a operação viva mesmo quando ninguém olha',
  ];
  const students = [
    { initials:'DB', name:'Denys Buso', role:'Conset Capital', img:'img/denys.jpg',
      quote:'O treinamento me ajudou a **acelerar a construção e validação dos agentes**, reduzindo retrabalho, aumentando a eficiência e otimizando o consumo de tokens de forma estratégica e inteligente!',
      result:'Agentes em produção · tokens otimizados' },
    { initials:'AR', name:'Arcanjo', role:'Tráfego pago · Low ticket', img:'img/arcanjo.jpg',
      quote:'Eu comecei do zero, sem saber estruturar campanhas. O curso me mostrou um caminho claro. **Hoje uso IA para criar criativos, analisar produtos e montar uma operação organizada para vender no digital.**',
      result:'Operação organizada do zero' },
    { initials:'NH', name:'Natanael H.', role:'Freelancer IA e Investidor Cripto', img:'img/natanael.jpg',
      quote:'Minha curva de aprendizado foi gigantesca. O uso de agente de IA nas minhas vendas e serviços **se tornou indispensável**, no meu negócio e também nos meus investimentos.',
      result:'IA aplicada em vendas e investimentos' },
    { initials:'LM', name:'Lukas Minervini', role:'Lançador de Produtos Digitais', img:'img/avatar.jpg',
      quote:'Conteúdo direto, sem enrolação. Apliquei o que aprendi no Super Agente e **destravei negociações que estavam paradas há meses**. Pagou o investimento logo nas primeiras semanas, agora opero em todas as frentes e em todas as demandas da operação.',
      result:'Investimento recuperado nas primeiras semanas' },
  ];
  /* Repete até ter volume suficiente pra loop infinito em qualquer tela */
  const repeated = Array(8).fill(students).flat();
  return (
    <section id="provas" className="proof-sec">
      <div className="container">
        <div className="proof-hd reveal">
          <span className="section-eyebrow">Skin in the game</span>
          <h2 className="h-display h2">Um Humano. <em>Dois Super Agentes.</em></h2>
          <p className="proof-hd-sub">Eu coloco em prática o que ensino. <strong>Dois negócios reais</strong>, cada um com um Super Agente responsável. <strong>Aspira</strong> cuida do <strong>Intus Cripto Club</strong>. <strong>Clóvis</strong> mantém a estrutura do <strong>INTUS HUB</strong>. Cada agente com contexto, função e identidade própria, que rodam minha operação todo dia.<br/><br/>É exatamente isso que <strong>você vai construir</strong>.</p>
        </div>

        <div className="proof-layout reveal">
          {/* Diego */}
          <div className="diego-card">
            <div className="diego-avatar-box">
              <img src="img/diego.png" alt="Diego Spanevello" className="diego-img"
                onError={(e)=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
              <div className="diego-initials" style={{display:'none'}}>DS</div>
            </div>
            <div className="diego-body">
              <span className="proof-badge proof-badge-prof">Seu Professor</span>
              <h3 className="diego-name">Diego Spanevello</h3>
              <div className="diego-role">Fundador · INTUS HUB</div>
              <div className="diego-speech">
                <p>Sou o fundador do IntusCripto Club, com mais de 1.000 membros ativos. Formei <strong>6.000+ alunos</strong> em DeFi, sou referência no YouTube com 17K inscritos, 40K no Instagram, fui professor de MBA em finanças descentralizadas e palestrei nos maiores eventos do Brasil.</p>
                <p>O que mudou minha operação foi entender como estruturar um agente de IA. <strong>Não virei programador. Aprendi o mecanismo.</strong> E foi daí que o IntusCripto Club evoluiu pro INTUS HUB: cripto, IA e negócios digitais num só lugar.</p>
                <p>Hoje dois agentes rodam minha empresa enquanto continuo fazendo o que sei fazer: criar, ensinar e gerar resultado no digital.</p>
              </div>
            </div>
          </div>

          {/* Aspira + Clóvis */}
          <div className="agents-col">
            <div className="agent-card">
              <div className="agent-photo-box">
                <img src="img/aspira.png" alt="Aspira" className="agent-photo-img"
                  onError={(e)=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                <div className="agent-photo-fallback">AS</div>
              </div>
              <div className="agent-body">
              <div className="agent-hd">
                <div>
                  <span className="proof-badge proof-badge-agent">Super Agente</span>
                  <div className="agent-name">Aspira</div>
                  <div className="agent-role-lbl">Agente · Operação 24/7</div>
                </div>
              </div>
              <p className="agent-intro">"Aspira cuida de tudo que seria interrupção na minha rotina. <strong>Opera sem parar. Eu só entro quando preciso decidir algo.</strong>"</p>
              <div className="agent-tasks">
                {aspira.map((item, i) => <div key={i} className="agent-task"><div className="task-dot"/><span>{item}</span></div>)}
              </div>
              </div>
            </div>
            <div className="agent-card">
              <div className="agent-photo-box">
                <img src="img/clovis.png" alt="Clóvis" className="agent-photo-img"
                  onError={(e)=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                <div className="agent-photo-fallback">CL</div>
              </div>
              <div className="agent-body">
              <div className="agent-hd">
                <div>
                  <span className="proof-badge proof-badge-agent">Super Agente</span>
                  <div className="agent-name">Clóvis</div>
                  <div className="agent-role-lbl">Agente · Estrutura</div>
                </div>
              </div>
              <p className="agent-intro">"Clóvis é o cérebro da empresa. <strong>Quando preciso tomar uma decisão, ele já sabe o histórico inteiro.</strong>"</p>
              <div className="agent-tasks">
                {clovis.map((item, i) => <div key={i} className="agent-task"><div className="task-dot"/><span>{item}</span></div>)}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="diego-quote reveal">
          <p>Eu sei o que funciona porque uso todo dia. <strong>Em menos de uma tarde, você vai ter o seu agente no ar</strong>, com a mesma estrutura que roda minha operação.</p>
          <div className="diego-quote-attr">— Diego Spanevello · Fundador, INTUS HUB</div>
        </div>
      </div>

      {/* Carrossel */}
      <div className="students-hd reveal">
        <span className="section-eyebrow">Resultados reais</span>
        <h2 className="h-display h3-proof">Quem fez, <em>aplica.</em></h2>
        <p className="students-sub">Empreendedores, consultores, profissionais de marketing, gestores, traders.<br/>Contextos diferentes. Resultado igual: agente funcionando no celular.</p>
      </div>

      <div className="carousel-wrap">
        <div className="carousel-track"
          onTouchStart={(e)=>{
            const t = e.currentTarget;
            t.style.animationPlayState = 'paused';
            clearTimeout(t._resumeTimer);
          }}
          onTouchEnd={(e)=>{
            const t = e.currentTarget;
            t._resumeTimer = setTimeout(()=>{ t.style.animationPlayState = 'running'; }, 3000);
          }}
        >
          {repeated.map((s, i) => (
            <div key={i} className="testi-card">
              <div className="testi-hdr">
                <div className="testi-photo">
                  <img src={s.img} alt={s.name} onError={(e)=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                  <div className="testi-initials" style={{display:'none'}}>{s.initials}</div>
                </div>
                <div>
                  <div className="testi-name">{s.name}</div>
                  <div className="testi-meta">{s.role}</div>
                </div>
              </div>
              <div className="testi-bubble" dangerouslySetInnerHTML={withStrong(s.quote)}/>
              <div className="testi-result"><div className="testi-dot">✓</div>{s.result}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── MARQUEE ───────────── */
function Marquee({ t }){
  const items = [
    'Crie um Super Agente de IA',
    'Acesso por 12 meses',
    `6x ${t.currency} 16,50`,
    'Comunidade no WhatsApp',
    'Kit de Ignição incluso',
    '4 módulos práticos',
  ];
  const doubled = [...items, ...items, ...items];
  return (
    <section className="marquee" style={{'--marquee-dur': `${80 - (t.marqueeSpeed||40)*0.6}s`}}>
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <div key={i} className="marquee-item">
            <span className="dot"/>{it}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── ROADMAP ───────────── */
function Roadmap({ t }){
  const items = [
    { num: '01', when: 'já incluso', title: 'Kit de Ignição', desc: 'O guia prático que conduz a configuração do agente depois que ele está no ar: identidade, contexto, regras, memória e registros úteis.' },
    { num: '02', when: 'atualizações do produto', title: 'Atualizações vivas', desc: 'Novos materiais, ajustes e correções acompanhando o que muda no ecossistema.' },
    { num: '+', when: 'em produção', title: 'Novos módulos', desc: 'Mais cases, integrações específicas e habilidades extras pro seu Super Agente.' },
  ];
  return (
    <section className="roadmap">
      <div className="container">
        <div className="roadmap-hd reveal">
          <span className="section-eyebrow">O curso evolui</span>
          <h2 className="h-display h2">Curso vivo <em>de verdade.</em></h2>
          <p className="lead" style={{margin:'24px auto 0'}}>Cada avanço significativo da IA, novas aulas. Você acompanha a evolução sem custo extra.</p>
        </div>
        <div className="roadmap-grid">
          {items.map((it, i) => (
            <div key={i} className="roadmap-card reveal" style={{'--reveal-delay': `${i*80}ms`}}>
              <div className={`roadmap-num ${i === items.length-1 ? 'last' : ''}`}>{it.num}</div>
              <div className="roadmap-when">{it.when}</div>
              <h4 className="h4">{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FOUNDERS ───────────── */
/* Conteúdo migrado para Testimonials (ProofSection). Mantido para compatibilidade do toggle. */
function Founders({ t }){ return null; }

/* ───────────── OFFER ───────────── */
function Offer({ t }){
  const main = [
    'Curso completo · 4 módulos, 16 aulas base e atualizações futuras',
    'Acesso por 12 meses · pagamento único',
    '**Kit de Ignição** · configuração guiada de identidade, contexto, regras e memória',
    'Materiais visuais de cada aula · revise quando quiser',
    'Comunidade de suporte no **WhatsApp** com agente de apoio (12 meses)',
    'Atualizações do produto e novas aulas futuras · sem custo extra',
    'Acesso imediato após o pagamento',
    'Garantia incondicional de 7 dias',
  ];
  const valueStack = [
    { name: 'Curso completo · 4 módulos, 16 aulas base e atualizações futuras', price: 'R$ 497'   },
    { name: 'Kit de Ignição · configuração guiada de identidade e memória',     price: 'R$ 197'   },
    { name: 'Materiais visuais de cada aula',                                   price: 'R$ 97'    },
    { name: 'Comunidade de suporte no WhatsApp · 12 meses',                     price: 'R$ 197'   },
    { name: 'Atualizações do produto e novas aulas futuras',                    price: 'incluso'  },
    { name: 'Garantia incondicional · 7 dias',                                  price: 'incluso'  },
    { name: 'Mais cases reais de aplicação',                                    price: 'bônus'    },
    { name: 'Integrações avançadas (agenda, CRM, planilhas)',                   price: 'bônus'    },
    { name: 'Novos arquivos-base e templates',                                  price: 'bônus'    },
  ];
  return (
    <section id="oferta" className="offer">
      <div className="container">
        <div className="offer-card reveal">
          <span className="section-eyebrow">Oferta especial · Válida por tempo limitado</span>
          <h2 className="h-display h2">Tudo o que você leva <em>hoje.</em></h2>

          <div className="offer-grid" style={{marginTop:'40px'}}>
            {/* LEFT: value stack */}
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
                <span className="value-total-num">R$ 997,00</span>
              </div>
            </div>

            {/* RIGHT: price box */}
            <div className="offer-price">
              <div className="offer-price-launch-label">Mas hoje você paga apenas:</div>
              <div className="offer-price-installment">
                <span className="price-times">6x</span>
                <div className="price-main">
                  <span className="currency">{t.currency}</span>16,50
                </div>
              </div>
              <div className="offer-price-vista">ou {t.currency} {t.priceNow} à vista</div>
              <CountdownTimer />
              <a href="#" className="btn btn-primary btn-big">Quero meu Super Agente <span className="btn-arrow">→</span></a>
              <div className="offer-price-note">🔒 1 ano de acesso · 7 dias de garantia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ───────────── COUNTDOWN TIMER ───────────── */
function CountdownTimer(){
  const DURATION = 59 * 60; // 59 minutos em segundos

  function getRemaining(){
    const key = 'sa_offer_end';
    let end = parseInt(sessionStorage.getItem(key) || '0', 10);
    if(!end || end < Date.now()){
      end = Date.now() + DURATION * 1000;
      sessionStorage.setItem(key, end);
    }
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
  }

  const [secs, setSecs] = useState(getRemaining);

  useEffect(() => {
    if(secs <= 0) return;
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

/* ───────────── GUARANTEE ───────────── */
function Guarantee({ t }){
  return (
    <section className="guarantee">
      <div className="container">
        <div className="guarantee-card reveal">
          <div className="guarantee-badge">
            <div className="guarantee-pulse-ring"/>
            {/* Texto rotativo */}
            <svg className="guarantee-spin" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="guar-tp" d="M 90,10 A 80,80 0 1,1 89.9,10"/>
              </defs>
              <text fontFamily="Inter Tight, sans-serif" fontSize="8.5" fontWeight="600"
                    fill="rgba(255,255,255,0.45)" letterSpacing="5">
                <textPath href="#guar-tp" startOffset="0%">
                  GARANTIA TOTAL  ·  7 DIAS  ·  GARANTIA TOTAL  ·
                </textPath>
              </text>
            </svg>
            {/* Anéis e número fixos */}
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
              {/* Glow atrás */}
              <text x="90" y="104" textAnchor="middle"
                    fontFamily="Inter Tight, sans-serif" fontSize="60" fontWeight="900"
                    fill="#E84000" opacity="0.4" filter="url(#guar-glow)">7</text>
              {/* Número nítido na frente */}
              <text x="90" y="104" textAnchor="middle"
                    fontFamily="Inter Tight, sans-serif" fontSize="60" fontWeight="900"
                    fill="#E84000">7</text>
              <text x="90" y="122" textAnchor="middle"
                    fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="700"
                    fill="rgba(255,255,255,0.5)" letterSpacing="3">DIAS</text>
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

/* ───────────── FAQ ───────────── */
function Faq({ t }){
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'Preciso saber programar?', a: 'Não. O curso foi pensado para configuração guiada, não para ensinar programação. Você vai seguir uma rota prática para colocar o agente no ar, configurar a base e evoluir com o Kit de Ignição. Se travar em algum ponto, usa o suporte para destravar.' },
    { q: 'Já tentei IA antes e ficou genérico. Por que seria diferente?', a: 'Porque o problema não era a ferramenta. Era a falta de estrutura. Um agente sem identidade, sem contexto e sem memória vai parecer ChatGPT com nome diferente. O que muda aqui é a fundação: você vai configurar identidade clara, arquivos-base com seu contexto real, memória persistente e estrutura de evolução. É a diferença entre dar uma ordem isolada e ter um colaborador que conhece você.' },
    { q: 'Quanto tempo leva pra ter o agente no ar?', a: 'A primeira versão pode ir ao ar em poucos minutos quando a rota está pronta. O que leva mais tempo, e é o que realmente diferencia o curso, é configurar identidade, contexto, memória, segurança e capacidades. A ideia é sair com um agente funcional e uma base para evoluir.' },
    { q: 'Vou receber 50 agentes genéricos prontos?', a: 'Não. E essa é a diferença. Você sai com UM Super Agente seu, com identidade, memória e contexto reais. Não 50 workflows soltos que ninguém usa.' },
    { q: 'Qual o custo mensal pra rodar o agente?', a: 'O custo depende da rota escolhida, do provider de IA e da infraestrutura. No curso você entende as opções antes de instalar, para escolher uma configuração compatível com seu orçamento e seu nível de controle.' },
    { q: 'O que é o Kit de Ignição?', a: 'É o guia prático que conduz a configuração do seu agente depois que ele está no ar. Ele ajuda a definir identidade, contexto do usuário, regras, limites, memória e registros úteis, para o agente deixar de ser genérico e começar a operar com base própria.' },
    { q: 'O acesso ao curso e ao grupo do WhatsApp é vitalício?', a: 'Não. O acesso ao curso e à comunidade WhatsApp é por 12 meses: tempo mais que suficiente para aplicar tudo e evoluir. No checkout, você pode optar pelo upgrade de acesso vitalício por apenas R$ 67,90 uma única vez.' },
    { q: 'Aspira e Clóvis são reais?', a: 'Sim. Aspira e Clóvis são agentes reais usados nas operações do Intus Cripto Club e na estrutura do Intus Hub. O curso usa a lógica dessa estrutura como referência, adaptada para uma versão prática e acessível para o aluno começar.' },
    { q: 'Tem garantia?', a: '7 dias incondicionais. Não gostou, pede reembolso, recebe 100%. Sem perguntas, sem burocracia.' },
  ];
  return (
    <section id="faq" className="faq">
      <div className="container faq-grid">
        <div>
          <span className="section-eyebrow">Dúvidas</span>
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

/* ───────────── LEAD MODAL ───────────── */
let _setModalOpen = null;
function openLeadModal(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (_setModalOpen) _setModalOpen(true);
}

function LeadModal({ t }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _setModalOpen = setOpen;
    return () => { _setModalOpen = null; };
  }, []);

  // Intercepta todos os cliques em CTAs primários (href="#oferta")
  useEffect(() => {
    function intercept(e) {
      const link = e.target.closest('a[href="#oferta"], a[href="#"], .btn-primary');
      if (link && !link.closest('.modal-box')) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener('click', intercept);
    return () => document.removeEventListener('click', intercept);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Aqui você pode adicionar integração com ActiveCampaign / RD Station / webhook
    // Ex: fetch('/api/lead', { method:'POST', body: JSON.stringify(form) })
    setTimeout(() => {
      window.location.href = t.checkoutUrl || '#oferta';
    }, 500);
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>

        <div className="modal-badge">FALTA SÓ UM PASSO</div>

        <h2 className="modal-title">Preencha seus dados<br/>e garanta sua vaga</h2>
        <p className="modal-sub">
          {t.currency} {t.priceNow} · 1 ano de acesso.
        </p>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <input
            className="modal-input"
            type="text"
            placeholder="Seu nome"
            required
            autoComplete="name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="modal-input"
            type="email"
            placeholder="Seu melhor email"
            required
            autoComplete="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <div className="modal-phone-row">
            <span className="modal-phone-prefix">🇧🇷 +55</span>
            <input
              className="modal-input modal-input-phone"
              type="tel"
              placeholder="WhatsApp (opcional)"
              autoComplete="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-big modal-submit"
            disabled={loading}
          >
            {loading ? 'Redirecionando…' : <>Continuar para o checkout <span className="btn-arrow">→</span></>}
          </button>
        </form>

        <p className="modal-footer-note">
          Ao continuar você é redirecionado para o <strong>checkout seguro</strong>.
        </p>
      </div>
    </div>
  );
}

/* ───────────── WHATSAPP FLOAT ───────────── */
const WA_LINK = 'https://wa.me/555596526047';
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function WhatsappFloat(){
  return (
    <a href={WA_LINK} className="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
      <span className="wa-float-icon"><WaIcon/></span>
      <span className="wa-float-pulse"/>
    </a>
  );
}

/* ───────────── SUPPORT ───────────── */
function Support({ t }){
  return (
    <section className="support">
      <div className="container">
        <div className="support-card reveal">
          <div className="support-badge">◈ Suporte Direto</div>
          <h2 className="h-display h2">Fale com <em>nosso time</em></h2>
          <p>Tire suas dúvidas sobre a oferta, o curso e as formas de pagamento diretamente com um dos nossos consultores.</p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-big">
            <span className="btn-wa-icon"><WaIcon/></span>
            Tirar dúvidas por WhatsApp
          </a>
          <div className="support-card-meta">Atendimento humano · seg a sex · 9h às 18h</div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── CTA ───────────── */
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
        <div className="cta-meta">6x R$16,50 · ou R$87,90 à vista · acesso imediato</div>
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */
function Footer({ t }){
  const socials = [
    {
      label: 'Instagram', href: 'https://instagram.com/intushub',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    },
    {
      label: 'YouTube', href: 'https://youtube.com/@intushub',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    },
    {
      label: 'X', href: 'https://x.com/intushub',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    },
    {
      label: 'TikTok', href: 'https://tiktok.com/@intushub',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
    },
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
                 className="social-icon" aria-label={s.label}>
                {s.icon}
              </a>
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
  Announcement, Nav, Hero, StatsBar, Video, Problem, Agitation, Challenges, Modules,
  Results, ProofBridge, Testimonials, Marquee, Roadmap, Founders, Offer, OrderBump,
  Guarantee, Faq, Support, WhatsappFloat, LeadModal, Cta, Footer
});
