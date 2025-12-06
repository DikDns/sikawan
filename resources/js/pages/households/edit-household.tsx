import AssistanceStep from '@/components/household/assistance-step';
import GeneralInfoStep from '@/components/household/general-info-step';
import { validateGeneralInfo } from '@/components/household/general-info-step/validation';
import MapLocationStep from '@/components/household/map-location-step';
import MultiStepForm from '@/components/household/multi-step-form';
import PhotoStep from '@/components/household/photo-step';
import TechnicalDataStep from '@/components/household/technical-data-step';
import {
    useHouseholdEdit,
    type HouseholdEditData,
} from '@/hooks/use-household-edit';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type PhotoFile = HouseholdEditData['photos'][number];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Edit Rumah', href: '/households/{id}/edit' },
];

interface Props {
    household: {
        id: number;
        // General Info
        head_name: string;
        nik?: string;
        survey_date?: string;
        address_text?: string;
        province_id?: string;
        province_name?: string;
        regency_id?: string;
        regency_name?: string;
        district_id?: string;
        district_name?: string;
        village_id?: string;
        village_name?: string;
        rt_rw?: string;
        latitude?: number;
        longitude?: number;

        // Ownership
        ownership_status_building?: string;
        ownership_status_land?: string;
        building_legal_status?: string;
        land_legal_status?: string;

        // Household Members
        status_mbr?: string;
        kk_count?: number;
        member_total?: number;
        male_count?: number;
        female_count?: number;
        disabled_count?: number;

        // Non-Physical Data
        main_occupation?: string;
        monthly_income_idr?: string; // '<1jt', '1-3jt', '3-5jt', '>5jt'
        health_facility_used?: string;
        health_facility_location?: string;
        education_facility_location?: string;

        // Technical Data
        technical_data?: {
            has_road_access?: boolean;
            road_width_category?: string;
            facade_faces_road?: boolean;
            faces_waterbody?: boolean;
            in_setback_area?: boolean;
            in_hazard_area?: boolean;
            building_length_m?: number;
            building_width_m?: number;
            floor_count?: number;
            floor_height_m?: number;
            roof_material?: string;
            roof_condition?: string;
            wall_material?: string;
            wall_condition?: string;
            floor_material?: string;
            floor_condition?: string;
            water_source?: string;
            water_distance_to_septic_m?: number;
            water_distance_category?: string;
            water_fulfillment?: string;
            defecation_place?: string;
            toilet_type?: string;
            sewage_disposal?: string;
            waste_disposal_place?: string;
            waste_collection_frequency?: string;
            electricity_source?: string;
            electricity_power_watt?: number;
            electricity_connected?: boolean;
        };

        // Photos
        photos?: Array<{
            id: string;
            file_path: string;
            caption?: string;
            order_index?: number;
        }>;
    };
}

const STEPS = [
    { id: 'photo', title: 'Photo', number: 1 },
    { id: 'general', title: 'Informasi Umum', number: 2 },
    { id: 'technical', title: 'Data Teknis', number: 3 },
    { id: 'map', title: 'Lokasi Peta', number: 4 },
    { id: 'assistance', title: 'Bantuan', number: 5 },
];

