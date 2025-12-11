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
import { useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ReportGenerateDialog({
    open,
    onOpenChange,
    onDateChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
    const today = dayjs().format('YYYY-MM-DD');
    const [loadingPreview, setLoadingPreview] = useState(false);

    const { data, setData, errors, reset } = useForm({
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

    const handlePreview = async () => {
        // Validate required fields
        if (!data.title) {
            toast.error('Judul laporan wajib diisi');
            return;
        }
        if (!data.type) {
            toast.error('Tipe laporan wajib dipilih');
            return;
        }
        if (!data.format) {
            toast.error('Format laporan wajib dipilih');
            return;
        }

        setLoadingPreview(true);

        try {
            const payload = {
                ...data,
            };

            // Store form data in session
            await fetch('/reports/preview/pdf/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (
                        document.querySelector(
                            'meta[name="csrf-token"]',
                        ) as HTMLMetaElement
                    ).content,
                },
                body: JSON.stringify(payload),
            });

            // Navigate to preview page
            const endpoint =
                data.format === 'PDF'
                    ? '/reports/preview/pdf'
                    : '/reports/preview/excel';

            // Close dialog and reset
            onOpenChange(false);
            reset();

            // Navigate to preview page
            window.location.href = endpoint;
        } catch (e) {
            console.log('error preview:', e);
            toast.error('Gagal membuka preview');
        } finally {
            setLoadingPreview(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl overflow-hidden p-0">
                <DialogHeader className="border-b p-6 pb-4">
                    <DialogTitle>Buat Laporan Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi data berikut untuk membuat laporan baru. Anda
                        akan melihat preview terlebih dahulu sebelum generate.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-4">
                    <Input
                        placeholder="Judul laporan"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                    />
                    <Textarea
                        placeholder="Deskripsi (opsional)"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
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
                                    onDateChange?.({
                                        start: e.target.value,
                                        end: data.end_date,
                                    });
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
                                    onDateChange?.({
                                        start: data.start_date,
                                        end: e.target.value,
                                    });
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
                </div>
                <DialogFooter className="border-t bg-white p-4">
                    <Button
                        type="button"
                        onClick={handlePreview}
                        disabled={loadingPreview}
                    >
                        {loadingPreview
                            ? 'Memuat Preview...'
                            : 'Preview Laporan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
