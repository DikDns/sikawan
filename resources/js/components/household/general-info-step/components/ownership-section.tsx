/**
 * Building & Land Ownership Section Component
 */

import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BUILDING_LEGAL_STATUS_OPTIONS,
    LAND_LEGAL_STATUS_OPTIONS,
    OWNERSHIP_STATUS_OPTIONS,
} from '../constants';
import type { GeneralInfoData } from '../types';

interface OwnershipSectionProps {
    formData: GeneralInfoData;
    updateField: (
        field: keyof GeneralInfoData,
        value: string | number | Date | undefined,
    ) => void;
}

export function OwnershipSection({
    formData,
    updateField,
}: OwnershipSectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Penguasaan Bangunan & Lahan
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Status Hunian Bangunan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.ownershipStatusBuilding || ''}
                            onValueChange={(value) =>
                                updateField('ownershipStatusBuilding', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status Hunian Bangunan" />
                            </SelectTrigger>
                            <SelectContent>
                                {OWNERSHIP_STATUS_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Status Lahan Hunian</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.ownershipStatusLand || ''}
                            onValueChange={(value) =>
                                updateField('ownershipStatusLand', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status Lahan Hunian" />
                            </SelectTrigger>
                            <SelectContent>
                                {OWNERSHIP_STATUS_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Legalitas Bangunan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.buildingLegalStatus || ''}
                            onValueChange={(value) =>
                                updateField('buildingLegalStatus', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Legalitas Bangunan" />
                            </SelectTrigger>
                            <SelectContent>
                                {BUILDING_LEGAL_STATUS_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Legalitas Lahan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.landLegalStatus || ''}
                            onValueChange={(value) =>
                                updateField('landLegalStatus', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Legalitas Lahan" />
                            </SelectTrigger>
                            <SelectContent>
                                {LAND_LEGAL_STATUS_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
            </div>
        </section>
    );
}
