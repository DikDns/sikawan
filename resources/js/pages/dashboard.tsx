import { AnalysisChart } from '@/components/dashboard/analysis-chart';
import { AreaSummaryTable } from '@/components/dashboard/area-summary-table';
import { BottomStats } from '@/components/dashboard/bottom-stats';
import { ChartSection } from '@/components/dashboard/chart-section';
import { EconomicDataTable } from '@/components/dashboard/economic-data-table';
import { DashboardHeader } from '@/components/dashboard/header';
import { Header2 } from '@/components/dashboard/header-2';
import { PSUSection } from '@/components/dashboard/psu-section';
import { RegionStatistics } from '@/components/dashboard/region-statistics';
import { StatCards } from '@/components/dashboard/stat-cards';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    const { statCardsData, analysisData, chartSectionData, psuData, improvedPSUData, bottomStatsData, economicData, areaSummaryRows, regionStats } = usePage().props as any;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <main className="min-h-screen space-y-6 bg-background">
                    <DashboardHeader />
                    <StatCards data={statCardsData} />
                    <ChartSection rtlhData={chartSectionData?.rtlh} rumahBaruData={chartSectionData?.rumahBaru} />
                    <AnalysisChart data={analysisData} />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <BottomStats data={bottomStatsData} />
                        <EconomicDataTable data={economicData} />
                    </div>

                    <Separator />

                    <Header2 />
                    <RegionStatistics items={regionStats} />

                    <Separator />

                    <PSUSection psuData={psuData} improvedPSUData={improvedPSUData} />
                    <AreaSummaryTable rows={areaSummaryRows} />
                </main>
            </div>
        </AppLayout>
    );
}
