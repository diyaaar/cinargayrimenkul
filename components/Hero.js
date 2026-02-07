'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Slider Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev === 0 ? 1 : 0));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for premium feel
            }
        }
    };

    const signatureVariants = {
        hidden: { opacity: 0, y: 15, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 1.2,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="hero" id="hero">
            <div className="hero__media">
                <div className={`hero__slide ${currentSlide === 0 ? 'hero__slide--active' : ''}`} data-slide="0">
                    <Image
                        src="/cinar2.webp"
                        alt="Modern Yaşam Alanları"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className={`hero__slide ${currentSlide === 1 ? 'hero__slide--active' : ''}`} data-slide="1">
                    <Image
                        src="/cinar1.webp"
                        alt="Premium Gayrimenkul"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="hero__vignette"></div>
            </div>

            <motion.div
                className="hero__content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h1 className="hero__title">
                    <motion.span className="line" variants={signatureVariants}>Çınar Duran</motion.span>
                    <motion.span className="line text-green" variants={itemVariants}>EMLAK VE GAYRİMENKUL</motion.span>
                    <motion.span className="line text-white" variants={itemVariants}>DANIŞMANLIĞI</motion.span>
                </h1>
                <motion.p className="hero__subtitle" variants={itemVariants}>
                    Gayrimenkul Yatırımlarınızda Güvenin Adresi
                </motion.p>
                <motion.div className="hero__cta" variants={itemVariants}>
                    <Link href="/listings">
                        <motion.button
                            className="hero-collab-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>Portföyümüzü Görüntüleyin</span>
                        </motion.button>
                    </Link>
                    <motion.a
                        href="#contact"
                        className="hero-collab-btn hero-collab-btn--secondary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>İletişime Geçin</span>
                    </motion.a>
                </motion.div>
            </motion.div>
        </section>
    );
}
