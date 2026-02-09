'use client';

import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <Image src="/logobeyaz.svg" alt="Çınar Gayrimenkul" className="footer-logo-img" width={150} height={50} />
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 ÇINAR DURAN EMLAK VE GAYRİMENKUL DANIŞMANLIK HİZMETLERİ LTD ŞTİ - Tüm Hakları Saklıdır.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
