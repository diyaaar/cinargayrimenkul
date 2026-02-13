'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/adminFetch';
import { AnimatePresence } from 'framer-motion';
import Toast from '@/components/admin/Toast';

export default function NewListingForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        price_raw: '',
        city: '',
        district: '',
        neighborhood: '',
        status: 'draft'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await adminFetch('/api/admin/create-listing', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'İlan oluşturulamadı');
            }

            setToast({ message: 'İlan başarıyla oluşturuldu, yönlendiriliyorsunuz...', type: 'success' });

            // Redirect to the edit page of the new listing
            if (data.data && data.data.listing_id) {
                setTimeout(() => {
                    router.push(`/admin/listings/${data.data.listing_id}`);
                }, 1000);
            }
        } catch (err) {
            console.error('Create error:', err);
            setToast({ message: `Hata: ${err.message}`, type: 'error' });
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-card">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>İlan Başlığı</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="Örn: Satılık Lüks Daire"
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Fiyat</label>
                    <input
                        type="text"
                        name="price_raw"
                        value={formData.price_raw}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="Örn: 5.000.000 TL"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Şehir</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Örn: İstanbul"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>İlçe</label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Örn: Kadıköy"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Mahalle</label>
                        <input
                            type="text"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Örn: Fenerbahçe"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Durum</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border-dark)' }}
                    >
                        <option value="draft">Taslak</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <Link href="/admin/listings" className="btn" style={{ padding: '0.8rem 2rem', background: '#f8f9fa', border: '1px solid #ddd' }}>
                        İptal
                    </Link>
                    <button
                        type="submit"
                        className="btn btn--primary"
                        style={{ padding: '0.8rem 2rem' }}
                        disabled={isSaving}
                    >
                        <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-plus'}`} style={{ marginRight: '8px' }}></i>
                        {isSaving ? 'Oluşturuluyor...' : 'İlanı Oluştur'}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
