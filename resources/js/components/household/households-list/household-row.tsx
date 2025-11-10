import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { type HouseholdListItem } from '@/types/household';
import { getOwnershipLabel } from '@/utils/household-formatters';
import { router } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import HouseholdActionsMenu from './household-actions-menu';

interface Props {
    household: HouseholdListItem;
    isSelected: boolean;
    householdToDelete: number | null;
    isDeleting: boolean;
    onSelect: (id: number, checked: boolean) => void;
    onDeleteClick: (id: number) => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
}

function getStatusBadge(status: string | null) {
    if (status === 'RTLH') {
        return <Badge variant="destructive">RTLH</Badge>;
    }
    if (status === 'RLH') {
        return <Badge variant="default">Layak Huni</Badge>;
    }
    return <Badge variant="outline">-</Badge>;
}

export default function HouseholdRow({
    household,
    isSelected,
    householdToDelete,
    isDeleting,
    onSelect,
    onDeleteClick,
    onDeleteConfirm,
    onDeleteCancel,
}: Props) {
    return (
        <TableRow
            key={household.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => router.visit(`/households/${household.id}`)}
        >
            <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                        onSelect(household.id, checked as boolean)
                    }
                />
            </TableCell>
            <TableCell className="font-medium">{household.id}</TableCell>
            <TableCell>{household.head_name}</TableCell>
            <TableCell>
                <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2">
                        {household.address_text}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                {getStatusBadge(household.habitability_status)}
            </TableCell>
            <TableCell>
                <Badge variant="secondary">
                    {getOwnershipLabel(household.ownership_status_building)}
                </Badge>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
                <HouseholdActionsMenu
                    householdId={household.id}
                    householdToDelete={householdToDelete}
                    isDeleting={isDeleting}
                    onDeleteClick={onDeleteClick}
                    onDeleteConfirm={onDeleteConfirm}
                    onDeleteCancel={onDeleteCancel}
                />
            </TableCell>
        </TableRow>
    );
}
