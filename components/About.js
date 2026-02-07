'use client';

import { useEffect, useRef } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function About() {
    useScrollReveal();
    const sectionRef = useRef(null);

    useEffect(() => {
        const counters = sectionRef.current?.querySelectorAll('[data-count]');
        if (!counters?.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const animateCounter = (element, target) => {
            const duration = 1200; // Faster overall duration
            const startTime = performance.now();
            const startValue = 0;
            const easeOutQuad = (t) => t * (2 - t); // Less aggressive deceleration than cubic/quart

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuad(progress);
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

        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" className="section section--light" ref={sectionRef}>
            <div className="container">
                <div className="section-header">
                    <span className="section-eyebrow" data-reveal>Hakkımızda</span>
                    <h2 className="section-title" data-reveal data-reveal-delay="1">Hoş Geldiniz</h2>
                    <p className="section-subtitle" data-reveal data-reveal-delay="2">
                        Çınar Gayrimenkul olarak, Çiğli'nin merkezinden tüm İzmir'e uzanan geniş portföyümüzle güvenilir
                        çözümler sunuyoruz.
                    </p>
                </div>

                <div className="stats-grid" data-reveal data-reveal-delay="3">
                    <div className="stat-item">
                        <div className="stat-number" data-count="150">0</div>
                        <div className="stat-label">Mutlu Müşteri</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number" data-count="7">0</div>
                        <div className="stat-label">Yıllık Deneyim</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number" data-count="200">0</div>
                        <div className="stat-label">Başarılı İşlem</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
