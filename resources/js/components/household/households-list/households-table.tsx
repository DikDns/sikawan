import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type HouseholdListItem } from '@/types/household';
import HouseholdRow from './household-row';

interface Props {
    households: HouseholdListItem[];
    selectedIds: number[];
    householdToDelete: number | null;
    isDeleting: boolean;
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onDeleteClick: (id: number) => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
}

export default function HouseholdsTable({
    households,
    selectedIds,
    householdToDelete,
    isDeleting,
    onSelectAll,
    onSelectOne,
    onDeleteClick,
    onDeleteConfirm,
    onDeleteCancel,
}: Props) {
    return (
        <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            households.length &&
                                        households.length > 0
                                    }
                                    onCheckedChange={onSelectAll}
                                />
                            </TableHead>
                            <TableHead>Id Rumah ▼</TableHead>
                            <TableHead>Nama Kepala Keluarga ▼</TableHead>
                            <TableHead>Alamat ▼</TableHead>
                            <TableHead>Kelayakan ▼</TableHead>
                            <TableHead>Status Kepemilikan ▼</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {households.map((household) => (
                            <HouseholdRow
                                key={household.id}
                                household={household}
                                isSelected={selectedIds.includes(household.id)}
                                householdToDelete={householdToDelete}
                                isDeleting={isDeleting}
                                onSelect={onSelectOne}
                                onDeleteClick={onDeleteClick}
                                onDeleteConfirm={onDeleteConfirm}
                                onDeleteCancel={onDeleteCancel}
                            />
                        ))}
                    </TableBody>
                </Table>

                {households.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                        Tidak ada data rumah yang ditemukan
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
