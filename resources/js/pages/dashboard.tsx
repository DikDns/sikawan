import { AnalysisChart } from '@/components/dashboard/analysis-chart';
import { AreaSummaryTable } from '@/components/dashboard/area-summary-table';
import { BottomStats } from '@/components/dashboard/bottom-stats';
import { EconomicDataTable } from '@/components/dashboard/economic-data-table';
import { DashboardHeader } from '@/components/dashboard/header';
import { PSUSection } from '@/components/dashboard/psu-section';
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
        psuData,
        improvedPSUData,
        bottomStatsData,
        economicData,
        availableYears = [],
        selectedEconomicYear,
        areaSummaryRows,
        slumAreaTotalM2 = 0,
        householdsInSlumArea = 0,
        selectedDistrict,
        selectedVillage,
    } = usePage<DashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <main className="min-h-screen space-y-6">
                    <DashboardHeader
                        years={availableYears}
                        selectedYear={selectedEconomicYear}
                        selectedDistrict={selectedDistrict}
                        selectedVillage={selectedVillage}
                    />

                    {/* Top Section: All 5 Stats in one row */}
                    <StatCards data={statCardsData} columns={5} />

                    {/* Slum Area Statistics */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card className="border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                            Total Luasan Kawasan Kumuh
                                        </p>
                                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                                            {formatAreaSize(slumAreaTotalM2)}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/50">
                                        <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-orange-100 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                            Rumah Terdampak Kawasan Kumuh
                                        </p>
                                        <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                                            {householdsInSlumArea.toLocaleString(
                                                'id-ID',
                                            )}{' '}
                                            unit
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/50">
                                        <Home className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analysis Chart */}
                    <AnalysisChart data={analysisData} />

                    {/* Demographics & Economic Data */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <BottomStats data={bottomStatsData} />
                        <EconomicDataTable data={economicData} />
                    </div>

                    <Separator />

                    {/* PSU Section */}
                    <PSUSection
                        psuData={psuData}
                        improvedPSUData={improvedPSUData}
                    />

                    <Separator />

                    {/* Area Summary Table - Full Width */}
                    <AreaSummaryTable rows={areaSummaryRows} />
                </main>
            </div>
        </AppLayout>
    );
}
