
import ListingEditForm from './ListingEditForm';
import MediaManager from '@/components/admin/MediaManager';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function getListingData(id) {
    try {
        // Fetch listing
        const { data: listing, error: listingError } = await supabaseAdmin
            .from('listings')
            .select(`
                listing_id,
                source_url,
                title,
                manual_title,
                description,
                manual_description,
                price_raw,
                manual_price_raw,
                price_value,
                price_currency,
                category,
                listing_type,
                status,
                city,
                district,
                neighborhood,
                features,
                scrape_status,
                last_scraped_at,
                updated_at
            `)
            .eq('listing_id', id)
            .single();

        if (listingError) throw listingError;

        // Fetch media
        const { data: media, error: mediaError } = await supabaseAdmin
            .from('listing_media')
            .select('*')
            .eq('listing_id', id)
            .order('sort_order', { ascending: true });

        if (mediaError) throw mediaError;

        return { listing, media };
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
