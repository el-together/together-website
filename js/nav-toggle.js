document.addEventListener('DOMContentLoaded', () => {
  const headerContent = document.querySelector('.header-content');
  const mainNav = document.querySelector('.main-nav');
  if (!headerContent || !mainNav) return;

  // Avoid duplicating the button if script runs twice
  if (document.getElementById('nav-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'nav-toggle';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.innerHTML = '<span></span><span></span><span></span>';
  headerContent.appendChild(btn);

  btn.addEventListener('click', () => {
    const opened = mainNav.classList.toggle('open');
    document.body.classList.toggle('menu-open', opened);
  });

  // Close overlay when clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
});
