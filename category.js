/* ════════════════════════════════════════════
   CATEGORY DATA
════════════════════════════════════════════ */
const CATS = [
  { id: 'editorial-makeup',  label: 'Editorial Makeup'  },
  { id: 'editorial-fashion', label: 'Editorial Fashion' },
  { id: 'beauty-portraits',  label: 'Beauty Portraits'  },
  { id: 'advertising',       label: 'Advertising'       },
  { id: 'overview',          label: 'Overview'          },
];

let currentIndex = 0;

/* ── helpers ── */
function showCat(index) {
  currentIndex = ((index % CATS.length) + CATS.length) % CATS.length;
  const cat = CATS[currentIndex];

  document.getElementById('catTitle').textContent = cat.label;

  document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + cat.id).classList.add('active');

  history.replaceState(null, '', '#' + cat.id);

  buildLightboxPool();
}

/* ── arrows ── */
document.getElementById('arrowPrev').addEventListener('click', () => showCat(currentIndex - 1));
document.getElementById('arrowNext').addEventListener('click', () => showCat(currentIndex + 1));

/* ── keyboard ── */
document.addEventListener('keydown', e => {
  if (lightboxOpen) return;
  if (e.key === 'ArrowLeft')  showCat(currentIndex - 1);
  if (e.key === 'ArrowRight') showCat(currentIndex + 1);
});

/* ── hash load ── */
window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '');
  const idx = CATS.findIndex(c => c.id === hash);
  showCat(idx !== -1 ? idx : 0);
});


/* ════════════════════════════════════════════
   HAMBURGER MENU
════════════════════════════════════════════ */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const dropdown = document.getElementById('dropdown');

let dropdownTimeout;

hamburgerBtn.addEventListener('click', e => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

hamburgerBtn.addEventListener('mouseenter', () => {
  dropdown.classList.add('open');
});

dropdown.addEventListener('mouseenter', () => {
  clearTimeout(dropdownTimeout);
});

dropdown.addEventListener('mouseleave', () => {
  dropdownTimeout = setTimeout(() => {
    dropdown.classList.remove('open');
  }, 800);
});

document.addEventListener('click', e => {
  if (!hamburgerBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});


/* ════════════════════════════════════════════
   CATEGORY MENU
════════════════════════════════════════════ */
const catMenuBtn = document.getElementById('catMenuBtn');
const catMenu = document.getElementById('catMenu');

let catMenuTimeout;

/* abrir/fechar botão */
catMenuBtn.addEventListener('click', e => {
  e.stopPropagation();
  catMenu.classList.toggle('open');
});

/* hover abre */
catMenuBtn.addEventListener('mouseenter', () => {
  clearTimeout(catMenuTimeout);
  catMenu.classList.add('open');
});

catMenu.addEventListener('mouseenter', () => {
  clearTimeout(catMenuTimeout);
});

/* fechar com delay */
catMenuBtn.addEventListener('mouseleave', () => {
  catMenuTimeout = setTimeout(() => {
    catMenu.classList.remove('open');
  }, 800);
});

catMenu.addEventListener('mouseleave', () => {
  catMenuTimeout = setTimeout(() => {
    catMenu.classList.remove('open');
  }, 800);
});

/* fechar clicando fora */
document.addEventListener('click', e => {
  if (!catMenuBtn.contains(e.target) && !catMenu.contains(e.target)) {
    catMenu.classList.remove('open');
  }
});

/* 🔥 FIX PRINCIPAL: clicar no menu NÃO sobe mais a página */
document.querySelectorAll('#catMenu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const catId = link.dataset.cat;
    const index = CATS.findIndex(c => c.id === catId);

    if (index !== -1) {
      showCat(index);
    }

    catMenu.classList.remove('open');
  });
});


/* ════════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════════ */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');

let lightboxOpen = false;
let lbImages = [];
let lbCurrent = 0;
let zoomed = false;

function buildLightboxPool() {
  const activePanel = document.querySelector('.cat-panel.active');
  if (!activePanel) return;

  lbImages = Array.from(activePanel.querySelectorAll('img')).map(img => ({
    src: img.src, alt: img.alt
  }));
}

function openLightbox(src) {
  const idx = lbImages.findIndex(i => i.src === src);
  lbCurrent = idx !== -1 ? idx : 0;
  renderLb();

  lightbox.classList.add('open');
  lightboxOpen = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxOpen = false;
  document.body.style.overflow = '';
  resetZoom();
}

function renderLb() {
  if (!lbImages.length) return;

  lbImg.src = lbImages[lbCurrent].src;
  lbImg.alt = lbImages[lbCurrent].alt;
  lbCounter.textContent = (lbCurrent + 1) + ' / ' + lbImages.length;

  resetZoom();
}

function lbStep(dir) {
  lbCurrent = ((lbCurrent + dir) + lbImages.length) % lbImages.length;
  renderLb();
}

/* zoom */
function resetZoom() {
  lbImg.style.transform = 'scale(1)';
  lbImg.classList.remove('zoomed');
  lbImg.style.cursor = 'zoom-in';
  zoomed = false;
}

lbImg.addEventListener('click', e => {
  e.stopPropagation();

  if (!zoomed) {
    lbImg.style.transform = 'scale(2.2)';
    lbImg.classList.add('zoomed');
    lbImg.style.cursor = 'zoom-out';
    zoomed = true;
  } else {
    resetZoom();
  }
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); lbStep(-1); });
document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); lbStep(1); });

document.addEventListener('keydown', e => {
  if (!lightboxOpen) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbStep(-1);
  if (e.key === 'ArrowRight') lbStep(1);
});

document.addEventListener('click', e => {
  const panel = e.target.closest('.cat-panel');
  if (!panel) return;

  if (e.target.tagName === 'IMG') {
    buildLightboxPool();
    openLightbox(e.target.src);
  }
});

/* fade */
window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
});

document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');

  if (href && !href.startsWith('#') && !href.startsWith('http')) {
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