/**
 * Building Regularity Section (A.1 KETERATURAN BANGUNAN HUNIAN)
 */

import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ROAD_WIDTH_CATEGORY_OPTIONS, YES_NO_OPTIONS } from '../constants';
import type { TechnicalData } from '../types';

interface BuildingRegularitySectionProps {
    formData: TechnicalData;
    updateField: (
        field: keyof TechnicalData,
        value: string | number | boolean | undefined,
    ) => void;
}

export function BuildingRegularitySection({
    formData,
    updateField,
}: BuildingRegularitySectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Keteraturan Bangunan
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Akses Jalan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={
                                formData.hasRoadAccess !== undefined
                                    ? String(formData.hasRoadAccess)
                                    : ''
                            }
                            onValueChange={(value) =>
                                updateField('hasRoadAccess', value === 'true')
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

                <Field className="w-full">
                    <FieldLabel>Menghadap Sempadan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={
                                formData.facadeFacesRoad !== undefined
                                    ? String(formData.facadeFacesRoad)
                                    : ''
                            }
                            onValueChange={(value) =>
                                updateField('facadeFacesRoad', value === 'true')
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

                <Field className="w-full">
                    <FieldLabel>
                        Daerah Limbah/ Dibawah Jalur Listrik Tegangan Tinggi
                    </FieldLabel>
                    <FieldContent>
                        <Select
                            value={
                                formData.inHazardArea !== undefined
                                    ? String(formData.inHazardArea)
                                    : ''
                            }
                            onValueChange={(value) =>
                                updateField('inHazardArea', value === 'true')
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

                <Field className="w-full">
                    <FieldLabel>Lebar Jalan</FieldLabel>
                    <FieldContent>
                        <Select
                            value={formData.roadWidthCategory || ''}
                            onValueChange={(value) =>
                                updateField('roadWidthCategory', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jawaban" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROAD_WIDTH_CATEGORY_OPTIONS.map((option) => (
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
                    <FieldLabel>Menghadap Sungai/Laut/Rawa/Danau</FieldLabel>
                    <FieldContent>
                        <Select
                            value={
                                formData.facesWaterbody !== undefined
                                    ? String(formData.facesWaterbody)
                                    : ''
                            }
                            onValueChange={(value) =>
                                updateField('facesWaterbody', value === 'true')
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

                <Field className="w-full">
                    <FieldLabel>Pemukiman Limbah</FieldLabel>
                    <FieldContent>
                        <Select
                            value={
                                formData.inSetbackArea !== undefined
                                    ? String(formData.inSetbackArea)
                                    : ''
                            }
                            onValueChange={(value) =>
                                updateField('inSetbackArea', value === 'true')
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
