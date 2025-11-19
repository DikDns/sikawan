import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const tableData = [
    { name: 'Kawasan Kumuh', rumah: 4, psu: 4 },
    { name: 'Kawasan Rawan Bencana', rumah: 2, psu: 2 },
    { name: 'Industri', rumah: 3, psu: 3 },
    { name: 'Pertanian', rumah: 5, psu: 5 },
    { name: 'Pariwisata', rumah: 2, psu: 2 },
    { name: 'Perkantoran', rumah: 3, psu: 3 },
];

export function AreaSummaryTable() {
    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Total Kawasan
                    </h2>
                    <p className="text-3xl font-bold text-secondary">6</p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 bg-transparent font-semibold text-secondary"
                >
                    2025
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
                            <th className="px-4 py-3 text-center text-sm font-semibold text-secondary">
                                PSU
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, idx) => (
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
                                <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                                    {row.psu}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
