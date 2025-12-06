import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export interface HouseholdEditData {
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
        rtRw?: string;
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
        // Facility fields
        educationFacilityLocation?: string;
        healthFacilityUsed?: string;
        healthFacilityLocation?: string;
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
}

export function useHouseholdEdit(householdId: number) {
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<HouseholdEditData>({
        photos: [],
    });

    // Save data directly to database (no draft)
    // This will also recalculate the score
    const saveData = useCallback(
        (
            data: Partial<HouseholdEditData>,
            options?: {
                onSuccess?: () => void;
                onError?: (errors: Record<string, string> | string) => void;
            },
        ): Promise<void> => {
            return new Promise((resolve, reject) => {
                // Merge data with current editData to ensure we have all data
                const mergedData: HouseholdEditData = {
                    photos: data.photos ?? editData.photos ?? [],
                    generalInfo: data.generalInfo ?? editData.generalInfo,
                    technicalData: data.technicalData ?? editData.technicalData,
                    mapLocation: data.mapLocation ?? editData.mapLocation,
                };

                // Update local state
                setEditData(mergedData);

                // Prepare FormData for file uploads
                const formData = new FormData();

                // Add new photo files
                const newPhotos = mergedData.photos.filter(
                    (photo) => photo.file && !photo.uploaded,
                );
                newPhotos.forEach((photo) => {
                    if (photo.file) {
                        formData.append('photo_files[]', photo.file);
                    }
                });

                // Add metadata - only include photos that are uploaded (have numeric ID from DB)
                const photosMetadata = mergedData.photos
                    .filter(
                        (photo) =>
                            photo.uploaded &&
                            photo.id &&
                            !isNaN(Number(photo.id)),
                    )
                    .map((photo) => ({
                        id: Number(photo.id),
                        uploaded: true,
                        path: photo.path,
                    }));
                formData.append('photos', JSON.stringify(photosMetadata));

                // Always add general info data - send empty object {} if undefined
                // This ensures backend receives the field and can process it
                formData.append(
                    'general_info',
                    JSON.stringify(mergedData.generalInfo || {}),
                );

                // Always add technical data - send empty object {} if undefined
                formData.append(
                    'technical_data',
                    JSON.stringify(mergedData.technicalData || {}),
                );

                // Always add map location data - send empty object {} if undefined
                formData.append(
                    'map_location',
                    JSON.stringify(mergedData.mapLocation || {}),
                );

                setIsSaving(true);

                // Debug: Log what we're sending
                console.log('💾 Saving household data:', {
                    householdId,
                    hasGeneralInfo: !!mergedData.generalInfo,
                    hasTechnicalData: !!mergedData.technicalData,
                    hasMapLocation: !!mergedData.mapLocation,
                    photosCount: mergedData.photos.length,
                    generalInfo: mergedData.generalInfo,
                    technicalData: mergedData.technicalData,
                    mapLocation: mergedData.mapLocation,
                });

                // Debug: Log FormData contents
                console.log('📦 FormData contents:', {
                    hasPhotos: formData.has('photos'),
                    hasGeneralInfo: formData.has('general_info'),
                    hasTechnicalData: formData.has('technical_data'),
                    hasMapLocation: formData.has('map_location'),
                    photosValue: formData.get('photos'),
                    generalInfoValue: formData.get('general_info'),
                    technicalDataValue: formData.get('technical_data'),
                    mapLocationValue: formData.get('map_location'),
                });

                // Use router.post with method spoofing for PUT
                // This is necessary because FormData with PUT doesn't work well with Inertia
                // Add _method field for Laravel method spoofing
                formData.append('_method', 'PUT');

                router.post(`/households/${householdId}`, formData, {
                    preserveState: true, // Preserve state to keep current step
                    preserveScroll: true,
                    forceFormData: true,
                    onSuccess: () => {
                        console.log('✅ Save successful');
                        setIsSaving(false);
                        options?.onSuccess?.();
                        resolve();
                    },
                    onError: (errors) => {
                        console.error('❌ Save error:', errors);
                        setIsSaving(false);
                        options?.onError?.(errors);
                        reject(errors);
                    },
                    onFinish: () => {
                        setIsSaving(false);
                    },
                });
            });
        },
        [householdId, editData],
    );

    const updateData = useCallback((updates: Partial<HouseholdEditData>) => {
        console.log('🔄 updateData called with:', {
            hasPhotos: !!updates.photos,
            hasGeneralInfo: !!updates.generalInfo,
            hasTechnicalData: !!updates.technicalData,
            hasMapLocation: !!updates.mapLocation,
            generalInfoKeys: updates.generalInfo
                ? Object.keys(updates.generalInfo)
                : [],
        });

        setEditData((prev) => {
            const newData = {
                ...prev,
                ...updates,
            };

            console.log('📊 New editData state:', {
                hasPhotos: !!newData.photos?.length,
                hasGeneralInfo: !!newData.generalInfo,
                hasTechnicalData: !!newData.technicalData,
                hasMapLocation: !!newData.mapLocation,
                generalInfoKeys: newData.generalInfo
                    ? Object.keys(newData.generalInfo)
                    : [],
            });

            return newData;
        });
    }, []);

    return {
        editData,
        updateData,
        saveData,
        isSaving,
    };
}
