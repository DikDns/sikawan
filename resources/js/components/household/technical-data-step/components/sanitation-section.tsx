/**
 * Sanitation Section (A.4 PENGELOLAAN SANITASI)
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
    DEFECATION_PLACE_OPTIONS,
    TOILET_TYPE_OPTIONS,
    SEWAGE_DISPOSAL_OPTIONS,
} from '../constants';
import type { TechnicalData } from '../types';

interface SanitationSectionProps {
    formData: TechnicalData;
    updateField: (
        field: keyof TechnicalData,
        value: string | number | boolean | undefined,
    ) => void;
}

export function SanitationSection({
    formData,
    updateField,
}: SanitationSectionProps) {
    const showToiletFields = formData.defecationPlace !== 'OPEN';

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Pengelolaan Sanitasi
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Tempat Buang Air Besar</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.defecationPlace || ''}
                            onValueChange={(value) =>
                                updateField('defecationPlace', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {DEFECATION_PLACE_OPTIONS.map((option) => (
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

                {showToiletFields && (
                    <>
                        <Field className="w-full">
                            <FieldLabel>Jenis Kloset</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={formData.toiletType || ''}
                                    onValueChange={(value) =>
                                        updateField('toiletType', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jawaban" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TOILET_TYPE_OPTIONS.map((option) => (
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
                            <FieldLabel>Pembuangan Limbah</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={formData.sewageDisposal || ''}
                                    onValueChange={(value) =>
                                        updateField('sewageDisposal', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jawaban" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEWAGE_DISPOSAL_OPTIONS.map(
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
                    </>
                )}
            </div>
        </section>
    );
}
