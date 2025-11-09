/**
 * Building Feasibility Section (A.2 KELAYAKAN BANGUNAN HUNIAN)
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
    FLOOR_CONDITION_OPTIONS,
    FLOOR_MATERIAL_OPTIONS,
    ROOF_CONDITION_OPTIONS,
    ROOF_MATERIAL_OPTIONS,
    WALL_CONDITION_OPTIONS,
    WALL_MATERIAL_OPTIONS,
} from '../constants';
import type { TechnicalData } from '../types';

interface BuildingFeasibilitySectionProps {
    formData: TechnicalData;
    updateField: (
        field: keyof TechnicalData,
        value: string | number | boolean | undefined,
    ) => void;
}

export function BuildingFeasibilitySection({
    formData,
    updateField,
}: BuildingFeasibilitySectionProps) {
    const buildingArea =
        (formData.buildingLengthM || 0) *
        (formData.buildingWidthM || 0) *
        (formData.floorCount || 0);

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Teknis Bangunan
            </h3>

            {/* Dimensi Bangunan */}
            <div className="space-y-4">
                <h4 className="font-medium text-secondary">Dimensi Bangunan</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field className="w-full">
                        <FieldLabel>Panjang Bangunan</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0 m"
                                value={formData.buildingLengthM || ''}
                                onChange={(e) =>
                                    updateField(
                                        'buildingLengthM',
                                        parseFloat(e.target.value) || undefined,
                                    )
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field className="w-full">
                        <FieldLabel>Lebar Bangunan</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0 m"
                                value={formData.buildingWidthM || ''}
                                onChange={(e) =>
                                    updateField(
                                        'buildingWidthM',
                                        parseFloat(e.target.value) || undefined,
                                    )
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field className="w-full">
                        <FieldLabel>Jumlah Lantai</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.floorCount || ''}
                                onChange={(e) =>
                                    updateField(
                                        'floorCount',
                                        parseInt(e.target.value) || undefined,
                                    )
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field className="w-full">
                        <FieldLabel>Ketinggian per lantai</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0 m"
                                value={formData.floorHeightM || ''}
                                onChange={(e) =>
                                    updateField(
                                        'floorHeightM',
                                        parseFloat(e.target.value) || undefined,
                                    )
                                }
                            />
                        </FieldContent>
                    </Field>

                    <Field className="w-full">
                        <FieldLabel>Luas Bangunan</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                value={buildingArea.toFixed(2)}
                                readOnly
                                className="bg-muted"
                            />
                        </FieldContent>
                    </Field>

                    <Field className="w-full">
                        <FieldLabel>Luas Lantai Bangunan/jiwa</FieldLabel>
                        <FieldContent>
                            <Input
                                type="number"
                                step="0.01"
                                value={
                                    formData.areaPerPersonM2
                                        ? formData.areaPerPersonM2.toFixed(2)
                                        : ''
                                }
                                readOnly
                                className="bg-muted"
                                placeholder="Akan dihitung otomatis"
                            />
                        </FieldContent>
                    </Field>
                </div>
            </div>

            {/* Material & Kondisi */}
            <div className="space-y-4">
                <h4 className="font-medium text-secondary">
                    Material &amp; Kondisi
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field className="w-full">
                        <FieldLabel>Material Atap</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.roofMaterial || ''}
                                onValueChange={(value) =>
                                    updateField('roofMaterial', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROOF_MATERIAL_OPTIONS.map((option) => (
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
                        <FieldLabel>Kondisi Atap</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.roofCondition || ''}
                                onValueChange={(value) =>
                                    updateField('roofCondition', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROOF_CONDITION_OPTIONS.map((option) => (
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
                        <FieldLabel>Material Dinding</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.wallMaterial || ''}
                                onValueChange={(value) =>
                                    updateField('wallMaterial', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WALL_MATERIAL_OPTIONS.map((option) => (
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
                        <FieldLabel>Kondisi Dinding</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.wallCondition || ''}
                                onValueChange={(value) =>
                                    updateField('wallCondition', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WALL_CONDITION_OPTIONS.map((option) => (
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
                        <FieldLabel>Material Lantai</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.floorMaterial || ''}
                                onValueChange={(value) =>
                                    updateField('floorMaterial', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FLOOR_MATERIAL_OPTIONS.map((option) => (
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
                        <FieldLabel>Kondisi Lantai</FieldLabel>
                        <FieldContent>
                            <Select
                                value={formData.floorCondition || ''}
                                onValueChange={(value) =>
                                    updateField('floorCondition', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jawaban" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FLOOR_CONDITION_OPTIONS.map((option) => (
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
            </div>
        </section>
    );
}
