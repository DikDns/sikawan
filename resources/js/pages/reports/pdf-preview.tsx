import HouseholdLineChart from '@/components/report/household-line-chart';
import HouseholdCharts from '@/components/report/household-status-chart';
import InfrastructureBarChart from '@/components/report/infrastructure-bar-chart';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import * as htmlToImage from 'html-to-image';
import React, { useState } from 'react';
import { toast } from 'sonner';

export function Section({ title }: { title: string }) {
    return (
        <h2 className="mt-6 mb-2 border-b pb-1 text-lg font-semibold">
            {title}
        </h2>
    );
}

export function TableBasic({
    headers,
    rows,
}: {
    headers: string[];
    rows?: (React.ReactNode[] | string[])[];
}) {
    const hasRows = Array.isArray(rows) && rows.length > 0;

    return (
        <Table className="w-full rounded-md border">
            <TableHeader>
                <TableRow>
                    {headers.map((h, i) => (
                        <TableHead
                            key={i}
                            className="px-2 py-2 text-xs font-semibold"
                        >
                            {h}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {hasRows ? (
                    rows!.map((cols, i) => (
                        <TableRow key={i}>
                            {cols.map((c, j) => (
                                <TableCell
                                    key={j}
                                    className="px-2 py-2 align-top text-xs break-words whitespace-pre-line"
                                    style={{
                                        wordBreak: 'break-word',
                                        maxWidth: 180,
                                    }}
                                >
                                    {c}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={headers.length}
                            className="text-center text-sm text-muted-foreground"
                        >
                            Tidak ada data
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

type HouseholdRow = {
    head_name?: string;
    address_text?: string;
    habitability_status?: string | null;
    member_total?: number | string;
    survey_date?: string | null;
};

type PsuRow = {
    name?: string;
    category?: string;
    type?: string;
    infrastructure_count?: number | string;
};

type AreaRow = {
    name?: string;
    description?: string | string;
    infrastructure_count?: number | string;
};

type PreviewProps = {
    title?: string;
    type?: 'RUMAH' | 'PSU' | 'KAWASAN' | 'UMUM';
    description?: string | null;
    start?: string | null;
    end?: string | null;
    format?: 'PDF' | 'EXCEL';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
};

function formatDate(date: string | null) {
    return date ? dayjs(date).format('DD MMM YYYY') : 'Semua';
}

export default function PdfPreview() {
    const { props } = usePage<PreviewProps>();
    const [generating, setGenerating] = useState(false);

    const title = props.title ?? 'Preview Laporan';
    const type = props.type ?? 'RUMAH';
    const description = props.description ?? '';
    const start = props.start ?? null;
    const end = props.end ?? null;
    const format = props.format ?? 'PDF';
    const rawData = props.data ?? null;

    const formatLongDate = (dateString?: string | null) => {
        if (!dateString) return '-';

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('id-ID', { month: 'long' });
        const year = date.getFullYear();

        return `${day} - ${month} - ${year}`;
    };

    const takeSnapshot = async (element: HTMLElement) => {
        return await htmlToImage.toPng(element, {
            quality: 1,
            pixelRatio: 2,
            cacheBust: true,
            skipFonts: true,
            fontEmbedCSS: '',
        });
    };

    const handleGenerate = async () => {
        setGenerating(true);

        try {
            let base64Status = null;
            let base64Line = null;
            let base64Infra = null;

            // Capture chart screenshots from the preview page
            const statusEl = document.getElementById(
                'preview-chart-status',
            ) as HTMLElement | null;
            const lineEl = document.getElementById(
                'preview-chart-line',
            ) as HTMLElement | null;
            const infraEl = document.getElementById(
                'preview-chart-infra',
            ) as HTMLElement | null;

            if (statusEl) base64Status = await takeSnapshot(statusEl);
            if (lineEl) base64Line = await takeSnapshot(lineEl);
            if (infraEl) base64Infra = await takeSnapshot(infraEl);

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
                    chart_household_status: base64Status,
                    chart_household_line: base64Line,
                    chart_infrastructure: base64Infra,
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

    // Table headers & rows
    let tableHeaders: string[] = [];
    let rows: (React.ReactNode[] | string[])[] = [];

    if (type === 'RUMAH' && Array.isArray(rawData)) {
        tableHeaders = [
            'Nama Kepala',
            'Alamat',
            'Status',
            'Jiwa',
            'Tanggal Survey',
        ];
        rows = rawData.map((h: HouseholdRow) => [
            h.head_name ?? '-',
            h.address_text ?? '-',
            h.habitability_status ?? '-',
            String(h.member_total ?? '-'),
            h.survey_date ? formatLongDate(h.survey_date) : '-',
        ]);
    }

    if (type === 'PSU' && Array.isArray(rawData)) {
        tableHeaders = ['Nama', 'Kategori', 'Tipe', 'Total Infrastruktur'];
        rows = rawData.map((p: PsuRow) => [
            p.name ?? '-',
            p.category ?? '-',
            p.type ?? '-',
            String(p.infrastructure_count ?? '-'),
        ]);
    }

    if (type === 'KAWASAN' && Array.isArray(rawData)) {
        tableHeaders = ['Nama Kawasan', 'Total Rumah', 'Total PSU'];
        rows = rawData.map((a: AreaRow) => [
            a.name ?? '-',
            String(a.description ?? '-'),
            String(a.infrastructure_count ?? '-'),
        ]);
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 bg-white p-4">
            <div className="mt-4 flex items-center justify-between">
                <Button
                    variant="destructive"
                    onClick={() => router.visit('/reports')}
                    className="text-xs"
                >
                    ← Kembali
                </Button>
                <Button onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Memproses...' : 'Generate & Download'}
                </Button>
            </div>
            <Card className="border-none shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Jenis: <b>{type}</b> — Periode:{' '}
                        <b>{formatDate(start)}</b> - <b>{formatDate(end)}</b>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {description && (
                        <p className="mb-4 text-sm break-words whitespace-pre-line">
                            {description}
                        </p>
                    )}

                    {/* chart section */}
                    {type === 'RUMAH' && Array.isArray(rawData) && (
                        <>
                            <Section title="Grafik Status Rumah" />
                            <div
                                id="preview-chart-status"
                                className="mb-4 w-full"
                            >
                                <HouseholdCharts houses={rawData} />
                            </div>
                            <Section title="Grafik Perkembangan Rumah" />
                            <div
                                id="preview-chart-line"
                                className="mb-4 w-full"
                            >
                                <HouseholdLineChart houses={rawData} />
                            </div>
                        </>
                    )}

                    {type === 'PSU' && Array.isArray(rawData) && (
                        <>
                            <Section title="Grafik Infrastruktur" />
                            <div
                                id="preview-chart-infra"
                                className="mb-4 w-full"
                            >
                                <InfrastructureBarChart
                                    infrastructures={rawData}
                                />
                            </div>
                        </>
                    )}

                    {type === 'UMUM' && rawData && (
                        <>
                            <Section title="Grafik Status Rumah" />
                            <div
                                id="preview-chart-status"
                                className="mb-4 w-full"
                            >
                                <HouseholdCharts
                                    houses={rawData.houses ?? []}
                                />
                            </div>
                            <Section title="Grafik Perkembangan Rumah" />
                            <div
                                id="preview-chart-line"
                                className="mb-4 w-full"
                            >
                                <HouseholdLineChart
                                    houses={rawData.houses ?? []}
                                />
                            </div>
                            <Section title="Grafik Infrastruktur" />
                            <div
                                id="preview-chart-infra"
                                className="mb-4 w-full"
                            >
                                <InfrastructureBarChart
                                    infrastructures={rawData.psu ?? []}
                                />
                            </div>
                        </>
                    )}

                    {/* Table Section */}
                    <Section title="Data Laporan" />
                    {type === 'UMUM' ? (
                        <>
                            <Section title="Rumah" />
                            <TableBasic
                                headers={[
                                    'Nama Kepala',
                                    'Alamat',
                                    'Status',
                                    'Total Jiwa',
                                    'Tanggal Survey',
                                ]}
                                rows={
                                    Array.isArray(rawData?.houses)
                                        ? rawData.houses.map(
                                              (h: HouseholdRow) => [
                                                  h.head_name ?? '-',
                                                  h.address_text ?? '-',
                                                  h.habitability_status ?? '-',
                                                  h.member_total ?? '-',
                                                  formatLongDate(
                                                      h.survey_date,
                                                  ) ?? '-',
                                              ],
                                          )
                                        : []
                                }
                            />
                            <Section title="PSU" />
                            <TableBasic
                                headers={[
                                    'Nama',
                                    'Kategori',
                                    'Jenis',
                                    'Total Infrastruktur',
                                ]}
                                rows={
                                    Array.isArray(rawData?.psu)
                                        ? rawData.psu.map((p: PsuRow) => [
                                              p.name ?? '-',
                                              p.category ?? '-',
                                              p.type ?? '-',
                                              p.infrastructure_count ?? '-',
                                          ])
                                        : []
                                }
                            />
                            <Section title="Kawasan" />
                            <TableBasic
                                headers={['Nama Kawasan', 'Total Rumah']}
                                rows={
                                    Array.isArray(rawData?.areas)
                                        ? rawData.areas.map((a: AreaRow) => [
                                              a.name ?? '-',
                                              String(a.description ?? '-'),
                                          ])
                                        : []
                                }
                            />
                        </>
                    ) : (
                        <TableBasic headers={tableHeaders} rows={rows} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
