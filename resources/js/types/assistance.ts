export type AssistanceType = 'RELOKASI' | 'REHABILITASI' | 'BSPS' | 'LAINNYA';
export type AssistanceStatus = 'SELESAI' | 'PROSES' | 'DIBATALKAN';

export interface Assistance {
    id: number;
    household_id: number;
    assistance_type: AssistanceType;
    program?: string;
    funding_source?: string;
    status: AssistanceStatus;
    started_at?: string; // ISO date string
    completed_at?: string; // ISO date string
    cost_amount_idr?: number;
    description?: string;
    document_path?: string;
    photo_paths?: string[];
    created_at: string;
    updated_at: string;
}

export interface AssistanceFormData {
    assistance_type: AssistanceType;
    program?: string;
    funding_source?: string;
    status: AssistanceStatus;
    started_at?: string;
    completed_at?: string;
    cost_amount_idr?: number;
    description?: string;
    document?: File;
}
