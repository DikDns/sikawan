/**
 * Custom hooks for General Info Step
 */

import { useWilayah } from '@/hooks/use-wilayah';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GeneralInfoData, GeneralInfoDataSerialized } from './types';

export function useGeneralInfoForm(
    initialData: GeneralInfoData = {},
    onChange?: (data: GeneralInfoDataSerialized) => void,
) {
    // Normalize initial data
    const normalizedData = useMemo(
        () => ({
            ...initialData,
            dataCollectionDate:
                initialData.dataCollectionDate instanceof Date
                    ? initialData.dataCollectionDate
                    : initialData.dataCollectionDate
                      ? new Date(initialData.dataCollectionDate)
                      : undefined,
        }),
        [initialData],
    );

    const [formData, setFormData] = useState<GeneralInfoData>(normalizedData);
    const wilayah = useWilayah();

    // Track if this is the first render to skip initial onChange call
    const isInitialMount = useRef(true);

    // ========================================================================
    // Effects
    // ========================================================================

    // Load cities when province changes
    useEffect(() => {
        if (formData.provinceId) {
            wilayah.loadCities(String(formData.provinceId));
        } else {
            wilayah.resetCities();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.provinceId]);

    // Load sub-districts when city changes
    useEffect(() => {
        if (formData.regencyId) {
            wilayah.loadSubDistricts(String(formData.regencyId));
        } else {
            wilayah.resetSubDistricts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.regencyId]);

    // Load villages when sub-district changes
    useEffect(() => {
        if (formData.districtId) {
            wilayah.loadVillages(String(formData.districtId));
        } else {
            wilayah.resetVillages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.districtId]);

    // Calculate total members
    const totalMembers = useMemo(() => {
        const male = formData.maleMembers || 0;
        const female = formData.femaleMembers || 0;
        const disabled = formData.disabledMembers || 0;
        return male + female + disabled;
    }, [
        formData.maleMembers,
        formData.femaleMembers,
        formData.disabledMembers,
    ]);

    // Update total members when member counts change
    useEffect(() => {
        if (formData.totalMembers !== totalMembers) {
            updateField('totalMembers', totalMembers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalMembers]);

    // ========================================================================
    // Handlers
    // ========================================================================

    const updateField = useCallback(
        (
            field: keyof GeneralInfoData,
            value: string | number | Date | undefined,
        ) => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [field]: value,
            }));
        },
        [],
    );

    // Call onChange when formData changes (skip initial render)
    useEffect(() => {
        // Skip onChange call on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Serialize data for onChange callback
        const dataToSave: GeneralInfoDataSerialized = {
            ...formData,
            dataCollectionDate:
                formData.dataCollectionDate instanceof Date
                    ? formData.dataCollectionDate.toISOString()
                    : typeof formData.dataCollectionDate === 'string'
                      ? formData.dataCollectionDate
                      : undefined,
        };

        onChange?.(dataToSave);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    const handleProvinceChange = useCallback(
        (value: string) => {
            const selected = wilayah.provinces.find(
                (p) => String(p.value) === String(value),
            );

            updateField('provinceId', value);
            updateField('provinceName', selected?.label || '');

            // Reset dependent fields
            updateField('regencyId', '');
            updateField('regencyName', '');
            updateField('districtId', '');
            updateField('districtName', '');
            updateField('villageId', '');
            updateField('villageName', '');
        },
        [wilayah.provinces, updateField],
    );

    const handleRegencyChange = useCallback(
        (value: string) => {
            const selected = wilayah.cities.find(
                (c) => String(c.value) === String(value),
            );

            updateField('regencyId', value);
            updateField('regencyName', selected?.label || '');

            // Reset dependent fields
            updateField('districtId', '');
            updateField('districtName', '');
            updateField('villageId', '');
            updateField('villageName', '');
        },
        [wilayah.cities, updateField],
    );

    const handleDistrictChange = useCallback(
        (value: string) => {
            const selected = wilayah.subDistricts.find(
                (d) => String(d.value) === String(value),
            );

            updateField('districtId', value);
            updateField('districtName', selected?.label || '');

            // Reset dependent fields
            updateField('villageId', '');
            updateField('villageName', '');
        },
        [wilayah.subDistricts, updateField],
    );

    const handleVillageChange = useCallback(
        (value: string) => {
            const selected = wilayah.villages.find(
                (v) => String(v.value) === String(value),
            );

            updateField('villageId', value);
            updateField('villageName', selected?.label || '');
        },
        [wilayah.villages, updateField],
    );

    const getDatePickerValue = useCallback((): Date => {
        if (formData.dataCollectionDate instanceof Date) {
            return formData.dataCollectionDate;
        }
        if (formData.dataCollectionDate) {
            return new Date(formData.dataCollectionDate);
        }
        return new Date();
    }, [formData.dataCollectionDate]);

    return {
        formData,
        wilayah,
        totalMembers,
        updateField,
        handleProvinceChange,
        handleRegencyChange,
        handleDistrictChange,
        handleVillageChange,
        getDatePickerValue,
    };
}
