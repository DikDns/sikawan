import HouseholdsList from '@/components/household/households-list';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type HouseholdListItem, type HouseholdStats } from '@/types/household';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Rumah',
        href: '/households',
    },
];

interface AreaOption {
    value: string;
    label: string;
}

interface Props {
    households: HouseholdListItem[];
    stats: HouseholdStats;
    approvalCount: number;
    rejectedCount: number;
    areas?: AreaOption[];
    filters?: {
        habitability_status?: string;
        province_id?: string;
        regency_id?: string;
        district_id?: string;
        village_id?: string;
        area_id?: string;
    };
}

export default function Households({
    households,
    stats,
    approvalCount,
    rejectedCount,
    filters,
    areas,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Rumah" />
            <HouseholdsList
                households={households}
                stats={stats}
                approvalCount={approvalCount}
                rejectedCount={rejectedCount}
                filters={filters}
                areas={areas}
            />
        </AppLayout>
    );
}
