document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

document.querySelectorAll('.card-grid .tcard').forEach((card, i) => {
  card.style.setProperty('--i', i % 4);

  const setFlipped = (flipped) => {
    card.classList.toggle('is-flipped', flipped);
    const frontBtn = card.querySelector('.tcard-face--front .tcard-flip');
    if (frontBtn) frontBtn.setAttribute('aria-expanded', String(flipped));
    if (flipped) {
      const backBtn = card.querySelector('.tcard-face--back .tcard-flip');
      if (backBtn) backBtn.focus({ preventScroll: true });
    }
  };

  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    setFlipped(!card.classList.contains('is-flipped'));
  });
});

const closeAll = () => {
  document.querySelectorAll('.tcard.is-flipped').forEach((card) => {
    card.classList.remove('is-flipped');
    const frontBtn = card.querySelector('.tcard-face--front .tcard-flip');
    if (frontBtn) frontBtn.setAttribute('aria-expanded', 'false');
  });
};

document.addEventListener('click', (e) => {
  if (e.target.closest('.tcard')) return;
  closeAll();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
});
