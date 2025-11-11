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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCsrfToken, handleCsrfError } from '@/lib/csrf';

export interface Area {
    id?: number;
    name: string;
    description?: string | null;
    geometry_json: unknown;
    province_id?: string | null;
    province_name?: string | null;
    regency_id?: string | null;
    regency_name?: string | null;
    district_id?: string | null;
    district_name?: string | null;
    village_id?: string | null;
    village_name?: string | null;
}

export interface AreaFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    areaGroupId: number;
    area?: Area | null;
    onSuccess: () => void;
}

export function AreaFormDialog({
    open,
    onOpenChange,
    areaGroupId,
    area,
    onSuccess,
}: AreaFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get initial form data
    const getInitialFormData = () => {
        return area
            ? {
                  name: area.name || '',
                  description: area.description || '',
                  province_id: area.province_id || '',
                  province_name: area.province_name || '',
                  regency_id: area.regency_id || '',
                  regency_name: area.regency_name || '',
                  district_id: area.district_id || '',
                  district_name: area.district_name || '',
                  village_id: area.village_id || '',
                  village_name: area.village_name || '',
                  geometry_json: area.geometry_json || null,
              }
            : {
                  name: '',
                  description: '',
                  province_id: '',
                  province_name: '',
                  regency_id: '',
                  regency_name: '',
                  district_id: '',
                  district_name: '',
                  village_id: '',
                  village_name: '',
                  geometry_json: null,
              };
    };

    // Form state
    const [formData, setFormData] = useState(getInitialFormData);

    // Reset form when area changes (for edit mode)
    useEffect(() => {
        if (open) {
            setFormData(getInitialFormData());
        }
    }, [open, area]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.geometry_json) {
            toast.error('Geometri wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: any = {
                name: formData.name,
                description: formData.description || null,
                geometry_json: formData.geometry_json,
            };

            // Add wilayah data if provided
            if (formData.province_id) {
                payload.province_id = formData.province_id;
                payload.province_name = formData.province_name || null;
            }
            if (formData.regency_id) {
                payload.regency_id = formData.regency_id;
                payload.regency_name = formData.regency_name || null;
            }
            if (formData.district_id) {
                payload.district_id = formData.district_id;
                payload.district_name = formData.district_name || null;
            }
            if (formData.village_id) {
                payload.village_id = formData.village_id;
                payload.village_name = formData.village_name || null;
            }

            const url = area
                ? `/areas/${areaGroupId}/areas/${area.id}`
                : `/areas/${areaGroupId}/areas`;

            const method = area ? 'PUT' : 'POST';

            // Get CSRF token with better error handling
            const csrfToken = getCsrfToken();
            console.log('[AreaFormDialog] CSRF Token for form:', csrfToken.substring(0, 10) + '...');

            const response = await fetch(url, {
                method: method === 'PUT' ? 'POST' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(
                    method === 'PUT'
                        ? { ...payload, _method: 'PUT' }
                        : payload,
                ),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Handle CSRF token mismatch specifically
                if (response.status === 419 || (errorData.message && errorData.message.includes('CSRF'))) {
                    toast.error(handleCsrfError(response, errorData));
                    return;
                }
                
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }

            const data = await response.json();
            toast.success(data.message || 'Area berhasil disimpan');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Error saving area:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan area';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {area ? 'Edit Area' : 'Tambah Area'}
                    </DialogTitle>
                    <DialogDescription>
                        {area
                            ? 'Perbarui informasi area kawasan'
                            : 'Tambahkan informasi area kawasan baru'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                        <Field>
                            <FieldLabel>
                                Nama Area{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Contoh: Kawasan Kumuh 1"
                                required
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
                                placeholder="Tambahkan deskripsi area..."
                                rows={3}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel>Provinsi</FieldLabel>
                                <Input
                                    value={formData.province_name || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            province_name: e.target.value,
                                        })
                                    }
                                    placeholder="Nama Provinsi"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Kota/Kabupaten</FieldLabel>
                                <Input
                                    value={formData.regency_name || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            regency_name: e.target.value,
                                        })
                                    }
                                    placeholder="Nama Kota/Kabupaten"
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel>Kecamatan</FieldLabel>
                                <Input
                                    value={formData.district_name || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            district_name: e.target.value,
                                        })
                                    }
                                    placeholder="Nama Kecamatan"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Kelurahan/Desa</FieldLabel>
                                <Input
                                    value={formData.village_name || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            village_name: e.target.value,
                                        })
                                    }
                                    placeholder="Nama Kelurahan/Desa"
                                />
                            </Field>
                        </div>
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
                            {area ? 'Simpan Perubahan' : 'Tambah Area'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
