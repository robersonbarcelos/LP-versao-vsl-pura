// effects.jsx — shared hooks: scroll reveal, sticky nav, custom cursor, parallax

const { useEffect, useRef, useState } = React;

/* IntersectionObserver-based reveal. Add className "reveal" + optional --reveal-delay.
   Auto-attaches to any element with `.reveal` after mount. */
function useScrollReveal(enabled = true){
  useEffect(() => {
    if (!enabled) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    let remaining = document.querySelectorAll('.reveal').length;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          remaining--;
          e.target.classList.add('in');
          io.unobserve(e.target);
          if (remaining <= 0) io.disconnect();
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Puro IO sem getBoundingClientRect — elimina forced reflow.
    // IO dispara em 1-2 frames (~16ms) para elementos já no viewport.
    document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, [enabled]);
}

/* Sticky nav scrolled-state */
function useScrolledFlag(threshold = 20){
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return scrolled;
}

/* Custom cursor — moves the ring element to mouse position. */
function useCustomCursor(enabled){
  useEffect(() => {
    if (!enabled) { document.body.classList.remove('cursor-on'); return; }
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.body.classList.add('cursor-on');
    const ring = document.getElementById('cursor-ring');
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const raf = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (ring) ring.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      r = requestAnimationFrame(raf);
    };
    let r = requestAnimationFrame(raf);

    const over = (e) => {
      if (e.target.closest('a, button, .persona-tab, .layer-item, .faq-q')) ring.classList.add('hover');
    };
    const out = (e) => {
      if (e.target.closest('a, button, .persona-tab, .layer-item, .faq-q')) ring.classList.remove('hover');
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      cancelAnimationFrame(r);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      document.body.classList.remove('cursor-on');
    };
  }, [enabled]);
}

/* Subtle parallax for elements with data-parallax="speed" */
function useParallax(enabled){
  useEffect(() => {
    if (!enabled) return;
    // Parallax mal aparece em telas touch e força transform/paint a cada scroll
    // (custo alto de Style & Layout no mobile). Desliga em ponteiro coarse e
    // quando o usuário pede menos movimento.
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf;
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    const update = () => {
      const sy = window.scrollY;
      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${sy * speed * -1}px, 0)`;
      });
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [enabled]);
}

/* Sweep animation pausada por padrão no CSS. Ativa só nos botões visíveis
   para evitar paint contínuo em todos os CTAs fora da tela. */
(function initBtnSweep(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      e.target.classList.toggle('btn-sweep-on', e.isIntersecting);
    });
  }, { threshold: 0.1 });
  const attach = () =>
    document.querySelectorAll('.btn-primary').forEach(b => io.observe(b));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();

Object.assign(window, { useScrollReveal, useScrolledFlag, useCustomCursor, useParallax });
