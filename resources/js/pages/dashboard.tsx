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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type DashboardProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Home, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

function formatAreaSize(m2: number): string {
    if (m2 >= 10000) {
        return `${(m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Ha`;
    }
    return `${m2.toLocaleString('id-ID', { maximumFractionDigits: 0 })} m²`;
}

export default function Dashboard() {
    const {
        statCardsData,
        analysisData,
        chartSectionData,
        psuData,
        improvedPSUData,
        bottomStatsData,
        economicData,
        availableYears = [],
        selectedEconomicYear,
        areaSummaryRows,
        regionStats,
        slumAreaTotalM2 = 0,
        householdsInSlumArea = 0,
        rtlhTotal = 0,
        newHouseNeededTotal = 0,
    } = usePage<DashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <main className="min-h-screen space-y-6 bg-background">
                    <DashboardHeader />
                    <StatCards data={statCardsData.slice(0, 3)} columns={3} />
                    <StatCards data={statCardsData.slice(3, 5)} columns={2} />

                    {/* Slum Area Statistics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Total Luasan Kawasan Kumuh
                                        </p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {formatAreaSize(slumAreaTotalM2)}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                        <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Pemukiman dalam Kawasan Kumuh
                                        </p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {householdsInSlumArea.toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                                        <Home className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <ChartSection
                        rtlhData={chartSectionData?.rtlh}
                        rumahBaruData={chartSectionData?.rumahBaru}
                        rtlhTotal={rtlhTotal}
                        newHouseNeededTotal={newHouseNeededTotal}
                    />
                    <AnalysisChart data={analysisData} />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <BottomStats data={bottomStatsData} />
                        <EconomicDataTable
                            data={economicData}
                            availableYears={availableYears}
                            selectedYear={selectedEconomicYear}
                        />
                    </div>

                    <Separator />

                    <Header2 />
                    <RegionStatistics items={regionStats} />

                    <Separator />

                    <PSUSection
                        psuData={psuData}
                        improvedPSUData={improvedPSUData}
                    />
                    <AreaSummaryTable rows={areaSummaryRows} />
                </main>
            </div>
        </AppLayout>
    );
}
