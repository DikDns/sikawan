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

interface Props {
    households: HouseholdListItem[];
    stats: HouseholdStats;
}

export default function Households({ households, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Rumah" />
            <HouseholdsList households={households} stats={stats} />
        </AppLayout>
    );
}
