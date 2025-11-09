/**
 * Waste Management Section (A.5 PENGELOLAAN SAMPAH)
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
    WASTE_DISPOSAL_PLACE_OPTIONS,
    WASTE_COLLECTION_FREQUENCY_OPTIONS,
} from '../constants';
import type { TechnicalData } from '../types';

interface WasteManagementSectionProps {
    formData: TechnicalData;
    updateField: (
        field: keyof TechnicalData,
        value: string | number | boolean | undefined,
    ) => void;
}

export function WasteManagementSection({
    formData,
    updateField,
}: WasteManagementSectionProps) {
    const showCollectionFrequency = ['PRIVATE_BIN', 'COMMUNAL'].includes(
        formData.wasteDisposalPlace || '',
    );

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Pengelolaan Sampah
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Tempat Pembuangan Sampah</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.wasteDisposalPlace || ''}
                            onValueChange={(value) =>
                                updateField('wasteDisposalPlace', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {WASTE_DISPOSAL_PLACE_OPTIONS.map((option) => (
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

                {showCollectionFrequency && (
                    <Field className="w-full">
                        <FieldLabel>Pengangkutan Sampah</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.wasteCollectionFrequency || ''}
                                onValueChange={(value) =>
                                    updateField('wasteCollectionFrequency', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WASTE_COLLECTION_FREQUENCY_OPTIONS.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                )}
            </div>
        </section>
    );
}
