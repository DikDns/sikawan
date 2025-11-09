/**
 * Validation utilities for General Info Step
 */

import type { GeneralInfoData } from './types';

export interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof GeneralInfoData, string>>;
}

export function validateGeneralInfo(data: GeneralInfoData): ValidationResult {
    const errors: Partial<Record<keyof GeneralInfoData, string>> = {};

    // Required: Location
    if (!data.provinceId) {
        errors.provinceId = 'Provinsi harus diisi';
    }
    if (!data.regencyId) {
        errors.regencyId = 'Kota/Kabupaten harus diisi';
    }
    if (!data.districtId) {
        errors.districtId = 'Kecamatan harus diisi';
    }
    if (!data.villageId) {
        errors.villageId = 'Desa/Kelurahan harus diisi';
    }

    // Required: Address
    if (!data.address || data.address.trim() === '') {
        errors.address = 'Alamat harus diisi';
    }

    // Required: Building ownership
    if (!data.ownershipStatusBuilding) {
        errors.ownershipStatusBuilding =
            'Status Penguasaan Bangunan harus diisi';
    }

    // Required: Land ownership
    if (!data.ownershipStatusLand) {
        errors.ownershipStatusLand = 'Status Penguasaan Lahan harus diisi';
    }

    // Required: Building legal status
    if (!data.buildingLegalStatus) {
        errors.buildingLegalStatus = 'Status Legalitas Bangunan harus diisi';
    }

    // Required: Land legal status
    if (!data.landLegalStatus) {
        errors.landLegalStatus = 'Status Legalitas Lahan harus diisi';
    }

    // Required: NIK
    if (!data.nik || data.nik.trim() === '') {
        errors.nik = 'NIK harus diisi';
    } else {
        // Validate NIK format: 16 digits with specific pattern
        const nikPattern =
            /^(1[1-9]|21|[37][1-6]|5[1-3]|6[1-5]|[89][12])\d{2}\d{2}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$/;
        const nikCleaned = data.nik.replace(/\s/g, ''); // Remove spaces

        if (nikCleaned.length !== 16) {
            errors.nik = 'NIK harus berformat 16 digit';
        } else if (!nikPattern.test(nikCleaned)) {
            errors.nik = 'Format NIK tidak valid';
        }
    }

    // Required: Head of household name
    if (!data.headOfHouseholdName || data.headOfHouseholdName.trim() === '') {
        errors.headOfHouseholdName = 'Nama Kepala Keluarga harus diisi';
    }

    // Required: Household status (MBR/NON_MBR)
    if (!data.householdStatus) {
        errors.householdStatus = 'Status MBR harus diisi';
    }

    const isValid = Object.keys(errors).length === 0;

    return { isValid, errors };
}

export function getRequiredFieldsStatus(data: GeneralInfoData): {
    total: number;
    filled: number;
    percentage: number;
} {
    const requiredFields: (keyof GeneralInfoData)[] = [
        'provinceId',
        'regencyId',
        'districtId',
        'villageId',
        'address',
        'ownershipStatusBuilding',
        'ownershipStatusLand',
        'buildingLegalStatus',
        'landLegalStatus',
        'nik',
        'headOfHouseholdName',
        'householdStatus',
    ];

    const filled = requiredFields.filter((field) => {
        const value = data[field];
        return value !== undefined && value !== null && value !== '';
    }).length;

    return {
        total: requiredFields.length,
        filled,
        percentage: Math.round((filled / requiredFields.length) * 100),
    };
}
