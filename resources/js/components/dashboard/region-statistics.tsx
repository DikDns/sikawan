import { RegionCard } from './region-card';

const regions = [
    { name: 'Lawang Kidul', houses: '40,689 Rumah' },
    { name: 'Tanjung Agung', houses: '40,689 Rumah' },
    { name: 'Rambang', houses: '40,689 Rumah' },
    { name: 'Rambang Niru', houses: '40,689 Rumah' },
    { name: 'Belimbing', houses: '40,689 Rumah' },
];

const chartData = [
    { label: 'RLH', value: 15000, color: '#B2F02C' },
    { label: 'RTLH', value: 25689, color: '#FFAA22' },
    { label: 'Butuh Rumah Baru', value: 25689, color: '#655B9C' },
];

export function RegionStatistics() {
    return (
        <div className="space-y-4">
            {regions.map((region) => (
                <RegionCard
                    key={region.name}
                    region={region}
                    data={chartData}
                />
            ))}
        </div>
    );
}
