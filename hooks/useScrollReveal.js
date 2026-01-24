'use client';

import { useEffect } from 'react';

export default function useScrollReveal() {
    useEffect(() => {
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

        return () => observer.disconnect();
    }, []);
}
