import type { Assistance, AssistanceFormData } from '@/types/assistance';

export interface AssistanceStepProps {
    householdId?: number;
}

export interface AssistanceCardProps {
    assistance: Assistance;
    onEdit: (assistance: Assistance) => void;
    onDelete: (assistanceId: number) => void;
    onStatusChange: (assistanceId: number, newStatus: string) => void;
}

export interface AssistanceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    householdId?: number;
    assistance?: Assistance; // If editing
    onSuccess: () => void;
}

export { Assistance, AssistanceFormData };
