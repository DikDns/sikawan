import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface MessageItem {
  id: number;
  name: string;
  subject: string;
}

interface DeleteMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages?: MessageItem[];
  onDeleted?: () => void;
}

export default function DeleteMessage({
  open,
  onOpenChange,
  messages = [],
  onDeleted,
}: DeleteMessageProps) {
  const [confirmed, setConfirmed] = useState(false);
  const { setData, post, processing, reset } = useForm({
    ids: [] as number[],
  });

  useEffect(() => {
    setData("ids", messages.map((m) => m.id));
  }, [messages, setData]);

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

    post('/messages/destroy', {
      onSuccess: () => {
        reset();
        onOpenChange(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  const total = messages.length;
  const singleMessage = total === 1 ? messages[0] : null;

  // fungsi untuk memotong teks subjek agar tidak kepanjangan
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-transparent backdrop-blur-sm" />

      <DialogContent className="max-w-sm rounded-2xl bg-white/80 p-8 backdrop-blur-md shadow-lg text-center border border-white/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>

        <DialogTitle className="text-xl font-semibold text-gray-800">
          Hapus Pesan?
        </DialogTitle>

        <DialogDescription className="mt-2 text-sm text-gray-600">
          {total > 1 ? (
            <>
              Yakin ingin menghapus <b>{total}</b> pesan terpilih?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </>
          ) : singleMessage ? (
            <>
              Yakin ingin menghapus pesan dari{' '}
              <b>{singleMessage.name}</b> dengan subjek{' '}
              <span className="italic">
                “{truncate(singleMessage.subject, 40)}”
              </span>
              ?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </>
          ) : (
            'Tidak ada pesan yang dipilih untuk dihapus.'
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
              total === 0 ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            Saya yakin untuk menghapus pesan ini.
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
            {processing ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
