document.documentElement.classList.add('js');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 15% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

const burger = document.querySelector('.nav-burger');
const menu = document.getElementById('menu');
const setMenu = (open) => {
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-on'));
  } else {
    menu.classList.remove('is-on');
    setTimeout(() => { menu.hidden = true; }, 600);
  }
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

const reel = document.getElementById('reel');
document.querySelectorAll('.reel-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = reel.querySelector('.card');
    const step = card.getBoundingClientRect().width + 20;
    reel.scrollBy({ left: step * 2 * Number(btn.dataset.dir), behavior: 'smooth' });
  });
});

const video = document.querySelector('.hero-logo');
if (video && matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.removeAttribute('autoplay');
  video.pause();
}
