
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                backgroundColor: '#f1f3f5',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            Çıkış Yap
        </button>
    )
}
