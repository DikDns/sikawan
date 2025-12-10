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
import { Textarea } from '@/components/ui/textarea';
import { router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import * as htmlToImage from 'html-to-image';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ReportGenerateDialog({
    open,
    onOpenChange,
    onDateChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
    const today = dayjs().format('YYYY-MM-DD');
    const [loadingPreview, setLoadingPreview] = useState(false);
    type FormPayload = typeof data;
    const generatePreviewRef = useRef<DebouncedFunc<
        (payload: FormPayload) => void
    > | null>(null);

    const takeSnapshot = async (element: HTMLElement) => {
        return await htmlToImage.toPng(element, {
            quality: 1,
            pixelRatio: 2,
            cacheBust: true,
            skipFonts: true,
            fontEmbedCSS: '',
        });
    };

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
                    window.open(json.url, '_blank');
                }

                if (payload.format === 'EXCEL') {
                    window.open(
                        `https://docs.google.com/viewer?url=${encodeURIComponent(json.url)}&embedded=true`,
                        '_blank'
                    );
                }
            } catch (e) {
                console.log('error preview:', e);
            } finally {
                setLoadingPreview(false);
            }
        }, 600);

        return () => {
            generatePreviewRef.current?.cancel?.();
        };
    }, []);

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

    const handlePreview = async () => {
        if (!data.format) return;

        const payload = {
            ...data
        };

        await fetch("/reports/preview/pdf/store", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
            },
            body: JSON.stringify(payload),
        });

        const endpoint =
            data.format === "PDF"
                ? "/reports/preview/pdf"
                : "/reports/preview/excel";

        window.open(endpoint, "_blank");
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
                                    onChange={(e) => {
                                        setData('start_date', e.target.value);
                                        onDateChange?.({ start: e.target.value, end: data.end_date });
                                    }}
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
                                    onChange={(e) => {
                                        setData('end_date', e.target.value);
                                        onDateChange?.({ start: data.start_date, end: e.target.value });
                                    }}
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
                            <button
                                type="button"
                                onClick={handlePreview}
                                disabled={loadingPreview}
                                className="mt-2 w-fit rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                {loadingPreview ? "Memuat preview..." : "Lihat Preview"}
                            </button>
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
