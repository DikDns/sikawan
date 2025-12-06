import StatsCard from '@/components/household/stats-card';
import { Layers } from 'lucide-react';

interface Props {
    stats?: { totalGroups: number };
}

export const AreaGroupStats = ({ stats }: Props) => {
    return (
        stats && (
            <div className="grid gap-4 md:grid-cols-1">
                <StatsCard
                    title="Kelompok Kawasan"
                    value={stats.totalGroups}
                    icon={Layers}
                />
            </div>
        )
    );
};
