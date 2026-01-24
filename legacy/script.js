/**
 * ÇINAR GAYRIMENKUL - Premium Website Scripts
 * Modern, performant JavaScript for luxury real estate experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlider();
  initScrollReveal();
  initScrollEffects();
  initAnimatedCounters();
  initTypewriter();
});

/**
 * Navigation Module
 */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      // Skip external links or empty hrefs
      if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Spy: Active Section Highlight
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Trigger when section is near top
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Hero Slider Module
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;

  let currentSlide = 0;
  const slideCount = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('hero__slide--active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
  }

  setInterval(nextSlide, 8000);
}

/**
 * Scroll Reveal Module
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Scroll Effects Module
 */
function initScrollEffects() {
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Animated Counters Module
 * Smooth, performant number animation using requestAnimationFrame
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const animateCounter = (element, target) => {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      element.textContent = currentValue + '+';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + '+';
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Typewriter Effect Module
 * Premium, human-like typing animation for hero subtitle
 * Optimized with requestAnimationFrame for 60fps performance
 */
function initTypewriter() {
  const subtitle = document.querySelector('.hero__subtitle');
  if (!subtitle) return;

  const fullText = subtitle.textContent.trim();

  // Clear content
  subtitle.textContent = '';

  // Create single text node for better performance (avoids layout thrashing)
  const textNode = document.createTextNode('');
  subtitle.appendChild(textNode);

  // Create elegant cursor
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  subtitle.appendChild(cursor);

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    textNode.nodeValue = fullText;
    return;
  }

  // Precompute timing map for consistent, stutter-free execution
  // Target: ~15% faster than before (Avg ~42ms per char vs 50ms)
  // Base range: 25ms - 60ms
  const timingMap = new Float32Array(fullText.length);
  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i];
    // Natural variation
    let delay = Math.random() * 35 + 25;

    // Subtle pause on punctuation for linguistic rhythm
    if (char === ',' || char === ';' || char === '.') delay += 80;

    timingMap[i] = delay;
  }

  let charIndex = 0;
  let lastFrameTime = 0;
  let timeAccumulator = 0;

  // Animation Loop using RAF for zero stutter
  function loop(currentTime) {
    if (!lastFrameTime) lastFrameTime = currentTime;

    // Calculate delta time (capped to prevent jumps on tab switch)
    const deltaTime = Math.min(currentTime - lastFrameTime, 100);
    lastFrameTime = currentTime;

    timeAccumulator += deltaTime;

    // Process characters based on accumulated time
    // This decoupled loop ensures speed is maintained even if frames drop slightly
    while (charIndex < fullText.length && timeAccumulator >= timingMap[charIndex]) {
      timeAccumulator -= timingMap[charIndex];
      textNode.nodeValue += fullText[charIndex];
      charIndex++;
    }

    if (charIndex < fullText.length) {
      requestAnimationFrame(loop);
    } else {
      // Animation complete - graceful cursor exit
      cursor.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 800,
        delay: 1500,
        fill: 'forwards',
        easing: 'ease-out'
      });
    }
  }

  // Start animation after hero title reveal (1.2s delay)
  setTimeout(() => {
    requestAnimationFrame(loop);
  }, 1200);
}


// Page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});