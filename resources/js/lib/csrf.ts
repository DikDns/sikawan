type CsrfSource = 'cookie' | 'meta' | 'stored' | 'shared';

const STORAGE_KEY = 'csrf.token';

function readCookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp('(^|;\\s*)' + name + '=([^;]*)'),
    );
    return match ? decodeURIComponent(match[2]) : null;
}

export function getMetaToken(): string | null {
    const m = document.querySelector('meta[name="csrf-token"]');
    const t = m?.getAttribute('content')?.trim();
    return t && t.length > 0 ? t : null;
}

function getStoredToken(): string | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return typeof parsed?.token === 'string' ? parsed.token : null;
    } catch {
        return null;
    }
}

function persistToken(token: string, source: CsrfSource): void {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ token, source, at: Date.now() }),
        );
    } catch {
        void 0;
    }
}

function getXsrfCookieToken(): string | null {
    return readCookie('XSRF-TOKEN');
}

export function getCsrfToken(): string {
    const cookieToken = getXsrfCookieToken();
    if (cookieToken) {
        persistToken(cookieToken, 'cookie');
        return cookieToken;
    }
    const stored = getStoredToken();
    if (stored) return stored;
    const meta = getMetaToken();
    if (meta) {
        persistToken(meta, 'meta');
        return meta;
    }
    return '';
}

export function hasCsrfToken(): boolean {
    return !!getCsrfToken();
}

export function getCsrfHeaders(): Record<string, string> {
    const cookieToken = getXsrfCookieToken();
    const metaToken = getMetaToken();
    const headers: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    };
    if (cookieToken) headers['X-XSRF-TOKEN'] = cookieToken;
    if (metaToken) headers['X-CSRF-TOKEN'] = metaToken;
    return headers;
}

export async function tryRefreshCsrfToken(): Promise<string | null> {
    try {
        const url = window.location.pathname || '/';
        await fetch(url, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
            credentials: 'same-origin',
        });
        const token = getXsrfCookieToken();
        if (token) {
            persistToken(token, 'cookie');
            return token;
        }
        const meta = getMetaToken();
        if (meta) {
            persistToken(meta, 'meta');
            return meta;
        }
        return null;
    } catch {
        return null;
    }
}

export async function csrfFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    const headers = new Headers(init?.headers || {});
    const token = getCsrfToken();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const at = raw ? (JSON.parse(raw)?.at as number) : 0;
        const ageMs = at ? Date.now() - at : 0;
        if (!token || ageMs > 30 * 60 * 1000) {
            await tryRefreshCsrfToken();
        }
    } catch {
        void 0;
    }
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Accept', headers.get('Accept') || 'application/json');
    const cookieToken = getXsrfCookieToken();
    const metaToken = getMetaToken();
    if (cookieToken) headers.set('X-XSRF-TOKEN', cookieToken);
    if (metaToken) headers.set('X-CSRF-TOKEN', metaToken);
    const resp = await fetch(input, {
        ...init,
        headers,
        credentials: init?.credentials || 'same-origin',
    });
    if (resp.status === 419) {
        const refreshed = await tryRefreshCsrfToken();
        if (refreshed) {
            return fetch(input, {
                ...init,
                headers,
                credentials: init?.credentials || 'same-origin',
            });
        }
    }
    return resp;
}

export function handleCsrfError(
    response: Response,
    errorData?: unknown,
): string {
    if (response.status === 419)
        return 'Sesi telah berakhir. Silakan coba lagi.';
    const message =
        typeof (errorData as Record<string, unknown>)?.message === 'string'
            ? ((errorData as Record<string, unknown>).message as string)
            : undefined;
    const errorMsg =
        typeof (errorData as Record<string, unknown>)?.error === 'string'
            ? ((errorData as Record<string, unknown>).error as string)
            : undefined;
    if (message?.includes('CSRF') || errorMsg?.includes('CSRF'))
        return 'Token tidak valid. Silakan coba lagi.';
    return message || 'Terjadi kesalahan. Silakan coba lagi.';
}

export async function refreshCsrfToken(): Promise<void> {
    await tryRefreshCsrfToken();
}

export function registerCsrfSync(): void {
    try {
        persistToken(getCsrfToken(), 'stored');
    } catch {
        void 0;
    }
}
