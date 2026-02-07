'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mode, setMode] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        setMode(searchParams.get('mode') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setCategory(searchParams.get('category') || '');
    }, [searchParams]);

    // Debounce price updates
    useEffect(() => {
        const timer = setTimeout(() => {
            updateParams({ minPrice, maxPrice });
        }, 500);
        return () => clearTimeout(timer);
    }, [minPrice, maxPrice]);

    const updateParams = (updates) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // Reset to page 1 on filter change
        if (Object.keys(updates).some(k => k !== 'page')) {
            params.set('page', '1');
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        updateParams({ mode: newMode });
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        updateParams({ category: newCategory });
    };

    return (
        <div className="filter-bar container" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="filter-card">
                <div className="filter-group">
                    <label className="filter-label">İlan Tipi</label>
                    <div className="mode-toggle">
                        <button
                            className={`mode-btn ${mode === '' ? 'active' : ''}`}
                            onClick={() => handleModeChange('')}
                        >
                            Tümü
                        </button>
                        <button
                            className={`mode-btn ${mode === 'sale' ? 'active' : ''}`}
                            onClick={() => handleModeChange('sale')}
                        >
                            Satılık
                        </button>
                        <button
                            className={`mode-btn ${mode === 'rent' ? 'active' : ''}`}
                            onClick={() => handleModeChange('rent')}
                        >
                            Kiralık
                        </button>
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Kategori</label>
                    <div className="mode-toggle">
                        <button
                            className={`mode-btn ${category === '' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('')}
                        >
                            Tümü
                        </button>
                        <button
                            className={`mode-btn ${category === 'konut' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('konut')}
                        >
                            Konut
                        </button>
                        <button
                            className={`mode-btn ${category === 'isyeri' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('isyeri')}
                        >
                            İşyeri
                        </button>
                        <button
                            className={`mode-btn ${category === 'arsa' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('arsa')}
                        >
                            Arsa
                        </button>
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Fiyat Aralığı (TL)</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="filter-input"
                        />
                        <span className="separator">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .filter-card {
                    background: var(--color-surface);
                    padding: var(--space-md) var(--space-xl);
                    border-radius: var(--radius-lg);
                    display: flex;
                    gap: var(--space-2xl);
                    align-items: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    border: 1px solid var(--color-border);
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .filter-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--color-text-light);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .mode-toggle {
                    display: flex;
                    background: var(--color-surface-light);
                    padding: 4px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border);
                }

                .mode-btn {
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    color: var(--color-text);
                    cursor: pointer;
                    border-radius: var(--radius-sm);
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .mode-btn.active {
                    background: var(--color-primary);
                    color: white;
                    box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.3);
                }

                .price-inputs {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .filter-input {
                    padding: 10px 12px;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    width: 120px;
                    font-size: 0.9rem;
                    background: var(--color-surface-light);
                    color: var(--color-text);
                }

                .filter-input:focus {
                    border-color: var(--color-primary);
                    outline: none;
                }

                .separator {
                    color: var(--color-text-light);
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .filter-card {
                        flex-direction: column;
                        align-items: stretch;
                        gap: var(--space-lg);
                        padding: var(--space-lg);
                    }
                    
                    .price-inputs {
                        display: grid;
                        grid-template-columns: 1fr auto 1fr;
                    }

                    .filter-input {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
