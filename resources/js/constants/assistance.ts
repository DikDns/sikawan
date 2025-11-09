import type { AssistanceStatus, AssistanceType } from '@/types/assistance';

export const ASSISTANCE_TYPES: Array<{ value: AssistanceType; label: string }> =
    [
        { value: 'BSPS', label: 'Dana BSPS' },
        { value: 'RELOKASI', label: 'Relokasi' },
        { value: 'REHABILITASI', label: 'Rehabilitasi' },
        { value: 'LAINNYA', label: 'Lainnya' },
    ];

export const ASSISTANCE_STATUSES: Array<{
    value: AssistanceStatus;
    label: string;
    color: string;
}> = [
    { value: 'SELESAI', label: 'Selesai', color: 'success' },
    { value: 'PROSES', label: 'Proses', color: 'warning' },
    { value: 'DIBATALKAN', label: 'Dibatalkan', color: 'destructive' },
];

export const getAssistanceTypeLabel = (type: AssistanceType): string => {
    return ASSISTANCE_TYPES.find((t) => t.value === type)?.label || type;
};

export const getAssistanceStatusLabel = (status: AssistanceStatus): string => {
    return ASSISTANCE_STATUSES.find((s) => s.value === status)?.label || status;
};

export const getAssistanceStatusColor = (status: AssistanceStatus): string => {
    return (
        ASSISTANCE_STATUSES.find((s) => s.value === status)?.color || 'default'
    );
};
