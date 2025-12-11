import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EconomicDataTableProps {
    data?: { indicator: string; value: string }[];
}

export function EconomicDataTable({ data }: EconomicDataTableProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Data Sosial Ekonomi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4 text-sm font-semibold">
                        <div>Indikator</div>
                        <div className="text-right">Nilai</div>
                    </div>
                    {(data && data.length > 0 ? data : []).map(
                        (item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 gap-4 py-2 text-sm"
                            >
                                <div className="text-muted-foreground">
                                    {item.indicator}
                                </div>
                                <div className="text-right font-medium text-foreground">
                                    {item.value}
                                </div>
                            </div>
                        ),
                    )}
                    {(!data || data.length === 0) && (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Belum ada data ekonomi.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
