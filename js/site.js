// Shared header behaviour: hides while scrolling down, comes back when scrolling up (like a phone).
(() => {
  const hdr = document.querySelector('header');
  if (!hdr) return;
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (Math.abs(y - lastY) < 6) return;
    hdr.classList.toggle('hide', y > lastY && y > 80);
    lastY = y;
  }, {passive: true});
  hdr.addEventListener('focusin', () => hdr.classList.remove('hide'));
})();
