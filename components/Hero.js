'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const subtitleRef = useRef(null);

    // Slider Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev === 0 ? 1 : 0));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Typewriter Logic
    useEffect(() => {
        const subtitle = subtitleRef.current;
        if (!subtitle) return;

        const fullText = "Sektörde bilinen iş tecrübesi ve güvenirliliğiyle Çınar Duran Gayrimenkul, hayallerinizdeki mülklere giden yolda size özel çözüm ve hizmetler sunuyor.";

        // Clear content
        subtitle.textContent = '';

        const textNode = document.createTextNode('');
        subtitle.appendChild(textNode);

        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        subtitle.appendChild(cursor);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            textNode.nodeValue = fullText;
            return;
        }

        const timingMap = new Float32Array(fullText.length);
        for (let i = 0; i < fullText.length; i++) {
            const char = fullText[i];
            let delay = Math.random() * 35 + 25;
            if (char === ',' || char === ';' || char === '.') delay += 80;
            timingMap[i] = delay;
        }

        let charIndex = 0;
        let lastFrameTime = 0;
        let timeAccumulator = 0;
        let requestID;

        function loop(currentTime) {
            if (!lastFrameTime) lastFrameTime = currentTime;
            const deltaTime = Math.min(currentTime - lastFrameTime, 100);
            lastFrameTime = currentTime;
            timeAccumulator += deltaTime;

            while (charIndex < fullText.length && timeAccumulator >= timingMap[charIndex]) {
                timeAccumulator -= timingMap[charIndex];
                textNode.nodeValue += fullText[charIndex];
                charIndex++;
            }

            if (charIndex < fullText.length) {
                requestID = requestAnimationFrame(loop);
            } else {
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

        const timer = setTimeout(() => {
            requestID = requestAnimationFrame(loop);
        }, 1200);

        return () => {
            clearTimeout(timer);
            if (requestID) cancelAnimationFrame(requestID);
        };
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="hero__media">
                <div className={`hero__slide ${currentSlide === 0 ? 'hero__slide--active' : ''}`} data-slide="0">
                    <Image
                        src="/cinar1.webp"
                        alt="Premium Gayrimenkul"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className={`hero__slide ${currentSlide === 1 ? 'hero__slide--active' : ''}`} data-slide="1">
                    <Image
                        src="/cinar2.webp"
                        alt="Modern Yaşam Alanları"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="hero__vignette"></div>
            </div>

            <div className="hero__content">
                <span className="hero__eyebrow">Çiğli & İzmir</span>
                <h1 className="hero__title">
                    <span className="line"><span>Gayrimenkul</span></span>
                    <span className="line"><span>Yatırımlarınızda</span></span>
                    <span className="line"><span className="accent">Güvenin Adresi</span></span>
                </h1>
                <p className="hero__subtitle" ref={subtitleRef}>
                    {/* Text is injected via JS */}
                </p>
                <div className="hero__cta">
                    <a href="https://cinargayrimenkulcigli.sahibinden.com/emlak?sorting=date_desc" target="_blank"
                        rel="noopener" className="btn btn--primary btn--large">
                        <span>İlanları Keşfedin</span>
                        <i className="fas fa-arrow-right"></i>
                    </a>
                    <a href="#contact" className="btn btn--ghost btn--large">
                        <span>İletişime Geçin</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
