import { cn } from '@/lib/utils';
import { Plus, Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PhotoFile {
    id: string;
    file?: File;
    preview: string;
    uploaded?: boolean;
    path?: string;
}

interface PhotoStepProps {
    photos: PhotoFile[];
    onPhotosChange: (photos: PhotoFile[]) => void;
}

export default function PhotoStep({ photos, onPhotosChange }: PhotoStepProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newPhotos: PhotoFile[] = acceptedFiles.map((file) => ({
                id: Math.random().toString(36).substring(7),
                file,
                preview: URL.createObjectURL(file),
            }));

            onPhotosChange([...photos, ...newPhotos]);
        },
        [photos, onPhotosChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: true,
    });

    const removePhoto = (id: string) => {
        const photoToRemove = photos.find((p) => p.id === id);
        if (photoToRemove) {
            URL.revokeObjectURL(photoToRemove.preview);
        }
        onPhotosChange(photos.filter((p) => p.id !== id));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Foto Rumah
                </h3>
                <p className="text-sm text-muted-foreground">
                    Upload foto rumah untuk dokumentasi. Maksimal 5MB per foto.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Upload Placeholder */}
                <div
                    {...getRootProps()}
                    className={cn(
                        'flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                        isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50',
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            Tambah Photo
                        </span>
                    </div>
                </div>

                {/* Photo Previews */}
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative h-48 overflow-hidden rounded-lg border bg-muted"
                    >
                        <img
                            src={photo.preview}
                            alt={`Preview ${photo.id}`}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {photos.length === 0 && (
                <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-8 text-center">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Belum ada foto yang diupload. Klik area di atas untuk
                        menambah foto.
                    </p>
                </div>
            )}
        </div>
    );
}
