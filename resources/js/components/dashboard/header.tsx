import { DashboardFilter } from './dashboard-filter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardHeader(props: any) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                    Perumahan dan Kawasan
                </h1>
            </div>
            <DashboardFilter
                years={props.years}
                selectedEconomicYear={props.selectedYear}
                selectedDistrict={props.selectedDistrict}
                selectedVillage={props.selectedVillage}
            />
        </div>
    );
}
