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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ASSISTANCE_STATUSES, ASSISTANCE_TYPES } from '@/constants/assistance';
import { csrfFetch, getMetaToken } from '@/lib/csrf';
import { FileUp, Loader2, Upload, ImagePlus, X, ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { AssistanceFormDialogProps } from '../types';

export function AssistanceFormDialog({
    open,
    onOpenChange,
    householdId,
    assistance,
    onSuccess,
}: AssistanceFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Get initial form data
    const getInitialFormData = () => {
        return assistance
            ? {
                  assistance_type: assistance.assistance_type,
                  program: assistance.program || '',
                  funding_source: assistance.funding_source || '',
                  status: assistance.status,
                  started_at: assistance.started_at
                      ? assistance.started_at.split('T')[0]
                      : '',
                  completed_at: assistance.completed_at
                      ? assistance.completed_at.split('T')[0]
                      : '',
                  cost_amount_idr: assistance.cost_amount_idr?.toString() || '',
                  description: assistance.description || '',
              }
            : {
                  assistance_type: 'BSPS' as const,
                  program: '',
                  funding_source: '',
                  status: 'PROSES' as const,
                  started_at: '',
                  completed_at: '',
                  cost_amount_idr: '',
                  description: '',
              };
    };

    const photoInputRef = useRef<HTMLInputElement>(null);
    const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
    const [photosToRemove, setPhotosToRemove] = useState<string[]>([]);

    // Form state
    const [formData, setFormData] = useState(getInitialFormData);

    // Reset form when assistance changes (for edit mode)
    const prevAssistanceId = useRef(assistance?.id);
    if (assistance?.id !== prevAssistanceId.current) {
        prevAssistanceId.current = assistance?.id;
        setFormData(getInitialFormData());
        setSelectedFile(null);
        setSelectedPhotos([]);
        setPhotosToRemove([]);
    }

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setFormData(getInitialFormData());
            setSelectedFile(null);
            setSelectedPhotos([]);
            setPhotosToRemove([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 5MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handlePhotoSelect = () => {
        photoInputRef.current?.click();
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`Ukuran file ${file.name} maksimal 5MB`);
                return false;
            }
            return true;
        });

        const existingCount = (assistance?.photo_paths?.length || 0) - photosToRemove.length;
        if (validFiles.length + selectedPhotos.length + existingCount > 10) {
            toast.error('Maksimal total 10 foto');
            return;
        }

        setSelectedPhotos((prev) => [...prev, ...validFiles]);
        if (photoInputRef.current) photoInputRef.current.value = ''; // Reset input
    };

    const removeSelectedPhoto = (index: number) => {
        setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingPhoto = (path: string) => {
        setPhotosToRemove((prev) => [...prev, path]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!householdId) {
            toast.error('Household ID tidak ditemukan');
            return;
        }

        setIsSubmitting(true);

        try {
            const formPayload = new FormData();
            formPayload.append('assistance_type', formData.assistance_type);
            formPayload.append('status', formData.status);

            if (formData.program)
                formPayload.append('program', formData.program);
            if (formData.funding_source)
                formPayload.append('funding_source', formData.funding_source);
            if (formData.started_at)
                formPayload.append('started_at', formData.started_at);
            if (formData.completed_at)
                formPayload.append('completed_at', formData.completed_at);
            if (formData.cost_amount_idr)
                formPayload.append('cost_amount_idr', formData.cost_amount_idr);
            if (formData.description)
                formPayload.append('description', formData.description);
            if (selectedFile) formPayload.append('document', selectedFile);
            
            selectedPhotos.forEach((photo) => {
                formPayload.append('photos[]', photo);
            });
            photosToRemove.forEach((path) => {
                formPayload.append('remove_photo_paths[]', path);
            });

            const url = assistance
                ? `/households/${householdId}/assistances/${assistance.id}`
                : `/households/${householdId}/assistances`;

            const method = assistance ? 'PUT' : 'POST';

            const response = await csrfFetch(url, {
                method: method === 'PUT' ? 'POST' : 'POST',
                body: (() => {
                    const metaToken = getMetaToken();
                    if (metaToken) formPayload.append('_token', metaToken);
                    if (method === 'PUT') {
                        formPayload.append('_method', 'PUT');
                    }
                    return formPayload;
                })(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 419) {
                    toast.error(
                        errorData.message || 'Sesi berakhir. Coba lagi.',
                    );
                    return;
                }
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }

            const data = await response.json();
            toast.success(data.message || 'Bantuan berhasil disimpan');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Error saving assistance:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan bantuan';
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
                        {assistance ? 'Edit Bantuan' : 'Tambah Bantuan'}
                    </DialogTitle>
                    <DialogDescription>
                        {assistance
                            ? 'Perbarui informasi bantuan yang telah diterima'
                            : 'Tambahkan informasi bantuan yang telah diterima'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                        <Field>
                            <FieldLabel>
                                Jenis Bantuan{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                                value={formData.assistance_type}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        assistance_type:
                                            value as typeof formData.assistance_type,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis bantuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSISTANCE_TYPES.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>
                                Status{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        status: value as typeof formData.status,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSISTANCE_STATUSES.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>Program Bantuan</FieldLabel>
                            <Input
                                value={formData.program}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        program: e.target.value,
                                    })
                                }
                                placeholder="Contoh: Program Bantuan Stimulan Perumahan Swadaya"
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Sumber Dana</FieldLabel>
                            <Input
                                value={formData.funding_source}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        funding_source: e.target.value,
                                    })
                                }
                                placeholder="Contoh: APBN, APBD, CSR"
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
                            <FieldLabel>Biaya (Rp)</FieldLabel>
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
                            <FieldLabel>Keterangan</FieldLabel>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Tambahkan keterangan tambahan..."
                                rows={3}
                            />
                        </Field>

                        <div className="space-y-2">
                            <Label>Dokumen</Label>
                            <div className="space-y-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleFileSelect}
                                    className="w-full"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {selectedFile
                                        ? 'Ganti Dokumen'
                                        : 'Unggah Dokumen'}
                                </Button>
                                {selectedFile && (
                                    <div className="flex items-center gap-2 rounded-md border bg-muted p-2">
                                        <FileUp className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {selectedFile.name}
                                        </span>
                                    </div>
                                )}
                                {!selectedFile && assistance?.document_path && (
                                    <p className="text-sm text-muted-foreground">
                                        Dokumen saat ini:{' '}
                                        <a
                                            href={`/storage/${assistance.document_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Lihat
                                        </a>
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Format: PDF, DOC, DOCX (Maks. 5MB)
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Foto Bantuan</Label>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {/* Existing Photos */}
                                    {assistance?.photo_paths
                                        ?.filter((path) => !photosToRemove.includes(path))
                                        .map((path, index) => {
                                            const isImage = path.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                                            return (
                                                <div key={`existing-${index}`} className="group relative aspect-square overflow-hidden rounded-md border bg-muted/30 flex items-center justify-center">
                                                    {isImage ? (
                                                        <img
                                                            src={`/storage/${path}`}
                                                            alt={`Foto ${index + 1}`}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                            onError={(e) => {
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    e.currentTarget.style.display = 'none';
                                                                    const fallback = document.createElement('div');
                                                                    fallback.className = 'flex flex-col items-center gap-2 text-muted-foreground';
                                                                    fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off h-8 w-8"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" x2="6" y1="13.5" y2="21"/><line x1="18" x2="21" y1="12" y2="15"/><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.05-.22 1.41-.59"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/></svg><span class="text-[10px] break-all px-2 text-center">${path.split('/').pop()}</span>`;
                                                                    parent.appendChild(fallback);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-muted-foreground p-2">
                                                            <FileUp className="h-8 w-8" />
                                                            <span className="text-[10px] break-all text-center">{path.split('/').pop()}</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingPhoto(path)}
                                                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 z-10"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                    {/* Selected Photos */}
                                    {selectedPhotos.map((photo, index) => (
                                        <div key={`selected-${index}`} className="group relative aspect-square overflow-hidden rounded-md border">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Foto baru ${index + 1}`}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedPhoto(index)}
                                                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 z-10"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button visible if less than 10 total */}
                                    {(((assistance?.photo_paths?.length || 0) - photosToRemove.length) + selectedPhotos.length) < 10 && (
                                        <button
                                            type="button"
                                            onClick={handlePhotoSelect}
                                            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/50 text-muted-foreground transition-colors hover:bg-muted"
                                        >
                                            <ImagePlus className="h-6 w-6" />
                                            <span className="text-xs font-medium">Tambah Foto</span>
                                        </button>
                                    )}
                                </div>
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: JPG, PNG, WEBP (Maks. 5MB/foto, maksimal 10 foto)
                                </p>
                            </div>
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
                            {assistance ? 'Simpan Perubahan' : 'Tambah Bantuan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
