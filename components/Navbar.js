'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            // Navbar scroll effect
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Scroll Spy - Only on homepage
            if (pathname === '/') {
                const sections = document.querySelectorAll('section');
                sections.forEach(section => {
                    const id = section.getAttribute('id');
                    if (!id) return;
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= (sectionTop - 150)) {
                        setActiveSection(id);
                    }
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const scrollToSection = (e, id) => {
        if (id.startsWith('http')) return; // Let default behavior handle external links

        e.preventDefault();

        // If we are not on the homepage and trying to access a homepage section
        if (pathname !== '/' && id.startsWith('#')) {
            router.push('/' + id);
            setIsMobileMenuOpen(false);
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
        } else if (id.startsWith('#')) {
            // Fallback for cases where direct selector fails but we want to go home
            router.push('/' + id);
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
                            href="/#hero"
                            className={`nav-link ${activeSection === 'hero' && pathname === '/' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#hero')}
                        >
                            Ana Sayfa
                        </a>
                    </li>
                    <li>
                        <a
                            href="/#about"
                            className={`nav-link ${activeSection === 'about' && pathname === '/' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#about')}
                        >
                            Hakkımızda
                        </a>
                    </li>
                    <li>
                        <Link
                            href="/listings"
                            className={`nav-link ${pathname === '/listings' ? 'active' : ''}`}
                        >
                            Portföy
                        </Link>
                    </li>
                    <li>
                        <a
                            href="/#services"
                            className={`nav-link ${activeSection === 'services' && pathname === '/' ? 'active' : ''}`}
                            onClick={(e) => scrollToSection(e, '#services')}
                        >
                            Hizmetler
                        </a>
                    </li>
                    <li>
                        <a
                            href="/#contact"
                            className={`nav-link ${activeSection === 'contact' && pathname === '/' ? 'active' : ''}`}
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
