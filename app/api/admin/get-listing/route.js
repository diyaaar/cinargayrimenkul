import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

/**
 * GET /api/admin/get-listing?id=<listing_id>
 * Fetches listing data and media for the admin edit page.
 */
export async function GET(req) {
    try {
        // 1. Authenticate Request
        const auth = await requireAdmin(req);
        if (!auth.ok) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Query Params
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'id query parameter is required' },
                { status: 400 }
            );
        }

        // 3. Fetch Listing Data
        const { data: listing, error: listingError } = await supabaseAdmin
            .from('listings')
            .select(`
                listing_id,
                source_url,
                title,
                manual_title,
                description,
                manual_description,
                price_raw,
                manual_price_raw,
                price_value,
                price_currency,
                category,
                listing_type,
                status,
                city,
                district,
                neighborhood,
                features,
                scrape_status,
                last_scraped_at,
                updated_at,
                created_at
            `)
            .eq('listing_id', id)
            .single();

        if (listingError) {
            console.error('[API get-listing] Error fetching listing:', listingError);
            return NextResponse.json(
                { error: 'Failed to fetch listing data' },
                { status: 500 }
            );
        }

        if (!listing) {
            return NextResponse.json(
                { error: 'Listing not found' },
                { status: 404 }
            );
        }

        // 4. Fetch Listing Media
        const { data: media, error: mediaError } = await supabaseAdmin
            .from('listing_media')
            .select('*')
            .eq('listing_id', id)
            .order('sort_order', { ascending: true });

        if (mediaError) {
            console.error('[API get-listing] Error fetching media:', mediaError);
            return NextResponse.json(
                { error: 'Failed to fetch listing media' },
                { status: 500 }
            );
        }

        // 5. Return JSON Response
        return NextResponse.json({
            listing,
            media: media || []
        });

    } catch (error) {
        console.error('[API get-listing] Server error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
