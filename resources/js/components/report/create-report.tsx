'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import * as htmlToImage from 'html-to-image';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

type SheetData = {
    headers: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: any[][];
};

export default function ReportGenerateDialog({
    open,
    onOpenChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
    const today = dayjs().format('YYYY-MM-DD');
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<Record<
        string,
        SheetData
    > | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    type FormPayload = typeof data;
    const generatePreviewRef = useRef<DebouncedFunc<
        (payload: FormPayload) => void
    > | null>(null);
    const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

    const takeSnapshot = async (element: HTMLElement) => {
        return await htmlToImage.toPng(element, {
            quality: 1,
            pixelRatio: 2,
            cacheBust: true,
            skipFonts: true,
            fontEmbedCSS: '',
        });
    };

    async function loadExcelPreview(url: string) {
        try {
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allSheets: any = {};

            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (!jsonData || jsonData.length === 0 || !jsonData[0]) {
                    allSheets[sheetName] = { headers: [], rows: [] };
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const firstRow = jsonData[0] as any[];
                const headers = firstRow.map((h) => String(h || ''));
                const rows = jsonData.slice(1);

                allSheets[sheetName] = { headers, rows };
            });

            setExcelData(allSheets);
            setSelectedSheet(workbook.SheetNames[0]);
        } catch (e) {
            console.log('error bang: ', e);
            setExcelData(null);
        }
    }

    const { data, setData, processing, reset, errors } = useForm({
        title: '',
        description: '',
        type: '',
        start_date: '',
        end_date: '',
        format: 'PDF',

        // charts data
        chart_household_status: '',
        chart_household_line: '',
        chart_infrastructure: '',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { props }: any = usePage();

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast.error(
                'Periksa kembali input Anda, terdapat kesalahan pada form.',
            );
        }
        if (props.flash?.success) {
            toast.success(props.flash.success.message);
        }
    }, [errors, props.flash]);

    useEffect(() => {
        if (props.flash?.success?.download_url) {
            const url = props.flash?.success?.download_url;

            if (!url) return;
            const downloadFile = async () => {
                try {
                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error('Gagal mengunduh file.');
                    }

                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);

                    const filename = url.split('/').pop() ?? 'report';

                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    window.URL.revokeObjectURL(downloadUrl);

                    onOpenChange(false);
                    reset();
                } catch (error) {
                    console.error(error);
                    toast.error('Gagal mengunduh file.');
                }
            };
            downloadFile();
        }
    }, [props.flash?.success?.download_url, onOpenChange, reset]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generatePreviewRef.current = debounce(async (payload: any) => {
            if (!payload.type) return;
            setLoadingPreview(true);

            try {
                const statusEl = document.getElementById(
                    'chart-status',
                ) as HTMLElement | null;
                const lineEl = document.getElementById(
                    'chart-line',
                ) as HTMLElement | null;
                const infraEl = document.getElementById(
                    'chart-infra',
                ) as HTMLElement | null;

                let base64Status = null;
                let base64Line = null;
                let base64Infra = null;

                if (statusEl) base64Status = await takeSnapshot(statusEl);
                if (lineEl) base64Line = await takeSnapshot(lineEl);
                if (infraEl) base64Infra = await takeSnapshot(infraEl);

                const res = await fetch('reports/preview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...payload,
                        chart_household_status: base64Status,
                        chart_household_line: base64Line,
                        chart_infrastructure: base64Infra,
                    }),
                });

                const json = await res.json();

                if (payload.format === 'PDF') {
                    setPreviewPdfUrl(json.url);
                    setExcelData(null);
                }

                if (payload.format === 'EXCEL') {
                    await loadExcelPreview(json.url);
                    setPreviewPdfUrl(null);
                }
            } catch (e) {
                console.log('error preview:', e);
                setPreviewPdfUrl(null);
                setExcelData(null);
            } finally {
                setLoadingPreview(false);
            }
        }, 600);

        return () => {
            generatePreviewRef.current?.cancel?.();
        };
    }, []);

    useEffect(() => {
        generatePreviewRef.current?.(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        data.title,
        data.description,
        data.type,
        data.start_date,
        data.end_date,
        data.format,
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const statusEl = document.getElementById('chart-status') as HTMLElement;
        const lineEl = document.getElementById('chart-line') as HTMLElement;
        const infraEl = document.getElementById('chart-infra') as HTMLElement;

        if (!statusEl || !lineEl || !infraEl) {
            toast.error('Chart belum siap untuk digenerate.');
            return;
        }

        const base64Status = await takeSnapshot(statusEl);
        const base64Line = await takeSnapshot(lineEl);
        const base64Infra = await takeSnapshot(infraEl);

        console.log('base64status: ', base64Status?.substring(0, 100));
        console.log('base64line: ', base64Line?.substring(0, 100));
        console.log('base64infra: ', base64Infra?.substring(0, 100));

        router.post(
            '/reports/store',
            {
                ...data,
                chart_household_status: base64Status,
                chart_household_line: base64Line,
                chart_infrastructure: base64Infra,
            },
            {
                onSuccess: () => {},
                onError: () => toast.error('Gagal membuat laporan.'),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl overflow-hidden p-0">
                <DialogHeader className="border-b p-6 pb-4">
                    <DialogTitle>Buat Laporan Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi data berikut untuk membuat laporan baru dan
                        mengunduh hasilnya.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-4">
                        <Input
                            placeholder="Judul laporan"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <Textarea
                            placeholder="Deskripsi (opsional)"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <Select
                            value={data.type}
                            onValueChange={(v) =>
                                setData(
                                    'type',
                                    v as 'RUMAH' | 'KAWASAN' | 'PSU' | 'UMUM',
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Tipe Laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RUMAH">Rumah</SelectItem>
                                <SelectItem value="KAWASAN">Kawasan</SelectItem>
                                <SelectItem value="PSU">PSU</SelectItem>
                                <SelectItem value="UMUM">Umum</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">
                                    Tanggal Mulai
                                </label>
                                <Input
                                    type="date"
                                    value={data.start_date}
                                    max={today}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">
                                    Tanggal Selesai
                                </label>
                                <Input
                                    type="date"
                                    value={data.end_date}
                                    min={data.start_date}
                                    max={today}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <Select
                            value={data.format}
                            onValueChange={(v) =>
                                setData('format', v as 'PDF' | 'EXCEL')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Format Laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF</SelectItem>
                                <SelectItem value="EXCEL">Excel</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">
                                Preview
                            </label>
                            {data.format === 'PDF' && (
                                <div className="mt-1 h-[400px] overflow-hidden rounded-md border">
                                    {loadingPreview && (
                                        <div className="p-4 text-center text-gray-500">
                                            Memuat preview...
                                        </div>
                                    )}
                                    {!loadingPreview && previewPdfUrl && (
                                        <iframe
                                            src={previewPdfUrl}
                                            className="h-full w-full"
                                            title="Preview PDF"
                                        ></iframe>
                                    )}
                                </div>
                            )}
                            {data.format === 'EXCEL' && (
                                <div className="mt-1 h-[400px] max-w-[450px] rounded-md border bg-white">
                                    <div className="h-full w-full max-w-[450px] overflow-auto">
                                        {loadingPreview && (
                                            <div className="p-4 text-center text-gray-500">
                                                Memuat preview...
                                            </div>
                                        )}
                                        {excelData &&
                                            Object.keys(excelData).length >
                                                1 && (
                                                <div className="sticky top-0 z-20 my-2 flex gap-2 border-b-2 border-b-gray-500 bg-white py-2 ps-2">
                                                    {Object.keys(excelData).map(
                                                        (name) => (
                                                            <button
                                                                type="button"
                                                                key={name}
                                                                onClick={() =>
                                                                    setSelectedSheet(
                                                                        name,
                                                                    )
                                                                }
                                                                className={`cursor-pointer rounded border px-2 py-1 text-xs ${
                                                                    selectedSheet ===
                                                                    name
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-100'
                                                                }`}
                                                            >
                                                                {name}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        {!loadingPreview &&
                                            excelData &&
                                            selectedSheet &&
                                            excelData[selectedSheet] && (
                                                <Table className="max-w-[450px] min-w-[400px] table-auto border-separate border-spacing-0">
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-100">
                                                            {excelData[
                                                                selectedSheet
                                                            ]?.headers?.map(
                                                                (
                                                                    header,
                                                                    idx,
                                                                ) => (
                                                                    <TableHead
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="sticky top-0 z-10 border-b bg-gray-100 px-4 py-3 text-sm font-semibold whitespace-nowrap"
                                                                    >
                                                                        {header}
                                                                    </TableHead>
                                                                ),
                                                            )}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {excelData[
                                                            selectedSheet
                                                        ]?.rows?.map(
                                                            (row, rowIdx) => (
                                                                <TableRow
                                                                    key={rowIdx}
                                                                    className="transition-colors hover:bg-gray-50"
                                                                >
                                                                    {row.map(
                                                                        (
                                                                            cell,
                                                                            cellIdx,
                                                                        ) => (
                                                                            <TableCell
                                                                                key={
                                                                                    cellIdx
                                                                                }
                                                                                className="border-b px-4 py-3 text-sm whitespace-nowrap"
                                                                            >
                                                                                {cell ??
                                                                                    ''}
                                                                            </TableCell>
                                                                        ),
                                                                    )}
                                                                </TableRow>
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="border-t bg-white p-4">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Memproses...'
                                : 'Generate & Download'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
