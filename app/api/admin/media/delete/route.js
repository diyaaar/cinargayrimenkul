
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

        const { id, storage_path } = await req.json();

        if (!id || !storage_path) {
            return NextResponse.json(
                { error: 'Missing media id or storage_path' },
                { status: 400 }
            );
        }

        // Delete from Storage
        const { error: storageError } = await supabaseAdmin
            .storage
            .from('listings')
            .remove([storage_path]);

        if (storageError) {
            console.error('Storage delete error:', storageError);
            // Proceed to delete from DB anyway? Maybe better to keep them in sync.
            // But if storage fails, DB record points to nothing.
            throw storageError;
        }

        // Delete from DB
        const { error: dbError } = await supabaseAdmin
            .from('listing_media')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
