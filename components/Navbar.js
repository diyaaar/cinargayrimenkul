'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            // Navbar scroll effect
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Scroll Spy
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 150)) {
                    setActiveSection(section.getAttribute('id'));
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        if (id.startsWith('http')) {
            window.open(id, '_blank');
            return;
        }

        const element = document.querySelector(id);
        if (element) {
            const offset = 80; // navbar height approx
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container">
                <div className="nav-brand">
                    <Link href="/" className="logo">
                        <Image
                            src="/logosiyah.svg"
                            alt="Çınar Gayrimenkul"
                            className="logo-img"
                            width={150}
                            height={50}
                        />
                    </Link>
                </div>
                <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id="nav-menu">
                    <li>
                        <a
                            href="#hero"
                            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#hero')}
                        >
                            Ana Sayfa
                        </a>
                    </li>
                    <li>
                        <a
                            href="#about"
                            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#about')}
                        >
                            Hakkımızda
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://cinargayrimenkulcigli.sahibinden.com/emlak?sorting=date_desc"
                            target="_blank"
                            rel="noopener"
                            className="nav-link"
                        >
                            İlanlar
                        </a>
                    </li>
                    <li>
                        <a
                            href="#services"
                            className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#services')}
                        >
                            Hizmetler
                        </a>
                    </li>
                    <li>
                        <a
                            href="#contact"
                            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#contact')}
                        >
                            İletişim
                        </a>
                    </li>
                </ul>
                <div
                    className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                    id="mobile-toggle"
                    aria-label="Menüyü aç"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}
