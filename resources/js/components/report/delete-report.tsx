import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";

export interface ReportItem {
  id: number;
  title: string;
  type: string;
}

interface DeleteReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reports?: ReportItem[];
  onDeleted?: () => void;
}

export default function DeleteReport({
  open,
  onOpenChange,
  reports = [],
  onDeleted,
}: DeleteReportProps) {
  const [confirmed, setConfirmed] = useState(false);

  const { setData, post, processing, reset } = useForm({
    ids: [] as number[],
  });

  useEffect(() => {
    setData("ids", reports.map((r) => r.id));
  }, [reports, setData]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setConfirmed(false);
        reset();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();

    post("/reports/destroy", {
      onSuccess: () => {
        reset();
        onOpenChange(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  const total = reports.length;
  const single = total === 1 ? reports[0] : null;

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-transparent backdrop-blur-sm" />

      <DialogContent className="max-w-sm rounded-2xl bg-white/80 p-8 backdrop-blur-md shadow-lg text-center border border-white/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Hapus Laporan?
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm text-gray-600">
          {total > 1 ? (
            <>
              Yakin ingin menghapus <b>{total}</b> laporan terpilih?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </>
          ) : single ? (
            <>
              Yakin ingin menghapus laporan berjudul{" "}
              <span className="italic">
                “{truncate(single.title, 40)}”
              </span>
              ?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </>
          ) : (
            "Tidak ada laporan yang dipilih untuk dihapus."
          )}
        </DialogDescription>
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Checkbox
            id="confirm-delete"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            disabled={total === 0}
          />
          <label
            htmlFor="confirm-delete"
            className={`text-sm cursor-pointer ${
              total === 0 ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Saya yakin untuk menghapus laporan ini.
          </label>
        </div>
        <DialogFooter className="mt-8 flex justify-center gap-3">
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={!confirmed || processing || total === 0}
            onClick={handleDelete}
          >
            {processing ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
