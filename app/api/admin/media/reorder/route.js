
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const auth = await requireAdmin(req);
        if (!auth.ok) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { items } = await req.json(); // Array of { id, sort_order }

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: 'Invalid items array' },
                { status: 400 }
            );
        }

        // Process updates in parallel or sequence? 
        // Usually standard to do loop for simple cases.
        // Supabase supports upsert but we are updating specific rows.

        // We can use `upsert` if we provide all required fields, but here we only want to update sort_order.
        // Loop is safer for partial update if we don't fetch everything.

        const updates = items.map(async (item) => {
            return supabaseAdmin
                .from('listing_media')
                .update({ sort_order: item.sort_order })
                .eq('id', item.id);
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Sort API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
