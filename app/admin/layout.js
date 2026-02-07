import '../styles/admin.css';
import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <main className="admin-main">
                <header className="admin-topbar">
                    <h2 className="admin-topbar__title">ÇINAR GAYRİMENKUL İLAN YÖNETİMİ PANELİ</h2>

                    <div className="admin-topbar__user" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <LogoutButton />
                        <Link href="/" title="Siteye Dön">
                            <Image
                                src="/logosiyah.svg"
                                alt="Çınar Gayrimenkul Logo"
                                width={120}
                                height={40}
                                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
                            />
                        </Link>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
