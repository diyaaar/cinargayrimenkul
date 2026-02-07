'use client';

import Image from 'next/image';
import Link from 'next/link';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Listings() {
    useScrollReveal();

    return (
        <section id="listings" className="section section--light">
            <div className="container">
                <div className="section-header">
                    <span className="section-eyebrow" data-reveal>Portföyümüz</span>
                    <h2 className="section-title" data-reveal data-reveal-delay="1">Güncel İlanlarımız</h2>
                    <p className="section-subtitle" data-reveal data-reveal-delay="2">
                        Çiğli ve İzmir genelindeki seçkin gayrimenkul fırsatlarını keşfedin
                    </p>
                </div>

                <div className="listings-showcase" data-reveal data-reveal-delay="3">
                    <div className="listings-card">
                        <div className="listings-card__image">
                            <Image src="/ilangorsel.svg" alt="Premium Mülkler" fill style={{ objectFit: 'cover' }} />
                            <div className="listings-card__overlay">
                                <span className="listings-badge">Yeni İlanlar</span>
                            </div>
                        </div>
                        <div className="listings-card__content">
                            <h3>Satılık & Kiralık Mülkler</h3>
                            <p>Konut, ticari gayrimenkul, arsa ve daha fazlası için güncel ilanlarımızı inceleyin.</p>
                            <div className="listings-features">
                                <span><i className="fas fa-home"></i> Konut</span>
                                <span><i className="fas fa-building"></i> Ticari</span>
                                <span><i className="fas fa-map"></i> Arsa</span>
                            </div>
                            <Link href="/listings" className="btn btn--primary btn--large"
                                style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                                <span>Tüm İlanları Görüntüle</span>
                                <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
