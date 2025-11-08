import { useCallback, useEffect, useRef, useState } from 'react';

export interface WilayahOption {
    value: string;
    label: string;
}

interface Province {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

interface SubDistrict {
    id: string;
    name: string;
}

interface Village {
    id: string;
    name: string;
}

const API_BASE_URL = '/api/wilayah';

export function useWilayah() {
    const [provinces, setProvinces] = useState<WilayahOption[]>([]);
    const [cities, setCities] = useState<WilayahOption[]>([]);
    const [subDistricts, setSubDistricts] = useState<WilayahOption[]>([]);
    const [villages, setVillages] = useState<WilayahOption[]>([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);

    const provincesLoadedRef = useRef(false);
    const loadingProvincesRef = useRef(false);

    // Load provinces
    const loadProvinces = useCallback(async () => {
        // Check if already loaded or currently loading to prevent duplicate requests
        if (provincesLoadedRef.current || loadingProvincesRef.current) return;

        loadingProvincesRef.current = true;
        provincesLoadedRef.current = true;
        setLoadingProvinces(true);
        try {
            const response = await fetch(`${API_BASE_URL}/provinces`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch provinces');
            }
            const data: Province[] = await response.json();
            const options: WilayahOption[] = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setProvinces(options);
        } catch (error) {
            console.error('Error loading provinces:', error);
            setProvinces([]);
            provincesLoadedRef.current = false; // Reset on error
        } finally {
            setLoadingProvinces(false);
            loadingProvincesRef.current = false;
        }
    }, []);

    // Load cities by province
    const loadCities = useCallback(async (provinceId: string) => {
        if (!provinceId) {
            setCities([]);
            return;
        }
        setLoadingCities(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/cities/${provinceId}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }
            const data: City[] = await response.json();
            const options: WilayahOption[] = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setCities(options);
        } catch (error) {
            console.error('Error loading cities:', error);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    }, []);

    // Load sub-districts (kecamatan) by city
    const loadSubDistricts = useCallback(async (cityId: string) => {
        if (!cityId) {
            setSubDistricts([]);
            return;
        }
        setLoadingSubDistricts(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/sub-districts/${cityId}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to fetch sub-districts');
            }
            const data: SubDistrict[] = await response.json();
            const options: WilayahOption[] = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setSubDistricts(options);
        } catch (error) {
            console.error('Error loading sub-districts:', error);
            setSubDistricts([]);
        } finally {
            setLoadingSubDistricts(false);
        }
    }, []);

    // Load villages (desa/kelurahan) by sub-district
    const loadVillages = useCallback(async (subDistrictId: string) => {
        if (!subDistrictId) {
            setVillages([]);
            return;
        }
        setLoadingVillages(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/villages/${subDistrictId}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to fetch villages');
            }
            const data: Village[] = await response.json();
            const options: WilayahOption[] = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setVillages(options);
        } catch (error) {
            console.error('Error loading villages:', error);
            setVillages([]);
        } finally {
            setLoadingVillages(false);
        }
    }, []);

    // Reset dependent selects
    const resetCities = useCallback(() => {
        setCities([]);
        setSubDistricts([]);
        setVillages([]);
    }, []);

    const resetSubDistricts = useCallback(() => {
        setSubDistricts([]);
        setVillages([]);
    }, []);

    const resetVillages = useCallback(() => {
        setVillages([]);
    }, []);

    // Load provinces on mount (only once)
    useEffect(() => {
        loadProvinces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    return {
        provinces,
        cities,
        subDistricts,
        villages,
        loadingProvinces,
        loadingCities,
        loadingSubDistricts,
        loadingVillages,
        loadProvinces,
        loadCities,
        loadSubDistricts,
        loadVillages,
        resetCities,
        resetSubDistricts,
        resetVillages,
    };
}
