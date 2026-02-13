import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';


export const dynamic = 'force-dynamic';

async function getListings() {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('listings')
            .select(`
                listing_id,
                title,
                manual_title,
                price_raw,
                manual_price_raw,
                price_value,
                category,
                listing_type,
                city,
                district,
                neighborhood,
                status,
                scrape_status,
                updated_at,
                features
            `)
            .eq('is_deleted', false)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            throw error;
        }

        return data;
    } catch (err) {
        return { error: err.message };
    }
}

export default async function AdminListings() {
    const data = await getListings();

    // Error state handling
    if (data?.error) {
        return (
            <div className="admin-card text-center" style={{ padding: 'var(--space-2xl)' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#e74c3c', marginBottom: '1rem' }}></i>
                <h2 className="text-secondary">Veriler yüklenemedi</h2>
                <p>Veritabanı bağlantısı sırasında bir hata oluştu: {data.error}</p>
            </div>
        );
    }

    const listings = data || [];

    // Debug: Log distinct statuses
    console.log('[ADMIN] statuses:', [...new Set(data?.map(x => x.status) || [])]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div className="section-header" style={{ marginBottom: 0 }}>
                    <h1 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
                        İlan Portföyü <span style={{ fontSize: '0.6em', opacity: 0.6, marginLeft: '8px', verticalAlign: 'middle' }}>({listings.length})</span>
                    </h1>
                </div>
                <Link href="/admin/listings/new" className="btn btn--primary">
                    Yeni İlan
                </Link>
            </div>

            <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>İlan No</th>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>Tip</th>
                            <th>Şehir/İlçe</th>
                            <th>Fiyat</th>
                            <th>Durum</th>

                            <th>Güncelleme</th>
                            <th style={{ textAlign: 'center' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: 'var(--space-2xl)', opacity: 0.5 }}>
                                    <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}></i>
                                    Henüz ilan bulunmamaktadır.
                                </td>
                            </tr>
                        ) : (
                            listings.map((listing) => {
                                const displayTitle = listing.manual_title || listing.title || 'Başlıksız';
                                const displayPrice = listing.manual_price_raw || listing.price_raw || '---';
                                const updatedAt = listing.updated_at ? new Date(listing.updated_at).toLocaleDateString('tr-TR') : '---';

                                return (
                                    <tr key={listing.listing_id}>
                                        <td style={{ fontSize: '0.75rem', color: 'var(--color-text-dark-secondary)' }}>
                                            {listing.listing_id}
                                        </td>
                                        <td style={{ fontWeight: '500', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {displayTitle}
                                        </td>
                                        <td>
                                            {listing.category ||
                                                listing.features?.['Kategori'] ||
                                                (listing.features?.['Emlak Tipi'] ? listing.features['Emlak Tipi'].split(' ').slice(1).join(' ') : null) ||
                                                listing.features?.['Emlak Tipi'] ||
                                                '---'}
                                        </td>
                                        <td>
                                            {listing.listing_type ||
                                                listing.features?.['Durumu'] ||
                                                (listing.features?.['Emlak Tipi'] ? listing.features['Emlak Tipi'].split(' ')[0] : null) ||
                                                '---'}
                                        </td>
                                        <td>{listing.city} / {listing.district}</td>
                                        <td style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{displayPrice}</td>
                                        <td>
                                            {(() => {
                                                const statusMap = {
                                                    active: { class: 'admin-badge--active', label: 'Aktif' },
                                                    inactive: { class: 'admin-badge--draft', label: 'Pasif' },
                                                    draft: { class: 'admin-badge--warning', label: 'Taslak' },
                                                    archived: { class: 'admin-badge--danger', label: 'Arşiv' }
                                                };
                                                const status = statusMap[listing.status] || { class: 'admin-badge--draft', label: listing.status };
                                                return (
                                                    <span className={`admin-badge ${status.class}`}>
                                                        {status.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        <td style={{ fontSize: '0.8rem' }}>{updatedAt}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Link
                                                href={`/admin/listings/${listing.listing_id}`}
                                                className="btn btn--primary"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
