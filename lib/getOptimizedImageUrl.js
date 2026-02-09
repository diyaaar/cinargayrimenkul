export function getOptimizedImageUrl(url, { width = 1200, quality = 75, format = 'webp' } = {}) {
    if (!url) return url;

    // convert Supabase public URL → render URL
    if (url.includes('/storage/v1/object/public/')) {
        const renderUrl = url.replace(
            '/storage/v1/object/public/',
            '/storage/v1/render/image/public/'
        );
        return `${renderUrl}?width=${width}&quality=${quality}&format=${format}`;
    }

    return url;
}
