import GeneralInfoStep from '@/components/household/general-info-step';
import MapLocationStep from '@/components/household/map-location-step';
import MultiStepForm from '@/components/household/multi-step-form';
import PhotoStep from '@/components/household/photo-step';
import TechnicalDataStep from '@/components/household/technical-data-step';
import {
    useHouseholdDraft,
    type HouseholdDraftData,
} from '@/hooks/use-household-draft';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

type PhotoFile = HouseholdDraftData['photos'][number];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Tambah Rumah', href: '/households/create' },
];

interface Props {
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
    } | null;
}

const STEPS = [
    { id: 'photo', title: 'Photo', number: 1 },
    { id: 'general', title: 'Informasi Umum', number: 2 },
    { id: 'technical', title: 'Data Teknis', number: 3 },
    { id: 'map', title: 'Lokasi Peta', number: 4 },
    { id: 'assistance', title: 'Bantuan', number: 5 },
];

export default function CreateHousehold({ draft: initialDraft }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const { updateDraft, saveDraft, isSaving, draftData } = useHouseholdDraft();
    const [photos, setPhotos] = useState<PhotoFile[]>(() => {
        // Initialize photos from initialDraft if available
        if (initialDraft) {
            return initialDraft.photos.map((photo) => ({
                id: photo.id,
                preview: photo.preview,
                uploaded: true,
                path: photo.path,
            }));
        }
        return [];
    });

    // Load draft on mount
    useEffect(() => {
        if (initialDraft) {
            const draftPhotos: PhotoFile[] = initialDraft.photos.map(
                (photo) => ({
                    id: photo.id,
                    preview: photo.preview,
                    uploaded: true,
                    path: photo.path,
                }),
            );
            updateDraft({
                photos: draftPhotos,
                generalInfo: initialDraft.generalInfo,
                technicalData: initialDraft.technicalData,
                mapLocation: initialDraft.mapLocation,
                householdId: initialDraft.householdId,
                lastSaved: initialDraft.lastSaved,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update draft when photos change
    useEffect(() => {
        updateDraft({ photos });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos]);

    const handleNext = async () => {
        console.log('🚀 handleNext called', {
            currentStep,
            draftData: {
                photos: draftData.photos.length,
                generalInfo: draftData.generalInfo,
                householdId: draftData.householdId,
            },
        });

        try {
            // Save draft before moving to next step
            await saveDraft();

            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            // Error saving draft - show error message or prevent navigation
            console.error('❌ Failed to save draft:', error);
            // Optionally: show toast notification or error message to user
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        router.visit('/households');
    };

    const handlePhotosChange = (newPhotos: PhotoFile[]) => {
        setPhotos(newPhotos);
    };

    const handleMapLocationChange = useCallback(
        (data: HouseholdDraftData['mapLocation']) => {
            console.log('📝 MapLocationStep onChange called', data);
            // Update draft with map location
            updateDraft({ mapLocation: data });
        },
        [updateDraft],
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PhotoStep
                        photos={photos}
                        onPhotosChange={handlePhotosChange}
                    />
                );
            case 2:
                return (
                    <GeneralInfoStep
                        data={draftData.generalInfo || {}}
                        onChange={(data) => {
                            console.log(
                                '📝 GeneralInfoStep onChange called',
                                data,
                            );
                            // Update draft with general info data
                            updateDraft({ generalInfo: data });
                        }}
                    />
                );
            case 3:
                return (
                    <TechnicalDataStep
                        data={draftData.technicalData || {}}
                        onChange={(data) => {
                            console.log(
                                '📝 TechnicalDataStep onChange called',
                                data,
                            );
                            // Update draft with technical data
                            updateDraft({ technicalData: data });
                        }}
                    />
                );
            case 4:
                return (
                    <MapLocationStep
                        data={draftData.mapLocation || {}}
                        onChange={handleMapLocationChange}
                        provinceId={draftData.generalInfo?.provinceId}
                        provinceName={draftData.generalInfo?.provinceName}
                        regencyId={draftData.generalInfo?.regencyId}
                        regencyName={draftData.generalInfo?.regencyName}
                        districtId={draftData.generalInfo?.districtId}
                        districtName={draftData.generalInfo?.districtName}
                        villageId={draftData.generalInfo?.villageId}
                        villageName={draftData.generalInfo?.villageName}
                    />
                );
            case 5:
                return <div>Bantuan (Coming Soon)</div>;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Rumah" />
            <MultiStepForm
                title="Tambah Data Rumah"
                steps={STEPS}
                currentStep={currentStep}
                onClose={handleClose}
                onNext={handleNext}
                onPrevious={handlePrevious}
                canGoNext={currentStep < STEPS.length}
                canGoPrevious={currentStep > 1}
                isLoading={isSaving}
            >
                {renderStepContent()}
            </MultiStepForm>
        </AppLayout>
    );
}
