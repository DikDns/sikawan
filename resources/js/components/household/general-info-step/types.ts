/**
 * Types and interfaces for General Info Step
 */

export interface GeneralInfoData {
    // Informasi Umum
    dataCollectionDate?: Date | string;
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

    // Penguasaan Bangunan & Lahan
    ownershipStatusBuilding?: string;
    ownershipStatusLand?: string;
    buildingLegalStatus?: string;
    landLegalStatus?: string;

    // Data Penghuni
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
}

export type GeneralInfoDataSerialized = Omit<
    GeneralInfoData,
    'dataCollectionDate'
> & {
    dataCollectionDate?: string;
};

export interface GeneralInfoStepProps {
    data?: GeneralInfoData;
    onChange?: (data: GeneralInfoDataSerialized) => void;
}
