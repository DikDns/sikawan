import AssistanceStep from '@/components/household/assistance-step';
import GeneralInfoStep from '@/components/household/general-info-step';
import { validateGeneralInfo } from '@/components/household/general-info-step/validation';
import MapLocationStep from '@/components/household/map-location-step';
import MultiStepForm from '@/components/household/multi-step-form';
import PhotoStep from '@/components/household/photo-step';
import TechnicalDataStep from '@/components/household/technical-data-step';
import {
    useHouseholdDraft,
    type HouseholdDraftData,
} from '@/hooks/use-household-draft';
import AppLayout from '@/layouts/app-layout';
import { csrfFetch } from '@/lib/csrf';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const {
        updateDraft,
        saveDraft,
        isSaving,
        draftData,
        clearDraft,
        validateAndSyncDraft,
    } = useHouseholdDraft();
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

    // Validate draft on mount - ensures localStorage draft is still valid on server
    useEffect(() => {
        const initializeDraft = async () => {
            setIsInitializing(true);

            // If we have server-provided draft, use it directly (it's fresh)
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
            } else {
                // No server draft - validate localStorage draft in case it's stale
                const isValid = await validateAndSyncDraft();
                if (!isValid) {
                    // localStorage was cleared, start fresh
                    console.log(
                        '🔄 localStorage draft was invalid, starting fresh',
                    );
                }
            }

            setIsInitializing(false);
        };

        initializeDraft();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update draft when photos change
    useEffect(() => {
        updateDraft({ photos });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos]);

    const handleFinalize = async () => {
        if (!draftData.householdId) {
            toast.error('Household ID tidak ditemukan');
            return;
        }

        if (
            !confirm('Apakah Anda yakin ingin menyimpan pendataan rumah ini?')
        ) {
            return;
        }

        setIsFinalizing(true);

        try {
            // Save draft first
            await saveDraft();

            const response = await csrfFetch(
                `/households/${draftData.householdId}/finalize`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }

            const data = await response.json();
            toast.success(data.message || 'Pendataan rumah berhasil disimpan');

            // Clear draft from local storage
            clearDraft();

            // Redirect to household list after 1.5 seconds
            setTimeout(() => {
                router.visit('/households');
            }, 500);
        } catch (error) {
            console.error('Error finalizing household:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan pendataan rumah';
            toast.error(errorMessage);
            setIsFinalizing(false);
        }
    };

    const handleNext = async () => {
        console.log('🚀 handleNext called', {
            currentStep,
            draftData: {
                photos: draftData.photos.length,
                generalInfo: draftData.generalInfo,
                householdId: draftData.householdId,
            },
        });

        // Validate General Info Step before proceeding
        if (currentStep === 2 && draftData.generalInfo) {
            const validation = validateGeneralInfo(draftData.generalInfo);
            if (!validation.isValid) {
                const firstError = Object.values(validation.errors)[0];
                toast.error(
                    firstError || 'Mohon lengkapi data yang wajib diisi',
                );
                return;
            }
        }

        // If last step, finalize instead of moving to next step
        if (currentStep === STEPS.length) {
            await handleFinalize();
            return;
        }

        try {
            // Save draft before moving to next step
            await saveDraft();

            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            // Error saving draft - show error message or prevent navigation
            console.error('❌ Failed to save draft:', error);
            toast.error('Gagal menyimpan data. Silakan coba lagi.');
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
                return <AssistanceStep householdId={draftData.householdId} />;
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
                canGoNext={true}
                canGoPrevious={currentStep > 1}
                isLoading={isSaving || isFinalizing || isInitializing}
                nextButtonText={
                    currentStep === STEPS.length ? 'Simpan' : undefined
                }
            >
                {renderStepContent()}
            </MultiStepForm>
        </AppLayout>
    );
}
