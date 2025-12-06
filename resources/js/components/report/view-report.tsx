import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Download } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

dayjs.locale("id");

interface ReportViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report: any | null;
}

export default function ReportViewDialog({
    open,
    onOpenChange,
    report,
}: ReportViewDialogProps) {
    const [tooltipEnabled, setTooltipEnabled] = useState(false);

    if (!report) return null;

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Laporan</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap dari laporan yang dipilih.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Judul Laporan</p>
                        <p className="font-medium">{report.title}</p>
                    </div>
                    {report.description && (
                        <div>
                            <p className="text-sm text-muted-foreground">Deskripsi</p>
                            <p className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                                {truncateText(report.description, 150)}
                            </p>
                        </div>
                    )}
                    <div className="flex gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Tipe</p>
                            <Badge variant="secondary" className="mt-1">
                                {report.type}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge
                                variant={
                                    report.status === "GENERATED"
                                        ? "default"
                                        : "secondary"
                                }
                                className="mt-1"
                            >
                                {report.status}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Periode</p>
                        <p className="font-medium">
                            {(() => {
                                const start = report.start_date
                                    ? dayjs(report.start_date).format("DD MMM YYYY")
                                    : null;

                                const end = report.end_date
                                    ? dayjs(report.end_date).format("DD MMM YYYY")
                                    : null;

                                if (!start && !end) return "Semua Periode";
                                if (!start && end) return `Semua - ${end}`;
                                if (start && !end) return `${start} - Semua`;
                                return `${start} - ${end}`;
                            })()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">File Laporan</p>
                        {report.file_path ? (
                            <TooltipProvider delayDuration={200} skipDelayDuration={999999}>
                                <Tooltip open={tooltipEnabled}>
                                    <TooltipTrigger
                                        asChild
                                        onMouseEnter={() => setTooltipEnabled(true)}
                                        onMouseLeave={() => setTooltipEnabled(false)}
                                    >
                                        <Button
                                            size="sm"
                                            className="mt-2"
                                            onClick={() =>
                                                window.open(
                                                    `/reports/download/${encodeURIComponent(
                                                        report.file_path
                                                    )}`,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            {truncateText(report.title, 30)}
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent side="bottom">
                                        <p>{report.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <p className="text-muted-foreground">Belum ada file</p>
                        )}
                    </div>
                    {report.created_at && (
                        <div className="text-right text-xs text-muted-foreground">
                            Dibuat pada:{" "}
                            {dayjs(report.created_at).format(
                                "dddd, DD MMMM YYYY • HH:mm"
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button onClick={() => onOpenChange(false)}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
