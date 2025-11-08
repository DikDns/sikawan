import { DatePicker } from '@/components/household/date-picker';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useWilayah } from '@/hooks/use-wilayah';
import { useEffect, useState } from 'react';

interface GeneralInfoData {
    // Informasi Umum
    dataCollectionDate?: Date | string;
    address?: string;
    provinceId?: string;
    provinceName?: string;
    regencyId?: string;
    regencyName?: string;
    districtId?: string;
    districtName?: string;
    villageId?: string;
    villageName?: string;

    // Penguasaan Bangunan & Lahan
    ownershipStatusBuilding?: string; // 'OWN','RENT','OTHER'
    ownershipStatusLand?: string; // 'OWN','RENT','OTHER'
    buildingLegalStatus?: string; // 'IMB','NONE'
    landLegalStatus?: string; // 'SHM','HGB','SURAT_PEMERINTAH','PERJANJIAN','LAINNYA','TIDAK_TAHU'

    // Data Penghuni
    nik?: string;
    headOfHouseholdName?: string;
    mainOccupation?: string;
    income?: string;
    householdStatus?: string;
    numberOfHouseholds?: number;
    maleMembers?: number;
    femaleMembers?: number;
    disabledMembers?: number;
    totalMembers?: number;
}

interface GeneralInfoStepProps {
    data?: GeneralInfoData;
    onChange?: (data: {
        dataCollectionDate?: string;
        address?: string;
        provinceId?: string;
        provinceName?: string;
        regencyId?: string;
        regencyName?: string;
        districtId?: string;
        districtName?: string;
        villageId?: string;
        villageName?: string;
        ownershipStatusBuilding?: string;
        ownershipStatusLand?: string;
        buildingLegalStatus?: string;
        landLegalStatus?: string;
        nik?: string;
        headOfHouseholdName?: string;
        mainOccupation?: string;
        income?: string;
        householdStatus?: string;
        numberOfHouseholds?: number;
        maleMembers?: number;
        femaleMembers?: number;
        disabledMembers?: number;
        totalMembers?: number;
    }) => void;
}

