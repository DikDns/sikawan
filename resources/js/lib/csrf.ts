/**
 * CSRF Token utility functions
 * Provides robust CSRF token handling for AJAX requests
 */

/**
 * Get CSRF token from meta tag with validation
 * @returns CSRF token string
 * @throws Error if token is not found or empty
 */
export function getCsrfToken(): string {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (!csrfMeta) {
        throw new Error('CSRF token meta tag not found. Please ensure <meta name="csrf-token"> is present in your HTML.');
    }
    
    const token = csrfMeta.getAttribute('content');
    if (!token || token.trim() === '') {
        throw new Error('CSRF token is empty or not set. Please refresh the page and try again.');
    }
    
    return token;
}

/**
 * Check if CSRF token is available
 * @returns boolean indicating if token is available
 */
export function hasCsrfToken(): boolean {
    try {
        const token = getCsrfToken();
        return token.length > 0;
    } catch {
        return false;
    }
}

/**
 * Get CSRF token headers for fetch requests
 * @returns Headers object with CSRF token
 */
export function getCsrfHeaders(): Record<string, string> {
    const token = getCsrfToken();
    return {
        'X-CSRF-TOKEN': token,
        'X-Requested-With': 'XMLHttpRequest',
    };
}

/**
 * Handle CSRF errors with user-friendly messages
 * @param response - Fetch response object
 * @param errorData - Optional error data from response
 * @returns string - User-friendly error message
 */
export function handleCsrfError(response: Response, errorData?: any): string {
    if (response.status === 419) {
        return 'Sesi telah berakhir. Silakan refresh halaman dan coba lagi.';
    }
    
    if (errorData?.message?.includes('CSRF') || errorData?.error?.includes('CSRF')) {
        return 'Token keamanan tidak valid. Silakan refresh halaman dan coba lagi.';
    }
    
    return errorData?.message || 'Terjadi kesalahan. Silakan coba lagi.';
}

/**
 * Refresh CSRF token by reloading the page
 * This should be called when CSRF token is invalid or expired
 */
export function refreshCsrfToken(): void {
    if (confirm('Sesi Anda telah berakhir. Refresh halaman untuk melanjutkan?')) {
        window.location.reload();
    }
}