import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

const DRAFT_STORAGE_KEY = 'household_draft';

export interface HouseholdDraftData {
    // Step 1: Photos
    photos: Array<{
        id: string;
        file?: File;
        preview: string;
        uploaded?: boolean;
        path?: string;
    }>;

    // Step 2: General Info (will be added later)
    // Step 3: Technical Data (will be added later)
    // Step 4: Map Location (will be added later)
    // Step 5: Assistance (will be added later)

    // Metadata
    householdId?: number;
    lastSaved?: string;
}

export function useHouseholdDraft() {
    const [draftData, setDraftData] = useState<HouseholdDraftData>(() => {
        // Load from localStorage on init
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return { photos: [] };
                }
            }
        }
        return { photos: [] };
    });

    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedDraft, setLastSavedDraft] = useState<string | null>(null);

    // Save to localStorage immediately
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        }
    }, [draftData]);

    // Manual save function - call this when user clicks Next button
    // Returns a Promise that resolves when save is complete
    const saveDraft = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Create a serializable version for comparison
            const serializableData = {
                photos: draftData.photos.map((photo) => ({
                    id: photo.id,
                    uploaded: photo.uploaded || false,
                    path: photo.path,
                })),
                householdId: draftData.householdId,
            };
            const dataString = JSON.stringify(serializableData);

            // Skip if data hasn't changed since last save
            if (lastSavedDraft === dataString) {
                resolve();
                return;
            }

            // Only save if there are new files to upload OR if we have an existing household
            const hasNewFiles = draftData.photos.some(
                (photo) => photo.file && !photo.uploaded,
            );

            if (!hasNewFiles && !draftData.householdId) {
                // No new files and no existing household, skip save
                resolve();
                return;
            }

            setIsSaving(true);
            try {
                // Prepare FormData for file uploads
                const formData = new FormData();

                // Add new photo files
                const newPhotos = draftData.photos.filter(
                    (photo) => photo.file && !photo.uploaded,
                );
                newPhotos.forEach((photo) => {
                    if (photo.file) {
                        formData.append('photo_files[]', photo.file);
                    }
                });

                // Add metadata - only include photos that are uploaded (have numeric ID from DB)
                // Photos with string ID are new and haven't been saved yet
                const photosMetadata = draftData.photos
                    .filter(
                        (photo) =>
                            photo.uploaded &&
                            photo.id &&
                            !isNaN(Number(photo.id)),
                    )
                    .map((photo) => ({
                        id: Number(photo.id), // Ensure ID is numeric
                        uploaded: true,
                        path: photo.path,
                    }));
                formData.append('photos', JSON.stringify(photosMetadata));

                if (draftData.householdId) {
                    formData.append(
                        'household_id',
                        draftData.householdId.toString(),
                    );
                }

                // Use router.post with redirect - Inertia will handle the redirect
                router.post('/households/draft', formData, {
                    preserveState: true,
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: (page) => {
                        // After redirect, page.props will contain the draft data from create() method
                        const props = page.props as {
                            householdId?: number;
                            draft?: {
                                householdId: number;
                                photos: Array<{
                                    id: string;
                                    path: string;
                                    preview: string;
                                    uploaded: boolean;
                                }>;
                                lastSaved: string;
                            };
                        };

                        if (props?.draft) {
                            const householdId = props.draft.householdId;
                            const backendPhotos = props.draft.photos || [];

                            const updatedData = {
                                ...draftData,
                                householdId,
                                lastSaved:
                                    props.draft.lastSaved ||
                                    new Date().toISOString(),
                                photos: backendPhotos.map(
                                    (photo: {
                                        id: string;
                                        path: string;
                                        preview: string;
                                        uploaded: boolean;
                                    }) => ({
                                        id: photo.id.toString(),
                                        preview: photo.preview,
                                        uploaded: true,
                                        path: photo.path,
                                    }),
                                ),
                            };

                            setDraftData(updatedData);

                            // Update last saved draft string after successful save
                            const updatedSerializable = {
                                photos: updatedData.photos.map(
                                    (photo: {
                                        id: string;
                                        uploaded: boolean;
                                        path?: string;
                                    }) => ({
                                        id: photo.id,
                                        uploaded: photo.uploaded || false,
                                        path: photo.path,
                                    }),
                                ),
                                householdId: updatedData.householdId,
                            };
                            setLastSavedDraft(
                                JSON.stringify(updatedSerializable),
                            );
                        }
                        setIsSaving(false);
                        resolve();
                    },
                    onError: (errors) => {
                        console.error('Error saving draft:', errors);
                        setIsSaving(false);
                        reject(errors);
                    },
                    onFinish: () => {
                        setIsSaving(false);
                    },
                });
            } catch (error) {
                console.error('Error saving draft:', error);
                setIsSaving(false);
                reject(error);
            }
        });
    }, [draftData, lastSavedDraft]);

    const updateDraft = useCallback((updates: Partial<HouseholdDraftData>) => {
        setDraftData((prev) => ({
            ...prev,
            ...updates,
        }));
    }, []);

    const clearDraft = useCallback(() => {
        setDraftData({ photos: [] });
        setLastSavedDraft(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
    }, []);

    const loadLastDraft = useCallback(async () => {
        try {
            // Use fetch for API endpoint (not page navigation)
            const response = await fetch('/households/draft', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                // 404 or other errors - no draft exists yet, silently handle
                if (response.status !== 404) {
                    console.debug('Error loading draft:', response.status);
                }
                return;
            }

            const data = await response.json();
            if (data?.draft) {
                // Convert backend draft format to HouseholdDraftData format
                const draftData: HouseholdDraftData = {
                    photos: data.draft.photos.map(
                        (photo: {
                            id: string;
                            path: string;
                            preview: string;
                            uploaded: boolean;
                        }) => ({
                            id: photo.id,
                            preview: photo.preview,
                            uploaded: photo.uploaded,
                            path: photo.path,
                        }),
                    ),
                    householdId: data.draft.householdId,
                    lastSaved: data.draft.lastSaved,
                };
                setDraftData(draftData);

                // Update lastSavedDraft to prevent unnecessary saves
                const serializableData = {
                    photos: draftData.photos.map((photo) => ({
                        id: photo.id,
                        uploaded: photo.uploaded || false,
                        path: photo.path,
                    })),
                    householdId: draftData.householdId,
                };
                setLastSavedDraft(JSON.stringify(serializableData));
            }
        } catch (error) {
            // Silently handle errors - no draft exists yet
            console.debug('Error loading draft:', error);
        }
    }, []);

    return {
        draftData,
        updateDraft,
        clearDraft,
        loadLastDraft,
        saveDraft,
        isSaving,
    };
}
