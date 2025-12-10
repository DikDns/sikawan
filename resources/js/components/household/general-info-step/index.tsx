/**
 * General Info Step - Main Component
 *
 * This is the main form component for collecting general household information.
 * It's organized into three main sections:
 * 1. General Information (date, address, location)
 * 2. Building & Land Ownership
 * 3. Household Data
 */

import { Separator } from '@/components/ui/separator';
import { GeneralInfoSection } from './components/general-info-section';
import { HouseholdDataSection } from './components/household-data-section';
import { OwnershipSection } from './components/ownership-section';
import { useGeneralInfoForm } from './hooks';
import type { GeneralInfoStepProps } from './types';

export default function GeneralInfoStep({
    data = {},
    onChange,
}: GeneralInfoStepProps) {
    const {
        formData,
        wilayah,
        totalMembers,
        updateField,
        handleDistrictChange,
        handleVillageChange,
        getDatePickerValue,
    } = useGeneralInfoForm(data, onChange);

    return (
        <div className="space-y-8">
            <GeneralInfoSection
                formData={formData}
                wilayah={wilayah}
                updateField={updateField}
                handleDistrictChange={handleDistrictChange}
                handleVillageChange={handleVillageChange}
                getDatePickerValue={getDatePickerValue}
            />

            <Separator className="border-dotted" />

            <OwnershipSection formData={formData} updateField={updateField} />

            <Separator className="border-dotted" />

            <HouseholdDataSection
                formData={formData}
                totalMembers={totalMembers}
                updateField={updateField}
            />
        </div>
    );
}
