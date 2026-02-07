import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    try {
        const body = await request.json();
        const {
            listing_id,
            manual_title,
            manual_description,
            manual_price_raw,
            status,
            features
        } = body;

        // 1. Validation
        if (!listing_id) {
            return NextResponse.json({ error: 'listing_id is required' }, { status: 400 });
        }

        const validStatuses = ['active', 'inactive', 'draft', 'archived'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        if (features && typeof features !== 'object') {
            return NextResponse.json({ error: 'features must be a valid JSON object' }, { status: 400 });
        }

        // 2. Build update payload
        const updatePayload = {
            updated_at: new Date().toISOString(),
            updated_by: 'admin-panel'
        };

        // Only add fields that are explicitly provided
        if (manual_title !== undefined && manual_title !== null) {
            updatePayload.manual_title = manual_title || null;
        }
        if (manual_description !== undefined && manual_description !== null) {
            updatePayload.manual_description = manual_description || null;
        }
        if (manual_price_raw !== undefined && manual_price_raw !== null) {
            updatePayload.manual_price_raw = manual_price_raw || null;
        }
        if (status !== undefined && status !== null) {
            updatePayload.status = status;
        }

        // Handle features and automatically derive Category/Type
        if (features !== undefined && features !== null) {
            const safeFeatures = typeof features === 'object' ? features : {};
            updatePayload.features = safeFeatures;

            // Auto-derive Category and Type from features
            // Priority 1: Direct keys "Kategori" / "Durumu"
            // Priority 2: Parse "Emlak Tipi" (e.g. "Satılık Arsa" -> Type: Satılık, Cat: Arsa)
            let category = safeFeatures['Kategori'] || null;
            let listingType = safeFeatures['Durumu'] || null;

            if (!category && !listingType && safeFeatures['Emlak Tipi']) {
                const parts = safeFeatures['Emlak Tipi'].trim().split(' ');
                if (parts.length > 0) {
                    // Start from the end? Or start from beginning?
                    // Typically: "Satılık Arsa", "Kiralık Daire", "Satılık Yazlık"
                    // First word is usually Type (Satılık, Kiralık)
                    // Rest is Category
                    const potentialType = parts[0];
                    const validTypes = ['Satılık', 'Kiralık', 'Günlük Kiralık', 'Devren'];

                    if (validTypes.includes(potentialType)) {
                        listingType = potentialType;
                        category = parts.slice(1).join(' '); // Refine if needed
                    } else {
                        // If first word is not a known type, maybe the whole thing is category?
                        // Or maybe format is different.
                        category = safeFeatures['Emlak Tipi'];
                    }
                }
            }

            if (category) updatePayload.category = category;
            if (listingType) updatePayload.listing_type = listingType;
        }

        console.log('[Admin Update] Updating listing:', listing_id);
        console.log('[Admin Update] Payload:', JSON.stringify(updatePayload, null, 2));

        // 3. Update Supabase
        const { data, error } = await supabase
            .from('listings')
            .update(updatePayload)
            .eq('listing_id', listing_id)
            .select();

        if (error) {
            console.error('[Admin Update] Supabase error:', error);
            return NextResponse.json({ error: 'Veritabanı güncelleme hatası' }, { status: 500 });
        }

        console.log('[Admin Update] Success - Affected rows:', data?.length || 0);
        console.log('[Admin Update] Updated data:', JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
