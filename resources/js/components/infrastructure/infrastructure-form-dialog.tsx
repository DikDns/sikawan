import { Button } from '@/components/ui/button';
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
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface InfrastructureItemForm {
    id?: number;
    name: string;
    description?: string | null;
    geometry_type?: 'Point' | 'LineString' | 'Polygon';
    geometry_json?: unknown;
    condition_status?: string;
}

export interface InfrastructureFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: number;
    item?: InfrastructureItemForm | null;
    onSuccess: () => void;
}

export function InfrastructureFormDialog({
    open,
    onOpenChange,
    groupId,
    item,
    onSuccess,
}: InfrastructureFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<InfrastructureItemForm>(() =>
        item
            ? {
                  name: item.name || '',
                  description: item.description || '',
                  geometry_type: item.geometry_type,
                  geometry_json: item.geometry_json,
              }
            : {
                  name: '',
                  description: '',
                  geometry_json: null,
                  condition_status: 'baik',
              },
    );

    useEffect(() => {
        if (!open) return;
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                geometry_type: item.geometry_type,
                geometry_type: item.geometry_type,
                geometry_json: item.geometry_json,
                condition_status: item.condition_status || 'baik',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                geometry_json: null,
                condition_status: 'baik',
            });
        }
    }, [item, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            const payload: {
                name: string;
                description: string | null;
                geometry_type?: 'Point' | 'LineString' | 'Polygon';
                geometry_json?: unknown;
            } = {
                name: formData.name,
                description: formData.description || null,
                geometry_type: formData.geometry_type,
                geometry_json: formData.geometry_json,
                condition_status: formData.condition_status,
            };

            const url = item
                ? `/infrastructure/${groupId}/items/${item.id}`
                : `/infrastructure/${groupId}/items`;

            const method = item ? 'PUT' : 'POST';

            const response = await csrfFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    method === 'PUT' ? { ...payload, _method: 'PUT' } : payload,
                ),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (
                    response.status === 419 ||
                    (errorData.message &&
                        String(errorData.message).includes('CSRF'))
                ) {
                    toast.error(handleCsrfError(response, errorData));
                    return;
                }
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }

            const data = await response.json().catch(() => ({}));
            toast.success(data.message || 'PSU berhasil disimpan');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            const msg =
                error instanceof Error ? error.message : 'Gagal menyimpan PSU';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {item ? 'Edit PSU' : 'Tambah PSU'}
                    </DialogTitle>
                    <DialogDescription>
                        {item
                            ? 'Perbarui informasi PSU'
                            : 'Tambahkan informasi PSU baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                        <Field>
                            <FieldLabel>
                                Nama <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Contoh: Posyandu 1"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Deskripsi</FieldLabel>
                            <Textarea
                                value={formData.description || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Tambahkan deskripsi..."
                                rows={3}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Kondisi</FieldLabel>
                            <Select
                                value={formData.condition_status || 'baik'}
                                onValueChange={(v) =>
                                    setFormData({
                                        ...formData,
                                        condition_status: v,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kondisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baik">Baik</SelectItem>
                                    <SelectItem value="rusak_ringan">
                                        Rusak Ringan
                                    </SelectItem>
                                    <SelectItem value="rusak_berat">
                                        Rusak Berat
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

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
                            {item ? 'Simpan Perubahan' : 'Tambah PSU'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
