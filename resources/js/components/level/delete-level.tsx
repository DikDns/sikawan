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

interface Role {
  id: number;
  name: string;
}

interface DeleteRoleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName?: string;
  roles?: Role[];
  onDeleted?: () => void;
}

export default function DeleteRole({
  open,
  onOpenChange,
  roleName,
  roles,
  onDeleted,
}: DeleteRoleProps) {
  const [confirmed, setConfirmed] = useState(false);

  const { setData, post, processing, reset, errors } = useForm({
    ids: [] as number[] | null,
    delete: '',
  });

  useEffect(() => {
    if (roles) setData('ids', roles.map((r) => r.id));
  }, [roles, setData]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setConfirmed(false);
        reset();
      }, 0);
    }
  }, [open, reset]);

  const handleDelete = () => {
    post(`/levels/destroy`, {
      onSuccess: () => {
        onOpenChange(false);
        if (onDeleted) onDeleted();
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
          Hapus Role?
        </DialogTitle>

        <DialogDescription className="mt-2 text-sm text-gray-600">
          Yakin ingin menghapus role <b>{roleName}</b>?<br />
          Tindakan ini tidak dapat dibatalkan.
        </DialogDescription>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <Checkbox
            id="confirm-delete"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
          />
          <label htmlFor="confirm-delete" className="text-sm">
            Saya yakin untuk menghapus role ini.
          </label>
        </div>

        {errors.delete && (
          <p className="mt-4 text-sm text-red-600">{errors.delete}</p>
        )}

        <DialogFooter className="mt-8 flex justify-center gap-3">
          <DialogClose asChild>
            <Button variant="secondary">Batal</Button>
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
