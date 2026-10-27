/**
 * AASHRI PURE VEG RESTAURANT & BANQUET
 * Interactive Luxury Experience & Storytelling Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initChapterTracking();
  initAmbientAudio();
  initMenuFiltering();
  initGalleryLightbox();
  initFormsAndModals();
  initMobileNav();
});

/* ==========================================================================
   SCROLL EFFECTS & REVEALS
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('.header');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Scroll Progress & Sticky Header
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // IntersectionObserver for elements
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   PERSEPOLIS-INSPIRED CHAPTER TRACKING
   ========================================================================== */
function initChapterTracking() {
  const chapters = document.querySelectorAll('[data-chapter]');
  const chapterDots = document.querySelectorAll('.chapter-dot');

  if (!chapters.length || !chapterDots.length) return;

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentChapter = entry.target.getAttribute('data-chapter');
        chapterDots.forEach(dot => {
          if (dot.getAttribute('data-target') === currentChapter) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  chapters.forEach(ch => chapterObserver.observe(ch));

  chapterDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   AMBIENT AUDIO SYNTHESIZER (WEB AUDIO API)
   Generates a tranquil, luxurious ambient acoustic drone
   ========================================================================== */
let audioCtx = null;
let masterGain = null;
let isAudioPlaying = false;
let oscillators = [];

function initAmbientAudio() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      createAmbientSoundscape();
    }

    if (isAudioPlaying) {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
      toggleBtn.classList.remove('playing');
      const label = toggleBtn.querySelector('.audio-label');
      if (label) label.textContent = 'Atmosphere: Off';
      isAudioPlaying = false;
    } else {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      masterGain.gain.setTargetAtTime(0.04, audioCtx.currentTime, 0.5);
      toggleBtn.classList.add('playing');
      const label = toggleBtn.querySelector('.audio-label');
      if (label) label.textContent = 'Atmosphere: On';
      isAudioPlaying = true;
      showToast('Soundscape activated: Warm hospitality ambience');
    }
  });
}

function createAmbientSoundscape() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // Harmonic chord of Indian classical Sa-Pa drone (C3, G3, C4, E4)
  const freqs = [130.81, 196.00, 261.63, 329.63];

  freqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450 + (idx * 50), audioCtx.currentTime);

    oscGain.gain.setValueAtTime(0.25 / freqs.length, audioCtx.currentTime);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start();
    oscillators.push(osc);
  });
}

/* ==========================================================================
   MENU FILTERING & MODAL DETAILS
   ========================================================================== */
function initMenuFiltering() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-category');

      cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   GALLERY LIGHTBOX
   ========================================================================== */
let activeGalleryIndex = 0;
let galleryImagesList = [];

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const closeBtn = document.getElementById('lightboxClose');

  if (!lightboxModal || !galleryItems.length) return;

  // Build image list
  galleryImagesList = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    const tag = item.querySelector('.gallery-caption-tag')?.textContent || 'Aashri Gallery';
    const title = item.querySelector('.gallery-caption-title')?.textContent || 'Aashri Ambience';
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      tag: tag,
      title: title
    };
  });

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    activeGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryImagesList[activeGalleryIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCategory) lightboxCategory.textContent = item.tag;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeGalleryIndex = (activeGalleryIndex - 1 + galleryImagesList.length) % galleryImagesList.length;
      updateLightboxContent();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeGalleryIndex = (activeGalleryIndex + 1) % galleryImagesList.length;
      updateLightboxContent();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* ==========================================================================
   FORMS, RESERVATIONS & MODALS
   ========================================================================== */
function initFormsAndModals() {
  // Banquet Enquiry Form
  const banquetForm = document.getElementById('banquetEnquiryForm');
  if (banquetForm) {
    banquetForm.addEventListener('submit', handleBanquetSubmit);
  }

  // Reservation Modal & Trigger
  const reservationModal = document.getElementById('reservationModal');
  const reserveBtns = document.querySelectorAll('.trigger-reserve-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');

  reserveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (reservationModal) {
        reservationModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Table Reservation Form Submission
  const tableForm = document.getElementById('tableReservationForm');
  if (tableForm) {
    tableForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = tableForm.querySelector('[name="name"]')?.value || 'Guest';
      const guests = tableForm.querySelector('[name="guests"]')?.value || '2';
      const time = tableForm.querySelector('[name="time"]')?.value || 'Today';

      const token = 'TAB-' + Math.floor(1000 + Math.random() * 9000);
      showToast(`Reservation Confirmed #${token} for ${name} (${guests} Guests at ${time})`);

      // WhatsApp link preparation
      const waText = encodeURIComponent(`Hi Aashri Restaurant! I would like to book a table for ${guests} guests at ${time}. Name: ${name} (Ref: ${token})`);
      setTimeout(() => {
        window.open(`https://wa.me/918806859456?text=${waText}`, '_blank');
      }, 900);

      if (reservationModal) reservationModal.classList.remove('open');
      document.body.style.overflow = '';
      tableForm.reset();
    });
  }
}

function handleBanquetSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value;
  const phone = form.querySelector('[name="phone"]').value;
  const occasion = form.querySelector('[name="occasion"]').value;
  const guests = form.querySelector('[name="guests"]').value;
  const date = form.querySelector('[name="date"]').value;
  const notes = form.querySelector('[name="notes"]').value;

  // Validation
  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 10) {
    showToast('Please enter a valid 10-digit phone number');
    return;
  }

  const token = 'AASHRI-EVT-' + Math.floor(10000 + Math.random() * 90000);
  const feedbackEl = document.getElementById('banquetFeedback');

  if (feedbackEl) {
    feedbackEl.innerHTML = `
      <div style="font-weight: 600; font-size: 1.05rem; margin-bottom: 0.4rem; color: #68d391;">
        ✓ Enquiry Received (Ref: ${token})
      </div>
      <p style="margin-bottom: 0.8rem; font-size: 0.85rem; color: #ede6d6;">
        Thank you, <strong>${name}</strong>. Our banquet coordinator will contact you at <strong>${phone}</strong> shortly to discuss details for your <strong>${occasion}</strong> on <strong>${date}</strong>.
      </p>
      <a href="https://wa.me/918806859456?text=${encodeURIComponent(`Hi Aashri Banquet! I have submitted an event enquiry for ${occasion} on ${date} for ${guests} guests. Reference: ${token}, Name: ${name}`)}" 
         target="_blank" 
         class="btn btn-sm btn-primary" 
         style="margin-top: 0.4rem;">
        Confirm Instantly on WhatsApp →
      </a>
    `;
    feedbackEl.style.display = 'block';
  }

  showToast(`Banquet Enquiry #${token} Registered!`);
  form.reset();
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function toggleDrawer() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  toggleBtn.addEventListener('click', toggleDrawer);
  backdrop.addEventListener('click', toggleDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleDrawer();
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--color-gold); font-size: 1.1rem;">◈</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}
