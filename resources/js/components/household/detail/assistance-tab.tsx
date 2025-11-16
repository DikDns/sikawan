import { AssistanceCard } from '@/components/household/assistance-step/components/assistance-card';
import { AssistanceFormDialog } from '@/components/household/assistance-step/components/assistance-form-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Assistance } from '@/types/assistance';
import { type HouseholdDetail } from '@/types/household';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AssistanceTabProps {
    household: HouseholdDetail;
}

export default function AssistanceTab({ household }: AssistanceTabProps) {
    const [assistances, setAssistances] = useState<Assistance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAssistance, setEditingAssistance] =
        useState<Assistance | null>(null);

    // Convert HouseAssistance to Assistance type for AssistanceCard
    const convertToAssistance = (
        houseAssistance: HouseholdDetail['assistances'][number],
    ): Assistance => {
        return {
            id: houseAssistance.id,
            household_id: household.id,
            assistance_type: houseAssistance.assistance_type as
                | 'RELOKASI'
                | 'REHABILITASI'
                | 'BSPS'
                | 'LAINNYA',
            program: houseAssistance.program || undefined,
            funding_source: houseAssistance.funding_source || undefined,
            status:
                (houseAssistance.status as
                    | 'SELESAI'
                    | 'PROSES'
                    | 'DIBATALKAN') || 'PROSES',
            started_at: houseAssistance.started_at || undefined,
            completed_at: houseAssistance.completed_at || undefined,
            cost_amount_idr: houseAssistance.cost_amount_idr || undefined,
            description: houseAssistance.description || undefined,
            document_path: houseAssistance.document_path || undefined,
            created_at: '',
            updated_at: '',
        };
    };

    // Load assistances
    const loadAssistances = useCallback(async () => {
        if (!household.id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/households/${household.id}/assistances`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Gagal memuat data bantuan');
            }

            const data = await response.json();
            setAssistances(data.assistances || []);
        } catch (err) {
            console.error('Error loading assistances:', err);
            setError('Gagal memuat data bantuan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, [household.id]);

    // Load assistances on mount and when household changes
    useEffect(() => {
        // Initialize with existing assistances from household prop
        if (household.assistances && household.assistances.length > 0) {
            const converted = household.assistances.map(convertToAssistance);
            setAssistances(converted);
            setIsLoading(false);
        } else {
            loadAssistances();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [household.id]);

    const handleAdd = () => {
        setEditingAssistance(null);
        setDialogOpen(true);
    };

    const handleEdit = (assistance: Assistance) => {
        setEditingAssistance(assistance);
        setDialogOpen(true);
    };

    const handleDelete = async (assistanceId: number) => {
        if (!household.id) return;

        if (!confirm('Apakah Anda yakin ingin menghapus bantuan ini?')) {
            return;
        }

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch(
                `/households/${household.id}/assistances/${assistanceId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken || '',
                    },
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }

            const data = await response.json();
            toast.success(data.message || 'Bantuan berhasil dihapus');
            loadAssistances();
        } catch (error) {
            console.error('Error deleting assistance:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menghapus bantuan';
            toast.error(errorMessage);
        }
    };

    const handleStatusChange = async (
        assistanceId: number,
        newStatus: string,
    ) => {
        if (!household.id) return;

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch(
                `/households/${household.id}/assistances/${assistanceId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken || '',
                    },
                    body: JSON.stringify({ status: newStatus }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }

            const data = await response.json();
            toast.success(data.message || 'Status bantuan berhasil diperbarui');
            loadAssistances();
        } catch (error) {
            console.error('Error updating status:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal memperbarui status bantuan';
            toast.error(errorMessage);
        }
    };

    const handleDialogSuccess = () => {
        loadAssistances();
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <h3 className="text-left text-lg font-semibold text-foreground">
                    Bantuan Perbaikan
                </h3>
                <Button
                    onClick={handleAdd}
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Data
                </Button>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">
                            Memuat data bantuan...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : assistances.length === 0 ? (
                <Card className="border-border bg-muted">
                    <CardContent className="py-12 text-center">
                        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Plus className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">
                                Belum Ada Bantuan
                            </h3>
                            <p className="mt-2 mb-4 text-sm text-muted-foreground">
                                Tambahkan data bantuan yang pernah diterima
                                untuk rumah ini.
                            </p>
                            <Button onClick={handleAdd} size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Bantuan
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col flex-wrap gap-4 lg:flex-row">
                    {assistances.map((assistance) => (
                        <AssistanceCard
                            key={assistance.id}
                            assistance={assistance}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            <AssistanceFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                householdId={household.id}
                assistance={editingAssistance || undefined}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}
