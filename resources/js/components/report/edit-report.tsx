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
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

interface ReportItem {
    id: number;
    title: string;
    description: string | null;
    type: "RUMAH" | "KAWASAN" | "PSU" | "UMUM";
    start_date: string | null;
    end_date: string | null;
    format?: "PDF" | "EXCEL" | null;
}

interface EditReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    report: ReportItem | null;
}

export default function EditReportDialog({ open, onOpenChange, report }: EditReportDialogProps) {
    const [formData, setFormData] = useState<ReportItem | null>(report);
    const [processing, setProcessing] = useState(false);
    const normalizeDate = (date: string | null) => {
        if (!date) return null;
        return date.split("T")[0];
    };

    useEffect(() => {
        setFormData(report);
    }, [report]);

    useEffect(() => {
        if (!report) {
            setFormData(null);
            return;
        }

        setFormData({
            ...report,
            start_date: normalizeDate(report.start_date),
            end_date: normalizeDate(report.end_date),
        });
    }, [report]);

    if (!formData) return null;

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            `/reports/update/${formData.id}`,
            {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                format: formData.format,
            },
            {
                onSuccess: () => {
                    setProcessing(false);
                    onOpenChange(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-xl">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>Edit Laporan</DialogTitle>
                    <DialogDescription>
                        Ubah data laporan dan periode report.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="edit-report-form">
                    <div className="max-h-[70vh] overflow-y-auto px-6 pb-4 space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Judul Laporan</label>
                            <Input
                                placeholder="Judul laporan"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Deskripsi (opsional)</label>
                            <Textarea
                                placeholder="Deskripsi laporan"
                                value={formData.description ?? ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Tanggal Mulai</label>
                                <Input
                                    type="date"
                                    value={formData.start_date ?? ""}
                                    max={today}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            start_date: e.target.value,
                                            end_date:
                                                formData.end_date && formData.end_date < e.target.value
                                                    ? e.target.value
                                                    : formData.end_date,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Tanggal Selesai</label>
                                <Input
                                    type="date"
                                    value={formData.end_date ?? ""}
                                    min={formData.start_date ?? undefined}
                                    max={today}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t bg-white">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
