/**
 * AASHRI PURE VEG RESTAURANT & BANQUET
 * High-Performance Interactive Hospitality Logic
 * Zero Slop • Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveals();
  initMenuFiltering();
  initGalleryLightbox();
  initFormsAndModals();
  initMobileNav();
});

/* ==========================================================================
   STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   INTERSECTION OBSERVER SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   MENU FILTERING TABS
   ========================================================================== */
function initMenuFiltering() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const cards = document.querySelectorAll('.menu-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-category');

      cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
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
  const banquetForm = document.getElementById('banquetEnquiryForm');
  if (banquetForm) {
    banquetForm.addEventListener('submit', handleBanquetSubmit);
  }

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

  const tableForm = document.getElementById('tableReservationForm');
  if (tableForm) {
    tableForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = tableForm.querySelector('[name="name"]')?.value || 'Guest';
      const phone = tableForm.querySelector('[name="phone"]')?.value || '';
      const guests = tableForm.querySelector('[name="guests"]')?.value || '2 Guests';
      const date = tableForm.querySelector('[name="date"]')?.value || 'Today';
      const time = tableForm.querySelector('[name="time"]')?.value || 'Dinner';
      const notes = tableForm.querySelector('[name="notes"]')?.value || '';

      const phoneClean = phone.replace(/\D/g, '');
      if (phoneClean.length < 10) {
        showToast('Please enter a valid 10-digit phone number');
        return;
      }

      const token = 'TAB-' + Math.floor(1000 + Math.random() * 9000);
      showToast(`Reservation Confirmed #${token} for ${name}`);

      const waMsg = encodeURIComponent(
        `Hello Aashri Pure Veg Restaurant Nagpur!\nI would like to reserve a table:\n- Booking ID: ${token}\n- Name: ${name}\n- Phone: ${phone}\n- Guests: ${guests}\n- Date: ${date}\n- Slot: ${time}${notes ? '\n- Notes: ' + notes : ''}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/918806859456?text=${waMsg}`, '_blank');
      }, 800);

      if (reservationModal) reservationModal.classList.remove('open');
      document.body.style.overflow = '';
      tableForm.reset();
    });
  }
}

function handleBanquetSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value.trim();
  const phone = form.querySelector('[name="phone"]').value.trim();
  const occasion = form.querySelector('[name="occasion"]').value;
  const guests = form.querySelector('[name="guests"]').value;
  const date = form.querySelector('[name="date"]').value;
  const notes = form.querySelector('[name="notes"]')?.value || '';

  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 10) {
    showToast('Please enter a valid 10-digit phone number');
    return;
  }

  const token = 'EVT-' + Math.floor(10000 + Math.random() * 90000);
  const feedbackEl = document.getElementById('banquetFeedback');

  const waMsg = encodeURIComponent(
    `Hello Aashri Banquet Team!\nI have submitted an event enquiry:\n- Reference: ${token}\n- Name: ${name}\n- Phone: ${phone}\n- Occasion: ${occasion}\n- Guest Count: ${guests}\n- Date: ${date}${notes ? '\n- Special Requests: ' + notes : ''}`
  );

  if (feedbackEl) {
    feedbackEl.innerHTML = `
      <div style="font-weight: 600; font-size: 1rem; color: #48bb78; margin-bottom: 0.3rem;">
        ✓ Event Enquiry Received (Ref: ${token})
      </div>
      <p style="font-size: 0.84rem; color: #FAF7F2; margin-bottom: 0.75rem;">
        Thank you, <strong>${name}</strong>. Our banquet coordinator will contact you at <strong>${phone}</strong> shortly.
      </p>
      <a href="https://wa.me/918806859456?text=${waMsg}" 
         target="_blank" 
         class="btn btn-sm btn-primary">
        Connect Instantly on WhatsApp →
      </a>
    `;
    feedbackEl.style.display = 'block';
  }

  showToast(`Banquet Enquiry #${token} Submitted!`);
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
    <span style="color: var(--color-gold); font-size: 1rem;">✦</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}
