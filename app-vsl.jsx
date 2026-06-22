// app-vsl.jsx — Versão VSL Pura · Super Agente IA

const TWEAK_DEFAULTS_VSL = {
  accent:             '#FE5000',
  currency:           'R$',
  priceNow:           '97',
  priceFull:          '988',
  priceInstallments:  '12x R$16,50',
  checkoutUrl:        'https://pay.hotmart.com/XXXXXXX',
  ctaPrimary:         'Quero meu Super Agente',
};

function AppVsl(){
  const t = TWEAK_DEFAULTS_VSL;

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
  }, []);

  useScrollReveal(true);
  useParallax(false);

  return (
    <React.Fragment>
      <Nav t={t}/>
      <main>
        <Hero t={t}/>
        <Vsl t={t}/>
        <Offer t={t}/>
        <Guarantee t={t}/>
        <Faq t={t}/>
        <Footer t={t}/>
      </main>
      <WhatsappFloat/>
      <CheckoutRedirect t={t}/>
    </React.Fragment>
  );
}

window.AppVsl = AppVsl;

const rootEl = document.getElementById('root');
if(rootEl){
  ReactDOM.createRoot(rootEl).render(<AppVsl/>);
}
