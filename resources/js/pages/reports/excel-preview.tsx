import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

type PreviewProps = {
    title?: string;
    description?: string | null;
    type?: 'RUMAH' | 'PSU' | 'KAWASAN' | 'UMUM';
    format?: 'PDF' | 'EXCEL';
    start?: string | null;
    end?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSheets(type: string, data: any) {
    if (type === 'UMUM') {
        return [
            {
                key: 'RUMAH',
                label: 'Rumah',
                data: data?.houses ?? [],
            },
            {
                key: 'PSU',
                label: 'PSU',
                data: data?.psu ?? [],
            },
            {
                key: 'KAWASAN',
                label: 'Kawasan',
                data: data?.areas ?? [],
            },
        ];
    }
    return [
        {
            key: type,
            label: type.charAt(0) + type.slice(1).toLowerCase(),
            data,
        },
    ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExcelTable({ data }: { data: any[] }) {
    if (!Array.isArray(data) || data.length === 0)
        return (
            <div className="py-8 text-center text-muted-foreground">
                Tidak ada data.
            </div>
        );

    const headers = Object.keys(data[0] ?? {});

    return (
        <Table className="border">
            <TableHeader>
                <TableRow>
                    {headers.map((h) => (
                        <TableHead
                            key={h}
                            className="border bg-gray-100 px-2 py-2 text-xs font-semibold"
                        >
                            {h}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, i) => (
                    <TableRow key={i}>
                        {headers.map((h) => (
                            <TableCell
                                key={h}
                                className="border px-2 py-2 text-xs break-words whitespace-pre-line"
                                style={{ maxWidth: 220 }}
                            >
                                {row[h] ?? ''}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function ExcelPreview() {
    const { props } = usePage<PreviewProps>();
    const [generating, setGenerating] = useState(false);

    const title = props.title ?? 'Preview Excel';
    const description = props.description ?? '';
    const type = props.type ?? 'RUMAH';
    const format = props.format ?? 'EXCEL';
    const start = props.start ?? null;
    const end = props.end ?? null;
    const data = props.data ?? [];

    const sheets = getSheets(type, data);
    const [activeTab, setActiveTab] = useState(sheets[0]?.key);

    const handleGenerate = async () => {
        setGenerating(true);

        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;

            const response = await fetch('/reports/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    format,
                    start_date: start,
                    end_date: end,
                    chart_household_status: null,
                    chart_household_line: null,
                    chart_infrastructure: null,
                }),
            });

            const result = await response.json();

            if (result.success && result.download_url) {
                toast.success('Laporan berhasil digenerate!');

                // Trigger download
                const downloadResponse = await fetch(result.download_url);
                if (downloadResponse.ok) {
                    const blob = await downloadResponse.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const filename =
                        result.download_url.split('/').pop() ?? 'report';

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    window.URL.revokeObjectURL(downloadUrl);
                }

                // Navigate back to reports list
                router.visit('/reports');
            } else {
                toast.error(result.message || 'Gagal membuat laporan');
            }
        } catch (error) {
            console.error('Generate error:', error);
            toast.error('Gagal membuat laporan');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="mx-auto my-8 max-w-5xl rounded border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => router.visit('/reports')}
                >
                    ← Kembali
                </Button>
                <h2 className="text-xl font-bold">{title}</h2>
                <Button onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Memproses...' : 'Generate & Download'}
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="mb-2">
                            {sheets.map((sheet) => (
                                <TabsTrigger key={sheet.key} value={sheet.key}>
                                    {sheet.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {sheets.map((sheet) => (
                            <TabsContent key={sheet.key} value={sheet.key}>
                                <CardContent className="max-w-[920px] overflow-x-auto p-0">
                                    <ExcelTable data={sheet.data} />
                                </CardContent>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    );
}
