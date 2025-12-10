/**
 * Utility functions for formatting household data
 */

import {
    BUILDING_LEGAL_STATUS_OPTIONS,
    HOUSEHOLD_STATUS_OPTIONS,
    INCOME_OPTIONS,
    LAND_LEGAL_STATUS_OPTIONS,
    MAIN_OCCUPATION_OPTIONS,
    OWNERSHIP_STATUS_OPTIONS,
} from '@/components/household/general-info-step/constants';
import {
    ELECTRICITY_SOURCE_OPTIONS,
    FLOOR_CONDITION_OPTIONS,
    FLOOR_MATERIAL_OPTIONS,
    ROAD_WIDTH_CATEGORY_OPTIONS,
    ROOF_CONDITION_OPTIONS,
    ROOF_MATERIAL_OPTIONS,
    WALL_CONDITION_OPTIONS,
    WALL_MATERIAL_OPTIONS,
    WATER_DISTANCE_CATEGORY_OPTIONS,
    WATER_FULFILLMENT_OPTIONS,
} from '@/components/household/technical-data-step/constants';

export const formatIncome = (value: string | number | null): string => {
    if (value === null || value === undefined || value === '') return '-';

    // Handle numeric values (new format)
    if (typeof value === 'number' || !isNaN(Number(value))) {
        const numValue = Number(value);
        if (numValue > 0) {
            return formatCurrency(numValue);
        }
        return '-';
    }

    // Handle legacy string values (old format)
    const option = INCOME_OPTIONS.find((opt) => opt.value === value);
    return option?.label || String(value);
};

