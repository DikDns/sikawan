import { getPhotoUrl } from '@/utils/household-formatters';
import { useState } from 'react';

interface PhotoGalleryProps {
    photos: unknown[];
    alt: string;
}

export default function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    // Filter out photos that don't have valid URLs
    const validPhotos = photos.filter((p) => getPhotoUrl(p) !== null);

    // Don't render if there are no valid photos
    if (validPhotos.length === 0) {
        return null;
    }

    const mainUrl = getPhotoUrl(validPhotos[activePhotoIndex]);

    // Safety check: if somehow mainUrl is still null, don't render
    if (!mainUrl) {
        return null;
    }

    return (
        <div>
            <div className="overflow-hidden rounded-lg border border-border">
                <img
                    src={mainUrl}
                    alt={alt}
                    className="aspect-video w-full object-cover"
                />
            </div>
            {validPhotos.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                    {validPhotos.slice(0, 8).map((p, idx) => {
                        const url = getPhotoUrl(p);
                        if (!url) return null;
                        const isActive = idx === activePhotoIndex;
                        return (
                            <button
                                type="button"
                                key={idx}
                                onClick={() => setActivePhotoIndex(idx)}
                                className={`overflow-hidden rounded-md border ${
                                    isActive
                                        ? 'border-primary ring-2 ring-primary/40'
                                        : 'border-border'
                                }`}
                            >
                                <img
                                    src={url}
                                    alt={`Foto ${idx + 1}`}
                                    className="h-20 w-full object-cover"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
