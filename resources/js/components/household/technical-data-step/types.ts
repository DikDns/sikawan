/**
 * Types for Technical Data Step
 */

export interface TechnicalData {
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
    areaPerPersonM2?: number; // Calculated field, read-only

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
}
