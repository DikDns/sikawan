import { RegionCard } from './region-card';

export function RegionStatistics({ items }: { items?: Array<{ region: { name: string; houses: string }; data: Array<{ label: string; value: number; color: string }> }> }) {
    const fallbackItems = [
        {
            region: { name: 'Contoh Wilayah', houses: '0 Rumah' },
            data: [
                { label: 'RLH', value: 0, color: '#B2F02C' },
                { label: 'RTLH', value: 0, color: '#FFAA22' },
                { label: 'Butuh Rumah Baru', value: 0, color: '#655B9C' },
            ],
        },
    ];
    const data = items && items.length > 0 ? items : fallbackItems;
    return (
        <div className="space-y-4">
            {data.map((it, idx) => (
                <RegionCard key={`${it.region.name}-${idx}`} region={it.region} data={it.data} />
            ))}
        </div>
    );
}
