'use client';

import Image from 'next/image';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Contact() {
    useScrollReveal();

    return (
        <section id="contact" className="section">
            <div className="container">
                <div className="section-header">
                    <span className="section-eyebrow" data-reveal>İletişim</span>
                    <h2 className="section-title" data-reveal data-reveal-delay="1">Bize Ulaşın</h2>
                </div>

                <div className="contact-grid">
                    <div className="contact-card" data-reveal data-reveal-delay="1">
                        <div className="contact-card__icon-wrapper">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="contact-card__content">
                            <h3 className="contact-card__title">Adres</h3>
                            <p className="contact-card__text">
                                Küçük Çiğli Mah. 8780/30 Sok. No:8<br />
                                Pasaj İçi, D:Z09<br />
                                35610 Çiğli / İzmir
                            </p>
                            <div className="contact-card__footer">
                                <div className="map-buttons-group">
                                    <span className="map-group-label">Yol Tarifi Al</span>
                                    <div className="map-buttons">
                                        <a href="https://www.google.com/maps/dir/38.5004357,27.0475505/%C3%87%C4%B1nar+Duran+Gayrimenkul,+K%C3%BC%C3%A7%C3%BCk%C3%A7i%C4%9Fli+mah.+8780%2F30+sk.+No:8+Pasaj+%C4%B0%C3%A7i,+Z09,+35610+%C3%87i%C4%9Fli%2F%C4%B0zmir/@38.5005813,27.0451678,17z/data=!3m1!4b1!4m10!4m9!1m1!4e1!1m5!1m1!1s0x14bbd17356b01467:0x27aab22d0624c98f!2m2!1d27.0475881!2d38.500675!3e0?entry=ttu"
                                            target="_blank" rel="noopener" className="map-btn" title="Google Maps">
                                            <Image src="/google.svg" alt="Google Maps" className="map-btn-icon" width={22} height={22} />
                                        </a>
                                        <a href="https://yandex.com.tr/maps/11505/izmir/?ll=27.047654%2C38.500707&mode=routes&rtext=~38.500722%2C27.047668&rtt=auto&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D192975544133&z=16.62"
                                            target="_blank" rel="noopener" className="map-btn" title="Yandex Maps">
                                            <Image src="/yandex.svg" alt="Yandex Maps" className="map-btn-icon" width={22} height={22} />
                                        </a>
                                        <a href="https://maps.apple.com/directions?destination=%C3%87%C4%B1nar+Duran+Gayrimenkul%2C+8780.+Sk.+8%2C+35620+Cigli+%C4%B0zmir%2C+T%C3%BCrkiye&destination-place-id=ICAA4315725D2DCFC&mode=driving"
                                            target="_blank" rel="noopener" className="map-btn" title="Apple Maps">
                                            <Image src="/apple.svg" alt="Apple Maps" className="map-btn-icon" width={22} height={22} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-card" data-reveal data-reveal-delay="2">
                        <div className="contact-card__icon-wrapper">
                            <i className="fas fa-phone"></i>
                        </div>
                        <div className="contact-card__content">
                            <h3 className="contact-card__title">Telefon</h3>
                            <a href="tel:+905304690565" className="contact-card__link">+90 530 469 05 65</a>
                            <p className="contact-card__note">Hızlı İletişim</p>
                        </div>
                    </div>

                    <div className="contact-card" data-reveal data-reveal-delay="3">
                        <div className="contact-card__icon-wrapper">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="contact-card__content">
                            <h3 className="contact-card__title">E-posta</h3>
                            <a href="mailto:cinaremlakcigli@gmail.com" className="contact-card__link">cinaremlakcigli@gmail.com</a>
                            <p className="contact-card__note">Resmi İşlemler</p>
                        </div>
                    </div>

                    <div className="contact-card" data-reveal data-reveal-delay="4">
                        <div className="contact-card__icon-wrapper">
                            <i className="fab fa-whatsapp"></i>
                        </div>
                        <div className="contact-card__content">
                            <h3 className="contact-card__title">WhatsApp</h3>
                            <a href="https://wa.me/905304690565" target="_blank" rel="noopener" className="contact-card__link">Detaylı Mesajlaşma</a>
                            <p className="contact-card__note">Kapsamlı İnceleme</p>
                        </div>
                    </div>

                    <div className="contact-card" data-reveal data-reveal-delay="5">
                        <div className="contact-card__icon-wrapper">
                            <i className="fab fa-instagram"></i>
                        </div>
                        <div className="contact-card__content">
                            <h3 className="contact-card__title">Instagram</h3>
                            <a href="https://www.instagram.com/izmir.cinar" target="_blank" rel="noopener" className="contact-card__link">@izmir.cinar</a>
                            <p className="contact-card__note">Sosyal Medya</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
