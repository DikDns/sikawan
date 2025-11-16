export interface MapLocationData {
    latitude?: number | string;
    longitude?: number | string;
}

export interface MapLocationStepProps {
    data: MapLocationData;
    onChange: (data: MapLocationData) => void;
    provinceId?: string;
    provinceName?: string;
    regencyId?: string;
    regencyName?: string;
    districtId?: string;
    districtName?: string;
    villageId?: string;
    villageName?: string;
}

export interface NominatimSearchResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: {
        village?: string;
        suburb?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
    };
    boundingbox: [string, string, string, string]; // [minLat, maxLat, minLon, maxLon]
}
