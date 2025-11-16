/**
 * Technical Data Step Component
 */

import { useCallback, useEffect, useState } from 'react';
import { BuildingFeasibilitySection } from './components/building-feasibility-section';
import { BuildingRegularitySection } from './components/building-regularity-section';
import { ElectricitySection } from './components/electricity-section';
import { SanitationSection } from './components/sanitation-section';
import { WasteManagementSection } from './components/waste-management-section';
import { WaterAccessSection } from './components/water-access-section';
import type { TechnicalData } from './types';

interface TechnicalDataStepProps {
    data: TechnicalData;
    onChange: (data: TechnicalData) => void;
}

export default function TechnicalDataStep({
    data,
    onChange,
}: TechnicalDataStepProps) {
    const [formData, setFormData] = useState<TechnicalData>(data);

    // Sync formData with parent data when it changes
    useEffect(() => {
        setFormData(data);
    }, [data]);

    const updateField = useCallback(
        (
            field: keyof TechnicalData,
            value: string | number | boolean | undefined,
        ) => {
            setFormData((prev) => {
                const newData = { ...prev, [field]: value };
                onChange(newData);
                return newData;
            });
        },
        [onChange],
    );

    return (
        <div className="space-y-8">
            <BuildingRegularitySection
                formData={formData}
                updateField={updateField}
            />
            <BuildingFeasibilitySection
                formData={formData}
                updateField={updateField}
            />
            <WaterAccessSection formData={formData} updateField={updateField} />
            <SanitationSection formData={formData} updateField={updateField} />
            <WasteManagementSection
                formData={formData}
                updateField={updateField}
            />
            <ElectricitySection formData={formData} updateField={updateField} />
        </div>
    );
}
