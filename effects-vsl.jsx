// effects-vsl.jsx — versao enxuta: so useScrollReveal + useScrolledFlag + useParallax stub

const { useEffect, useState } = React;

function useScrollReveal(enabled = true){
  useEffect(() => {
    if (!enabled) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const inView = (el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh && r.bottom > 0;
    };
    const observe = () => {
      const els = Array.from(document.querySelectorAll('.reveal:not(.in)'));
      const results = els.map(el => ({ el, visible: inView(el) }));
      results.forEach(({ el, visible }) => { if (visible) el.classList.add('in'); else io.observe(el); });
    };
    observe();
    let scheduled = false;
    const mo = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; observe(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [enabled]);
}

function useScrolledFlag(threshold = 20){
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return scrolled;
}

function useParallax(){ /* desativado nessa versao */ }
function useCustomCursor(){ /* desativado nessa versao */ }

Object.assign(window, { useScrollReveal, useScrolledFlag, useParallax, useCustomCursor });
