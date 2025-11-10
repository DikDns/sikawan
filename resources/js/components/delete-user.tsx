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
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface DeleteUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number | null;
}

export default function DeleteUser({
  open,
  onOpenChange,
  userId,
}: DeleteUserProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Inertia form
  const { data, setData, post, processing, reset } = useForm({
    id: userId ?? null,
  });

  // Update form state jika userId berubah
  // supaya id selalu sesuai dengan user yang dipilih
  if (data.id !== userId) {
    setData('id', userId);
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();

    post('/users/delete', {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-transparent backdrop-blur-sm" />

      <DialogContent className="max-w-sm rounded-2xl bg-white/80 p-8 backdrop-blur-md shadow-lg text-center border border-white/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>

        <DialogTitle className="text-xl font-semibold text-gray-800">
          Hapus Pengguna?
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm text-gray-600">
          Yakin hapus pengguna dengan ID{' '}
          <span className="text-blue-600 font-medium">{userId}</span>?
          <br />
          Harap pastikan kembali, karena setelah dihapus data ini tidak dapat
          dipulihkan.
        </DialogDescription>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <Checkbox
            id="confirm-delete"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
          />
          <label
            htmlFor="confirm-delete"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Saya yakin untuk menghapus data ini.
          </label>
        </div>

        <DialogFooter className="mt-8 flex justify-center gap-3">
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Batal Hapus
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={!confirmed || processing}
            onClick={handleDelete}
          >
            {processing ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
