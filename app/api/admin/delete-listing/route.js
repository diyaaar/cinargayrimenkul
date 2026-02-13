import { requireAdmin } from '@/lib/requireAdmin';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { listing_id } = body;

        if (!listing_id) {
            return NextResponse.json(
                { error: 'Listing ID is required' },
                { status: 400 }
            );
        }

        // 1. Get all media files associated with this listing
        const { data: mediaFiles, error: fetchError } = await supabaseAdmin
            .from('listing_media')
            .select('storage_path')
            .eq('listing_id', listing_id);

        if (fetchError) {
            console.error('[delete-listing] Error fetching media:', fetchError);
            throw fetchError;
        }

        // 2. Delete files from Storage if any exist
        if (mediaFiles && mediaFiles.length > 0) {
            const pathsToRemove = mediaFiles.map(file => file.storage_path).filter(Boolean);

            if (pathsToRemove.length > 0) {
                const { error: storageError } = await supabaseAdmin
                    .storage
                    .from('listings')
                    .remove(pathsToRemove);

                if (storageError) {
                    console.error('[delete-listing] Storage deletion error:', storageError);
                    // We continue even if storage deletion fails, to ensure DB consistency
                }
            }
        }

        // 3. Delete media rows from database
        const { error: mediaDeleteError } = await supabaseAdmin
            .from('listing_media')
            .delete()
            .eq('listing_id', listing_id);

        if (mediaDeleteError) {
            console.error('[delete-listing] Error deleting media rows:', mediaDeleteError);
            throw mediaDeleteError;
        }

        // 4. Soft delete the listing
        const { data, error: updateError } = await supabaseAdmin
            .from('listings')
            .update({
                is_deleted: true,
                updated_at: new Date().toISOString()
            })
            .eq('listing_id', listing_id)
            .select()
            .single();

        if (updateError) {
            console.error('[delete-listing] Supabase error:', updateError);
            return NextResponse.json(
                { error: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('[delete-listing] Server error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
