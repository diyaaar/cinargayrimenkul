'use client';

import { useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminFetch';

export default function ListingEditForm({ listing }) {
    const [formData, setFormData] = useState({
        manual_title: listing.manual_title || listing.title || '',
        manual_description: listing.manual_description || listing.description || '',
        manual_price_raw: listing.manual_price_raw || listing.price_raw || '',
        status: listing.status || 'draft',
        features: JSON.stringify(listing.features || {}, null, 2)
    });

    const [isSaving, setIsSaving] = useState(false);
    const [jsonError, setJsonError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'features') {
            try {
                JSON.parse(value);
                setJsonError(null);
            } catch (err) {
                setJsonError('Geçersiz JSON formatı');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (jsonError) {
            alert('Lütfen önce JSON hatasını düzeltin.');
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                listing_id: listing.listing_id,
                status: formData.status
            };

            // Always send manual fields - empty string means "clear" (backend converts to null)
            payload.manual_title = formData.manual_title.trim();
            payload.manual_description = formData.manual_description.trim();
            payload.manual_price_raw = formData.manual_price_raw.trim();

            // Always include features as valid object
            payload.features = JSON.parse(formData.features);

            const res = await adminFetch('/api/admin/update-listing', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Güncelleme sırasında bir hata oluştu');
            }

            alert('İlan başarıyla güncellendi.');

            // Refresh listing data to show updated values
            if (data.data && data.data.length > 0) {
                const updatedListing = data.data[0];
                setFormData({
                    manual_title: updatedListing.manual_title || updatedListing.title || '',
                    manual_description: updatedListing.manual_description || updatedListing.description || '',
                    manual_price_raw: updatedListing.manual_price_raw || updatedListing.price_raw || '',
                    status: updatedListing.status || 'draft',
                    features: JSON.stringify(updatedListing.features || {}, null, 2)
                });
            }
        } catch (err) {
            console.error('Save error:', err);
            alert(`Hata: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <Link href="/admin/listings" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <i className="fas fa-arrow-left"></i>
                        Listeye Dön
                    </Link>
                    <h1 className="admin-topbar__title" style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>İlanı Düzenle</h1>
                </div>
                <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ padding: '0.8rem 2rem' }}
                    disabled={isSaving}
                >
                    <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-save'}`} style={{ marginRight: '8px' }}></i>
                    {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-xl)' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {/* Core Section */}
                    <div className="admin-card">
                        <h3 className="modal-section-title" style={{ marginTop: 0 }}>Temel Bilgiler (Manuel)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Manuel Başlık</label>
                                <input
                                    type="text"
                                    name="manual_title"
                                    value={formData.manual_title}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="Başlık giriniz"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Manuel Fiyat</label>
                                <input
                                    type="text"
                                    name="manual_price_raw"
                                    value={formData.manual_price_raw}
                                    onChange={handleChange}
                                    className="admin-input"
                                    placeholder="Fiyat giriniz"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>İlan Durumu</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                                >
                                    <option value="active">Aktif</option>
                                    <option value="draft">Taslak</option>
                                    <option value="inactive">Pasif</option>
                                    <option value="archived">Arşivlendi</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Manuel Açıklama</label>
                                <textarea
                                    name="manual_description"
                                    value={formData.manual_description}
                                    onChange={handleChange}
                                    rows="10"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)', resize: 'vertical' }}
                                    placeholder="Açıklama giriniz"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Editor */}
                    <div className="admin-card">
                        <h3 className="modal-section-title" style={{ marginTop: 0 }}>Özellikler (JSON Editor)</h3>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            rows="15"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: `1px solid ${jsonError ? '#e74c3c' : 'var(--color-border-dark)'}`,
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                background: '#f8f9fa'
                            }}
                        />
                        {jsonError && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>{jsonError}</p>}
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

                    {/* Location Info (Read only) */}
                    <div className="admin-card" style={{ background: 'var(--color-surface-light)' }}>
                        <h3 className="modal-section-title" style={{ marginTop: 0 }}>Konum Bilgileri</h3>
                        <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div><strong style={{ opacity: 0.6 }}>Şehir:</strong> {listing.city}</div>
                            <div><strong style={{ opacity: 0.6 }}>İlçe:</strong> {listing.district}</div>
                            <div><strong style={{ opacity: 0.6 }}>Mahalle:</strong> {listing.neighborhood}</div>
                            <hr style={{ border: 0, borderTop: '1px solid var(--color-border-dark)', margin: '8px 0' }} />
                            <div><strong style={{ opacity: 0.6 }}>Scrape Durumu:</strong> {listing.scrape_status}</div>
                            <div><strong style={{ opacity: 0.6 }}>Son Güncelleme:</strong> {new Date(listing.updated_at).toLocaleString('tr-TR')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
