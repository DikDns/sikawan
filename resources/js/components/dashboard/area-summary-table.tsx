import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const fallbackRows = [{ name: 'Contoh Kawasan', rumah: 0 }];

interface AreaSummaryRow {
    name: string;
    rumah: number;
}

export function AreaSummaryTable({ rows }: { rows?: AreaSummaryRow[] }) {
    const data = rows && rows.length > 0 ? rows : fallbackRows;
    const currentYear = new Date().getFullYear();

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Total Kawasan
                    </h2>
                    <p className="text-3xl font-bold text-secondary">
                        {data.length}
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 bg-transparent font-semibold text-secondary"
                    disabled
                >
                    {currentYear}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-secondary/25">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">
                                Nama Kawasan
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-secondary">
                                Rumah
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr
                                key={idx}
                                className="border-b border-border transition-colors hover:bg-muted"
                            >
                                <td className="px-4 py-3 text-sm text-foreground">
                                    {row.name}
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                                    {row.rumah}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
