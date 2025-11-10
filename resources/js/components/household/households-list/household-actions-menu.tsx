import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import DeleteHouseholdDialog from './delete-household-dialog';

interface Props {
    householdId: number;
    householdToDelete: number | null;
    isDeleting: boolean;
    onDeleteClick: (id: number) => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
}

export default function HouseholdActionsMenu({
    householdId,
    householdToDelete,
    isDeleting,
    onDeleteClick,
    onDeleteConfirm,
    onDeleteCancel,
}: Props) {
    const isThisHouseholdSelected = householdToDelete === householdId;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => router.visit(`/households/${householdId}`)}
                >
                    Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        router.visit(`/households/${householdId}/edit`)
                    }
                >
                    Edit
                </DropdownMenuItem>
                <DeleteHouseholdDialog
                    householdId={householdId}
                    isDeleting={isDeleting}
                    onDelete={onDeleteConfirm}
                    onCancel={onDeleteCancel}
                    open={isThisHouseholdSelected}
                    onOpenChange={(open) => {
                        if (!open) {
                            onDeleteCancel();
                        }
                    }}
                    trigger={
                        <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => {
                                e.preventDefault();
                                onDeleteClick(householdId);
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </DropdownMenuItem>
                    }
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
