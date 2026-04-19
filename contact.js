const hbg = document.getElementById('hbg');
const drop = document.getElementById('drop');
const navLeft = document.getElementById('navLeft');

let timeout;

// ===== MENU =====

// abrir no hover (desktop)
navLeft.addEventListener('mouseenter', () => {
  clearTimeout(timeout);
  drop.classList.add('open');
});

// fechar com delay (permite clicar)
navLeft.addEventListener('mouseleave', () => {
  timeout = setTimeout(() => {
    drop.classList.remove('open');
  }, 200);
});

// toggle no botão (mobile)
hbg.addEventListener('click', (e) => {
  e.stopPropagation();
  drop.classList.toggle('open');
});

// fechar ao clicar fora
document.addEventListener('click', (e) => {
  if (!navLeft.contains(e.target)) {
    drop.classList.remove('open');
  }
});


// ===== ANIMAÇÕES =====


/* FADE IN */
window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');

  // garante que âncoras funcionem (ex: index.html#contact)
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) {
      el.scrollIntoView();
    }
  }
});

/* FADE OUT */
document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');

  // 👇 só adicionamos isso aqui
  if (
    href &&
    !href.startsWith('#') &&
    !href.startsWith('http') &&
    !href.includes('#') // ✅ CORREÇÃO
  ) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      document.body.classList.remove('page-loaded');
      document.body.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  }
});