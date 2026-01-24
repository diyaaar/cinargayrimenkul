'use client';

import Image from 'next/image';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Services() {
    useScrollReveal();

    return (
        <section id="services" className="section services-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-eyebrow" data-reveal>Hizmetlerimiz</span>
                    <h2 className="section-title" data-reveal data-reveal-delay="1">Hizmet Alanlarımız</h2>
                    <p className="section-subtitle" data-reveal data-reveal-delay="2">
                        Çiğli ve İzmir genelinde kapsamlı gayrimenkul çözümleri
                    </p>
                </div>

                <div className="services-grid">
                    <div className="service-card" data-reveal data-reveal-delay="1">
                        <div className="service-icon">
                            <Image src="/hizmetler/ev.svg" alt="Konut" width={64} height={64} />
                        </div>
                        <h3>Konut Satış & Kiralama</h3>
                        <p>Daire, villa, müstakil ev satış ve kiralama işlemlerinde profesyonel danışmanlık.</p>
                    </div>

                    <div className="service-card" data-reveal data-reveal-delay="2">
                        <div className="service-icon">
                            <Image src="/hizmetler/isyeri.svg" alt="Ticari" width={64} height={64} />
                        </div>
                        <h3>Ticari Gayrimenkul</h3>
                        <p>Dükkan, ofis, fabrika, depo gibi ticari gayrimenkullerin alım-satım ve kiralama.</p>
                    </div>

                    <div className="service-card" data-reveal data-reveal-delay="3">
                        <div className="service-icon">
                            <Image src="/hizmetler/arsa.svg" alt="Arsa" width={64} height={64} />
                        </div>
                        <h3>Arsa & Tarla</h3>
                        <p>İmar durumu araştırması ile arsa ve tarla alım-satım işlemlerinde uzman destek.</p>
                    </div>

                    <div className="service-card" data-reveal data-reveal-delay="4">
                        <div className="service-icon">
                            <Image src="/hizmetler/degerleme.svg" alt="Yatırım" width={64} height={64} />
                        </div>
                        <h3>Yatırım Danışmanlığı</h3>
                        <p>Piyasa analizi ve getiri hesaplamaları ile doğru yatırım kararları.</p>
                    </div>

                    <div className="service-card" data-reveal data-reveal-delay="5">
                        <div className="service-icon">
                            <Image src="/hizmetler/proje.svg" alt="Değerleme" width={64} height={64} />
                        </div>
                        <h3>Değerleme & Proje</h3>
                        <p>Profesyonel gayrimenkul değerleme ve inşaat proje yönetimi hizmetleri.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
