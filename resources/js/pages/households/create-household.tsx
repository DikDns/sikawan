import MultiStepForm from '@/components/household/multi-step-form';
import PhotoStep from '@/components/household/photo-step';
import {
    useHouseholdDraft,
    type HouseholdDraftData,
} from '@/hooks/use-household-draft';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type PhotoFile = HouseholdDraftData['photos'][number];

interface Props {
    draft?: {
        householdId: number;
        photos: Array<{
            id: string;
            path: string;
            preview: string;
            uploaded: boolean;
        }>;
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
    const { updateDraft, saveDraft, isSaving } = useHouseholdDraft();
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
        try {
            // Save draft before moving to next step
            await saveDraft();

            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            // Error saving draft - show error message or prevent navigation
            console.error('Failed to save draft:', error);
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
                return <div>Informasi Umum (Coming Soon)</div>;
            case 3:
                return <div>Data Teknis (Coming Soon)</div>;
            case 4:
                return <div>Lokasi Peta (Coming Soon)</div>;
            case 5:
                return <div>Bantuan (Coming Soon)</div>;
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title="Tambah Data Rumah" />
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
