/**
 * Main JavaScript for the SPIF Website (Calm & Content-Rich Design).
 *
 * This script handles the following functionalities:
 * 1. Sticky Header on scroll.
 * 2. Light/Dark Theme Toggle with localStorage persistence.
 * 3. Mobile Navigation Toggle.
 * 4. Scroll-triggered animations using Intersection Observer.
 * 5. Animated number counters.
 * 6. Initialization for Swiper.js carousels.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. STICKY HEADER
     * Adds a class to the header when the user scrolls down slightly.
     */
    const initStickyHeader = () => {
        const header = document.querySelector('#page-header-inner');
        if (!header) return;

        const stickyPoint = 10; // Trigger effect almost immediately

        window.addEventListener('scroll', () => {
            if (window.scrollY > stickyPoint) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        });
    };

    /**
     * 2. LIGHT/DARK THEME TOGGLE
     * Manages themes based on user preference and localStorage.
     */
    const initThemeToggle = () => {
        const themeToggleButton = document.getElementById('theme-toggle');
        if (!themeToggleButton) return;

        // Function to apply the selected theme
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        };

        // Determine the initial theme
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme ? storedTheme : (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);

        // Add click event listener to the toggle button
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    };

    /**
     * 3. MOBILE NAVIGATION
     * Toggles the mobile menu when the hamburger icon is clicked.
     */
    const initMobileNav = () => {
        const menuToggle = document.querySelector('#page-open-mobile-menu');
        if (!menuToggle) return;
        
        // Check if mobile menu container exists, if not, create it
        let mobileMenu = document.querySelector('#page-mobile-main-menu');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'page-mobile-main-menu';
            document.body.appendChild(mobileMenu);

            const desktopNav = document.querySelector('.navigation .menu__container');
            if (desktopNav) {
                mobileMenu.innerHTML = `<div class="page-mobile-menu-content">${desktopNav.outerHTML}</div>`;
            }

            const closeButton = document.createElement('button');
            closeButton.className = 'page-close-mobile-menu';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Close menu');
            mobileMenu.prepend(closeButton);

            closeButton.addEventListener('click', () => {
                document.body.classList.remove('mobile-menu-is-open');
            });
        }

        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-is-open');
        });
    };


    /**
     * 4. SCROLL-TRIGGERED ANIMATIONS
     * Uses Intersection Observer to add an 'is-animated' class to elements.
     */
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(el => observer.observe(el));
    };

    /**
     * 5. ANIMATED NUMBER COUNTERS
     * Animates numbers when they scroll into view.
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
                    const suffix = targetText.replace(/[0-9,]/g, '');

                    let current = 0;
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16);

                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target.toLocaleString() + suffix;
                        }
                    };
                    requestAnimationFrame(updateCount);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    };

    /**
     * 6. SWIPER.JS CAROUSEL INITIALIZATION
     */
    const initCarousels = () => {
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper library is not loaded. Carousels will not work.');
            return;
        }

        // Testimonials Carousel
        new Swiper('.tm-testimonial', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2 },
            }
        });

        // Clients & Media Logos Carousel
        new Swiper('.tm-logo-carousel', {
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            slidesPerView: 2,
            spaceBetween: 40,
            breakpoints: {
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
            }
        });
    };


    // --- Initialize all modules ---
    initStickyHeader();
    initThemeToggle();
    initMobileNav();
    initScrollAnimations();
    initCounters();
    initCarousels();

});