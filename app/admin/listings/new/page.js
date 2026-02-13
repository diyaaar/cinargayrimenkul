import NewListingForm from './NewListingForm';

export const dynamic = 'force-dynamic';

export default function NewListingPage() {
    return (
        <div>
            <div className="admin-topbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1 className="admin-topbar__title" style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Yeni İlan Ekle</h1>
            </div>
            <NewListingForm />
        </div>
    );
}
