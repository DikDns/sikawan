import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { csrfFetch, handleCsrfError } from '@/lib/csrf';
import {
    AlertCircle,
    Calendar,
    Edit,
    Loader2,
    Plus,
    Trash2,
    Wrench,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface InfrastructureAssistance {
    id: number;
    infrastructure_id: number;
    assistance_type: 'RELOKASI' | 'REHABILITASI' | 'BSPS' | 'LAINNYA';
    program?: string | null;
    funding_source?: string | null;
    status: 'SELESAI' | 'PROSES' | 'DIBATALKAN';
    started_at?: string | null;
    completed_at?: string | null;
    cost_amount_idr?: number | null;
    description?: string | null;
    document_path?: string | null;
    created_at?: string;
    updated_at?: string;
}

interface InfrastructureAssistanceCardProps {
    infrastructureId: number;
    infrastructureName: string;
}

const ASSISTANCE_TYPE_LABELS: Record<string, string> = {
    RELOKASI: 'Relokasi',
    REHABILITASI: 'Rehabilitasi',
    BSPS: 'BSPS',
    LAINNYA: 'Lainnya',
};

const STATUS_LABELS: Record<string, string> = {
    SELESAI: 'Selesai',
    PROSES: 'Dalam Proses',
    DIBATALKAN: 'Dibatalkan',
};

const STATUS_COLORS: Record<string, string> = {
    SELESAI: 'bg-green-100 text-green-800',
    PROSES: 'bg-yellow-100 text-yellow-800',
    DIBATALKAN: 'bg-red-100 text-red-800',
};

function formatCurrency(value: number | null | undefined): string {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function InfrastructureAssistanceCard({
    infrastructureId,
    infrastructureName,
}: InfrastructureAssistanceCardProps) {
    const [assistances, setAssistances] = useState<InfrastructureAssistance[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAssistance, setEditingAssistance] =
        useState<InfrastructureAssistance | null>(null);

    const loadAssistances = useCallback(async () => {
        if (!infrastructureId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await csrfFetch(
                `/infrastructure-items/${infrastructureId}/assistances`,
                { method: 'GET' },
            );

            if (!response.ok) {
                if (response.status === 419) {
                    toast.error(handleCsrfError(response));
                    return;
                }
                throw new Error('Gagal memuat riwayat perbaikan');
            }

            const data = await response.json();
            setAssistances(data.assistances || []);
        } catch (err) {
            console.error('Error loading assistances:', err);
            setError('Gagal memuat riwayat perbaikan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, [infrastructureId]);

    useEffect(() => {
        loadAssistances();
    }, [loadAssistances]);

    const handleAdd = () => {
        setEditingAssistance(null);
        setDialogOpen(true);
    };

    const handleEdit = (assistance: InfrastructureAssistance) => {
        setEditingAssistance(assistance);
        setDialogOpen(true);
    };

    const handleDelete = async (assistanceId: number) => {
        if (
            !confirm('Apakah Anda yakin ingin menghapus riwayat perbaikan ini?')
        ) {
            return;
        }

        try {
            const response = await csrfFetch(
                `/infrastructure-items/${infrastructureId}/assistances/${assistanceId}`,
                { method: 'DELETE' },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 419) {
                    toast.error(handleCsrfError(response, errorData));
                    return;
                }
                throw new Error(errorData.message || 'Gagal menghapus');
            }

            const data = await response.json();
            toast.success(data.message || 'Riwayat perbaikan berhasil dihapus');
            loadAssistances();
        } catch (error) {
            console.error('Error deleting assistance:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menghapus riwayat perbaikan';
            toast.error(errorMessage);
        }
    };

    const handleDialogSuccess = () => {
        loadAssistances();
    };

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Riwayat Perbaikan - {infrastructureName}
                </CardTitle>
                <Button onClick={handleAdd} size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Tambah
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex h-32 items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Memuat riwayat...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : assistances.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Wrench className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Belum ada riwayat perbaikan
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {assistances.map((assistance) => (
                            <div
                                key={assistance.id}
                                className="flex items-start justify-between rounded-lg border p-3"
                            >
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {ASSISTANCE_TYPE_LABELS[
                                                assistance.assistance_type
                                            ] || assistance.assistance_type}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[assistance.status] || 'bg-gray-100'}`}
                                        >
                                            {STATUS_LABELS[assistance.status] ||
                                                assistance.status}
                                        </span>
                                    </div>
                                    {assistance.program && (
                                        <p className="text-sm text-muted-foreground">
                                            Program: {assistance.program}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        {assistance.started_at && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(
                                                    assistance.started_at,
                                                )}
                                                {assistance.completed_at &&
                                                    ` - ${formatDate(assistance.completed_at)}`}
                                            </span>
                                        )}
                                        {assistance.cost_amount_idr && (
                                            <span>
                                                {formatCurrency(
                                                    assistance.cost_amount_idr,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {assistance.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {assistance.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEdit(assistance)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() =>
                                            handleDelete(assistance.id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <InfrastructureAssistanceFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                infrastructureId={infrastructureId}
                assistance={editingAssistance || undefined}
                onSuccess={handleDialogSuccess}
            />
        </Card>
    );
}

// Form Dialog Component
interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    infrastructureId: number;
    assistance?: InfrastructureAssistance;
    onSuccess: () => void;
}

function InfrastructureAssistanceFormDialog({
    open,
    onOpenChange,
    infrastructureId,
    assistance,
    onSuccess,
}: FormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        assistance_type: 'LAINNYA' as string,
        program: '',
        funding_source: '',
        status: 'PROSES' as string,
        started_at: '',
        completed_at: '',
        cost_amount_idr: '',
        description: '',
    });

    useEffect(() => {
        if (!open) return;

        if (assistance) {
            setFormData({
                assistance_type: assistance.assistance_type || 'LAINNYA',
                program: assistance.program || '',
                funding_source: assistance.funding_source || '',
                status: assistance.status || 'PROSES',
                started_at: assistance.started_at || '',
                completed_at: assistance.completed_at || '',
                cost_amount_idr: assistance.cost_amount_idr?.toString() || '',
                description: assistance.description || '',
            });
        } else {
            setFormData({
                assistance_type: 'LAINNYA',
                program: '',
                funding_source: '',
                status: 'PROSES',
                started_at: '',
                completed_at: '',
                cost_amount_idr: '',
                description: '',
            });
        }
    }, [open, assistance]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                assistance_type: formData.assistance_type,
                program: formData.program || null,
                funding_source: formData.funding_source || null,
                status: formData.status,
                started_at: formData.started_at || null,
                completed_at: formData.completed_at || null,
                cost_amount_idr: formData.cost_amount_idr
                    ? parseInt(formData.cost_amount_idr)
                    : null,
                description: formData.description || null,
            };

            const url = assistance
                ? `/infrastructure-items/${infrastructureId}/assistances/${assistance.id}`
                : `/infrastructure-items/${infrastructureId}/assistances`;

            const method = assistance ? 'PUT' : 'POST';

            const response = await csrfFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 419) {
                    toast.error(handleCsrfError(response, errorData));
                    return;
                }
                throw new Error(errorData.message || 'Gagal menyimpan');
            }

            const data = await response.json();
            toast.success(
                data.message || 'Riwayat perbaikan berhasil disimpan',
            );
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Error saving assistance:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan riwayat perbaikan';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {assistance
                            ? 'Edit Riwayat Perbaikan'
                            : 'Tambah Riwayat Perbaikan'}
                    </DialogTitle>
                    <DialogDescription>
                        {assistance
                            ? 'Perbarui informasi riwayat perbaikan'
                            : 'Tambahkan riwayat perbaikan baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel>Jenis Perbaikan *</FieldLabel>
                            <Select
                                value={formData.assistance_type}
                                onValueChange={(v) =>
                                    setFormData({
                                        ...formData,
                                        assistance_type: v,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REHABILITASI">
                                        Rehabilitasi
                                    </SelectItem>
                                    <SelectItem value="RELOKASI">
                                        Relokasi
                                    </SelectItem>
                                    <SelectItem value="BSPS">BSPS</SelectItem>
                                    <SelectItem value="LAINNYA">
                                        Lainnya
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>Status *</FieldLabel>
                            <Select
                                value={formData.status}
                                onValueChange={(v) =>
                                    setFormData({ ...formData, status: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PROSES">
                                        Dalam Proses
                                    </SelectItem>
                                    <SelectItem value="SELESAI">
                                        Selesai
                                    </SelectItem>
                                    <SelectItem value="DIBATALKAN">
                                        Dibatalkan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>Program</FieldLabel>
                        <Input
                            value={formData.program}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    program: e.target.value,
                                })
                            }
                            placeholder="Nama program"
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Sumber Pendanaan</FieldLabel>
                        <Input
                            value={formData.funding_source}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    funding_source: e.target.value,
                                })
                            }
                            placeholder="Contoh: APBD, APBN"
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel>Tanggal Mulai</FieldLabel>
                            <Input
                                type="date"
                                value={formData.started_at}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        started_at: e.target.value,
                                    })
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Tanggal Selesai</FieldLabel>
                            <Input
                                type="date"
                                value={formData.completed_at}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        completed_at: e.target.value,
                                    })
                                }
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>Biaya (IDR)</FieldLabel>
                        <Input
                            type="number"
                            min="0"
                            value={formData.cost_amount_idr}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    cost_amount_idr: e.target.value,
                                })
                            }
                            placeholder="0"
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Deskripsi</FieldLabel>
                        <Textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Catatan tambahan..."
                            rows={3}
                        />
                    </Field>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {assistance ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Section component for embedding in other dialogs (without Card wrapper)
interface InfrastructureAssistanceSectionProps {
    infrastructureId: number;
}

export function InfrastructureAssistanceSection({
    infrastructureId,
}: InfrastructureAssistanceSectionProps) {
    const [assistances, setAssistances] = useState<InfrastructureAssistance[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAssistance, setEditingAssistance] =
        useState<InfrastructureAssistance | null>(null);

    const loadAssistances = useCallback(async () => {
        if (!infrastructureId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await csrfFetch(
                `/infrastructure-items/${infrastructureId}/assistances`,
                { method: 'GET' },
            );

            if (!response.ok) {
                if (response.status === 419) {
                    toast.error(handleCsrfError(response));
                    return;
                }
                throw new Error('Gagal memuat riwayat perbaikan');
            }

            const data = await response.json();
            setAssistances(data.assistances || []);
        } catch (err) {
            console.error('Error loading assistances:', err);
            setError('Gagal memuat riwayat perbaikan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, [infrastructureId]);

    useEffect(() => {
        loadAssistances();
    }, [loadAssistances]);

    const handleAdd = () => {
        setEditingAssistance(null);
        setDialogOpen(true);
    };

    const handleEdit = (assistance: InfrastructureAssistance) => {
        setEditingAssistance(assistance);
        setDialogOpen(true);
    };

    const handleDelete = async (assistanceId: number) => {
        if (
            !confirm('Apakah Anda yakin ingin menghapus riwayat perbaikan ini?')
        ) {
            return;
        }

        try {
            const response = await csrfFetch(
                `/infrastructure-items/${infrastructureId}/assistances/${assistanceId}`,
                { method: 'DELETE' },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 419) {
                    toast.error(handleCsrfError(response, errorData));
                    return;
                }
                throw new Error(errorData.message || 'Gagal menghapus');
            }

            const data = await response.json();
            toast.success(data.message || 'Riwayat perbaikan berhasil dihapus');
            loadAssistances();
        } catch (error) {
            console.error('Error deleting assistance:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menghapus riwayat perbaikan';
            toast.error(errorMessage);
        }
    };

    const handleDialogSuccess = () => {
        loadAssistances();
    };

    return (
        <div className="border-t pt-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-medium">
                    <Wrench className="h-4 w-4" />
                    Riwayat Perbaikan
                </h4>
                <Button onClick={handleAdd} size="sm" variant="outline">
                    <Plus className="mr-1 h-3 w-3" />
                    Tambah
                </Button>
            </div>

            {isLoading ? (
                <div className="flex h-20 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : assistances.length === 0 ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Belum ada riwayat perbaikan
                    </p>
                </div>
            ) : (
                <div className="max-h-[200px] space-y-2 overflow-y-auto">
                    {assistances.map((assistance) => (
                        <div
                            key={assistance.id}
                            className="flex items-start justify-between rounded-md border p-2 text-sm"
                        >
                            <div className="flex-1 space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {ASSISTANCE_TYPE_LABELS[
                                            assistance.assistance_type
                                        ] || assistance.assistance_type}
                                    </span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[assistance.status] || 'bg-gray-100'}`}
                                    >
                                        {STATUS_LABELS[assistance.status] ||
                                            assistance.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    {assistance.started_at && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(assistance.started_at)}
                                        </span>
                                    )}
                                    {assistance.cost_amount_idr && (
                                        <span>
                                            {formatCurrency(
                                                assistance.cost_amount_idr,
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleEdit(assistance)}
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(assistance.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <InfrastructureAssistanceFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                infrastructureId={infrastructureId}
                assistance={editingAssistance || undefined}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}
