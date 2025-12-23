/**
 * Date and Time formatting utilities for WIB (Indonesia Western Time)
 */

/**
 * Format a date string to Indonesian locale with WIB timezone
 * @param dateStr - ISO date string or Date object
 * @returns Formatted date string (e.g., "15 Des 2025")
 */
export function formatDate(dateStr: string | Date | null | undefined): string {
    if (!dateStr) return '-';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    });
}

/**
 * Format a date string to Indonesian locale with time in WIB
 * @param dateStr - ISO date string or Date object
 * @returns Formatted date-time string (e.g., "15 Des 2025, 14:30")
 */
export function formatDateTime(
    dateStr: string | Date | null | undefined,
): string {
    if (!dateStr) return '-';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    });
}

/**
 * Format a date string to long Indonesian format
 * @param dateStr - ISO date string or Date object
 * @returns Formatted date string (e.g., "15 Desember 2025")
 */
export function formatDateLong(
    dateStr: string | Date | null | undefined,
): string {
    if (!dateStr) return '-';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    });
}

/**
 * Format a date string to full Indonesian format with day name
 * @param dateStr - ISO date string or Date object
 * @returns Formatted date string (e.g., "Senin, 15 Desember 2025")
 */
export function formatDateFull(
    dateStr: string | Date | null | undefined,
): string {
    if (!dateStr) return '-';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    });
}

/**
 * Format time only in WIB
 * @param dateStr - ISO date string or Date object
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(dateStr: string | Date | null | undefined): string {
    if (!dateStr) return '-';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    });
}
