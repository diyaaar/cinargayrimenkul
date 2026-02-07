
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { adminFetch } from '@/lib/adminFetch';

export default function MediaManager({ listingId, initialMedia }) {
    const router = useRouter();
    const [media, setMedia] = useState(initialMedia || []);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const fileInputRef = useRef(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sort media by sort_order
    const sortedMedia = [...media].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    useEffect(() => {
        setMedia(initialMedia || []);
    }, [initialMedia]);

    // --- UPLOAD LOGIC ---
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            validateAndUpload(selectedFiles);
        }
    };

    const validateAndUpload = async (selectedFiles) => {
        const validFiles = [];
        const errors = [];
        const MAX_FILES = 20;
        const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
        const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
        const ALLOWED_TYPES = ['image/webp', 'image/jpeg', 'image/png', 'video/mp4'];

        if (selectedFiles.length > MAX_FILES) {
            errors.push(`Maksimum ${MAX_FILES} dosya seçebilirsiniz.`);
        }

        selectedFiles.slice(0, MAX_FILES).forEach(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`${file.name}: Geçersiz format.`);
                return;
            }
            if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
                errors.push(`${file.name}: Boyut 5MB'ı aşıyor.`);
                return;
            }
            if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
                errors.push(`${file.name}: Boyut 50MB'ı aşıyor.`);
                return;
            }
            validFiles.push(file);
        });

        setValidationErrors(errors);

        if (validFiles.length > 0) {
            await uploadFiles(validFiles);
        }
    };

    const uploadFiles = async (files) => {
        setUploading(true);
        setProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append('listing_id', listingId);
        files.forEach(file => formData.append('files[]', file));

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/upload-media');
        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                // Cap at 95% during upload phase, 100% will be set on load
                const percentComplete = (event.loaded / event.total) * 95;
                setProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setProgress(100); // Now set to 100%
                const result = JSON.parse(xhr.responseText);
                if (fileInputRef.current) fileInputRef.current.value = '';

                // Add new media to state immediately
                // Note: The API returns the uploaded rows.
                // We should append them.
                if (Array.isArray(result.data)) {
                    // Update local state by adding new items
                    // We need to account for sort_order. 
                    // Usually API assigns next sort order. 
                    // To be safe, we re-fetch or trust API.
                    // For now, let's trigger refresh and wait for props update or update locally.

                    // Let's assume result.data has the correct new items. 
                    // We will merge them.
                    setMedia(prev => [...prev, ...result.data]);
                }

                router.refresh();
                setUploading(false);
                setProgress(0);
            } else {
                try {
                    const res = JSON.parse(xhr.responseText);
                    setError(res.error || 'Yükleme başarısız');
                } catch {
                    setError('Yükleme başarısız');
                }
                setUploading(false);
            }
        };

        xhr.onerror = () => {
            setError('Ağ hatası oluştu');
            setUploading(false);
        };

        xhr.send(formData);
    };

    // --- MANAGE LOGIC ---
    const handleDelete = async (id, storagePath) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;

        // Optimistic delete
        const previousMedia = [...media];
        setMedia(media.filter(m => m.id !== id));

        try {
            const res = await adminFetch('/api/admin/media/delete', {
                method: 'POST',
                body: JSON.stringify({ id, storage_path: storagePath }),
            });
            if (!res.ok) throw new Error('Silinemedi');
            router.refresh();
        } catch (err) {
            alert(err.message);
            setMedia(previousMedia); // Revert
        }
    };

    const handleMove = async (index, direction) => {
        // Create a copy of the sorted array, not the potentially unsorted state
        const newMedia = [...sortedMedia];
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= newMedia.length) return;

        // Perform the swap in the array
        const temp = newMedia[index];
        newMedia[index] = newMedia[newIndex];
        newMedia[newIndex] = temp;

        // Re-assign sort_order based on the new array order
        const updatedMedia = newMedia.map((item, idx) => ({
            ...item,
            sort_order: idx + 1
        }));

        // Optimistically update state
        setMedia(updatedMedia);

        // Send update to server
        try {
            const itemsToUpdate = updatedMedia.map(m => ({
                id: m.id,
                sort_order: m.sort_order
            }));

            const res = await adminFetch('/api/admin/media/reorder', {
                method: 'POST',
                body: JSON.stringify({ items: itemsToUpdate }),
            });

            if (!res.ok) throw new Error('Sıralama hatası');

            // We don't strictly need router.refresh() if our optimistic update is correct,
            // but it ensures consistency with DB trigger/constraints if any.
            router.refresh();
        } catch (err) {
            console.error(err);
            alert('Sıralama kaydedilemedi: ' + err.message);
            // Ideally revert state here, but router.refresh() might fix it next navigation
            router.refresh();
        }
    };

    return (
        <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fafafa'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Medya Yönetimi</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>
                        {media.length} medya dosyası • İlk görsel kapak fotoğrafı olur
                    </p>
                </div>

                <div>
                    <input
                        type="file"
                        multiple
                        accept="image/webp,image/jpeg,image/png,video/mp4"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        id="media-manager-upload"
                    />
                    <label
                        htmlFor="media-manager-upload"
                        className="btn btn--primary"
                        style={{ cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {uploading ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i>
                                {progress}%
                            </>
                        ) : (
                            <>
                                <i className="fas fa-cloud-upload-alt"></i>
                                Medya Ekle
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div style={{ padding: '1rem', background: '#fff1f0', borderBottom: '1px solid #ffccc7' }}>
                    {validationErrors.map((err, i) => (
                        <div key={i} style={{ color: '#cf1322', fontSize: '0.85rem' }}>• {err}</div>
                    ))}
                    <button
                        onClick={() => setValidationErrors([])}
                        style={{ background: 'none', border: 'none', color: '#cf1322', textDecoration: 'underline', marginTop: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        Temizle
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{ padding: '1rem', background: '#fff1f0', color: '#cf1322', borderBottom: '1px solid #ffccc7' }}>
                    {error}
                </div>
            )}

            {/* Empty State */}
            {sortedMedia.length === 0 && (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                        <i className="far fa-images"></i>
                    </div>
                    <p>Henüz hiç görsel yüklenmemiş.</p>
                </div>
            )}

            {/* Grid */}
            {sortedMedia.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1rem',
                    padding: '1.5rem',
                    backgroundColor: '#fff'
                }}>
                    <AnimatePresence>
                        {sortedMedia.map((item, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={item.id}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '1',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: index === 0 ? '2px solid var(--color-primary)' : '1px solid #eee',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    background: '#f9f9f9',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onDoubleClick={() => window.open(item.url, '_blank')}
                            >
                                {/* Image/Video Preview */}
                                {item.media_type === 'video' ? (
                                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                        <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'white',
                                            fontSize: '2rem',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                            pointerEvents: 'none'
                                        }}>
                                            <i className="fas fa-play-circle"></i>
                                        </div>
                                    </div>
                                ) : (
                                    <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}

                                {/* Cover Badge */}
                                {index === 0 && (
                                    <div style={{
                                        position: 'absolute', top: 8, left: 8,
                                        background: 'var(--color-primary)', color: '#fff',
                                        fontSize: '0.7rem', fontWeight: 'bold',
                                        padding: '3px 8px', borderRadius: '4px',
                                        zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}>
                                        KAPAK
                                    </div>
                                )}

                                {/* Controls Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0, left: 0, right: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(4px)',
                                    padding: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    opacity: hoveredId === item.id || isMobile ? 1 : 0,
                                    transition: 'opacity 0.2s ease'
                                }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => handleMove(index, -1)}
                                            disabled={index === 0}
                                            className="btn-icon"
                                            title="Sola Taşı"
                                            style={{ color: 'white', padding: '4px', opacity: index === 0 ? 0.3 : 1 }}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        <button
                                            onClick={() => handleMove(index, 1)}
                                            disabled={index === sortedMedia.length - 1}
                                            className="btn-icon"
                                            title="Sağa Taşı"
                                            style={{ color: 'white', padding: '4px', opacity: index === sortedMedia.length - 1 ? 0.3 : 1 }}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(item.id, item.storage_path)}
                                        className="btn-icon"
                                        title="Sil"
                                        style={{ color: '#ff4d4f', padding: '4px' }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
