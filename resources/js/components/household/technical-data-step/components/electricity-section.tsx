/**
 * Electricity Section (Sumber Listrik)
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
import { ELECTRICITY_SOURCE_OPTIONS, YES_NO_OPTIONS } from '../constants';
import type { TechnicalData } from '../types';

interface ElectricitySectionProps {
    formData: TechnicalData;
    updateField: (
        field: keyof TechnicalData,
        value: string | number | boolean | undefined,
    ) => void;
}

export function ElectricitySection({
    formData,
    updateField,
}: ElectricitySectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Sumber Listrik
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Sumber Utama</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.electricitySource || ''}
                            onValueChange={(value) =>
                                updateField('electricitySource', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {ELECTRICITY_SOURCE_OPTIONS.map((option) => (
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
                    <FieldLabel>Daya Listrik</FieldLabel>
                    <FieldContent>
                        <Input
                            type="number"
                            placeholder="0 Watt"
                            value={formData.electricityPowerWatt || ''}
                            onChange={(e) =>
                                updateField(
                                    'electricityPowerWatt',
                                    parseInt(e.target.value) || undefined,
                                )
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Listrik Tersambung</FieldLabel>
                    <FieldContent>
                        <Select
                            value={
                                formData.electricityConnected !== undefined
                                    ? String(formData.electricityConnected)
                                    : ''
                            }
                            onValueChange={(value) =>
                                updateField(
                                    'electricityConnected',
                                    value === 'true',
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {YES_NO_OPTIONS.map((option) => (
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
