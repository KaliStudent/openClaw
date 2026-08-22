/**
 * ComponentKit — Landing Page Interactions
 * Pricing toggle, FAQ accordion, smooth scroll, mobile nav, sticky CTA
 */
(function () {
    'use strict';

    // =========================================================
    // HEADER SCROLL EFFECT
    // =========================================================
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // =========================================================
    // MOBILE NAVIGATION
    // =========================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = mobileToggle ? mobileToggle.closest('.nav') : null;

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('nav--open');
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close on link click
        nav.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('nav--open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================
    // PRICING TOGGLE (Monthly / Annual)
    // =========================================================
    const pricingToggle = document.getElementById('pricing-toggle');
    const amounts = document.querySelectorAll('.pricing-card__amount[data-monthly]');
    const periods = document.querySelectorAll('.pricing-card__period[data-monthly]');

    if (pricingToggle) {
        pricingToggle.addEventListener('click', function () {
            const isAnnual = this.getAttribute('aria-checked') === 'true';
            const newState = !isAnnual;
            this.setAttribute('aria-checked', newState ? 'true' : 'false');

            amounts.forEach(function (el) {
                el.textContent = newState ? el.dataset.annual : el.dataset.monthly;
            });

            periods.forEach(function (el) {
                el.textContent = newState ? el.dataset.annual : el.dataset.monthly;
            });
        });
    }

    // =========================================================
    // FAQ ACCORDION
    // =========================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');

        if (question && answer) {
            question.addEventListener('click', function () {
                const isOpen = item.classList.contains('faq-item--open');

                // Close all others
                faqItems.forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove('faq-item--open');
                        const otherAnswer = other.querySelector('.faq-item__answer');
                        const otherQuestion = other.querySelector('.faq-item__question');
                        if (otherAnswer) otherAnswer.hidden = true;
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                if (isOpen) {
                    item.classList.remove('faq-item--open');
                    answer.hidden = true;
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('faq-item--open');
                    answer.hidden = false;
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // =========================================================
    // SMOOTH SCROLL for anchor links
    // =========================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =========================================================
    // STICKY CTA (show after scrolling past hero)
    // =========================================================
    const stickyCta = document.getElementById('sticky-cta');

    if (stickyCta) {
        function updateStickyCta() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero') ? document.querySelector('.hero').offsetHeight : 600;

            if (scrollY > heroHeight && window.innerWidth <= 768) {
                stickyCta.classList.add('sticky-cta--visible');
                stickyCta.setAttribute('aria-hidden', 'false');
            } else {
                stickyCta.classList.remove('sticky-cta--visible');
                stickyCta.setAttribute('aria-hidden', 'true');
            }
        }

        window.addEventListener('scroll', updateStickyCta, { passive: true });
        window.addEventListener('resize', updateStickyCta, { passive: true });
        updateStickyCta();
    }

    // =========================================================
    // INTERSECTION OBSERVER - Animate elements on scroll
    // =========================================================
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .faq-item');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.classList.contains('pricing-card--featured')
                        ? 'scale(1.02)'
                        : 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animateElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

})();
