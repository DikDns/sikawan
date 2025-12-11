import { DashboardFilter } from './dashboard-filter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardHeader(props: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-3xl font-bold text-foreground whitespace-nowrap">Perumahan dan Kawasan</h1>
      <DashboardFilter {...props} />
    </div>
  )
}
