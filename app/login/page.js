
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Check if user is admin
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                setError('Oturum açılamadı.')
                setLoading(false)
                return
            }

            try {
                const res = await fetch('/api/auth/check-admin', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                })

                if (res.ok) {
                    router.push('/admin')
                    router.refresh()
                } else {
                    await supabase.auth.signOut()
                    setError('Yönetici izniniz bulunmamaktadır.')
                    setLoading(false)
                }
            } catch (err) {
                console.error('Admin check error:', err)
                await supabase.auth.signOut()
                setError('Yetkilendirme kontrolü başarısız oldu.')
                setLoading(false)
            }
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem' }}>Admin Paneli Giriş</h1>

                {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fff5f5', color: '#c53030', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.625rem', borderRadius: '4px', border: '1px solid #dee2e6' }}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.625rem', borderRadius: '4px', border: '1px solid #dee2e6' }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    )
}
