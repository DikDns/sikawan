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

// Laravel Pagination structure
interface PaginatedHouseholds {
    data: HouseholdListItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    households: PaginatedHouseholds;
    stats: HouseholdStats;
    areas?: AreaOption[];
    filters?: {
        habitability_status?: string;
        district_id?: string;
        village_id?: string;
        area_id?: string;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function Households({
    households,
    stats,
    filters,
    areas,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Rumah" />
            <HouseholdsList
                households={households.data}
                pagination={{
                    currentPage: households.current_page,
                    lastPage: households.last_page,
                    perPage: households.per_page,
                    total: households.total,
                    from: households.from,
                    to: households.to,
                }}
                stats={stats}
                filters={filters}
                areas={areas}
            />
        </AppLayout>
    );
}
