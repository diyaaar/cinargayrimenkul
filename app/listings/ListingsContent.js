'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '@/lib/getOptimizedImageUrl';

export default function ListingsContent({ initialListings }) {
    const [selectedListing, setSelectedListing] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isFullScreenGallery, setIsFullScreenGallery] = useState(false);

    // Reset index when modal opens/changes
    useEffect(() => {
        setCurrentMediaIndex(0);
    }, [selectedListing]);

    // Debug: Log what data we receive
    useEffect(() => {
        console.log('[ListingsContent] Received listings count:', initialListings?.length || 0);
        if (initialListings && initialListings.length > 0) {
            console.log('[ListingsContent] Sample listing:', {
                listing_id: initialListings[0].listing_id,
                title: initialListings[0].title,
                images_exists: !!initialListings[0].images,
                images_count: initialListings[0].images?.length || 0,
                images_array: initialListings[0].images,
                sample_image_url: initialListings[0].images?.[0]
            });
        }
    }, [initialListings]);

    // Lock scroll when modal is open
    useEffect(() => {
        if (selectedListing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedListing]);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSelectedListing(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const getSummaryFields = (listing) => {
        const summary = [];
        const features = listing.features || {};

        // Room count
        const rooms = features['Oda Sayısı'] || features['Bölüm & Oda Sayısı'];
        if (rooms) summary.push({ icon: 'fa-door-open', value: rooms });

        // Area (m2)
        const area = features['m² (Net)'] || features['m² (Brüt)'] || features['m²'] || features['Kapalı Alan (m2)'];
        if (area) summary.push({ icon: 'fa-ruler-combined', value: `${area} m²` });

        // Property type
        const type = features['Emlak Tipi'] || features['Kategori'];
        if (type) summary.push({ icon: 'fa-home', value: type });

        return summary;
    };

    const getListingBadge = (listing) => {
        if (listing.listing_mode === 'sale') return 'Satılık';
        if (listing.listing_mode === 'rent') return 'Kiralık';
        const features = listing.features || {};
        return features['Durumu'] || features['Emlak Tipi']?.split(' ')[0] || 'Satılık';
    };

    const renderDynamicFields = (listing) => {
        if (!listing.features) return { knownFields: [], extraFields: [] };

        const importantKeys = [
            'm² (Net)', 'm² (Brüt)', 'm²', 'Oda Sayısı', 'Bina Yaşı',
            'Bulunduğu Kat', 'Kat Sayısı', 'Isıtma', 'Banyo Sayısı',
            'Kullanım Durumu', 'Tapu Durumu', 'Krediye Uygunluk',
            'Kapalı Alan (m2)', 'Açık Alan (m2)', 'Giriş Yüksekliği (m)',
            'İlan No', 'İlan Tarihi'
        ];

        const knownFields = [];
        const extraFields = [];

        Object.entries(listing.features).forEach(([key, value]) => {
            if (value === 'Belirtilmemiş' || !value) return;
            if (key === 'İlan No') return; // İlan No'yu gizle

            if (importantKeys.includes(key)) {
                knownFields.push({ key, value });
            } else {
                extraFields.push({ key, value });
            }
        });

        return { knownFields, extraFields };
    };

    return (
        <>
            <div className="container">
                <div className="listings-grid">
                    {initialListings.map((listing, index) => {
                        const summary = getSummaryFields(listing);
                        const badge = getListingBadge(listing);

                        return (
                            <motion.div
                                key={listing.listing_id || index}
                                className="listing-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedListing(listing)}
                            >
                                <div className="listing-card__category">
                                    {listing.listing_category === 'isyeri' ? 'İŞYERİ' :
                                        listing.listing_category === 'arsa' ? 'ARSA' : 'KONUT'}
                                </div>
                                <div className="listing-card__badge">{badge}</div>
                                <div className="listing-card__image-container">
                                    {listing.images && listing.images.length > 0 ? (
                                        <Image
                                            src={getOptimizedImageUrl(listing.images[0], { width: 800, quality: 75 })}
                                            alt={listing.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="listing-card__img"
                                        />
                                    ) : (
                                        <div className="listing-card__image-placeholder">
                                            <i className="fas fa-home"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="listing-card__body">
                                    <span className="listing-card__location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {listing.location.city} / {listing.location.district}
                                    </span>
                                    <h3 className="listing-card__title">
                                        {listing.title}
                                    </h3>

                                    {summary.length > 0 && (
                                        <div className="listing-card__summary">
                                            {summary.map((item, i) => (
                                                <div key={i} className="listing-card__summary-item">
                                                    <i className={`fas ${item.icon}`}></i>
                                                    {item.value}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="listing-card__footer">
                                    <div className="listing-card__price-group">
                                        <span className="listing-card__price-amount">
                                            {listing.price?.split(' ')[0] || '---'}
                                        </span>
                                        <span className="listing-card__price-currency">
                                            {listing.price?.split(' ')[1] || 'TL'}
                                        </span>
                                    </div>
                                    <button className="btn btn--primary" style={{ padding: '0.8rem 1.4rem', fontSize: 'var(--font-size-xs)', flexShrink: 0 }}>
                                        <span>İncele</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedListing && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedListing(null)}
                    >
                        <motion.div
                            className={`modal-content ${isFullScreenGallery ? 'modal-content--fullscreen-gallery' : ''}`}
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close"
                                onClick={() => setSelectedListing(null)}
                                aria-label="Kapat"
                            >
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="modal-body">
                                {/* Mobile-only Photo Strip */}
                                <div className="modal-photo-strip-mobile">
                                    {selectedListing.images && selectedListing.images.map((img, i) => (
                                        <div
                                            key={i}
                                            className="photo-strip-item"
                                            onClick={() => {
                                                setCurrentMediaIndex(i);
                                                setIsFullScreenGallery(true);
                                            }}
                                        >
                                            {img.endsWith('.mp4') ? (
                                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                    <video
                                                        src={`${img}#t=0.1`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                    />
                                                    <div className="strip-video-preview" style={{ position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.3)' }}>
                                                        <i className="fas fa-play"></i>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Image src={getOptimizedImageUrl(img, { width: 400, quality: 75 })} alt={`Strip ${i}`} fill style={{ objectFit: 'cover' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-gallery">
                                    {selectedListing.images && selectedListing.images.length > 0 ? (
                                        <div className="modal-gallery-main">
                                            <div className="modal-gallery-viewport">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={currentMediaIndex}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="modal-gallery-media-container"
                                                        onClick={() => setIsFullScreenGallery(true)}
                                                    >
                                                        {selectedListing.images[currentMediaIndex]?.endsWith('.mp4') ? (
                                                            <video
                                                                src={selectedListing.images[currentMediaIndex]}
                                                                controls
                                                                className="modal-gallery-video"
                                                                autoPlay
                                                                muted
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={getOptimizedImageUrl(selectedListing.images[currentMediaIndex], { width: 1200, quality: 80 })}
                                                                alt={`${selectedListing.title} - ${currentMediaIndex + 1}`}
                                                                fill
                                                                style={{ objectFit: 'contain' }}
                                                                priority
                                                            />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            {selectedListing.images.length > 1 && (
                                                <>
                                                    <button
                                                        className="gallery-nav gallery-nav--prev"
                                                        onClick={() => setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : selectedListing.images.length - 1))}
                                                    >
                                                        <i className="fas fa-chevron-left"></i>
                                                    </button>
                                                    <button
                                                        className="gallery-nav gallery-nav--next"
                                                        onClick={() => setCurrentMediaIndex((prev) => (prev < selectedListing.images.length - 1 ? prev + 1 : 0))}
                                                    >
                                                        <i className="fas fa-chevron-right"></i>
                                                    </button>

                                                    <div className="gallery-thumbnails">
                                                        {selectedListing.images.map((img, i) => (
                                                            <div
                                                                key={i}
                                                                className={`thumbnail-item ${i === currentMediaIndex ? 'active' : ''}`}
                                                                onClick={() => setCurrentMediaIndex(i)}
                                                            >
                                                                {img.endsWith('.mp4') ? (
                                                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                                        <video
                                                                            src={`${img}#t=0.1`}
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                            muted
                                                                            playsInline
                                                                            preload="metadata"
                                                                        />
                                                                        <div className="thumbnail-video-overlay" style={{ position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.3)' }}>
                                                                            <i className="fas fa-play"></i>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <Image
                                                                        src={getOptimizedImageUrl(img, { width: 200, quality: 70 })}
                                                                        alt={`thumbnail ${i}`}
                                                                        fill
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="listing-card__image-placeholder">
                                            <i className="fas fa-home"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-details">
                                    <div className="modal-header">
                                        <div className="modal-price">{selectedListing.price}</div>
                                        <h2 className="modal-title">{selectedListing.title}</h2>
                                        <div className="modal-location">
                                            <i className="fas fa-map-marker-alt text-primary"></i>
                                            {selectedListing.location.city}, {selectedListing.location.district}, {selectedListing.location.neighborhood}
                                        </div>
                                    </div>

                                    {selectedListing.features && (
                                        <>
                                            <div className="modal-grid">
                                                {renderDynamicFields(selectedListing).knownFields.map((field, i) => (
                                                    <div key={i} className="modal-grid-item">
                                                        <span className="modal-grid-label">{field.key}</span>
                                                        <span className="modal-grid-value">{field.value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <h3 className="modal-section-title">Açıklama</h3>
                                            <div className="modal-description">
                                                {selectedListing.description}
                                            </div>

                                            {renderDynamicFields(selectedListing).extraFields.length > 0 && (
                                                <>
                                                    <h3 className="modal-section-title">Ekstra Detaylar</h3>
                                                    <div className="modal-extra-details">
                                                        {renderDynamicFields(selectedListing).extraFields.map((field, i) => (
                                                            <div key={i} className="modal-extra-item">
                                                                <span className="modal-grid-label">{field.key}</span>
                                                                <span className="modal-grid-value">{field.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Full Screen Gallery Overlay */}

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Gallery Overlay - Moved outside modal-overlay to avoid stacking context issues */}
            <AnimatePresence>
                {isFullScreenGallery && selectedListing && (
                    <motion.div
                        className="fullscreen-gallery-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullScreenGallery(false);
                        }}
                    >
                        <button
                            className="fullscreen-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFullScreenGallery(false);
                            }}
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        <div className="fullscreen-viewport" onClick={(e) => e.stopPropagation()}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentMediaIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    drag="y"
                                    dragConstraints={{ top: 0, bottom: 0 }}
                                    dragElastic={0.8}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        if (offset.y > 100) {
                                            setIsFullScreenGallery(false);
                                        }
                                    }}
                                    className="fullscreen-image-container"
                                >
                                    {selectedListing.images[currentMediaIndex]?.endsWith('.mp4') ? (
                                        <video
                                            src={selectedListing.images[currentMediaIndex]}
                                            controls
                                            className="fullscreen-video"
                                            autoPlay
                                        />
                                    ) : (
                                        <Image
                                            src={getOptimizedImageUrl(selectedListing.images[currentMediaIndex], { width: 1600, quality: 85 })}
                                            alt="Full View"
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <button
                                className="fullscreen-nav fullscreen-nav--prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : selectedListing.images.length - 1));
                                }}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                                className="fullscreen-nav fullscreen-nav--next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentMediaIndex((prev) => (prev < selectedListing.images.length - 1 ? prev + 1 : 0));
                                }}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className="fullscreen-counter">
                            {currentMediaIndex + 1} / {selectedListing.images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
