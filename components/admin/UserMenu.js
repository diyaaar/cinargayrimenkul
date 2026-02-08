'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-menu-container" ref={menuRef} style={{ position: 'relative' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    border: '3px solid rgba(0,0,0,0.8)', // Thicker border
                    borderRadius: '50%', // Circle
                    width: '50px', // Fixed dimensions
                    height: '50px',
                    padding: '0', // Removing padding to maximize logo space or manage via flex
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isOpen ? '#f8f9fa' : 'white',
                    transition: 'all 0.2s',
                    flexShrink: 0 // Prevent shrinking
                }}
            >
                <Image
                    src="/logobeyaz.svg"
                    alt="Çınar Gayrimenkul Logo"
                    width={100}
                    height={34}
                    style={{
                        height: '38px',
                        width: 'auto',
                        objectFit: 'contain',
                        filter: 'invert(1) hue-rotate(180deg)'
                    }}
                />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '200px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid #eee',
                    zIndex: 100,
                    padding: '8px 0',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '0 12px 8px', borderBottom: '1px solid #f0f0f0', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600 }}>YÖNETİCİ İŞLEMLERİ</span>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="menu-item"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 16px',
                            textDecoration: 'none',
                            color: '#333',
                            fontSize: '0.9rem',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        <i className="fas fa-external-link-alt" style={{ fontSize: '0.9rem', width: '20px', color: '#666' }}></i>
                        Siteyi Görüntüle
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="menu-item"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 16px',
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            color: '#e74c3c',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        <i className="fas fa-sign-out-alt" style={{ fontSize: '0.9rem', width: '20px' }}></i>
                        Çıkış Yap
                    </button>
                </div>
            )}
        </div>
    );
}
