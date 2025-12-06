import { RegionCard } from './region-card';

export function RegionStatistics({
    items,
}: {
    items?: Array<{
        region: { name: string; houses: string };
        data: Array<{ label: string; value: number; color: string }>;
    }>;
}) {
    if (!items || items.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground">
                Belum ada data statistik kawasan.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((it, idx) => (
                <RegionCard
                    key={`${it.region.name}-${idx}`}
                    region={it.region}
                    data={it.data}
                />
            ))}
        </div>
    );
}
