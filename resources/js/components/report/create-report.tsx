"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

import { useEffect } from "react";
import dayjs from "dayjs";
import { useForm, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";

export default function ReportGenerateDialog({
    open,
    onOpenChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {

    const today = dayjs().format("YYYY-MM-DD");
    const takeSnapshot = async (element: HTMLElement) => {
        return await htmlToImage.toPng(element, {
            quality: 1,
            pixelRatio: 2,
            cacheBust: true,
            skipFonts: true,
        });
    }

    const { data, setData, processing, reset, errors } = useForm({
        title: "",
        description: "",
        type: "",
        start_date: "",
        end_date: "",
        format: "PDF",

        // charts data
        chart_household_status: "",
        chart_household_line: "",
        chart_infrastructure: "",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { props }: any = usePage();

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast.error("Periksa kembali input Anda, terdapat kesalahan pada form.");
        }
        if (props.flash?.success) {
            toast.success(props.flash.success.message);
        }
    }, [errors, props.flash]);

    useEffect(() => {
        if (props.flash?.success?.download_url) {
            const url = props.flash?.success?.download_url;

            if(!url) return;
            const downloadFile = async () => {
                try {
                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error("Gagal mengunduh file.");
                    }

                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);

                    const filename = url.split("/").pop() ?? "report";

                    const link = document.createElement("a");
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
                    toast.error("Gagal mengunduh file.");
                }
            };
            downloadFile();
        }
    }, [props.flash?.success?.download_url, onOpenChange, reset]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const statusEl = document.getElementById("chart-status") as HTMLElement;
        const lineEl = document.getElementById("chart-line") as HTMLElement;
        const infraEl = document.getElementById("chart-infra") as HTMLElement;

        if (!statusEl || !lineEl || !infraEl) {
            toast.error("Chart belum siap untuk digenerate.");
            return;
        }

        const base64Status = await takeSnapshot(statusEl);
        const base64Line   = await takeSnapshot(lineEl);
        const base64Infra  = await takeSnapshot(infraEl);

        console.log('base64status: ',base64Status?.substring(0, 100));
        console.log('base64line: ',base64Line?.substring(0, 100));
        console.log('base64infra: ',base64Infra?.substring(0, 100));

        router.post("/reports/store", {
            ...data,
            chart_household_status: base64Status,
            chart_household_line: base64Line,
            chart_infrastructure: base64Infra,
        }, {
            onSuccess: () => {},
            onError: () => toast.error("Gagal membuat laporan."),
        })
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>Buat Laporan Baru</DialogTitle>
                    <DialogDescription>
                        Lengkapi data berikut untuk membuat laporan baru dan mengunduh hasilnya.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
                        <Input
                            placeholder="Judul laporan"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <Textarea
                            placeholder="Deskripsi (opsional)"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                        />
                        <Select
                            value={data.type}
                            onValueChange={(v) =>
                                setData("type", v as "RUMAH" | "KAWASAN" | "PSU" | "UMUM")
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
                                <label className="text-sm font-medium">Tanggal Mulai</label>
                                <Input
                                    type="date"
                                    value={data.start_date}
                                    max={today}
                                    onChange={(e) => setData("start_date", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Tanggal Selesai</label>
                                <Input
                                    type="date"
                                    value={data.end_date}
                                    min={data.start_date}
                                    max={today}
                                    onChange={(e) => setData("end_date", e.target.value)}
                                />
                            </div>
                        </div>
                        <Select
                            value={data.format}
                            onValueChange={(v) => setData("format", v as "PDF" | "EXCEL")}
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
                    <DialogFooter className="p-4 border-t bg-white">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Memproses..." : "Generate & Download"}
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    );
}
