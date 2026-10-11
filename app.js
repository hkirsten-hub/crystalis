const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
});

menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menu.classList.remove('is-open');
}));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('is-open');
    menuButton.focus();
  }
});

document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('is-open');
  }
});

document.querySelectorAll('[data-product]').forEach(link => {
  const variant = link.dataset.variant ? ` · ${link.dataset.variant}` : '';
  const message = `Olá! Tenho interesse na peça ${link.dataset.product}${variant} (ref. ${link.dataset.ref}) para revenda no atacado. Poderiam me informar as condições e a quantidade por caixa?`;
  link.href = `https://wa.me/551146769800?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

document.querySelector('#year').textContent = new Date().getFullYear();

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('#hero-video');
// Load the film only when motion is allowed; the complete poster is the fallback.
if (heroVideo) {
  const source = heroVideo.querySelector('source');
  let playbackVersion = 0;
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.controls = false;

  const showPosterOnly = () => {
    heroVideo.pause();
    heroVideo.hidden = true;
  };
  heroVideo.addEventListener('error', showPosterOnly);
  source?.addEventListener('error', showPosterOnly);

  const applyMotionPreference = () => {
    const version = ++playbackVersion;
    if (motionPreference.matches) {
      heroVideo.autoplay = false;
      showPosterOnly();
      if (source?.hasAttribute('src')) {
        source.removeAttribute('src');
        heroVideo.load();
      }
      return;
    }
    if (!source?.dataset.src) return showPosterOnly();
    heroVideo.hidden = false;
    heroVideo.autoplay = true;
    if (!source.hasAttribute('src')) {
      source.src = source.dataset.src;
      heroVideo.load();
    }
    const playback = heroVideo.play();
    if (playback) playback.catch(() => {
      if (version === playbackVersion) showPosterOnly();
    });
  };
  motionPreference.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
}

// Progressive enhancement: content remains visible without JavaScript or motion.
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .story-copy, .eco-copy, .contact-grid').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}
