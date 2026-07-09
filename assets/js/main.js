/* ShapeTech India Contractors — site interactions */
document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* Sticky header shrink + scroll progress + back to top */
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress');
  const backTop = document.querySelector('.fab-top');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    if (backTop) backTop.classList.toggle('show', scrolled > 500);
    if (header) header.style.boxShadow = scrolled > 30 ? '0 6px 24px rgba(0,0,0,.25)' : 'none';
  });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach((el, i) => { el.style.setProperty('--i', i % 8); io.observe(el); });

  /* Counters */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target < 10 ? (target * eased).toFixed(1) : Math.floor(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  /* Accordion (FAQ) */
  document.querySelectorAll('.acc-item').forEach(item => {
    const q = item.querySelector('.acc-q');
    const a = item.querySelector('.acc-a');
    if (!q || !a) return;
    a.style.maxHeight = '0px';
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.acc-item').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.acc-a').style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 40 + 'px';
      }
    });
  });

  /* Filter buttons (Projects / Gallery) */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const buttons = group.querySelectorAll('.filter-btn');
    const targetSelector = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSelector + ' [data-cat]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        items.forEach(it => {
          const match = cat === 'all' || it.dataset.cat === cat;
          it.style.display = match ? '' : 'none';
        });
      });
    });
  });

  /* Search filter (Projects) */
  const searchInput = document.querySelector('#project-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('#projects-completed [data-cat]').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  /* Lightbox */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        lbImg.src = trigger.dataset.lightbox;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  /* Dark mode toggle */
  const darkToggle = document.querySelector('.dark-toggle');
  if (darkToggle) {
    if (localStorage.getItem('stic-dark') === '1') document.body.classList.add('dark');
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('stic-dark', document.body.classList.contains('dark') ? '1' : '0');
    });
  }

  /* Simple captcha */
  const captchaQ = document.querySelector('#captcha-q');
  if (captchaQ) {
    const a = Math.ceil(Math.random() * 8) + 2;
    const b = Math.ceil(Math.random() * 8) + 1;
    captchaQ.textContent = `${a} + ${b} = ?`;
    captchaQ.dataset.answer = a + b;
  }

  /* Form submit (demo — no backend) */
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const captcha = form.querySelector('#captcha-a');
      const captchaQEl = form.querySelector('#captcha-q');
      if (captcha && captchaQEl && parseInt(captcha.value, 10) !== parseInt(captchaQEl.dataset.answer, 10)) {
        alert('Please solve the verification sum correctly before submitting.');
        return;
      }
      const note = form.querySelector('.form-success');
      if (note) {
        note.style.display = 'block';
        form.reset();
        note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Thank you — your enquiry has been received. Our team will contact you shortly.');
        form.reset();
      }
    });
  });

  /* Set active nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* Year */
  document.querySelectorAll('.year-now').forEach(el => el.textContent = new Date().getFullYear());
});
