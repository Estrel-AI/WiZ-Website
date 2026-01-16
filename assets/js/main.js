/**
* Template Name: WiiZ
*
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  // =================================================================================
  // AUTHENTICATION LOGIC (RUNS IMMEDIATELY)

  // =================================================================================
  /**
   * Checks login state and updates UI elements accordingly.
   * This runs immediately to prevent any flicker of wrong buttons/links.
   */
  function checkAuthState() {
    const authToken = localStorage.getItem('wiizAuthToken');

    // Navbar links
    const signupLink = document.getElementById('nav-signup-link');
    const signinLink = document.getElementById('nav-signin-link');
    const logoutLink = document.getElementById('nav-logout-link');

    if (authToken) {
      // User is LOGGED IN
      if (signupLink) signupLink.style.display = 'none';
      if (signinLink) signinLink.style.display = 'none';
      if (logoutLink) logoutLink.style.display = 'list-item';
    } else {
      // User is LOGGED OUT
      if (signupLink) signupLink.style.display = 'list-item';
      if (signinLink) signinLink.style.display = 'list-item';
      if (logoutLink) logoutLink.style.display = 'none';
    }

    // "Get Started" / CTA buttons
    const ctaButtons = document.querySelectorAll('a.btn[href="Signup.html"], a.btn[href="Login.html"], a.btn[href="#about"]');
    if (authToken) {
      ctaButtons.forEach(button => {
        button.href = 'https://hub.wiiz.it/aistudio/login';
        const icon = button.querySelector('i');
        let buttonText = 'Get Started';
        if (button.textContent.trim().toLowerCase().includes('learn more')) {
          buttonText = 'Explore Platform';
        }
        button.innerHTML = icon ? `<i class="${icon.className}"></i> ${buttonText}` : buttonText;
      });
    }
  }

  // --- Run the authentication check as soon as the script loads ---
  checkAuthState();

  // ---------------------------------------------------------------------------
  // TEMPLATE HELPER FUNCTIONS (Definitions)
  // ---------------------------------------------------------------------------

  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  function toggleScrollTop() {
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  function aosInit() {
    AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
  }

  function navmenuScrollspy() {
    const navmenulinks = document.querySelectorAll('.navmenu a');
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // EVENT LISTENERS (Execution)
  // ---------------------------------------------------------------------------

  window.addEventListener('load', () => {
    toggleScrolled();
    toggleScrollTop();
    aosInit();
    navmenuScrollspy();
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setTimeout(() => {
        let section = document.querySelector(window.location.hash);
        let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
        window.scrollTo({ top: section.offsetTop - parseInt(scrollMarginTop), behavior: 'smooth' });
      }, 100);
    }
  });

  document.addEventListener('scroll', () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn) mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) mobileNavToogle();
      });
    });

    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });
    if (typeof PureCounter !== 'undefined') new PureCounter();

    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
      faqItem.addEventListener('click', () => faqItem.parentNode.classList.toggle('faq-active'));
    });

    // --- Logout Button Logic (Needs to be inside DOMContentLoaded) ---
    const logoutLink = document.getElementById('nav-logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('wiizAuthToken');
        localStorage.removeItem('wiizUserData');
        window.location.href = 'index.html';
      });
    }

    // --- Inline Video Player Logic for Signup Page ---
    const videoItems = document.querySelectorAll('.inline-video-item');
    videoItems.forEach(item => {
      const trigger = item.querySelector('.video-trigger');
      const video = item.querySelector('.inline-video-player');
      let playCount = 0;
      if (trigger && video) {
        trigger.addEventListener('click', () => {
          trigger.style.display = 'none';
          video.style.display = 'block';
          playCount = 0;
          video.play();
        });
        video.addEventListener('ended', () => {
          playCount++;
          if (playCount < 3) video.play();
          else { video.pause(); video.style.display = 'none'; trigger.style.display = 'flex'; }
        });
      }
    });

    // --- Custom Carousel Logic for External Indicators ---
    function initializeCarouselWithExternalIndicators(carouselId) {
      const carouselElement = document.getElementById(carouselId);
      if (!carouselElement) return;

      const indicators = document.querySelectorAll(`button[data-bs-target="#${carouselId}"]`);
      if (indicators.length > 0) {

        const firstIndicator = indicators[0];
        if (firstIndicator && !firstIndicator.classList.contains('active')) {
          indicators.forEach(ind => ind.classList.remove('active'));
          firstIndicator.classList.add('active');
        }

        carouselElement.addEventListener('slid.bs.carousel', event => {
          indicators.forEach(indicator => indicator.classList.remove('active'));
          const activeIndicator = indicators[event.to];
          if (activeIndicator) activeIndicator.classList.add('active');
        });
      }
    }

    // Initialize carousels that might have external indicators.
    initializeCarouselWithExternalIndicators('offeringsCarousel');
    // Note: featuresCarousel now has its indicators inside, so it doesn't need this.
    // I'm leaving the call here as it's harmless and will work if you move them again.
    initializeCarouselWithExternalIndicators('featuresCarousel');

    // --- "Apple Style" Zoom on Scroll Logic ---
    const scrollZoomElements = document.querySelectorAll('.scroll-zoom');

    if (scrollZoomElements.length > 0) {
      const handleScrollZoom = () => {
        const windowHeight = window.innerHeight;

        scrollZoomElements.forEach(el => {
          const rect = el.getBoundingClientRect();

          const isVisible = (rect.top < windowHeight && rect.bottom > 0);

          if (isVisible) {
            const elementCenter = rect.top + (rect.height / 2);
            const screenCenter = windowHeight / 2;

            // Normalized distance: -1 (top edge) to 1 (bottom edge) relative to half-screen
            const normalizedDist = (elementCenter - screenCenter) / (windowHeight / 2);

            // Strong Scale Effect: 0.85 (at edges) -> 1.0 (at center)
            let scale = 1 - Math.abs(normalizedDist * 0.20);
            scale = Math.max(0.35, Math.min(1, scale));

            // Strong Opacity Effect: 0.5 (at edges) -> 1.0 (at center)
            let opacity = 1 - Math.abs(normalizedDist * 1);
            opacity = Math.max(0.5, Math.min(1, opacity));

            // Force full visibility when near center (within 25% of center)
            if (Math.abs(normalizedDist) < 0.25) {
              opacity = 1;
              scale = 1;
            }

            el.style.transform = `scale(${scale})`;
            el.style.opacity = opacity;
          }
        });
      };

      window.addEventListener('scroll', () => {
        window.requestAnimationFrame(handleScrollZoom);
      });

      // Run once immediately to set initial state
      handleScrollZoom();

      // Safety: Ensure they are fully visible after a delay if JS fails or calculates wrongly
      setTimeout(() => {
        scrollZoomElements.forEach(el => {
          // If opacity is dangerously low (e.g. 0), force reset to 1
          const currentOp = parseFloat(getComputedStyle(el).opacity);
          if (currentOp < 0.2) {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          }
        });
      }, 500);
    }
  });

})();