import { DashboardFilter } from './dashboard-filter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardHeader(props: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Perumahan dan Kawasan
        </h1>
      </div>
      <DashboardFilter {...props} />
    </div>
  )
}
