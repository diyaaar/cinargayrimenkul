
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

        const { id, listing_id } = await req.json();

        if (!id || !listing_id) {
            return NextResponse.json(
                { error: 'Missing id or listing_id' },
                { status: 400 }
            );
        }

        // Reset all covers for this listing
        const { error: updateAllError } = await supabaseAdmin
            .from('listing_media')
            .update({ is_cover: false })
            .eq('listing_id', listing_id);

        if (updateAllError) throw updateAllError;

        // Set new cover
        const { error: updateOneError } = await supabaseAdmin
            .from('listing_media')
            .update({ is_cover: true })
            .eq('id', id);

        if (updateOneError) throw updateOneError;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Set Cover API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
