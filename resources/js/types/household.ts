// Type untuk list households (dari HouseholdController@index)
export interface HouseholdListItem {
    id: number;
    head_name: string;
    nik: string | null;
    address_text: string;
    province_name: string | null;
    regency_name: string | null;
    district_name: string | null;
    village_name: string | null;
    rt_rw: string | null;
    status_mbr: 'MBR' | 'NON_MBR';
    member_total: number;
    male_count: number;
    female_count: number;
    kk_count: number;
    habitability_status: 'RLH' | 'RTLH' | null;
    ownership_status_building: 'OWN' | 'RENT' | 'OTHER' | null;
    latitude: number | null;
    longitude: number | null;
}

// Type untuk stats
export interface HouseholdStats {
    total: number;
    rlh: number;
    rtlh: number;
}

// Type base untuk household (digunakan di detail)
export interface Household {
    id: number;
    head_name: string;
    nik: string | null;
    survey_date: string | null;
    address_text: string;
    province_id: string | null;
    province_name: string | null;
    regency_id: string | null;
    regency_name: string | null;
    district_id: string | null;
    district_name: string | null;
    village_id: string | null;
    village_name: string | null;
    rt_rw: string | null;
    latitude: number | null;
    longitude: number | null;
    ownership_status_building: string | null;
    ownership_status_land: string | null;
    building_legal_status: string | null;
    land_legal_status: string | null;
    status_mbr: string;
    kk_count: number;
    member_total: number;
    male_count: number;
    female_count: number;
    disabled_count: number;
    main_occupation: string | null;
    monthly_income_idr: string | null;
    health_facility_used: string | null;
    health_facility_location: string | null;
    education_facility_location: string | null;
    habitability_status: string | null;
    eligibility_score_total: number | null;
}

export interface HouseholdTechnicalData {
    // A.1 Keteraturan Bangunan
    has_road_access: boolean | null;
    road_width_category: string | null;
    facade_faces_road: boolean | null;
    faces_waterbody: boolean | null;
    in_setback_area: boolean | null;
    in_hazard_area: boolean | null;

    // A.2 Kelayakan Bangunan
    building_length_m: number | null;
    building_width_m: number | null;
    floor_count: number | null;
    floor_height_m: number | null;
    building_area_m2: number | null;
    area_per_person_m2: number | null;

    // Struktur
    has_foundation: boolean | null;
    has_sloof: boolean | null;
    has_ring_beam: boolean | null;
    has_roof_structure: boolean | null;
    has_columns: boolean | null;

    // Material & Kondisi
    roof_material: string | null;
    roof_condition: string | null;
    wall_material: string | null;
    wall_condition: string | null;
    floor_material: string | null;
    floor_condition: string | null;

    // A.3 Akses Air
    water_source: string | null;
    water_distance_to_septic_m: number | null;
    water_distance_category: string | null;
    water_fulfillment: string | null;

    // Listrik
    electricity_source: string | null;
    electricity_power_watt: number | null;
    electricity_connected: boolean | null;

    // A.4 Sanitasi
    defecation_place: string | null;
    toilet_type: string | null;
    sewage_disposal: string | null;

    // A.5 Sampah
    waste_disposal_place: string | null;
    waste_collection_frequency: string | null;
}

export interface HouseholdMember {
    id: number;
    name: string;
    nik: string | null;
    relationship: string | null;
    gender: string | null;
    is_disabled: boolean;
    birth_date: string | null;
    occupation: string | null;
}

export interface HouseAssistance {
    id: number;
    assistance_type: string;
    program: string | null;
    funding_source: string | null;
    status: string | null;
    started_at: string | null;
    completed_at: string | null;
    cost_amount_idr: number | null;
    description: string | null;
    document_path: string | null;
}

export interface HouseholdPhoto {
    id: number;
    file_path: string;
    caption: string | null;
    order_index: number | null;
}

export interface HouseholdDetail extends Household {
    technical_data: HouseholdTechnicalData | null;
    members: HouseholdMember[];
    assistances: HouseAssistance[];
    photos: HouseholdPhoto[];
}
