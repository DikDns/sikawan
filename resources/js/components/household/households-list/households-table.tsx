import { Card, CardContent } from '@/components/ui/card';
import { Pager } from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type HouseholdListItem } from '@/types/household';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import HouseholdRow from './household-row';

interface PaginationInfo {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    households: HouseholdListItem[];
    householdToDelete: number | null;
    isDeleting: boolean;
    onDeleteClick: (id: number) => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (column: string) => void;
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
}

function SortIcon({
    column,
    sortBy,
    sortOrder,
}: {
    column: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}) {
    if (sortBy !== column) {
        return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? (
        <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
        <ArrowDown className="ml-1 h-3 w-3" />
    );
}

export default function HouseholdsTable({
    households,
    householdToDelete,
    isDeleting,
    onDeleteClick,
    onDeleteConfirm,
    onDeleteCancel,
    sortBy,
    sortOrder,
    onSort,
    pagination,
    onPageChange,
}: Props) {
    const sortableColumns = [
        { key: 'id', label: 'Id Rumah' },
        { key: 'head_name', label: 'Nama KRT' },
        { key: 'nik', label: 'NIK' },
        { key: 'address_text', label: 'Alamat' },
        { key: 'village_name', label: 'Lokasi' },
        { key: 'habitability_status', label: 'Kelayakan' },
        { key: 'ownership_status_building', label: 'Status Kepemilikan' },
    ];

    return (
        <Card className="border-border bg-card shadow-sm">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {sortableColumns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className="cursor-pointer select-none hover:bg-muted/50"
                                    onClick={() => onSort(col.key)}
                                >
                                    <div className="flex items-center">
                                        {col.label}
                                        <SortIcon
                                            column={col.key}
                                            sortBy={sortBy}
                                            sortOrder={sortOrder}
                                        />
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {households.map((household) => (
                            <HouseholdRow
                                key={household.id}
                                household={household}
                                householdToDelete={householdToDelete}
                                isDeleting={isDeleting}
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

                {/* Pagination */}
                {pagination.lastPage > 1 && (
                    <div className="flex flex-col items-center gap-3 border-t px-4 py-4 sm:flex-row sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {pagination.from || 0} -{' '}
                            {pagination.to || 0} dari {pagination.total} data
                        </div>
                        <Pager
                            page={pagination.currentPage}
                            pageCount={pagination.lastPage}
                            onChange={onPageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
