/**
 * Water Access Section (A.3 AKSES AIR MINUM)
 */

import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    WATER_SOURCE_OPTIONS,
    WATER_DISTANCE_CATEGORY_OPTIONS,
    WATER_FULFILLMENT_OPTIONS,
} from '../constants';
import type { TechnicalData } from '../types';

interface WaterAccessSectionProps {
    formData: TechnicalData;
    updateField: (
        field: keyof TechnicalData,
        value: string | number | boolean | undefined,
    ) => void;
}

export function WaterAccessSection({
    formData,
    updateField,
}: WaterAccessSectionProps) {
    const showDistanceField = ['SUMUR_BOR', 'SUMUR_TRL', 'MATA_AIR_TRL'].includes(
        formData.waterSource || '',
    );

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">Sumber Air</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Sumber Utama</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.waterSource || ''}
                            onValueChange={(value) =>
                                updateField('waterSource', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {WATER_SOURCE_OPTIONS.map((option) => (
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

                {showDistanceField && (
                    <>
                        <Field className="w-full">
                            <FieldLabel>
                                Jarak ke penampung tinja/kotoran terdekat
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0 m"
                                    value={formData.waterDistanceToSepticM || ''}
                                    onChange={(e) =>
                                        updateField(
                                            'waterDistanceToSepticM',
                                            parseFloat(e.target.value) ||
                                                undefined,
                                        )
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <Field className="w-full">
                            <FieldLabel>Kategori Jarak</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={formData.waterDistanceCategory || ''}
                                    onValueChange={(value) =>
                                        updateField('waterDistanceCategory', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jawaban" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WATER_DISTANCE_CATEGORY_OPTIONS.map(
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

                <Field className="w-full">
                    <FieldLabel>Kecukupan Air Pertahun</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.waterFulfillment || ''}
                            onValueChange={(value) =>
                                updateField('waterFulfillment', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {WATER_FULFILLMENT_OPTIONS.map((option) => (
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
