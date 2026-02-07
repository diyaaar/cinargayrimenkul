
import { createClient as createSupabaseServerClient } from './supabase/server';
import { supabaseAdmin } from './supabaseAdmin';

/**
 * Validates if the request is made by an admin user using cookie-based auth.
 * 
 * @param {Request} _req - The incoming request object (not explicitly needed with cookies())
 * @returns {Promise<{ ok: boolean, user?: object }>}
 */
export async function requireAdmin(_req) {
    try {
        // 1. Initialize Supabase client for Server Side (reads cookies automatically)
        const supabase = createSupabaseServerClient();

        // 2. Get user from session (cookie based)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { ok: false };
        }

        // 3. Check if user exists in admin_users table using Admin/Service-Role client
        // (RLS might block regular client from reading admin_users table)
        const { data: adminUser, error: dbError } = await supabaseAdmin
            .from('admin_users')
            .select('user_id')
            .eq('user_id', user.id)
            .single();

        if (dbError || !adminUser) {
            console.warn(`[requireAdmin] User ${user.id} authenticated but not found in admin_users`);
            return { ok: false };
        }

        // 4. Return success
        return { ok: true, user };

    } catch (error) {
        console.error('requireAdmin error:', error);
        return { ok: false };
    }
}
