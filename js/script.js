/* ============================================================
   PORTFOLIO — JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ===================== THEME SYSTEM ===================== */
  const ThemeManager = {
    key: 'portfolio-theme',

    init() {
      const saved = localStorage.getItem(this.key);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.apply(theme);
      this.bindToggle();
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.updateIcon(theme);
    },

    updateIcon(theme) {
      const toggle = document.querySelector('.theme-toggle');
      if (!toggle) return;
      const sun = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      const moon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      toggle.innerHTML = theme === 'dark' ? moon : sun;
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      this.apply(next);
      localStorage.setItem(this.key, next);
    },

    bindToggle() {
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) toggle.addEventListener('click', () => this.toggle());
    }
  };

  /* ===================== NAVIGATION ===================== */
  const Navigation = {
    init() {
      this.nav = document.querySelector('.nav');
      if (!this.nav) return;
      this.lastScroll = 0;
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    },

    onScroll() {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
      this.lastScroll = scrollY;
    }
  };

  /* ===================== MOBILE MENU ===================== */
  const MobileMenu = {
    init() {
      this.hamburger = document.querySelector('.hamburger');
      this.menu = document.querySelector('.mobile-menu');
      if (!this.hamburger || !this.menu) return;

      this.links = this.menu.querySelectorAll('.mobile-menu-link');
      this.isOpen = false;

      this.hamburger.addEventListener('click', () => this.toggle());
      this.links.forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    },

    toggle() {
      this.isOpen = !this.isOpen;
      this.hamburger.classList.toggle('active', this.isOpen);
      this.menu.classList.toggle('open', this.isOpen);
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    },

    close() {
      this.isOpen = false;
      this.hamburger.classList.remove('active');
      this.menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  /* ===================== CUSTOM CURSOR ===================== */
  const Cursor = {
    init() {
      if (window.matchMedia('(hover: none)').matches) return;
      if (window.innerWidth < 769) return;

      this.dot = document.querySelector('.cursor-dot');
      this.circle = document.querySelector('.cursor-circle');
      if (!this.dot || !this.circle) return;

      this.mouseX = 0;
      this.mouseY = 0;
      this.circleX = 0;
      this.circleY = 0;

      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.dot.style.left = e.clientX + 'px';
        this.dot.style.top = e.clientY + 'px';
      });

      this.animate();

      // Hover targets
      const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .project-image-wrap');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

      // View cursor on project images
      const viewTargets = document.querySelectorAll('.project-image-wrap');
      viewTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
      });

      // Click pulse effect
      document.addEventListener('click', (e) => {
        const pulse = document.createElement('div');
        pulse.className = 'cursor-pulse';
        pulse.style.left = e.clientX + 'px';
        pulse.style.top = e.clientY + 'px';
        document.body.appendChild(pulse);
        pulse.addEventListener('animationend', () => pulse.remove());
      });
    },

    animate() {
      this.circleX += (this.mouseX - this.circleX) * 0.12;
      this.circleY += (this.mouseY - this.circleY) * 0.12;
      this.circle.style.left = this.circleX + 'px';
      this.circle.style.top = this.circleY + 'px';
      requestAnimationFrame(() => this.animate());
    }
  };

  /* ===================== SCROLL REVEAL ===================== */
  const ScrollReveal = {
    init() {
      this.elements = document.querySelectorAll('.reveal');
      if (!this.elements.length) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  /* ===================== STAT COUNTERS ===================== */
  const StatCounters = {
    init() {
      this.counters = document.querySelectorAll('.stat-number');
      if (!this.counters.length) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      this.counters.forEach(el => this.observer.observe(el));
    },

    animate(el) {
      const target = el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();
      const isDecimal = target.includes('.');

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * parseFloat(target);

        if (isDecimal) {
          el.textContent = current.toFixed(1) + suffix;
        } else {
          el.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  };

  /* ===================== MAGNETIC BUTTONS ===================== */
  const MagneticButtons = {
    init() {
      if (window.matchMedia('(hover: none)').matches) return;
      if (window.innerWidth < 769) return;

      const buttons = document.querySelectorAll('.btn, .about-cta-link');
      buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => this.move(e, btn));
        btn.addEventListener('mouseleave', (e) => this.reset(e, btn));
      });
    },

    move(e, el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    },

    reset(e, el) {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s ease';
      setTimeout(() => { el.style.transition = ''; }, 400);
    }
  };

  /* ===================== PROJECT FILTERS ===================== */
  const ProjectFilters = {
    init() {
      this.buttons = document.querySelectorAll('.filter-btn');
      this.projects = document.querySelectorAll('.project-item');
      if (!this.buttons.length) return;

      this.buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.filter(btn.getAttribute('data-filter'));
        });
      });
    },

    filter(category) {
      this.projects.forEach(project => {
        const cats = project.getAttribute('data-category') || '';
        if (category === 'all' || cats.includes(category)) {
          project.classList.remove('hidden');
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
          });
        } else {
          project.classList.add('hidden');
        }
      });
    }
  };

  /* ===================== PROJECT MODAL ===================== */
  const ProjectModal = {
    init() {
      this.modal = document.querySelector('.project-modal');
      this.closeBtn = document.querySelector('.modal-close');
      this.overlay = document.querySelector('.project-modal');
      if (!this.modal) return;

      document.addEventListener('click', (e) => {
        const imageWrap = e.target.closest('.project-image-wrap');
        const arrow = e.target.closest('.project-arrow');

        if (imageWrap || arrow) {
          const projectItem = (imageWrap || arrow).closest('.project-item');
          if (projectItem) {
            e.preventDefault();
            this.open(projectItem);
          }
        }
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });

      // Set download button hrefs from data attributes
      document.querySelectorAll('.project-item').forEach(item => {
        const url = item.getAttribute('data-download');
        const btn = item.querySelector('.project-download-btn');
        if (url && btn) btn.href = url;
        if (!url && btn) btn.style.display = 'none';
      });
    },

    open(projectItem) {
      const data = this.extractData(projectItem);
      this.populateModal(data);
      this.modal.classList.add('open');
      this.modal.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal.classList.remove('open');
      document.body.style.overflow = '';
    },

    extractData(projectItem) {
      return {
        title: projectItem.querySelector('.project-name')?.textContent || '',
        category: projectItem.querySelector('.project-meta-item:first-child')?.textContent || '',
        year: projectItem.querySelector('.project-meta-item:last-child')?.textContent || '',
        overview: projectItem.getAttribute('data-overview') || '',
        role: projectItem.getAttribute('data-role') || '',
        timeline: projectItem.getAttribute('data-timeline') || '',
        tools: projectItem.getAttribute('data-tools') || '',
        challenge: projectItem.getAttribute('data-challenge') || '',
        approach: projectItem.getAttribute('data-approach') || '',
        solution: projectItem.getAttribute('data-solution') || '',
        results: projectItem.getAttribute('data-results') || '',
        image: projectItem.querySelector('.project-image-wrap img')?.src || '',
        gallery1: projectItem.getAttribute('data-gallery-1') || '',
        gallery2: projectItem.getAttribute('data-gallery-2') || '',
        gallery3: projectItem.getAttribute('data-gallery-3') || '',
        download: projectItem.getAttribute('data-download') || ''
      };
    },

    populateModal(data) {
      const content = this.modal.querySelector('.modal-content');
      if (!content) return;

      content.innerHTML = `
        <div class="modal-hero-image">
          <img src="${data.image}" alt="${data.title}" loading="lazy">
        </div>
        <h2 class="modal-title">${data.title}</h2>
        <div class="modal-meta-grid">
          <div class="modal-meta-item">
            <span class="label">OVERVIEW</span>
            <span class="modal-meta-value">${data.category}</span>
          </div>
          <div class="modal-meta-item">
            <span class="label">YEAR</span>
            <span class="modal-meta-value">${data.year}</span>
          </div>
          <div class="modal-meta-item">
            <span class="label">ROLE</span>
            <span class="modal-meta-value">${data.role}</span>
          </div>
          <div class="modal-meta-item">
            <span class="label">TOOLS</span>
            <span class="modal-meta-value">${data.tools}</span>
          </div>
        </div>
        ${data.download && data.download !== '#' ? `<a href="${data.download}" class="btn modal-download-btn" target="_blank" rel="noopener" style="margin-bottom: 2rem; display: inline-flex;">DOWNLOAD <span class="arrow">&darr;</span></a>` : ''}
        <div class="modal-section">
          <h3 class="modal-section-title">Challenge</h3>
          <p class="modal-section-text">${data.challenge}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">Approach</h3>
          <p class="modal-section-text">${data.approach}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">Solution</h3>
          <p class="modal-section-text">${data.solution}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">Results</h3>
          <p class="modal-section-text">${data.results}</p>
        </div>
        <div class="modal-gallery">
          <div class="modal-gallery-item"><img src="${data.gallery1 || data.image}" alt="${data.title}" loading="lazy"></div>
          <div class="modal-gallery-item"><img src="${data.gallery2 || data.image}" alt="${data.title}" loading="lazy"></div>
          <div class="modal-gallery-item full"><img src="${data.gallery3 || data.image}" alt="${data.title}" loading="lazy"></div>
        </div>
      `;
    }
  };

  /* ===================== CONTACT FORM ===================== */
  const ContactForm = {
    init() {
      this.form = document.querySelector('.contact-form');
      this.success = document.querySelector('.form-success');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate()) {
          this.form.style.display = 'none';
          this.success.classList.add('show');
        }
      });
    },

    validate() {
      const name = this.form.querySelector('[name="name"]');
      const email = this.form.querySelector('[name="email"]');
      const message = this.form.querySelector('[name="message"]');
      let valid = true;

      [name, email, message].forEach(f => f.style.borderColor = '');

      if (!name.value.trim()) {
        name.style.borderColor = 'var(--pink)';
        valid = false;
      }

      if (!email.value.trim() || !this.isValidEmail(email.value)) {
        email.style.borderColor = 'var(--pink)';
        valid = false;
      }

      if (!message.value.trim()) {
        message.style.borderColor = 'var(--pink)';
        valid = false;
      }

      return valid;
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  };

  /* ===================== SCROLL PROGRESS ===================== */
  const ScrollProgress = {
    init() {
      this.bar = document.querySelector('.scroll-progress');
      if (!this.bar) return;
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.bar.style.width = progress + '%';
    }
  };

  /* ===================== BACK TO TOP ===================== */
  const BackToTop = {
    init() {
      this.btn = document.querySelector('.back-to-top');
      if (!this.btn) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          this.btn.classList.add('visible');
        } else {
          this.btn.classList.remove('visible');
        }
      }, { passive: true });

      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /* ===================== PHILOSOPHY ANIMATION ===================== */
  const PhilosophyAnimation = {
    init() {
      this.lines = document.querySelectorAll('.philosophy-text .line');
      if (!this.lines.length) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate();
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      this.observer.observe(this.lines[0]?.closest('.philosophy'));
    },

    animate() {
      this.lines.forEach((line, i) => {
        setTimeout(() => {
          line.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, i * 200);
      });
    }
  };

  /* ===================== PAGE LOADER ===================== */
  const PageLoader = {
    init() {
      this.loader = document.querySelector('.page-loader');
      const content = document.querySelector('.page-content');
      if (!this.loader) return;

      window.addEventListener('load', () => {
        setTimeout(() => {
          this.loader.classList.add('loaded');
          if (content) content.classList.add('visible');
        }, 600);
      });

      // Fallback
      setTimeout(() => {
        this.loader.classList.add('loaded');
        if (content) content.classList.add('visible');
      }, 2000);
    }
  };

  /* ===================== IMAGE PARALLAX ===================== */
  const ImageParallax = {
    init() {
      if (window.matchMedia('(hover: none)').matches) return;
      if (window.innerWidth < 769) return;

      this.images = document.querySelectorAll('.project-image-wrap img, .about-hero-image img');
      if (!this.images.length) return;

      this.images.forEach(img => {
        img.addEventListener('mousemove', (e) => this.move(e, img));
        img.addEventListener('mouseleave', (e) => this.reset(e, img));
      });
    },

    move(e, img) {
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `scale(1.03) translate(${x * -8}px, ${y * -8}px)`;
    },

    reset(e, img) {
      img.style.transform = 'scale(1) translate(0, 0)';
    }
  };

  /* ===================== INIT ===================== */
  const init = () => {
    ThemeManager.init();
    Navigation.init();
    MobileMenu.init();
    Cursor.init();
    ScrollReveal.init();
    StatCounters.init();
    MagneticButtons.init();
    ProjectFilters.init();
    ProjectModal.init();
    ContactForm.init();
    ScrollProgress.init();
    BackToTop.init();
    PhilosophyAnimation.init();
    PageLoader.init();
    ImageParallax.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
