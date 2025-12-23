import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { type HouseholdListItem } from '@/types/household';
import { getOwnershipLabel } from '@/utils/household-formatters';
import { router } from '@inertiajs/react';
import HouseholdActionsMenu from './household-actions-menu';

interface Props {
    household: HouseholdListItem;
    householdToDelete: number | null;
    isDeleting: boolean;
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
    householdToDelete,
    isDeleting,
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
            <TableCell className="font-medium">{household.id}</TableCell>
            <TableCell>{household.head_name}</TableCell>
            <TableCell className="font-mono text-sm">
                {household.nik || '-'}
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-sm">
                {household.address_text || '-'}
            </TableCell>
            <TableCell>
                <div className="text-sm">
                    <div>{household.village_name || '-'}</div>
                    <div className="text-muted-foreground">
                        {household.district_name}, {household.regency_name}
                    </div>
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
