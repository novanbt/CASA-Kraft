/**
 * Casa Kraft Interiors — Studio Global JavaScript
 * Interactions, Navigation, Consultation Drawer & Toasts
 */

(function () {
  'use strict';

  // --- Mobile Menu Toggle ---
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const content = document.getElementById('mobile-drawer-content');

    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        content.classList.remove('translate-x-full');
      }, 10);
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
      }
      if (content) {
        content.classList.add('translate-x-full');
      }
      setTimeout(() => {
        drawer.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
        closeMenu();
      }
    });
  }

  // --- Universal Consultation Modal / Drawer ---
  function initConsultationModal() {
    const modal = document.getElementById('consultation-modal');
    if (!modal) return;

    const overlay = document.getElementById('consultation-modal-overlay');
    const panel = document.getElementById('consultation-modal-panel');
    const closeBtns = document.querySelectorAll('.close-consultation-btn');
    const openBtns = document.querySelectorAll('.open-consultation-btn, [data-path="contact"], a[href="#contact"]');

    function openModal(e) {
      if (e && e.preventDefault && this && this.getAttribute('href') !== 'contact.html') {
        // If they click on a button or an anchor that isn't a direct link to another page
        if (this.getAttribute('data-action') === 'open-modal' || this.classList.contains('open-consultation-btn')) {
          e.preventDefault();
        }
      }
      modal.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.remove('opacity-0');
        panel.classList.remove('translate-x-full', 'opacity-0');
      }, 10);
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.add('opacity-0');
      panel.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }

    openBtns.forEach((btn) => {
      if (btn.getAttribute('data-action') === 'open-modal' || btn.classList.contains('open-consultation-btn')) {
        btn.addEventListener('click', openModal);
      }
    });

    closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Expose globally
    window.openConsultationModal = openModal;
    window.closeConsultationModal = closeModal;
  }

  // --- Universal Consultation Form Handler ---
  function initFormHandlers() {
    const forms = document.querySelectorAll('.consultation-form');

    forms.forEach((form) => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('[name="client_name"]')?.value || 'Patron';
        const phone = form.querySelector('[name="client_phone"]')?.value || '';
        const email = form.querySelector('[name="client_email"]')?.value || '';
        const service = form.querySelector('[name="project_type"]')?.value || 'Interior Architecture';
        const location = form.querySelector('[name="project_location"]')?.value || 'Your Location';
        const area = form.querySelector('[name="carpet_area"]')?.value || '';
        const timeline = form.querySelector('[name="timeline"]:checked')?.value || '';
        const notes = form.querySelector('[name="project_notes"]')?.value || '';

        // Clean up and format carpet area (e.g. 4500 -> 4,500 sq.ft)
        let formattedArea = (area || '').trim();
        if (formattedArea && !/sq|ft|meter/i.test(formattedArea)) {
          const num = parseInt(formattedArea.replace(/\D/g, ''), 10);
          formattedArea = (!isNaN(num) && num > 0) ? `${num.toLocaleString('en-IN')} sq.ft` : `${formattedArea} sq.ft`;
        }

        // Clean up location
        let formattedLocation = (location || '').trim();

        // Compose an elegant, natural, luxury consultation inquiry
        let whatsappMsg = `Hello Casa Kraft Interiors! 👋\n` +
          `I would like to discuss an interior design project for my space.\n\n` +
          `📋 *Consultation Details:*\n` +
          `• *Name:* ${name}\n` +
          `• *Phone:* ${phone}\n` +
          (email ? `• *Email:* ${email}\n` : '') +
          `• *Project Scope:* ${service}\n` +
          `• *Location:* ${formattedLocation}\n` +
          (formattedArea ? `• *Carpet Area:* ${formattedArea}\n` : '') +
          (timeline ? `• *Target Timeline:* ${timeline}\n` : '') +
          (notes ? `\n✨ *Design Vision & Requirements:*\n"${notes}"\n` : '') +
          `\nPlease let me know your availability for an initial studio walkthrough or site visit. Thank you!`;

        const whatsappUrl = `https://wa.me/919955455305?text=${encodeURIComponent(whatsappMsg)}`;

        // Show Toast
        showToast(`Consultation details recorded for ${name}! Connecting directly to WhatsApp...`);

        // Close modal if open
        if (window.closeConsultationModal) {
          window.closeConsultationModal();
        }

        form.reset();

        // Directly open WhatsApp
        window.open(whatsappUrl, '_blank');
      });
    });
  }

  // --- Toast Notification Utility ---
  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-6 right-6 z-[9999] max-w-md p-4 bg-[#141411] text-[#fbf9f4] border border-[#cac6bd]/40 shadow-2xl rounded flex items-start gap-3 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none';
      toast.innerHTML = `
        <span class="material-symbols-outlined text-[#e0e5cd] text-xl shrink-0 mt-0.5">verified</span>
        <div class="flex-grow">
          <p class="font-manrope text-xs font-semibold uppercase tracking-widest text-[#e0e5cd]">Atelier Confirmation</p>
          <p class="font-manrope text-sm text-[#e4e2dd] mt-0.5 leading-snug" id="toast-message"></p>
        </div>
        <button type="button" class="text-[#cac6bd] hover:text-white ml-2 text-sm" onclick="this.parentElement.classList.remove('show')">✕</button>
      `;
      document.body.appendChild(toast);
    }

    const msgEl = toast.querySelector('#toast-message');
    if (msgEl) msgEl.textContent = message;

    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('show', 'translate-y-0', 'opacity-100', 'pointer-events-auto');

    setTimeout(() => {
      toast.classList.remove('show', 'translate-y-0', 'opacity-100', 'pointer-events-auto');
      toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 6000);
  }
  window.showToast = showToast;

  // --- Active Nav State Determination ---
  function highlightActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('header nav a, #mobile-drawer a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')?.toLowerCase() || '';
      if (
        (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '') &&
        (href === 'index.html' || href === '#' || href === './')
      ) {
        // active on home
        link.classList.add('text-primary', 'font-semibold');
      } else if (href && currentPath.includes(href)) {
        link.classList.add('text-primary', 'font-semibold');
      }
    });
  }

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initConsultationModal();
    initFormHandlers();
    highlightActiveNav();
  });
})();
