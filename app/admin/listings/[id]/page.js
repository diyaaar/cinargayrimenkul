import ListingEditForm from './ListingEditForm';
import MediaManager from '@/components/admin/MediaManager';
import Link from 'next/link';
import { cookies, headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getListingData(id) {
    try {
        const cookieStore = cookies();
        const headerList = headers();
        const host = headerList.get('host');
        // Construct absolute URL for server-side fetch to internal API
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        const res = await fetch(`${baseUrl}/api/admin/get-listing?id=${id}`, {
            headers: {
                Cookie: cookieStore.toString()
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `API error: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        return { error: err.message };
    }
}

export default async function AdminListingPage({ params }) {
    const { id } = params;
    const { listing, media, error } = await getListingData(id);

    if (error) {
        return (
            <div className="admin-card text-center" style={{ padding: 'var(--space-4xl)' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: 'var(--space-md)' }}></i>
                <h2>İlan yüklenemedi</h2>
                <p style={{ opacity: 0.7, marginBottom: 'var(--space-lg)' }}>{error}</p>
                <Link href="/admin/listings" className="btn btn--primary">Listeye Geri Dön</Link>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="admin-card text-center" style={{ padding: 'var(--space-4xl)' }}>
                <h2>İlan bulunamadı</h2>
                <p style={{ opacity: 0.7, marginBottom: 'var(--space-lg)' }}>Aradığınız ilan veritabanında mevcut değil.</p>
                <Link href="/admin/listings" className="btn btn--primary">Listeye Geri Dön</Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ListingEditForm listing={listing} />
            <MediaManager listingId={id} initialMedia={media} />
        </div>
    );
}
