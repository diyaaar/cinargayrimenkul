import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/media/register
 * Registers media items in the listing_media table.
 */
export async function POST(req) {
    try {
        // 1. Authenticate Request
        const auth = await requireAdmin(req);
        if (!auth.ok) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Request Body
        const body = await req.json();
        const { items } = body;

        // 3. Validate Input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'items must be a non-empty array' },
                { status: 400 }
            );
        }

        // 4. Insert Media Items
        const { data: insertedItems, error: insertError } = await supabaseAdmin
            .from('listing_media')
            .insert(items)
            .select();

        if (insertError) {
            console.error('[API media/register] Insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to register media items' },
                { status: 500 }
            );
        }

        // 5. Return Success Response
        return NextResponse.json({
            data: insertedItems || []
        });

    } catch (error) {
        console.error('[API media/register] Server error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
