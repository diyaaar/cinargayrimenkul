'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/adminFetch';
import { AnimatePresence } from 'framer-motion';
import Toast from '@/components/admin/Toast';

export default function ListingEditForm({ listing }) {
    const router = useRouter();
    const [currentListing, setCurrentListing] = useState(listing);

    const [formData, setFormData] = useState({
        manual_title: (listing.manual_title && listing.manual_title !== listing.title) ? listing.manual_title : (listing.title || ''),
        manual_description: (listing.manual_description && listing.manual_description !== listing.description) ? listing.manual_description : (listing.description || ''),
        manual_price_raw: (listing.manual_price_raw && listing.manual_price_raw !== listing.price_raw) ? listing.manual_price_raw : (listing.price_raw || ''),
        status: listing.status || 'draft',
        features: listing.features || {}
    });

    const [isSaving, setIsSaving] = useState(false);
    const [deletingKey, setDeletingKey] = useState(null);
    const [selectedPreset, setSelectedPreset] = useState('');
    const [toast, setToast] = useState(null);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customKey, setCustomKey] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeatureChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [key]: value
            }
        }));
    };

    const removeFeature = (key) => {
        setFormData(prev => {
            const next = { ...prev.features };
            delete next[key];
            return { ...prev, features: next };
        });
    };

    const FEATURE_PRESETS = [
        "Oda Sayısı",
        "m² (Net)",
        "m² (Brüt)",
        "m²",
        "Kapalı Alan (m2)",
        "Emlak Tipi",
        "Durumu",
        "Kategori"
    ];

    const addPresetFeature = () => {
        if (!selectedPreset) return;
        if (!formData.features[selectedPreset]) {
            handleFeatureChange(selectedPreset, '');
            setToast({ message: `${selectedPreset} eklendi`, type: 'success', duration: 2000 });
        } else {
            setToast({ message: 'Bu özellik zaten ekli', type: 'warning', duration: 2000 });
        }
        setSelectedPreset('');
    };

    const saveCustomFeature = () => {
        if (!customKey.trim()) return;
        if (formData.features[customKey.trim()]) {
            setToast({ message: 'Bu özellik zaten ekli', type: 'warning', duration: 2000 });
            return;
        }
        handleFeatureChange(customKey.trim(), '');
        setCustomKey('');
        setIsAddingCustom(false);
        setToast({ message: `${customKey} eklendi`, type: 'success', duration: 2000 });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                listing_id: listing.listing_id,
                status: formData.status,
                manual_title: formData.manual_title.trim(),
                manual_description: formData.manual_description.trim(),
                manual_price_raw: formData.manual_price_raw.trim(),
                features: formData.features
            };

            const res = await adminFetch('/api/admin/update-listing', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Güncelleme sırasında bir hata oluştu');
            }

            setToast({ message: 'İlan başarıyla güncellendi', type: 'success' });

            if (data.data && data.data.length > 0) {
                const updatedListing = data.data[0];
                setCurrentListing(updatedListing);
                setFormData({
                    manual_title: (updatedListing.manual_title && updatedListing.manual_title !== updatedListing.title) ? updatedListing.manual_title : (updatedListing.title || ''),
                    manual_description: (updatedListing.manual_description && updatedListing.manual_description !== updatedListing.description) ? updatedListing.manual_description : (updatedListing.description || ''),
                    manual_price_raw: (updatedListing.manual_price_raw && updatedListing.manual_price_raw !== updatedListing.price_raw) ? updatedListing.manual_price_raw : (updatedListing.price_raw || ''),
                    status: updatedListing.status || 'draft',
                    features: updatedListing.features || {}
                });
            }
        } catch (err) {
            console.error('Save error:', err);
            setToast({ message: `Hata: ${err.message}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await adminFetch('/api/admin/delete-listing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: listing.listing_id })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Silme işlemi başarısız');
            }

            setShowDeleteConfirm(false);
            setToast({ message: 'İlan başarıyla silindi', type: 'success' });

            setTimeout(() => {
                router.push('/admin/listings');
            }, 1000);

        } catch (err) {
            console.error('Delete error:', err);
            setToast({ message: `Hata: ${err.message}`, type: 'error' });
            setShowDeleteConfirm(false);
        }
    };

    return (
        <form onSubmit={handleSave}>
            <div className="admin-topbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <Link href="/admin/listings" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <i className="fas fa-arrow-left"></i>
                        Listeye Dön
                    </Link>
                    <h1 className="admin-topbar__title" style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>İlanı Düzenle</h1>
                </div>
                <div className="admin-topbar-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="btn btn--danger"
                        style={{
                            padding: '0.8rem 1.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        disabled={isSaving}
                    >
                        <i className="fas fa-trash-alt"></i> Sil
                    </button>
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
            </div>

            <div className="admin-edit-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-xl)' }}>
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
                                    placeholder={currentListing.manual_title || currentListing.title || "Başlık giriniz"}
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
                                    placeholder={currentListing.manual_price_raw || currentListing.price_raw || "Fiyat giriniz"}
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
                                    placeholder={currentListing.manual_description || currentListing.description || "Açıklama giriniz"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Editor */}
                    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div
                            onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.25rem 1.5rem',
                                cursor: 'pointer',
                                background: '#fff',
                                borderBottom: isFeaturesOpen ? '1px solid var(--color-border)' : 'none'
                            }}
                            className="features-header"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h3 className="modal-section-title" style={{ margin: 0 }}>İlan Özellikleri</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: '#aaa',
                                    fontWeight: 400,
                                    letterSpacing: '0.3px'
                                }}>
                                    ({Object.keys(formData.features).length} adet)
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className={`fas fa-chevron-down toggle-icon ${isFeaturesOpen ? 'open' : ''}`} style={{
                                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    color: '#ccc',
                                    fontSize: '0.9rem'
                                }}></i>
                            </div>
                        </div>

                        <div
                            className={`features-content ${isFeaturesOpen ? 'open' : ''}`}
                            style={{
                                padding: '1.5rem',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                maxHeight: isFeaturesOpen ? '2000px' : '0',
                                opacity: isFeaturesOpen ? 1 : 0
                            }}
                        >
                            {/* Feature Adding Toolbar */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '1.5rem',
                                padding: '10px',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }} onClick={e => e.stopPropagation()}>
                                <select
                                    value={selectedPreset}
                                    onChange={(e) => setSelectedPreset(e.target.value)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        fontSize: '0.85rem',
                                        minWidth: '150px'
                                    }}
                                >
                                    <option value="">Özellik Seç...</option>
                                    {FEATURE_PRESETS.map(preset => (
                                        <option key={preset} value={preset} disabled={!!formData.features[preset]}>
                                            {preset} {formData.features[preset] ? '(Ekli)' : ''}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={addPresetFeature}
                                    className="btn btn--primary"
                                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                    disabled={!selectedPreset}
                                >
                                    <i className="fas fa-plus"></i> Ekle
                                </button>

                                <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 8px' }}></div>

                                {isAddingCustom ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={customKey}
                                            onChange={(e) => setCustomKey(e.target.value)}
                                            placeholder="Özellik adı..."
                                            autoFocus
                                            className="admin-input"
                                            style={{
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: '1px solid var(--color-primary)',
                                                fontSize: '0.85rem',
                                                width: '150px'
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    saveCustomFeature();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={saveCustomFeature}
                                            className="btn btn--primary"
                                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                                        >
                                            <i className="fas fa-check"></i>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingCustom(false);
                                                setCustomKey('');
                                            }}
                                            className="btn"
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '0.8rem',
                                                background: '#eee',
                                                color: '#666'
                                            }}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCustom(true)}
                                        className="btn"
                                        style={{
                                            padding: '8px 16px',
                                            fontSize: '0.8rem',
                                            background: 'transparent',
                                            border: '1px solid var(--color-primary)',
                                            color: 'var(--color-primary)'
                                        }}
                                    >
                                        <i className="fas fa-edit"></i> Özel Özellik Ekle
                                    </button>
                                )}
                            </div>
                            <div style={{ paddingBottom: '1.5rem' }}>
                                <div className="features-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                    gap: '0.6rem'
                                }}>
                                    {Object.entries(formData.features).map(([key, value]) => (
                                        <div
                                            key={key}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                background: '#fff',
                                                border: '1px solid var(--color-border)',
                                                position: 'relative',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.65rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    color: 'var(--color-primary)',
                                                    fontWeight: 800
                                                }}>
                                                    {key}
                                                </label>

                                                <div style={{ position: 'relative' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingKey(deletingKey === key ? null : key)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: deletingKey === key ? '#e74c3c' : '#ccc',
                                                            cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                            padding: '2px',
                                                            transition: 'color 0.2s'
                                                        }}
                                                        title="Sil"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>

                                                    {/* Confirmation Popover */}
                                                    {deletingKey === key && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '100%',
                                                            right: '0',
                                                            marginBottom: '6px',
                                                            background: '#e74c3c',
                                                            color: 'white',
                                                            padding: '3px 10px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 4px 10px rgba(231, 76, 60, 0.2)',
                                                            zIndex: 10,
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                            onClick={() => {
                                                                removeFeature(key);
                                                                setDeletingKey(null);
                                                            }}
                                                        >
                                                            SİL
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    value={value || ''}
                                                    onChange={(e) => handleFeatureChange(key, e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        background: '#f9fafb',
                                                        border: '1px solid #e5e7eb',
                                                        padding: '6px 10px',
                                                        fontSize: '0.85rem',
                                                        color: 'var(--color-text)',
                                                        borderRadius: '5px',
                                                        outline: 'none',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'var(--color-primary)';
                                                        e.target.style.background = '#fff';
                                                        e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.08)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#e5e7eb';
                                                        e.target.style.background = '#f9fafb';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                    placeholder="..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {Object.keys(formData.features).length === 0 && (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                                        Henüz özellik eklenmemiş. "Ekle" butonunu kullanarak ekleyebilirsiniz.
                                    </div>
                                )}

                                {/* Mobile Close Button */}
                                <div className="mobile-only-close" style={{ marginTop: '1.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsFeaturesOpen(false)}
                                        className="close-features-btn"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            background: '#f8f9fa',
                                            border: '1px solid #eee',
                                            color: '#666',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <i className="fas fa-chevron-up"></i> Özellikleri Kapat
                                    </button>
                                </div>
                            </div>
                        </div>
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

            <style jsx>{`
                /* Default Desktop Styles */
                
                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    /* Header Adjustments */
                    .admin-topbar-container {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: var(--space-md);
                    }
                    
                    .admin-topbar-actions {
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                    }

                    .admin-topbar-actions button {
                        width: 100%;
                        justify-content: center;
                    }

                    /* Main Grid Adjustments */
                    .admin-edit-grid {
                        grid-template-columns: 1fr !important;
                        gap: var(--space-lg) !important;
                    }

                    /* Form Elements */
                    .admin-input, textarea, select {
                        font-size: 16px !important; /* Prevent zoom on iOS */
                    }

                    .features-grid {
                        gap: 0.3rem !important;
                    }

                    .features-grid > div {
                        padding: 6px 10px !important;
                    }

                    .features-grid input {
                        padding: 6px 10px !important;
                        font-size: 16px !important;
                        font-weight: 400;
                    }

                    .features-grid label {
                        margin-bottom: 2px !important;
                        font-size: 0.85rem !important;
                        font-weight: 600 !important;
                        opacity: 1;
                        color: #666;
                    }

                    .toggle-icon {
                        display: block !important;
                    }

                    .toggle-icon.open {
                        transform: rotate(180deg);
                    }

                    .mobile-only-close {
                        display: block !important;
                    }
                    
                    .close-features-btn:hover {
                        background: #eee !important;
                        color: #333 !important;
                        transform: translateY(-1px);
                    }
                }

                .mobile-only-close {
                    display: none;
                }

                /* Ensure desktop always shows content */
                @media (min-width: 769px) {
                    .features-content {
                        display: block !important;
                        max-height: none !important;
                        opacity: 1 !important;
                        overflow: visible !important;
                    }
                    .features-header {
                        cursor: default !important;
                    }
                }
            `}</style>

            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>İlanı Sil</h3>
                        <p style={{ color: 'var(--color-text)' }}>Bu ilan silinecek. Devam etmek istiyor musunuz?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn"
                                style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', border: '1px solid #ddd', background: '#fff' }}
                            >
                                İptal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn"
                                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
