'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ListingsContent from './ListingsContent';
import FilterBar from './FilterBar';

function ListingsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState({ items: [], pagination: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchListings() {
            setLoading(true);
            try {
                // Build query string from current URL params
                const params = new URLSearchParams(searchParams.toString());
                const queryString = params.toString();

                const response = await fetch(`/api/listings?${queryString}`, {
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error('İlanlar yüklenirken bir hata oluştu');
                }

                const result = await response.json();

                // Handle potential array response (backward compatibility) or object
                if (Array.isArray(result)) {
                    setData({ items: result, pagination: { page: 1, limit: 12, total: result.length, pageCount: 1 } });
                } else {
                    setData(result);
                }

            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, [searchParams]);

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage);
        router.push(`?${params.toString()}`, { scroll: true });
    };

    const { items, pagination } = data;

    return (
        <main className="min-h-screen bg-dark">
            <Navbar />

            <section className="section section--light" style={{ minHeight: '100vh', paddingTop: '120px' }}>
                <div className="container" style={{ marginBottom: 'var(--space-2xl)' }}>
                    <div className="section-header text-center">
                        <span className="section-eyebrow">İlan Portföyü</span>
                        <h1 className="section-title" style={{ color: 'var(--color-text-dark)' }}>Gayrimenkul Fırsatları</h1>
                        <p className="section-subtitle">Sizin için seçtiğimiz en özel seçenekler.</p>
                    </div>
                </div>

                <FilterBar />

                {loading ? (
                    <div className="container text-center" style={{ padding: 'var(--space-4xl)' }}>
                        <div className="loader"></div>
                        <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-primary)' }}>Yükleniyor...</p>
                    </div>
                ) : error ? (
                    <div className="container text-center" style={{ padding: 'var(--space-4xl)' }}>
                        <h2 className="text-secondary">Bir hata oluştu</h2>
                        <p>{error}</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="container text-center" style={{ padding: 'var(--space-4xl)' }}>
                        <i className="fas fa-search" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '20px' }}></i>
                        <p>Kriterlerinize uygun ilan bulunamadı.</p>
                        <button
                            className="btn btn--primary"
                            style={{ marginTop: '20px' }}
                            onClick={() => router.push('/listings')}
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                ) : (
                    <>
                        <ListingsContent initialListings={items} />

                        {/* Pagination */}
                        {pagination && pagination.pageCount > 1 && (
                            <div className="container" style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    className="btn btn--white"
                                    disabled={pagination.page <= 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    style={{ opacity: pagination.page <= 1 ? 0.5 : 1 }}
                                >
                                    <i className="fas fa-chevron-left"></i> Önceki
                                </button>

                                <span style={{ display: 'flex', alignItems: 'center', fontWeight: '600', padding: '0 15px' }}>
                                    {pagination.page} / {pagination.pageCount}
                                </span>

                                <button
                                    className="btn btn--white"
                                    disabled={pagination.page >= pagination.pageCount}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    style={{ opacity: pagination.page >= pagination.pageCount ? 0.5 : 1 }}
                                >
                                    Sonraki <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer />

            <style jsx>{`
                .loader {
                    border: 3px solid var(--color-surface-light);
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
        </main>
    );
}

export default function ListingsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-dark w-full flex items-center justify-center text-white">Yükleniyor...</div>}>
            <ListingsPageContent />
        </Suspense>
    );
}
