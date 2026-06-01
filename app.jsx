// app.jsx — Super Agente IA · INTUS HUB

const { useEffect } = React;

function App(){
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-ink', getContrastInk(t.accent));
    root.style.setProperty('--f-display', `"${t.fontDisplay}", "Inter Tight", ui-sans-serif, system-ui, sans-serif`);
    root.style.setProperty('--r', t.radius + 'px');
    root.style.setProperty('--r-sm', (t.radius*0.55) + 'px');
    root.style.setProperty('--r-lg', (t.radius*1.6) + 'px');
    root.style.setProperty('--r-xl', (t.radius*2) + 'px');
    root.dataset.palette = t.palette;
    root.dataset.density = t.density;
  }, [t.accent, t.fontDisplay, t.radius, t.palette, t.density]);

  useScrollReveal(t.scrollReveal);
  useCustomCursor(t.customCursor);
  useParallax(t.parallax);

  return (
    <React.Fragment>
      {t.showAnnouncement && <Announcement t={t}/>}
      {t.showNav && <Nav t={t}/>}
      {t.showHero && <Hero t={t}/>}
      <StatsBar/>
      {t.showProblem && <Problem t={t}/>}
      {t.showChallenges && <Challenges t={t}/>}
      {t.showAgitation && <Agitation t={t}/>}
      {t.showModules && <Modules t={t}/>}
      {t.showResults && <Results t={t}/>}
      {t.showResults && t.showTestimonials && <ProofBridge/>}
      {t.showTestimonials && <Testimonials t={t}/>}
      {t.showMarquee && <Marquee t={t}/>}
      {t.showRoadmap && <Roadmap t={t}/>}
      {t.showOffer && <Offer t={t}/>}
      {t.showGuarantee && <Guarantee t={t}/>}
      {t.showFaq && <Faq t={t}/>}
      {t.showCta && <Cta t={t}/>}
      {t.showSupport && <Support t={t}/>}
      {t.showFooter && <Footer t={t}/>}
      <WhatsappFloat/>
      <CheckoutRedirect t={t}/>

      <TweaksPanel>
        <TweakSection label="Identidade visual"/>
        <TweakColor label="Accent" value={t.accent}
          options={['#C5FF3D', '#F0B429', '#0055FF', '#FE5000', '#7A5AE0', '#0F8A6A']}
          onChange={v => setTweak('accent', v)}/>
        <TweakSelect label="Paleta base" value={t.palette}
          options={['navy', 'hub', 'black', 'forest']}
          onChange={v => setTweak('palette', v)}/>
        <TweakSelect label="Fonte display" value={t.fontDisplay}
          options={['Epilogue', 'Inter Tight', 'Instrument Serif', 'JetBrains Mono']}
          onChange={v => setTweak('fontDisplay', v)}/>
        <TweakSlider label="Raio" value={t.radius} min={0} max={28} step={1} unit="px"
          onChange={v => setTweak('radius', v)}/>
        <TweakRadio label="Densidade" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={v => setTweak('density', v)}/>

        <TweakSection label="Marca / produto"/>
        <TweakText label="Marca" value={t.brandName} onChange={v => setTweak('brandName', v)}/>
        <TweakText label="Tag superior" value={t.brandTag} onChange={v => setTweak('brandTag', v)}/>

        <TweakSection label="Preço"/>
        <TweakText label="Moeda" value={t.currency} onChange={v => setTweak('currency', v)}/>
        <TweakText label="Oferta" value={t.priceNow} onChange={v => setTweak('priceNow', v)}/>
        <TweakText label="Âncora" value={t.priceFull} onChange={v => setTweak('priceFull', v)}/>
        <TweakText label="URL checkout" value={t.checkoutUrl} onChange={v => setTweak('checkoutUrl', v)}/>

        <TweakSection label="Hero (copy)"/>
        <TweakText label="Título (*itálico*)" value={t.heroTitle} onChange={v => setTweak('heroTitle', v)}/>
        <TweakText label="Subtítulo" value={t.heroSub} onChange={v => setTweak('heroSub', v)}/>
        <TweakText label="CTA" value={t.ctaPrimary} onChange={v => setTweak('ctaPrimary', v)}/>

        <TweakSection label="Efeitos"/>
        <TweakToggle label="Scroll reveal" value={t.scrollReveal} onChange={v => setTweak('scrollReveal', v)}/>
        <TweakToggle label="Parallax" value={t.parallax} onChange={v => setTweak('parallax', v)}/>
        <TweakToggle label="Cursor custom" value={t.customCursor} onChange={v => setTweak('customCursor', v)}/>
        <TweakSlider label="Marquee" value={t.marqueeSpeed} min={10} max={100} step={5}
          onChange={v => setTweak('marqueeSpeed', v)}/>

        <TweakSection label="Seções"/>
        <TweakToggle label="Anúncio topo" value={t.showAnnouncement} onChange={v => setTweak('showAnnouncement', v)}/>
        <TweakToggle label="Nav" value={t.showNav} onChange={v => setTweak('showNav', v)}/>
        <TweakToggle label="Hero" value={t.showHero} onChange={v => setTweak('showHero', v)}/>
        <TweakToggle label="Problema" value={t.showProblem} onChange={v => setTweak('showProblem', v)}/>
        <TweakToggle label="Agitação" value={t.showAgitation} onChange={v => setTweak('showAgitation', v)}/>
        <TweakToggle label="Desafios" value={t.showChallenges} onChange={v => setTweak('showChallenges', v)}/>
        <TweakToggle label="Módulos" value={t.showModules} onChange={v => setTweak('showModules', v)}/>
        <TweakToggle label="O que você leva" value={t.showResults} onChange={v => setTweak('showResults', v)}/>
        <TweakToggle label="Provas (Aspira/Clóvis)" value={t.showTestimonials} onChange={v => setTweak('showTestimonials', v)}/>
        <TweakToggle label="Marquee" value={t.showMarquee} onChange={v => setTweak('showMarquee', v)}/>
        <TweakToggle label="Roadmap" value={t.showRoadmap} onChange={v => setTweak('showRoadmap', v)}/>
        <TweakToggle label="Oferta" value={t.showOffer} onChange={v => setTweak('showOffer', v)}/>
        <TweakToggle label="Garantia" value={t.showGuarantee} onChange={v => setTweak('showGuarantee', v)}/>
        <TweakToggle label="FAQ" value={t.showFaq} onChange={v => setTweak('showFaq', v)}/>
        <TweakToggle label="Suporte WhatsApp" value={t.showSupport} onChange={v => setTweak('showSupport', v)}/>
        <TweakToggle label="CTA final" value={t.showCta} onChange={v => setTweak('showCta', v)}/>
        <TweakToggle label="Footer" value={t.showFooter} onChange={v => setTweak('showFooter', v)}/>
      </TweaksPanel>
    </React.Fragment>
  );
}

function getContrastInk(hex){
  const c = hex.replace('#','');
  const r = parseInt(c.slice(0,2), 16);
  const g = parseInt(c.slice(2,4), 16);
  const b = parseInt(c.slice(4,6), 16);
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  return lum > 0.55 ? '#0a0e14' : '#ffffff';
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
