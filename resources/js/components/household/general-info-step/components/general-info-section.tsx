/**
 * General Information Section Component
 */

import { DatePicker } from '@/components/household/date-picker';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import type { useWilayah } from '@/hooks/use-wilayah';
import type { GeneralInfoData } from '../types';

interface GeneralInfoSectionProps {
    formData: GeneralInfoData;
    wilayah: ReturnType<typeof useWilayah>;
    updateField: (
        field: keyof GeneralInfoData,
        value: string | number | Date | undefined,
    ) => void;
    handleProvinceChange: (value: string) => void;
    handleRegencyChange: (value: string) => void;
    handleDistrictChange: (value: string) => void;
    handleVillageChange: (value: string) => void;
    getDatePickerValue: () => Date;
}

export function GeneralInfoSection({
    formData,
    wilayah,
    updateField,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    handleVillageChange,
    getDatePickerValue,
}: GeneralInfoSectionProps) {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary">
                Informasi Umum
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="w-full">
                    <FieldLabel>Tanggal Pendataan</FieldLabel>
                    <FieldContent>
                        <DatePicker
                            value={getDatePickerValue()}
                            onDateChange={(date) =>
                                updateField('dataCollectionDate', date)
                            }
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full md:col-span-2">
                    <FieldLabel>Alamat</FieldLabel>
                    <FieldContent>
                        <Textarea
                            placeholder="Masukkan Alamat Lengkap Rumah"
                            value={formData.address || ''}
                            onChange={(e) =>
                                updateField('address', e.target.value)
                            }
                            rows={3}
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Provinsi</FieldLabel>
                    <FieldContent>
                        <SearchableSelect
                            options={wilayah.provinces}
                            value={String(formData.provinceId || '')}
                            onValueChange={handleProvinceChange}
                            placeholder={
                                wilayah.loadingProvinces
                                    ? 'Memuat provinsi...'
                                    : 'Pilih Provinsi'
                            }
                            searchPlaceholder="Cari provinsi..."
                            emptyMessage="Provinsi tidak ditemukan"
                            disabled={wilayah.loadingProvinces}
                            clearable={false}
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Kota/Kabupaten</FieldLabel>
                    <FieldContent>
                        <SearchableSelect
                            options={wilayah.cities}
                            value={String(formData.regencyId || '')}
                            onValueChange={handleRegencyChange}
                            placeholder={
                                wilayah.loadingCities
                                    ? 'Memuat kota/kabupaten...'
                                    : 'Pilih Kota/Kabupaten'
                            }
                            searchPlaceholder="Cari kota/kabupaten..."
                            emptyMessage="Kota/Kabupaten tidak ditemukan"
                            disabled={
                                !formData.provinceId || wilayah.loadingCities
                            }
                            clearable={true}
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Kecamatan</FieldLabel>
                    <FieldContent>
                        <SearchableSelect
                            options={wilayah.subDistricts}
                            value={String(formData.districtId || '')}
                            onValueChange={handleDistrictChange}
                            placeholder={
                                wilayah.loadingSubDistricts
                                    ? 'Memuat kecamatan...'
                                    : 'Pilih Kecamatan'
                            }
                            searchPlaceholder="Cari kecamatan..."
                            emptyMessage="Kecamatan tidak ditemukan"
                            disabled={
                                !formData.regencyId ||
                                wilayah.loadingSubDistricts
                            }
                            clearable={true}
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>Desa/Kelurahan</FieldLabel>
                    <FieldContent>
                        <SearchableSelect
                            options={wilayah.villages}
                            value={String(formData.villageId || '')}
                            onValueChange={handleVillageChange}
                            placeholder={
                                wilayah.loadingVillages
                                    ? 'Memuat desa/kelurahan...'
                                    : 'Pilih Desa/Kelurahan'
                            }
                            searchPlaceholder="Cari desa/kelurahan..."
                            emptyMessage="Desa/Kelurahan tidak ditemukan"
                            disabled={
                                !formData.districtId || wilayah.loadingVillages
                            }
                            clearable={true}
                        />
                    </FieldContent>
                </Field>

                <Field className="w-full">
                    <FieldLabel>RT/RW</FieldLabel>
                    <FieldContent>
                        <Input
                            placeholder="Contoh: 001/002"
                            value={formData.rtRw || ''}
                            onChange={(e) =>
                                updateField('rtRw', e.target.value)
                            }
                        />
                    </FieldContent>
                </Field>
            </div>
        </section>
    );
}