export const formatCurrency = (value: number | null): string => {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export const getOwnershipLabel = (status: string | null): string => {
    if (!status) return '-';
    const option = OWNERSHIP_STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.label || '-';
};

export const getBuildingLegalStatusLabel = (status: string | null): string => {
    if (!status) return '-';
    const option = BUILDING_LEGAL_STATUS_OPTIONS.find(
        (opt) => opt.value === status,
    );
    return option?.label || '-';
};

export const getLandLegalStatusLabel = (status: string | null): string => {
    if (!status) return '-';
    const option = LAND_LEGAL_STATUS_OPTIONS.find(
        (opt) => opt.value === status,
    );
    return option?.label || '-';
};

// Deprecated: Use getBuildingLegalStatusLabel or getLandLegalStatusLabel instead
export const getLegalStatusLabel = (status: string | null): string => {
    if (!status) return '-';
    // Try building legal status first
    const buildingOption = BUILDING_LEGAL_STATUS_OPTIONS.find(
        (opt) => opt.value === status,
    );
    if (buildingOption) return buildingOption.label;
    // Then try land legal status
    const landOption = LAND_LEGAL_STATUS_OPTIONS.find(
        (opt) => opt.value === status,
    );
    return landOption?.label || '-';
};

export const getMainOccupationLabel = (occupation: string | null): string => {
    if (!occupation) return '-';
    const option = MAIN_OCCUPATION_OPTIONS.find(
        (opt) => opt.value === occupation,
    );
    return option?.label || '-';
};

export const getHouseholdStatusLabel = (status: string | null): string => {
    if (!status) return '-';
    const option = HOUSEHOLD_STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.label || '-';
};

export const getWaterSourceLabel = (source: string | null): string => {
    const labels: Record<string, string> = {
        SR_METERAN: 'Ledeng Meteran',
        SR_NONMETER: 'Ledeng Non Meter',
        SUMUR_BOR: 'Sumur Bor',
        SUMUR_TRL: 'Sumur Terlindungi',
        MATA_AIR_TRL: 'Mata Air Terlindungi',
        HUJAN: 'Air Hujan',
        KEMASAN: 'Air Kemasan',
        SUMUR_TAK_TRL: 'Sumur Tak Terlindungi',
        MATA_AIR_TAK_TRL: 'Mata Air Tak Terlindungi',
        SUNGAI: 'Sungai',
        TANGKI_MOBIL: 'Tangki Mobil',
    };
    return labels[source || ''] || '-';
};

export const getDefecationPlaceLabel = (place: string | null): string => {
    const labels: Record<string, string> = {
        PRIVATE_SHARED: 'Jamban Sendiri',
        PUBLIC: 'Jamban Umum',
        OPEN: 'Tidak Ada',
    };
    return labels[place || ''] || '-';
};

export const getToiletTypeLabel = (type: string | null): string => {
    const labels: Record<string, string> = {
        S_TRAP: 'Leher Angsa',
        NON_S_TRAP: 'Plengsengan',
    };
    return labels[type || ''] || '-';
};

export const getSewageLabel = (sewage: string | null): string => {
    const labels: Record<string, string> = {
        SEPTIC_IPAL: 'Septictank',
        NON_SEPTIC: 'Non Septictank',
    };
    return labels[sewage || ''] || '-';
};

export const getWasteDisposalLabel = (disposal: string | null): string => {
    const labels: Record<string, string> = {
        PRIVATE_BIN: 'Tempat Sampah Pribadi',
        COMMUNAL: 'Tempat Sampah Komunal',
        BURNT: 'Dibakar',
        OPENSPACE: 'Ruang Terbuka',
        WATERBODY: 'Ke Sungai/Laut',
    };
    return labels[disposal || ''] || '-';
};

export const getWasteFrequencyLabel = (frequency: string | null): string => {
    const labels: Record<string, string> = {
        GE2X_WEEK: '≥ 2x Seminggu',
        LT1X_WEEK: '< 1x Seminggu',
    };
    return labels[frequency || ''] || '-';
};

export const getRoofMaterialLabel = (material: string | null): string => {
    if (!material) return '-';
    const option = ROOF_MATERIAL_OPTIONS.find((opt) => opt.value === material);
    return option?.label || '-';
};

export const getRoofConditionLabel = (condition: string | null): string => {
    if (!condition) return '-';
    const option = ROOF_CONDITION_OPTIONS.find(
        (opt) => opt.value === condition,
    );
    return option?.label || '-';
};

export const getWallMaterialLabel = (material: string | null): string => {
    if (!material) return '-';
    const option = WALL_MATERIAL_OPTIONS.find((opt) => opt.value === material);
    return option?.label || '-';
};

export const getWallConditionLabel = (condition: string | null): string => {
    if (!condition) return '-';
    const option = WALL_CONDITION_OPTIONS.find(
        (opt) => opt.value === condition,
    );
    return option?.label || '-';
};

export const getFloorMaterialLabel = (material: string | null): string => {
    if (!material) return '-';
    const option = FLOOR_MATERIAL_OPTIONS.find((opt) => opt.value === material);
    return option?.label || '-';
};

export const getFloorConditionLabel = (condition: string | null): string => {
    if (!condition) return '-';
    const option = FLOOR_CONDITION_OPTIONS.find(
        (opt) => opt.value === condition,
    );
    return option?.label || '-';
};

export const getWaterFulfillmentLabel = (
    fulfillment: string | null,
): string => {
    if (!fulfillment) return '-';
    const option = WATER_FULFILLMENT_OPTIONS.find(
        (opt) => opt.value === fulfillment,
    );
    return option?.label || '-';
};

export const getElectricitySourceLabel = (source: string | null): string => {
    if (!source) return '-';
    const option = ELECTRICITY_SOURCE_OPTIONS.find(
        (opt) => opt.value === source,
    );
    return option?.label || '-';
};

export const getRoadWidthCategoryLabel = (category: string | null): string => {
    if (!category) return '-';
    const option = ROAD_WIDTH_CATEGORY_OPTIONS.find(
        (opt) => opt.value === category,
    );
    return option?.label || '-';
};

export const getWaterDistanceCategoryLabel = (
    category: string | null,
): string => {
    if (!category) return '-';
    const option = WATER_DISTANCE_CATEGORY_OPTIONS.find(
        (opt) => opt.value === category,
    );
    return option?.label || '-';
};

export const getPhotoUrl = (photo: unknown): string | null => {
    if (!photo) return null;
    if (typeof photo === 'string') return photo;
    const p = photo as Record<string, unknown>;
    const filePath =
        (typeof p.file_path === 'string' && p.file_path) ||
        (typeof p.path === 'string' && p.path) ||
        (typeof p.preview === 'string' && p.preview) ||
        (typeof p.url === 'string' && p.url) ||
        null;

    if (filePath) {
        if (filePath.startsWith('http')) {
            return filePath;
        }
        return '/storage/' + filePath;
    }
    return null;
};
