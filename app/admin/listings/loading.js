'use client';

export default function AdminListingsLoading() {
    return (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <div className="loader"></div>
            <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-primary)', fontWeight: '500' }}>
                İlan Verileri Yükleniyor...
            </p>
            <style jsx>{`
                .loader {
                    border: 3px solid #e0e0e0;
                    border-top: 3px solid var(--color-primary);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
