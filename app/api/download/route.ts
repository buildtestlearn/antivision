import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'image.png';

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Sanitize filename to prevent header issues
    // Replace non-alphanumeric characters (except dots, dashes, underscores) with underscores
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
            },
        });
    } catch (error: any) {
        console.error('Download proxy error:', error);
        return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
    }
}
