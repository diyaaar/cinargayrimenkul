import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Merhaba! API çalışıyor.',
        timestamp: new Date().toISOString()
    });
}
