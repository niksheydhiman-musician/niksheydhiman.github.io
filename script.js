/* ====================================================
   NIKSHEY DHIMAN – PORTFOLIO
   script.js
   Author: Generated for Nikshey Dhiman
   ==================================================== */

/* ---- YEAR IN FOOTER ---- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ====================================================
   HAMBURGER / MOBILE NAV
   ==================================================== */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ====================================================
   SCROLL REVEAL
   ==================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children inside a parent
      entry.target.style.transitionDelay = `${i * 0.04}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ====================================================
   ANIMATED COUNTERS
   ==================================================== */
const counters    = document.querySelectorAll('.stat-card__num');
let countersRan   = false;

function animateCounter(el) {
  const target   = +el.dataset.target;
  const duration = 1500; // ms
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersRan) {
      countersRan = true;
      counters.forEach(animateCounter);
    }
  });
}, { threshold: 0.3 });

if (counters.length) counterObserver.observe(counters[0].closest('section') || counters[0]);

/* ====================================================
   PORTFOLIO FILTER
   ==================================================== */
const tabs        = document.querySelectorAll('.tab');
const projectCards= document.querySelectorAll('.project-card');

function filterPortfolio(filter) {
  projectCards.forEach(card => {
    const match = card.dataset.category === filter;
    if (match) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      // Trigger reflow to restart animation
      void card.offsetWidth;
      card.style.animation = '';
    } else {
      card.classList.add('hidden');
    }
  });
}

// Show first category by default
filterPortfolio('blogs');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    filterPortfolio(tab.dataset.filter);
  });
});

/* ====================================================
   TESTIMONIAL SLIDER
   ==================================================== */
const track     = document.getElementById('testimonialsTrack');
const dots      = document.querySelectorAll('.dot');
let current     = 0;
let autoSlide;
const cardCount = dots.length;

function goTo(index) {
  current = (index + cardCount) % cardCount;
  // Each card is 100% of the slider + gap compensation
  const cardWidth = track.parentElement.offsetWidth;
  track.style.transform = `translateX(-${current * (cardWidth + 32)}px)`;

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === current);
    d.setAttribute('aria-selected', i === current);
  });
}

function startAutoSlide() {
  autoSlide = setInterval(() => goTo(current + 1), 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goTo(+dot.dataset.index);
    resetAutoSlide();
  });
});

startAutoSlide();

// Recalculate on resize
window.addEventListener('resize', () => goTo(current));

/* ====================================================
   CONTACT FORM VALIDATION
   ==================================================== */
const form = document.getElementById('contactForm');

if (form) {

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.textContent = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameEl    = form.querySelector('#name');
    const emailEl   = form.querySelector('#email');
    const messageEl = form.querySelector('#message');
    const successEl = document.getElementById('formSuccess');

    // Reset
    [nameEl, emailEl, messageEl].forEach(clearError);
    successEl.textContent = '';

    // Validate name
    if (!nameEl.value.trim()) {
      showError(nameEl, 'Please enter your name.');
      valid = false;
    }

    // Validate email
    if (!emailEl.value.trim()) {
      showError(emailEl, 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(emailEl.value.trim())) {
      showError(emailEl, 'Please enter a valid email address.');
      valid = false;
    }

    // Validate message
    if (!messageEl.value.trim()) {
      showError(messageEl, 'Please enter a message.');
      valid = false;
    } else if (messageEl.value.trim().length < 20) {
      showError(messageEl, 'Message should be at least 20 characters.');
      valid = false;
    }

    if (valid) {
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      })
      .then(response => {
        if (response.ok) {
          successEl.textContent = "✓ Thanks for reaching out! I'll get back to you soon.";
          form.reset();
        } else {
          successEl.textContent = "❌ Something went wrong. Please try again.";
        }
      })
      .catch(() => {
        successEl.textContent = "❌ Network error. Please try again.";
      });
    }
  });

  // Clear errors on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
  });

}

/* ====================================================
   ACTIVE NAV LINK ON SCROLL
   ==================================================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--blue)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
