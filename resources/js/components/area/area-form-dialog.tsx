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
import { GeometryEditor } from '@/components/ui/geometry-editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useWilayah } from '@/hooks/use-wilayah';
import { csrfFetch, handleCsrfError } from '@/lib/csrf';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    is_slum?: boolean;
    area_total_m2?: number | null;
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
    const wilayah = useWilayah();

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
                  is_slum: Boolean(area.is_slum),
                  area_total_m2: area.area_total_m2 ?? '',
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
                  is_slum: false,
                  area_total_m2: '',
              };
    };

    // Form state
    const [formData, setFormData] = useState(getInitialFormData);

    // Reset form when dialog opens or area changes (edit mode)
    useEffect(() => {
        if (!open) return;

        const initial = getInitialFormData();
        setFormData(initial);

        // Preload dependent options if editing existing area
        const p = initial.province_id;
        const r = initial.regency_id;
        const d = initial.district_id;

        if (p) {
            wilayah.loadCities(String(p));
        } else {
            wilayah.resetCities();
        }
        if (r) {
            wilayah.loadSubDistricts(String(r));
        } else {
            wilayah.resetSubDistricts();
        }
        if (d) {
            wilayah.loadVillages(String(d));
        } else {
            wilayah.resetVillages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, area]);

    // Load cities when province changes
    useEffect(() => {
        if (formData.province_id) {
            wilayah.loadCities(String(formData.province_id));
        } else {
            wilayah.resetCities();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.province_id]);

    // Load sub-districts when city/regency changes
    useEffect(() => {
        if (formData.regency_id) {
            wilayah.loadSubDistricts(String(formData.regency_id));
        } else {
            wilayah.resetSubDistricts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.regency_id]);

    // Load villages when district changes
    useEffect(() => {
        if (formData.district_id) {
            wilayah.loadVillages(String(formData.district_id));
        } else {
            wilayah.resetVillages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.district_id]);

    const handleProvinceChange = useCallback(
        (value: string) => {
            const selected = wilayah.provinces.find(
                (p) => String(p.value) === String(value),
            );
            setFormData((prev) => ({
                ...prev,
                province_id: value,
                province_name: selected?.label || '',
                regency_id: '',
                regency_name: '',
                district_id: '',
                district_name: '',
                village_id: '',
                village_name: '',
            }));
        },
        [wilayah.provinces],
    );

    const handleRegencyChange = useCallback(
        (value: string) => {
            const selected = wilayah.cities.find(
                (c) => String(c.value) === String(value),
            );
            setFormData((prev) => ({
                ...prev,
                regency_id: value,
                regency_name: selected?.label || '',
                district_id: '',
                district_name: '',
                village_id: '',
                village_name: '',
            }));
        },
        [wilayah.cities],
    );

    const handleDistrictChange = useCallback(
        (value: string) => {
            const selected = wilayah.subDistricts.find(
                (d) => String(d.value) === String(value),
            );
            setFormData((prev) => ({
                ...prev,
                district_id: value,
                district_name: selected?.label || '',
                village_id: '',
                village_name: '',
            }));
        },
        [wilayah.subDistricts],
    );

    const handleVillageChange = useCallback(
        (value: string) => {
            const selected = wilayah.villages.find(
                (v) => String(v.value) === String(value),
            );
            setFormData((prev) => ({
                ...prev,
                village_id: value,
                village_name: selected?.label || '',
            }));
        },
        [wilayah.villages],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.geometry_json) {
            toast.error('Geometri wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: {
                name: string;
                description: string | null;
                geometry_json: unknown;
                province_id?: string;
                province_name?: string | null;
                regency_id?: string;
                regency_name?: string | null;
                district_id?: string;
                district_name?: string | null;
                village_id?: string;
                village_name?: string | null;
                is_slum: boolean;
                area_total_m2?: number | null;
            } = {
                name: formData.name,
                description: formData.description || null,
                geometry_json: formData.geometry_json,
                is_slum: formData.is_slum,
                area_total_m2: formData.area_total_m2
                    ? Number(formData.area_total_m2)
                    : null,
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

            const response = await csrfFetch(url, {
                method: method === 'PUT' ? 'POST' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    method === 'PUT' ? { ...payload, _method: 'PUT' } : payload,
                ),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle CSRF token mismatch specifically
                if (
                    response.status === 419 ||
                    (errorData.message && errorData.message.includes('CSRF'))
                ) {
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
                error instanceof Error ? error.message : 'Gagal menyimpan area';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log('is_slum', formData.is_slum);
    console.log('area   ', area);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {area ? 'Edit Kawasan' : 'Tambah Kawasan'}
                    </DialogTitle>
                    <DialogDescription>
                        {area
                            ? 'Perbarui informasi kawasan'
                            : 'Tambahkan informasi kawasan baru'}
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
                                placeholder="Tambahkan deskripsi kawasan..."
                                rows={3}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel>Luas Area (m²)</FieldLabel>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.area_total_m2}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            area_total_m2: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: 50000"
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Kawasan Kumuh</FieldLabel>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="is_slum"
                                        checked={formData.is_slum}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                is_slum: checked,
                                            })
                                        }
                                    />
                                    <Label
                                        htmlFor="is_slum"
                                        className="text-sm text-muted-foreground"
                                    >
                                        {formData.is_slum
                                            ? 'Ya, ini kawasan kumuh'
                                            : 'Bukan kawasan kumuh'}
                                    </Label>
                                </div>
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel>Provinsi</FieldLabel>
                                <SearchableSelect
                                    options={wilayah.provinces}
                                    value={String(formData.province_id || '')}
                                    onValueChange={handleProvinceChange}
                                    placeholder={
                                        wilayah.loadingProvinces
                                            ? 'Memuat provinsi...'
                                            : 'Pilih Provinsi'
                                    }
                                    searchPlaceholder="Cari provinsi..."
                                    emptyMessage="Provinsi tidak ditemukan"
                                    disabled={wilayah.loadingProvinces}
                                    clearable={false}
                                    aria-label="Pilih Provinsi"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Kota/Kabupaten</FieldLabel>
                                <SearchableSelect
                                    options={wilayah.cities}
                                    value={String(formData.regency_id || '')}
                                    onValueChange={handleRegencyChange}
                                    placeholder={
                                        wilayah.loadingCities
                                            ? 'Memuat kota/kabupaten...'
                                            : 'Pilih Kota/Kabupaten'
                                    }
                                    searchPlaceholder="Cari kota/kabupaten..."
                                    emptyMessage="Kota/Kabupaten tidak ditemukan"
                                    disabled={
                                        !formData.province_id ||
                                        wilayah.loadingCities
                                    }
                                    clearable={false}
                                    aria-label="Pilih Kota/Kabupaten"
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel>Kecamatan</FieldLabel>
                                <SearchableSelect
                                    options={wilayah.subDistricts}
                                    value={String(formData.district_id || '')}
                                    onValueChange={handleDistrictChange}
                                    placeholder={
                                        wilayah.loadingSubDistricts
                                            ? 'Memuat kecamatan...'
                                            : 'Pilih Kecamatan'
                                    }
                                    searchPlaceholder="Cari kecamatan..."
                                    emptyMessage="Kecamatan tidak ditemukan"
                                    disabled={
                                        !formData.regency_id ||
                                        wilayah.loadingSubDistricts
                                    }
                                    clearable={false}
                                    aria-label="Pilih Kecamatan"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Kelurahan/Desa</FieldLabel>
                                <SearchableSelect
                                    options={wilayah.villages}
                                    value={String(formData.village_id || '')}
                                    onValueChange={handleVillageChange}
                                    placeholder={
                                        wilayah.loadingVillages
                                            ? 'Memuat desa/kelurahan...'
                                            : 'Pilih Desa/Kelurahan'
                                    }
                                    searchPlaceholder="Cari desa/kelurahan..."
                                    emptyMessage="Desa/Kelurahan tidak ditemukan"
                                    disabled={
                                        !formData.district_id ||
                                        wilayah.loadingVillages
                                    }
                                    clearable={false}
                                    aria-label="Pilih Desa/Kelurahan"
                                />
                            </Field>
                        </div>

                        <GeometryEditor
                            geometryJson={formData.geometry_json}
                            onGeometryChange={(geometry: unknown) =>
                                setFormData({
                                    ...formData,
                                    geometry_json:
                                        geometry as typeof formData.geometry_json,
                                })
                            }
                        />
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
                            {area ? 'Simpan Perubahan' : 'Tambah Kawasan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
