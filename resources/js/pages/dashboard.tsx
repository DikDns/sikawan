import { AnalysisChart } from '@/components/dashboard/analysis-chart';
import { BottomStats } from '@/components/dashboard/bottom-stats';
import { ChartSection } from '@/components/dashboard/chart-section';
import { EconomicDataTable } from '@/components/dashboard/economic-data-table';
import { DashboardHeader } from '@/components/dashboard/header';
import { StatCards } from '@/components/dashboard/stat-cards';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <main className="min-h-screen space-y-6 bg-background">
                    <DashboardHeader />
                    <StatCards />
                    <ChartSection />
                    <AnalysisChart />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <BottomStats />
                        <EconomicDataTable />
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
