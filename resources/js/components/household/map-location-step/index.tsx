import SectionHeader from '@/components/household/section-header';
import { MapPicker } from './components/map-picker';
import type { MapLocationStepProps } from './types';

export default function MapLocationStep({
    data,
    onChange,
    provinceId,
    provinceName,
    regencyId,
    regencyName,
    districtId,
    districtName,
    villageId,
    villageName,
}: MapLocationStepProps) {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="Lokasi Peta"
                subtitle="Tentukan lokasi rumah pada peta dengan mengklik posisi yang sesuai"
            />

            <MapPicker
                data={data}
                onChange={onChange}
                provinceId={provinceId}
                provinceName={provinceName}
                regencyId={regencyId}
                regencyName={regencyName}
                districtId={districtId}
                districtName={districtName}
                villageId={villageId}
                villageName={villageName}
            />
        </div>
    );
}
