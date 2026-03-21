/* ============================================================
   main.js — Portfolio Site
   Sections:
     1. Sticky navbar
     2. Hamburger menu
     3. Fade-in on scroll (IntersectionObserver)
     4. Skill bar animations
     5. Active nav link highlight
     6. Contact form validation + success state
     7. Footer year
   ============================================================ */

'use strict';

/* ============================================================
   1. STICKY NAVBAR
   Adds .scrolled class once the user scrolls past 40px,
   which triggers the frosted-glass background in CSS.
   ============================================================ */
const siteHeader = document.getElementById('site-header');

function onScroll() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load in case the page is already scrolled


/* ============================================================
   2. HAMBURGER MENU
   Toggles the fullscreen mobile nav overlay.
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');

function openMenu() {
  hamburger.classList.add('is-open');
  navLinks.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent bg scroll
}

function closeMenu() {
  hamburger.classList.remove('is-open');
  navLinks.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
});

// Close when any nav link is tapped
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
    closeMenu();
    hamburger.focus();
  }
});


/* ============================================================
   3. FADE-IN ANIMATIONS (IntersectionObserver)
   Elements with .fade-in will receive .is-visible when they
   enter the viewport, triggering the CSS transition.
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { rootMargin: '0px 0px -64px 0px', threshold: 0.08 }
  );

  fadeEls.forEach(el => fadeObserver.observe(el));
}


/* ============================================================
   4. SKILL BAR ANIMATIONS
   Progress bars start at 0 in CSS; JS sets the target width
   once the bar scrolls into view.
   ============================================================ */
const skillBarFills = document.querySelectorAll('.skill-bar__fill');

if (skillBarFills.length) {
  const barObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.getAttribute('data-width');
          // Small delay so the animation is noticeable
          setTimeout(() => { fill.style.width = `${width}%`; }, 180);
          barObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBarFills.forEach(fill => barObserver.observe(fill));
}


/* ============================================================
   5. ACTIVE NAV LINK HIGHLIGHT
   Uses IntersectionObserver to mark the current section's nav
   link as .active as the user scrolls.
   ============================================================ */
const pageSections  = document.querySelectorAll('section[id]');
const navLinkEls    = document.querySelectorAll('.nav-links .nav-link:not(.nav-link--cta)');

if (pageSections.length && navLinkEls.length) {
  const navOffset = getComputedStyle(document.documentElement)
                      .getPropertyValue('--nav-h').trim() || '68px';

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: `-${navOffset} 0px -68% 0px` }
  );

  pageSections.forEach(s => sectionObserver.observe(s));
}


/* ============================================================
   6. CONTACT FORM
   Client-side validation + simulated async submit with a
   polished success state. Swap the setTimeout for a real
   fetch() call when you add a backend or form service.
   ============================================================ */
const contactForm   = document.getElementById('contact-form');
const formSuccess   = document.getElementById('form-success');
const formResetBtn  = document.getElementById('form-reset-btn');
const submitBtn     = document.getElementById('submit-btn');

// --- Helpers ---
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('has-error');
  error.textContent = message;
  input.setAttribute('aria-describedby', errorId);
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('has-error');
  error.textContent = '';
  input.removeAttribute('aria-describedby');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Live error clearing ---
[
  { id: 'contact-name',    errId: 'name-error'    },
  { id: 'contact-email',   errId: 'email-error'   },
  { id: 'contact-message', errId: 'message-error' },
].forEach(({ id, errId }) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      if (el.classList.contains('has-error')) clearError(id, errId);
    });
  }
});

// --- Validation ---
function validateForm(data) {
  // Clear previous errors
  clearError('contact-name',    'name-error');
  clearError('contact-email',   'email-error');
  clearError('contact-message', 'message-error');

  let valid = true;

  if (!data.get('name').trim()) {
    showError('contact-name', 'name-error', 'Please enter your name.');
    valid = false;
  }

  const email = data.get('email').trim();
  if (!email) {
    showError('contact-email', 'email-error', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    showError('contact-email', 'email-error', 'Please enter a valid email address.');
    valid = false;
  }

  const msg = data.get('message').trim();
  if (!msg) {
    showError('contact-message', 'message-error', 'Please enter a message.');
    valid = false;
  } else if (msg.length < 10) {
    showError('contact-message', 'message-error', 'Your message is a bit short — tell me more!');
    valid = false;
  }

  return valid;
}

// --- Submit handler ---
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(contactForm);

    if (!validateForm(data)) {
      const firstInvalid = contactForm.querySelector('.has-error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Lock button while sending
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
      await emailjs.send('service_1wii1ld', 'template_vztuime', {
        name:    data.get('name').trim(),
        email:   data.get('email').trim(),
        message: data.get('message').trim()
      });

      contactForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus();
    } catch {
      // Re-enable button and show inline error so the user can retry
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
      submitBtn.innerHTML  += ' <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

      const errEl = document.getElementById('message-error');
      if (errEl) {
        errEl.textContent = 'Something went wrong — please try again or email directly.';
      }
    }
  });
}

// --- Reset form after success ---
if (formResetBtn) {
  formResetBtn.addEventListener('click', () => {
    // Reset state
    contactForm.reset();
    contactForm.hidden = false;
    formSuccess.hidden = true;

    // Re-enable submit button and restore original label + icon
    submitBtn.disabled   = false;
    submitBtn.innerHTML  =
      `Send Message
       <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
         <line x1="22" y1="2" x2="11" y2="13"/>
         <polygon points="22 2 15 22 11 13 2 9 22 2"/>
       </svg>`;

    clearError('contact-name',    'name-error');
    clearError('contact-email',   'email-error');
    clearError('contact-message', 'message-error');

    document.getElementById('contact-name').focus();
  });
}


/* ============================================================
   7. FOOTER YEAR
   Automatically keeps the copyright year up to date.
   ============================================================ */
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();
