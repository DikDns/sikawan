import SectionHeader from '@/components/household/section-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AssistanceCard } from './components/assistance-card';
import { AssistanceFormDialog } from './components/assistance-form-dialog';
import type { Assistance, AssistanceStepProps } from './types';

export default function AssistanceStep({ householdId }: AssistanceStepProps) {
    const [assistances, setAssistances] = useState<Assistance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAssistance, setEditingAssistance] =
        useState<Assistance | null>(null);

    // Load assistances
    const loadAssistances = useCallback(async () => {
        if (!householdId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/households/${householdId}/assistances`,
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
    }, [householdId]);

    useEffect(() => {
        loadAssistances();
    }, [loadAssistances]);

    const handleAdd = () => {
        setEditingAssistance(null);
        setDialogOpen(true);
    };

    const handleEdit = (assistance: Assistance) => {
        setEditingAssistance(assistance);
        setDialogOpen(true);
    };

    const handleDelete = async (assistanceId: number) => {
        if (!householdId) return;

        if (!confirm('Apakah Anda yakin ingin menghapus bantuan ini?')) {
            return;
        }

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch(
                `/households/${householdId}/assistances/${assistanceId}`,
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
        if (!householdId) return;

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch(
                `/households/${householdId}/assistances/${assistanceId}/status`,
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

    if (!householdId) {
        return (
            <div className="space-y-6">
                <SectionHeader
                    title="Bantuan Perbaikan"
                    subtitle="Data bantuan perbaikan yang pernah diterima"
                />
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Silakan simpan data rumah terlebih dahulu sebelum
                        menambahkan bantuan.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Bantuan Perbaikan"
                subtitle="Data bantuan perbaikan yang pernah diterima"
            />

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {assistances.length === 0
                        ? 'Belum ada data bantuan'
                        : `${assistances.length} bantuan tercatat`}
                </p>
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
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                            Belum Ada Bantuan
                        </h3>
                        <p className="mt-2 mb-4 text-sm text-muted-foreground">
                            Tambahkan data bantuan yang pernah diterima untuk
                            rumah ini.
                        </p>
                        <Button onClick={handleAdd} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Bantuan
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                householdId={householdId}
                assistance={editingAssistance || undefined}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}
