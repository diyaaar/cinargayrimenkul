
export async function adminFetch(url, options = {}) {
    const defaultOptions = {
        credentials: 'include',
        ...options,
        headers: {
            ...options.headers,
        },
    };

    // Auto-set Content-Type to JSON if body is present and not FormData
    if (options.body && !(options.body instanceof FormData)) {
        defaultOptions.headers['Content-Type'] = 'application/json';
    }

    return fetch(url, defaultOptions);
}
