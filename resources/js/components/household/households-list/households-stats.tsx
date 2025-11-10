import StatsCard from '@/components/household/stats-card';
import { type HouseholdStats } from '@/types/household';
import { Home } from 'lucide-react';

interface Props {
    stats: HouseholdStats;
}

export default function HouseholdsStats({ stats }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
                title="Rumah"
                value={stats.total}
                icon={Home}
                iconColor="text-[#8B87E8]"
                iconBgColor="bg-[#8B87E8]/10"
            />
            <StatsCard
                title="RLH"
                value={stats.rlh}
                icon={Home}
                iconColor="text-[#8AD463]"
                iconBgColor="bg-[#8AD463]/10"
            />
            <StatsCard
                title="RTLH"
                value={stats.rtlh}
                icon={Home}
                iconColor="text-[#EC6767]"
                iconBgColor="bg-[#EC6767]/10"
            />
        </div>
    );
}
