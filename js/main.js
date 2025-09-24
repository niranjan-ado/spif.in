/**
 * Main JavaScript for the SPIF Website (Performance & Mobile-First).
 *
 * This script is dependency-free and handles:
 * 1. High-Performance Sticky Header using Intersection Observer.
 * 2. Light/Dark Theme Toggle with localStorage persistence.
 * 3. Robust Mobile Navigation overlay.
 * 4. Efficient Scroll-triggered animations.
 * 5. Animated number counters.
 * 6. Controls for the CSS Testimonial Carousel.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. STICKY HEADER (PERFORMANCE-OPTIMIZED)
     * Uses Intersection Observer to toggle the sticky class. This is far more
     * performant than using a 'scroll' event listener.
     */
    const initStickyHeader = () => {
        const header = document.querySelector('#page-header-inner');
        const sentinel = document.querySelector('#header-observer-sentinel');

        if (!header || !sentinel) return;

        const observer = new IntersectionObserver((entries) => {
            // entry.isIntersecting is true when the sentinel is in view.
            // We want the header to be sticky when the sentinel is *out of view*.
            header.classList.toggle('is-sticky', !entries[0].isIntersecting);
        }, {
            root: null, // observes intersections relative to the viewport
            threshold: 0,
        });

        observer.observe(sentinel);
    };

    /**
     * 2. LIGHT/DARK THEME TOGGLE
     * Manages themes based on user preference and localStorage.
     */
    const initThemeToggle = () => {
        const themeToggleButton = document.getElementById('theme-toggle');
        if (!themeToggleButton) return;

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        };

        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme ? storedTheme : (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);

        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    };

    /**
     * 3. MOBILE NAVIGATION
     * Toggles a full-screen overlay menu for a clean mobile experience.
     */
    const initMobileNav = () => {
        const menuToggle = document.querySelector('#page-open-mobile-menu');
        if (!menuToggle) return;
        
        // Dynamically create the mobile menu from the desktop navigation HTML
        // This avoids duplicating menu code in the HTML.
        let mobileMenu = document.querySelector('#page-mobile-main-menu');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'page-mobile-main-menu';
            
            const desktopNav = document.querySelector('.navigation .menu__container');
            if (desktopNav) {
                mobileMenu.innerHTML = `<div class="page-mobile-menu-content">${desktopNav.outerHTML}</div>`;
            }

            const closeButton = document.createElement('button');
            closeButton.className = 'page-close-mobile-menu';
            closeButton.innerHTML = '<span class="material-symbols-outlined">close</span>';
            closeButton.setAttribute('aria-label', 'Close menu');
            mobileMenu.prepend(closeButton);
            
            document.body.appendChild(mobileMenu);

            closeButton.addEventListener('click', () => {
                document.body.classList.remove('mobile-menu-is-open');
            });

            // Add event listener to close menu when a link is clicked
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    document.body.classList.remove('mobile-menu-is-open');
                });
            });
        }

        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-is-open');
        });
    };

    /**
     * 4. SCROLL-TRIGGERED ANIMATIONS
     * Efficiently adds an 'is-animated' class to elements as they enter the viewport.
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-animated');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => observer.observe(el));
    };

    /**
     * 5. ANIMATED NUMBER COUNTERS
     * Animates numbers in the impact section when they scroll into view.
     */
    const initCounters = () => {
        const counters = document.querySelectorAll('.impact-card__number');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetText = counter.innerText;
                    const target = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
                    const suffix = targetText.replace(/[0-9,]/g, '') || '';

                    counter.innerText = '0'; // Start count from 0
                    
                    const duration = 2000; // 2 seconds
                    let startTime = null;

                    const step = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const current = Math.floor(progress * target);
                        counter.innerText = current.toLocaleString();
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            counter.innerText = target.toLocaleString() + suffix;
                        }
                    };
                    requestAnimationFrame(step);
                    
                    observer.unobserve(counter); // Count up only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the element is visible
        
        counters.forEach(counter => observer.observe(counter));
    };

    /**
     * 6. TESTIMONIAL CAROUSEL CONTROLS
     * Provides functionality for the next/prev buttons on the CSS-based carousel.
     */
    const initTestimonialCarousel = () => {
        const track = document.querySelector('.carousel-track');
        const nextButton = document.getElementById('testimonial-next');
        const prevButton = document.getElementById('testimonial-prev');

        if (!track || !nextButton || !prevButton) return;

        const scrollCarousel = (direction) => {
            const slide = track.querySelector('.carousel-slide');
            if (!slide) return;
            const scrollAmount = slide.offsetWidth * direction;
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        };

        nextButton.addEventListener('click', () => scrollCarousel(1));
        prevButton.addEventListener('click', () => scrollCarousel(-1));
    };


    // --- Initialize all modules on page load ---
    initStickyHeader();
    initThemeToggle();
    initMobileNav();
    initScrollAnimations();
    initCounters();
    initTestimonialCarousel();

});