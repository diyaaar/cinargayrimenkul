import '../styles/admin.css';
import UserMenu from '@/components/admin/UserMenu';

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <main className="admin-main">
                <header className="admin-topbar">
                    <h2 className="admin-topbar__title">ÇINAR GAYRİMENKUL İLAN YÖNETİMİ PANELİ</h2>

                    <div className="admin-topbar__user" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <UserMenu />
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
