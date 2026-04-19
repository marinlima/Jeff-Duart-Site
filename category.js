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

  document.querySelectorAll('.cat-panel')
    .forEach(p => p.classList.remove('active'));

  const panel = document.getElementById('panel-' + cat.id);
  if (panel) panel.classList.add('active');

  history.replaceState(null, '', '#' + cat.id);

  buildLightboxPool();
}

/* ── arrows ── */
document.getElementById('arrowPrev')?.addEventListener('click', () => showCat(currentIndex - 1));
document.getElementById('arrowNext')?.addEventListener('click', () => showCat(currentIndex + 1));

/* ── keyboard ── */
document.addEventListener('keydown', e => {
  if (lightboxOpen) return;
  if (e.key === 'ArrowLeft') showCat(currentIndex - 1);
  if (e.key === 'ArrowRight') showCat(currentIndex + 1);
});

/* ── hash load ── */
window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '');
  const idx = CATS.findIndex(c => c.id === hash);
  showCat(idx !== -1 ? idx : 0);
});

/* ─────────────────────────────────────────
   CATEGORY MENU FIX (IMPORTANTE)
───────────────────────────────────────── */
const catMenuBtn = document.getElementById('catMenuBtn');
const catMenu = document.getElementById('catMenu');

let catMenuTimeout;

catMenuBtn?.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  catMenu.classList.toggle('open');
});

/* click nas categorias */
document.querySelectorAll('.cat-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const catId = link.dataset.cat;
    const idx = CATS.findIndex(c => c.id === catId);

    if (idx !== -1) showCat(idx);

    catMenu.classList.remove('open');
  });
});

/* fechar fora */
document.addEventListener('click', e => {
  if (!catMenu?.contains(e.target) && e.target !== catMenuBtn) {
    catMenu?.classList.remove('open');
  }
});

/* ─────────────────────────────────────────
   LIGHTBOX + DRAG ZOOM (NOVO)
───────────────────────────────────────── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');

let lightboxOpen = false;
let lbImages = [];
let lbCurrent = 0;

/* zoom drag state */
let isDragging = false;
let startX = 0;
let startY = 0;
let posX = 0;
let posY = 0;
let scale = 1;

function buildLightboxPool() {
  const activePanel = document.querySelector('.cat-panel.active');
  if (!activePanel) return;

  lbImages = Array.from(activePanel.querySelectorAll('img')).map(img => ({
    src: img.src,
    alt: img.alt
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
  lbCounter.textContent = `${lbCurrent + 1} / ${lbImages.length}`;

  resetZoom();
}

function lbStep(dir) {
  lbCurrent = ((lbCurrent + dir) + lbImages.length) % lbImages.length;
  renderLb();
}

/* ── zoom reset ── */
function resetZoom() {
  scale = 1;
  posX = 0;
  posY = 0;
  lbImg.style.transform = `translate(0px,0px) scale(1)`;
}

/* ── zoom click ── */
lbImg.addEventListener('click', e => {
  e.stopPropagation();

  if (scale === 1) {
    scale = 2.2;
  } else {
    resetZoom();
  }

  lbImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

/* ── DRAG (passear na imagem) ── */
lbImg.addEventListener('mousedown', e => {
  if (scale === 1) return;

  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
  lbImg.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;

  posX = e.clientX - startX;
  posY = e.clientY - startY;

  lbImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  lbImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
});

/* touch mobile */
lbImg.addEventListener('touchmove', e => {
  if (!isDragging || scale === 1) return;

  const touch = e.touches[0];

  posX = touch.clientX - startX;
  posY = touch.clientY - startY;

  lbImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

/* abrir imagem */
document.addEventListener('click', e => {
  const img = e.target.closest('img');
  if (!img) return;

  const panel = img.closest('.cat-panel');
  if (!panel) return;

  buildLightboxPool();
  openLightbox(img.src);
});

/* fechar lightbox */
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', e => { e.stopPropagation(); lbStep(-1); });
document.getElementById('lbNext')?.addEventListener('click', e => { e.stopPropagation(); lbStep(1); });

/* teclado */
document.addEventListener('keydown', e => {
  if (!lightboxOpen) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbStep(-1);
  if (e.key === 'ArrowRight') lbStep(1);
});

/* fade in */
window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
});