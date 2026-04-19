// Hamburger dropdown
const btn = document.getElementById('hamburgerBtn');
const dropdown = document.getElementById('dropdown');

btn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

/* ABRIR NO HOVER */
btn.addEventListener('mouseenter', () => {
  dropdown.classList.add('open');
});

document.addEventListener('click', (e) => {
  if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

dropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => dropdown.classList.remove('open'));
});

// Portfolio collapse
const portfolioTitle = document.querySelector('.portfolio-title');
const portfolioContent = document.getElementById('portfolioContent');

portfolioTitle.addEventListener('click', () => {
  portfolioTitle.classList.toggle('collapsed');
  portfolioContent.classList.toggle('collapsed');
});

/* FADE IN */
window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
});

/* FADE OUT */
document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');

  if (href && !href.startsWith('#') && !href.startsWith('http')) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      document.body.classList.remove('page-loaded');
      document.body.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = href;
      }, 250); // mais rápido
    });
  }
});