export default function EditHousehold({ household }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const {
        updateData,
        saveData,
        isSaving: isSavingFromHook,
        editData,
    } = useHouseholdEdit(household.id);
    const [photos, setPhotos] = useState<PhotoFile[]>(() => {
        // Initialize photos from household
        if (household.photos && household.photos.length > 0) {
            return household.photos.map((photo) => ({
                id: photo.id.toString(),
                preview: `/storage/${photo.file_path}`,
                uploaded: true,
                path: photo.file_path,
            }));
        }
        return [];
    });

    // Initialize edit data from household
    useEffect(() => {
        console.log('🔄 Initializing edit data from household:', {
            householdId: household.id,
            hasPhotos: !!household.photos?.length,
            hasTechnicalData: !!household.technical_data,
            hasLatLng:
                household.latitude !== null && household.longitude !== null,
        });

        const generalInfo: HouseholdEditData['generalInfo'] = {
            dataCollectionDate: household.survey_date,
            address: household.address_text,
            provinceId: household.province_id,
            provinceName: household.province_name,
            regencyId: household.regency_id,
            regencyName: household.regency_name,
            districtId: household.district_id,
            districtName: household.district_name,
            villageId: household.village_id,
            villageName: household.village_name,
            rtRw: household.rt_rw,
            ownershipStatusBuilding: household.ownership_status_building,
            ownershipStatusLand: household.ownership_status_land,
            buildingLegalStatus: household.building_legal_status,
            landLegalStatus: household.land_legal_status,
            nik: household.nik,
            headOfHouseholdName: household.head_name,
            mainOccupation: household.main_occupation,
            income: household.monthly_income_idr,
            householdStatus: household.status_mbr,
            numberOfHouseholds: household.kk_count,
            maleMembers: household.male_count,
            femaleMembers: household.female_count,
            disabledMembers: household.disabled_count,
            totalMembers: household.member_total,
            // Facility fields
            educationFacilityLocation: household.education_facility_location,
            healthFacilityUsed: household.health_facility_used,
            healthFacilityLocation: household.health_facility_location,
        };

        console.log('📋 General Info prepared:', generalInfo);

        const technicalData: HouseholdEditData['technicalData'] =
            household.technical_data
                ? {
                      hasRoadAccess: household.technical_data.has_road_access,
                      roadWidthCategory:
                          household.technical_data.road_width_category,
                      facadeFacesRoad:
                          household.technical_data.facade_faces_road,
                      facesWaterbody: household.technical_data.faces_waterbody,
                      inSetbackArea: household.technical_data.in_setback_area,
                      inHazardArea: household.technical_data.in_hazard_area,
                      buildingLengthM:
                          household.technical_data.building_length_m,
                      buildingWidthM: household.technical_data.building_width_m,
                      floorCount: household.technical_data.floor_count,
                      floorHeightM: household.technical_data.floor_height_m,
                      roofMaterial: household.technical_data.roof_material,
                      roofCondition: household.technical_data.roof_condition,
                      wallMaterial: household.technical_data.wall_material,
                      wallCondition: household.technical_data.wall_condition,
                      floorMaterial: household.technical_data.floor_material,
                      floorCondition: household.technical_data.floor_condition,
                      waterSource: household.technical_data.water_source,
                      waterDistanceToSepticM:
                          household.technical_data.water_distance_to_septic_m,
                      waterDistanceCategory:
                          household.technical_data.water_distance_category,
                      waterFulfillment:
                          household.technical_data.water_fulfillment,
                      defecationPlace:
                          household.technical_data.defecation_place,
                      toiletType: household.technical_data.toilet_type,
                      sewageDisposal: household.technical_data.sewage_disposal,
                      wasteDisposalPlace:
                          household.technical_data.waste_disposal_place,
                      wasteCollectionFrequency:
                          household.technical_data.waste_collection_frequency,
                      electricitySource:
                          household.technical_data.electricity_source,
                      electricityPowerWatt:
                          household.technical_data.electricity_power_watt,
                      electricityConnected:
                          household.technical_data.electricity_connected,
                  }
                : undefined;

        const mapLocation: HouseholdEditData['mapLocation'] =
            household.latitude !== null && household.longitude !== null
                ? {
                      latitude: household.latitude,
                      longitude: household.longitude,
                  }
                : undefined;

        const householdPhotos: PhotoFile[] = household.photos
            ? household.photos.map((photo) => ({
                  id: photo.id.toString(),
                  preview: `/storage/${photo.file_path}`,
                  uploaded: true,
                  path: photo.file_path,
              }))
            : [];

        const initialData = {
            photos: householdPhotos,
            generalInfo,
            technicalData,
            mapLocation,
        };

        console.log('💾 Updating editData with:', {
            photosCount: initialData.photos.length,
            hasGeneralInfo: !!initialData.generalInfo,
            hasTechnicalData: !!initialData.technicalData,
            hasMapLocation: !!initialData.mapLocation,
            generalInfoKeys: Object.keys(initialData.generalInfo || {}),
        });

        updateData(initialData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update edit data when photos change
    useEffect(() => {
        updateData({ photos });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos]);

    const handleNext = async () => {
        // Validate General Info Step before proceeding
        if (currentStep === 2 && editData.generalInfo) {
            const validation = validateGeneralInfo(editData.generalInfo);
            if (!validation.isValid) {
                const firstError = Object.values(validation.errors)[0];
                toast.error(
                    firstError || 'Mohon lengkapi data yang wajib diisi',
                );
                return;
            }
        }

        // If last step, just save and redirect
        if (currentStep === STEPS.length) {
            await handleSave();
            return;
        }

        try {
            // Save data directly (no draft) and recalculate score
            // Use current editData which should have all the latest changes
            setIsSaving(true);

            console.log('🚀 handleNext - Saving data:', {
                currentStep,
                photosCount: editData.photos?.length || 0,
                hasGeneralInfo: !!editData.generalInfo,
                hasTechnicalData: !!editData.technicalData,
                hasMapLocation: !!editData.mapLocation,
            });

            await saveData(
                {
                    photos: photos, // Use photos state directly
                    generalInfo: editData.generalInfo,
                    technicalData: editData.technicalData,
                    mapLocation: editData.mapLocation,
                },
                {
                    onSuccess: () => {
                        toast.success('Data berhasil disimpan');
                        if (currentStep < STEPS.length) {
                            setCurrentStep(currentStep + 1);
                        }
                    },
                    onError: (errors) => {
                        console.error('Error saving:', errors);
                        toast.error('Gagal menyimpan data. Silakan coba lagi.');
                    },
                },
            );
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Gagal menyimpan data. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            await saveData(
                {
                    photos: editData.photos,
                    generalInfo: editData.generalInfo,
                    technicalData: editData.technicalData,
                    mapLocation: editData.mapLocation,
                },
                {
                    onSuccess: () => {
                        toast.success('Data rumah berhasil diperbarui');
                        router.visit(`/households/${household.id}`);
                    },
                    onError: (errors) => {
                        console.error('Error saving:', errors);
                        toast.error('Gagal menyimpan data. Silakan coba lagi.');
                    },
                },
            );
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Gagal menyimpan data. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClose = () => {
        router.visit(`/households`);
    };

    const handlePhotosChange = (newPhotos: PhotoFile[]) => {
        setPhotos(newPhotos);
    };

    const handleMapLocationChange = useCallback(
        (data: HouseholdEditData['mapLocation']) => {
            console.log('📝 MapLocationStep onChange called', data);
            updateData({ mapLocation: data });
        },
        [updateData],
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
                        data={editData.generalInfo || {}}
                        onChange={(data) => {
                            console.log(
                                '📝 GeneralInfoStep onChange called',
                                data,
                            );
                            updateData({ generalInfo: data });
                        }}
                    />
                );
            case 3:
                return (
                    <TechnicalDataStep
                        data={editData.technicalData || {}}
                        onChange={(data) => {
                            console.log(
                                '📝 TechnicalDataStep onChange called',
                                data,
                            );
                            updateData({ technicalData: data });
                        }}
                    />
                );
            case 4:
                return (
                    <MapLocationStep
                        data={editData.mapLocation || {}}
                        onChange={handleMapLocationChange}
                        provinceId={editData.generalInfo?.provinceId}
                        provinceName={editData.generalInfo?.provinceName}
                        regencyId={editData.generalInfo?.regencyId}
                        regencyName={editData.generalInfo?.regencyName}
                        districtId={editData.generalInfo?.districtId}
                        districtName={editData.generalInfo?.districtName}
                        villageId={editData.generalInfo?.villageId}
                        villageName={editData.generalInfo?.villageName}
                    />
                );
            case 5:
                return <AssistanceStep householdId={household.id} />;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Rumah - ${household.head_name}`} />
            <MultiStepForm
                title="Edit Data Rumah"
                steps={STEPS}
                currentStep={currentStep}
                onClose={handleClose}
                onNext={handleNext}
                onPrevious={handlePrevious}
                canGoNext={true}
                canGoPrevious={currentStep > 1}
                isLoading={isSaving || isSavingFromHook}
                nextButtonText={
                    currentStep === STEPS.length ? 'Simpan' : undefined
                }
            >
                {renderStepContent()}
            </MultiStepForm>
        </AppLayout>
    );
}