export default function GeneralInfoStep({
    data = {},
    onChange,
}: GeneralInfoStepProps) {
    // Convert date string to Date object if needed
    const normalizedData = {
        ...data,
        dataCollectionDate:
            data.dataCollectionDate instanceof Date
                ? data.dataCollectionDate
                : data.dataCollectionDate
                  ? new Date(data.dataCollectionDate)
                  : undefined,
    };

    const [formData, setFormData] = useState<GeneralInfoData>(normalizedData);
    const wilayah = useWilayah();

    // Load cities when province changes
    useEffect(() => {
        if (formData.provinceId) {
            wilayah.loadCities(String(formData.provinceId));
        } else {
            wilayah.resetCities();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.provinceId]);

    // Load sub-districts when city changes
    useEffect(() => {
        if (formData.regencyId) {
            wilayah.loadSubDistricts(String(formData.regencyId));
        } else {
            wilayah.resetSubDistricts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.regencyId]);

    // Load villages when sub-district changes
    useEffect(() => {
        if (formData.districtId) {
            wilayah.loadVillages(String(formData.districtId));
        } else {
            wilayah.resetVillages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.districtId]);

    const updateField = (
        field: keyof GeneralInfoData,
        value: string | number | Date | undefined,
    ) => {
        // Use functional update to ensure we always have the latest state
        setFormData((prevFormData) => {
            const newData = { ...prevFormData, [field]: value };
            return newData;
        });

        // Calculate dataToSave outside of setFormData callback
        // We need to use the updated value, not the old formData
        const updatedData = { ...formData, [field]: value };
        const dataToSave: {
            dataCollectionDate?: string;
            address?: string;
            provinceId?: string;
            provinceName?: string;
            regencyId?: string;
            regencyName?: string;
            districtId?: string;
            districtName?: string;
            villageId?: string;
            villageName?: string;
            ownershipStatusBuilding?: string;
            ownershipStatusLand?: string;
            buildingLegalStatus?: string;
            landLegalStatus?: string;
            nik?: string;
            headOfHouseholdName?: string;
            mainOccupation?: string;
            income?: string;
            householdStatus?: string;
            numberOfHouseholds?: number;
            maleMembers?: number;
            femaleMembers?: number;
            disabledMembers?: number;
            totalMembers?: number;
        } = {
            ...updatedData,
            dataCollectionDate:
                updatedData.dataCollectionDate instanceof Date
                    ? updatedData.dataCollectionDate.toISOString()
                    : typeof updatedData.dataCollectionDate === 'string'
                      ? updatedData.dataCollectionDate
                      : undefined,
        };

        // Call onChange with the new data
        onChange?.(dataToSave);
    };

    // Calculate total members
    const calculateTotalMembers = () => {
        const male = formData.maleMembers || 0;
        const female = formData.femaleMembers || 0;
        const disabled = formData.disabledMembers || 0;
        return male + female + disabled;
    };

    const totalMembers = calculateTotalMembers();

    // Update total members in useEffect to avoid setState during render
    useEffect(() => {
        if (formData.totalMembers !== totalMembers) {
            updateField('totalMembers', totalMembers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalMembers]);

    return (
        <div className="space-y-8">
            {/* Informasi Umum */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary">
                    Informasi Umum
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field className="w-full">
                        <FieldLabel>Tanggal Pendataan</FieldLabel>
                        <FieldContent>
                            <DatePicker
                                value={
                                    formData.dataCollectionDate instanceof Date
                                        ? formData.dataCollectionDate
                                        : formData.dataCollectionDate
                                          ? new Date(
                                                formData.dataCollectionDate,
                                            )
                                          : new Date()
                                }
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
                                value={(() => {
                                    const val = String(
                                        formData.provinceId || '',
                                    );
                                    return val;
                                })()}
                                onValueChange={(value) => {
                                    const selected = wilayah.provinces.find(
                                        (p) =>
                                            String(p.value) === String(value),
                                    );

                                    updateField('provinceId', value);
                                    updateField(
                                        'provinceName',
                                        selected?.label || '',
                                    );
                                    // Reset dependent fields
                                    updateField('regencyId', '');
                                    updateField('regencyName', '');
                                    updateField('districtId', '');
                                    updateField('districtName', '');
                                    updateField('villageId', '');
                                    updateField('villageName', '');
                                }}
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
                                value={formData.regencyId || ''}
                                onValueChange={(value) => {
                                    const selected = wilayah.cities.find(
                                        (c) => c.value === value,
                                    );
                                    updateField('regencyId', value);
                                    updateField(
                                        'regencyName',
                                        selected?.label || '',
                                    );
                                    // Reset dependent fields
                                    updateField('districtId', '');
                                    updateField('districtName', '');
                                    updateField('villageId', '');
                                    updateField('villageName', '');
                                }}
                                placeholder={
                                    wilayah.loadingCities
                                        ? 'Memuat kota/kabupaten...'
                                        : 'Pilih Kota/Kabupaten'
                                }
                                searchPlaceholder="Cari kota/kabupaten..."
                                emptyMessage="Kota/Kabupaten tidak ditemukan"
                                disabled={
                                    !formData.provinceId ||
                                    wilayah.loadingCities
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
                                value={formData.districtId || ''}
                                onValueChange={(value) => {
                                    const selected = wilayah.subDistricts.find(
                                        (d) => d.value === value,
                                    );
                                    updateField('districtId', value);
                                    updateField(
                                        'districtName',
                                        selected?.label || '',
                                    );
                                    // Reset dependent fields
                                    updateField('villageId', '');
                                    updateField('villageName', '');
                                }}
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
                                value={formData.villageId || ''}
                                onValueChange={(value) => {
                                    const selected = wilayah.villages.find(
                                        (v) => v.value === value,
                                    );
                                    updateField('villageId', value);
                                    updateField(
                                        'villageName',
                                        selected?.label || '',
                                    );
                                }}
                                placeholder={
                                    wilayah.loadingVillages
                                        ? 'Memuat desa/kelurahan...'
                                        : 'Pilih Desa/Kelurahan'
                                }
                                searchPlaceholder="Cari desa/kelurahan..."
                                emptyMessage="Desa/Kelurahan tidak ditemukan"
                                disabled={
                                    !formData.districtId ||
                                    wilayah.loadingVillages
                                }
                                clearable={true}
                            />
                        </FieldContent>
                    </Field>
                </div>
            </div>

            <Separator className="border-dotted" />

            {/* Penguasaan Bangunan & Lahan */}
            <div className="space-y-6">
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
                                    updateField(
                                        'ownershipStatusBuilding',
                                        value,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status Hunian Bangunan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OWN">
                                        Milik Sendiri
                                    </SelectItem>
                                    <SelectItem value="RENT">Sewa</SelectItem>
                                    <SelectItem value="OTHER">
                                        Lainnya
                                    </SelectItem>
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
                                    <SelectItem value="OWN">
                                        Milik Sendiri
                                    </SelectItem>
                                    <SelectItem value="RENT">Sewa</SelectItem>
                                    <SelectItem value="OTHER">
                                        Lainnya
                                    </SelectItem>
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
                                    <SelectItem value="IMB">IMB</SelectItem>
                                    <SelectItem value="NONE">
                                        Tidak Ada
                                    </SelectItem>
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
                                    <SelectItem value="SHM">SHM</SelectItem>
                                    <SelectItem value="HGB">HGB</SelectItem>
                                    <SelectItem value="SURAT_PEMERINTAH">
                                        Surat Pemerintah
                                    </SelectItem>
                                    <SelectItem value="PERJANJIAN">
                                        Perjanjian
                                    </SelectItem>
                                    <SelectItem value="LAINNYA">
                                        Lainnya
                                    </SelectItem>
                                    <SelectItem value="TIDAK_TAHU">
                                        Tidak Tahu
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
            </div>

            <Separator className="border-dotted" />

            {/* Data Penghuni */}
            <div className="space-y-6">
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
                                onChange={(e) =>
                                    updateField('nik', e.target.value)
                                }
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
                                    <SelectItem value="pns">PNS</SelectItem>
                                    <SelectItem value="swasta">
                                        Swasta
                                    </SelectItem>
                                    <SelectItem value="wiraswasta">
                                        Wiraswasta
                                    </SelectItem>
                                    <SelectItem value="petani">
                                        Petani
                                    </SelectItem>
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
                                    <SelectItem value="<1jt">
                                        &lt; 1 Juta
                                    </SelectItem>
                                    <SelectItem value="1-3jt">
                                        1-3 Juta
                                    </SelectItem>
                                    <SelectItem value="3-5jt">
                                        3-5 Juta
                                    </SelectItem>
                                    <SelectItem value=">5jt">
                                        &gt; 5 Juta
                                    </SelectItem>
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
                                    <SelectItem value="kepala-keluarga">
                                        Kepala Keluarga
                                    </SelectItem>
                                    <SelectItem value="istri">Istri</SelectItem>
                                    <SelectItem value="anak">Anak</SelectItem>
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
            </div>
        </div>
    );
}
