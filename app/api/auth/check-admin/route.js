
import { requireAdmin } from '@/lib/requireAdmin';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const result = await requireAdmin(req);

    if (result.ok) {
        return NextResponse.json({ ok: true, user: result.user });
    } else {
        return NextResponse.json({ ok: false }, { status: 403 });
    }
}
