import { csrfFetch } from '@/lib/csrf';
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

    // Step 2: General Info
    generalInfo?: {
        dataCollectionDate?: string;
        address?: string;
        provinceId?: string;
        provinceName?: string;
        regencyId?: string;
        regencyName?: string;
        districtId?: string;
        districtName?: string;
        villageId?: string;
        villageName?: string;
        ownershipStatusBuilding?: string;
        ownershipStatusLand?: string;
        buildingLegalStatus?: string;
        landLegalStatus?: string;
        nik?: string;
        headOfHouseholdName?: string;
        mainOccupation?: string;
        income?: string;
        householdStatus?: string;
        numberOfHouseholds?: number;
        maleMembers?: number;
        femaleMembers?: number;
        disabledMembers?: number;
        totalMembers?: number;
    };

    // Step 3: Technical Data
    technicalData?: {
        // A.1 KETERATURAN BANGUNAN HUNIAN
        hasRoadAccess?: boolean;
        roadWidthCategory?: string;
        facadeFacesRoad?: boolean;
        facesWaterbody?: boolean | 'NONE';
        inSetbackArea?: boolean | 'NONE';
        inHazardArea?: boolean;

        // A.2 KELAYAKAN BANGUNAN HUNIAN
        buildingLengthM?: number;
        buildingWidthM?: number;
        floorCount?: number;
        floorHeightM?: number;

        // Material & Kondisi
        roofMaterial?: string;
        roofCondition?: string;
        wallMaterial?: string;
        wallCondition?: string;
        floorMaterial?: string;
        floorCondition?: string;

        // A.3 AKSES AIR MINUM
        waterSource?: string;
        waterDistanceToSepticM?: number;
        waterDistanceCategory?: string;
        waterFulfillment?: string;

        // A.4 PENGELOLAAN SANITASI
        defecationPlace?: string;
        toiletType?: string;
        sewageDisposal?: string;

        // A.5 PENGELOLAAN SAMPAH
        wasteDisposalPlace?: string;
        wasteCollectionFrequency?: string;

        // SUMBER LISTRIK
        electricitySource?: string;
        electricityPowerWatt?: number;
        electricityConnected?: boolean;
    };

    // Step 4: Map Location
    mapLocation?: {
        latitude?: number | string;
        longitude?: number | string;
    };

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
            // Create a serializable version for comparison (include generalInfo, technicalData, and mapLocation!)
            const serializableData = {
                photos: draftData.photos.map((photo) => ({
                    id: photo.id,
                    uploaded: photo.uploaded || false,
                    path: photo.path,
                })),
                generalInfo: draftData.generalInfo,
                technicalData: draftData.technicalData,
                mapLocation: draftData.mapLocation,
                householdId: draftData.householdId,
            };
            const dataString = JSON.stringify(serializableData);

            // Skip if data hasn't changed since last save
            if (lastSavedDraft === dataString) {
                console.log('⏭️ Skipping save - no changes detected');
                resolve();
                return;
            }

            // Check if there's any data to save
            const hasNewFiles = draftData.photos.some(
                (photo) => photo.file && !photo.uploaded,
            );
            const hasGeneralInfo =
                draftData.generalInfo &&
                Object.keys(draftData.generalInfo).length > 0;
            const hasTechnicalData =
                draftData.technicalData &&
                Object.keys(draftData.technicalData).length > 0;
            const hasMapLocation =
                draftData.mapLocation &&
                Object.keys(draftData.mapLocation).length > 0;
            const hasExistingHousehold = !!draftData.householdId;

            // Skip if there's nothing to save
            if (
                !hasNewFiles &&
                !hasGeneralInfo &&
                !hasTechnicalData &&
                !hasMapLocation &&
                !hasExistingHousehold
            ) {
                console.log('⏭️ Skipping save - no data to save');
                resolve();
                return;
            }

            console.log('💾 Saving draft...', {
                hasNewFiles,
                hasGeneralInfo,
                hasTechnicalData,
                hasMapLocation,
                hasExistingHousehold,
                generalInfo: draftData.generalInfo,
                technicalData: draftData.technicalData,
                mapLocation: draftData.mapLocation,
            });

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

                // Add general info data
                if (draftData.generalInfo) {
                    formData.append(
                        'general_info',
                        JSON.stringify(draftData.generalInfo),
                    );
                }

                // Add technical data
                if (draftData.technicalData) {
                    formData.append(
                        'technical_data',
                        JSON.stringify(draftData.technicalData),
                    );
                }

                // Add map location data
                if (draftData.mapLocation) {
                    formData.append(
                        'map_location',
                        JSON.stringify(draftData.mapLocation),
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
                                generalInfo?: HouseholdDraftData['generalInfo'];
                                technicalData?: HouseholdDraftData['technicalData'];
                                mapLocation?: HouseholdDraftData['mapLocation'];
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
                                generalInfo:
                                    props.draft.generalInfo ||
                                    draftData.generalInfo,
                                technicalData:
                                    props.draft.technicalData ||
                                    draftData.technicalData,
                                mapLocation:
                                    props.draft.mapLocation ||
                                    draftData.mapLocation,
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
                                generalInfo: updatedData.generalInfo,
                                technicalData: updatedData.technicalData,
                                mapLocation: updatedData.mapLocation,
                                householdId: updatedData.householdId,
                            };
                            setLastSavedDraft(
                                JSON.stringify(updatedSerializable),
                            );
                            console.log('✅ Draft saved successfully!');
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
            const response = await csrfFetch('/households/draft', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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
                    generalInfo: data.draft.generalInfo,
                    technicalData: data.draft.technicalData,
                    mapLocation: {
                        latitude: parseFloat(
                            data.draft.mapLocation.latitude.toString(),
                        ),
                        longitude: parseFloat(
                            data.draft.mapLocation.longitude.toString(),
                        ),
                    },
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
                    generalInfo: draftData.generalInfo,
                    technicalData: draftData.technicalData,
                    mapLocation: draftData.mapLocation,
                    householdId: draftData.householdId,
                };
                setLastSavedDraft(JSON.stringify(serializableData));
            }
        } catch (error) {
            // Silently handle errors - no draft exists yet
            console.debug('Error loading draft:', error);
        }
    }, []);

    const [isValidating, setIsValidating] = useState(false);

    // Validate localStorage draft against server
    // Returns true if draft is valid, false if cleared
    const validateAndSyncDraft = useCallback(async (): Promise<boolean> => {
        if (typeof window === 'undefined') return true;

        const localData = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!localData) return true; // No local draft, nothing to validate

        try {
            const parsed = JSON.parse(localData);
            if (!parsed.householdId) return true; // No ID yet, nothing to validate

            setIsValidating(true);

            // Check if household exists and is still a draft
            const response = await csrfFetch(
                `/households/${parsed.householdId}/validate-draft`,
            );

            if (!response.ok) {
                // Household doesn't exist or is not accessible - clear local storage
                console.warn(
                    '⚠️ Draft household invalid (status: ' +
                        response.status +
                        '), clearing local storage',
                );
                localStorage.removeItem(DRAFT_STORAGE_KEY);
                setDraftData({ photos: [] });
                setIsValidating(false);
                return false;
            }

            const data = await response.json();
            if (!data.valid) {
                // Draft is no longer valid (not_draft, not_owner, etc.)
                console.warn(
                    '⚠️ Draft household invalid (reason: ' +
                        data.reason +
                        '), clearing local storage',
                );
                localStorage.removeItem(DRAFT_STORAGE_KEY);
                setDraftData({ photos: [] });
                setIsValidating(false);
                return false;
            }

            setIsValidating(false);
            return true;
        } catch (error) {
            console.debug('Error validating draft:', error);
            setIsValidating(false);
            return true; // Don't clear on network errors, let it fail later
        }
    }, []);

    return {
        draftData,
        updateDraft,
        clearDraft,
        loadLastDraft,
        saveDraft,
        isSaving,
        validateAndSyncDraft,
        isValidating,
    };
}
