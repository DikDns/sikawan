/**
 * Household Data Section Component
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
    HOUSEHOLD_STATUS_OPTIONS,
    INCOME_OPTIONS,
    MAIN_OCCUPATION_OPTIONS,
} from '../constants';
import type { GeneralInfoData } from '../types';

interface HouseholdDataSectionProps {
    formData: GeneralInfoData;
    totalMembers: number;
    updateField: (
        field: keyof GeneralInfoData,
        value: string | number | Date | undefined,
    ) => void;
}

export function HouseholdDataSection({
    formData,
    totalMembers,
    updateField,
}: HouseholdDataSectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Data Penghuni
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>NIK</FieldLabel>
                    <FieldContent>
                        <Input
                            type="text"
                            placeholder="Masukkan NIK Kepala Keluarga"
                            value={formData.nik || ''}
                            onChange={(e) => updateField('nik', e.target.value)}
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Nama Kepala Keluarga</FieldLabel>
                    <FieldContent>
                        <Input
                            placeholder="Masukkan Nama Kepala Keluarga"
                            value={formData.headOfHouseholdName || ''}
                            onChange={(e) =>
                                updateField(
                                    'headOfHouseholdName',
                                    e.target.value,
                                )
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Pekerjaan Utama</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.mainOccupation || ''}
                            onValueChange={(value) =>
                                updateField('mainOccupation', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Pekerjaan Utama" />
                            </SelectTrigger>
                            <SelectContent>
                                {MAIN_OCCUPATION_OPTIONS.map((option) => (
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
                    <FieldLabel>Penghasilan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.income || ''}
                            onValueChange={(value) =>
                                updateField('income', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Penghasilan" />
                            </SelectTrigger>
                            <SelectContent>
                                {INCOME_OPTIONS.map((option) => (
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
                    <FieldLabel>Status Rumah Tangga</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.householdStatus || ''}
                            onValueChange={(value) =>
                                updateField('householdStatus', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status Rumah Tangga" />
                            </SelectTrigger>
                            <SelectContent>
                                {HOUSEHOLD_STATUS_OPTIONS.map((option) => (
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
                    <FieldLabel>Jumlah KK</FieldLabel>
                    <FieldContent>
                        <Input
                            type="number"
                            placeholder="Masukkan Jumlah KK"
                            value={formData.numberOfHouseholds || ''}
                            onChange={(e) =>
                                updateField(
                                    'numberOfHouseholds',
                                    parseInt(e.target.value) || 0,
                                )
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Anggota Laki-Laki</FieldLabel>
                    <FieldContent>
                        <Input
                            type="number"
                            placeholder="Masukkan Anggota Laki-Laki"
                            value={formData.maleMembers || ''}
                            onChange={(e) =>
                                updateField(
                                    'maleMembers',
                                    parseInt(e.target.value) || 0,
                                )
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Anggota Perempuan</FieldLabel>
                    <FieldContent>
                        <Input
                            type="number"
                            placeholder="Masukkan Anggota Perempuan"
                            value={formData.femaleMembers || ''}
                            onChange={(e) =>
                                updateField(
                                    'femaleMembers',
                                    parseInt(e.target.value) || 0,
                                )
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Anggota Difabel</FieldLabel>
                    <FieldContent>
                        <Input
                            type="number"
                            placeholder="Masukkan Anggota Difabel"
                            value={formData.disabledMembers || ''}
                            onChange={(e) =>
                                updateField(
                                    'disabledMembers',
                                    parseInt(e.target.value) || 0,
                                )
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Total Jiwa</FieldLabel>
                    <FieldContent>
                        <Input
                            type="number"
                            value={totalMembers}
                            readOnly
                            className="bg-muted"
                        />
                    </FieldContent>
                </Field>
            </div>
        </section>
    );
}
