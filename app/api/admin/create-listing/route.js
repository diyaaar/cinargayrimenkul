import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            title,
            price_raw,
            city,
            district,
            neighborhood,
            status
        } = body;

        // Basic validation
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const listing_id = crypto.randomUUID();
        const now = new Date().toISOString();

        const newListing = {
            listing_id,
            title: title.trim(),
            manual_title: title.trim(), // Set manual title as well
            price_raw: price_raw ? price_raw.trim() : null,
            manual_price_raw: price_raw ? price_raw.trim() : null,
            city: city ? city.trim() : null,
            district: district ? district.trim() : null,
            neighborhood: neighborhood ? neighborhood.trim() : null,
            status: status || 'draft',
            scrape_status: 'manual',
            is_deleted: false,
            features: {},
            created_at: now,
            updated_at: now,
            updated_by: 'admin-panel'
        };

        console.log('[Admin Create] Creating listing:', newListing);

        const { data, error } = await supabaseAdmin
            .from('listings')
            .insert([newListing])
            .select()
            .single();

        if (error) {
            console.error('[Admin Create] Supabase error:', error);
            return NextResponse.json({ error: 'Veritabanı kayıt hatası: ' + error.message }, { status: 500 });
        }

        console.log('[Admin Create] Success:', data.listing_id);

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Admin Create API error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
