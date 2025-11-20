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
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";

export default function ReportGenerateDialog({
    open,
    onOpenChange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {

    const today = dayjs().format("YYYY-MM-DD");

    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        description: "",
        type: "",
        start_date: "",
        end_date: "",
        format: "PDF",
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/reports/store", {
            onSuccess: () => {},
        });
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

                <form onSubmit={handleSubmit}>
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
