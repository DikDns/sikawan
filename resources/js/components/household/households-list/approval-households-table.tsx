import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { Check, Eye, X } from 'lucide-react';
import { HouseholdListItem } from '@/types/household';
import { getOwnershipLabel } from '@/utils/household-formatters';

interface Props {
    households: HouseholdListItem[];
    isProcessing?: boolean;
}

export default function ApprovalHouseholdsTable({
    households,
    isProcessing = false,
}: Props) {
    const handleApprove = (id: number) => {
        router.post(
            `/households/approval/approve/${id}`,
            { preserveScroll: true },
        );
    };

    const handleReject = (id: number) => {
        router.post(
            `/households/approval/reject/${id}`,
            { preserveScroll: true },
        );
    };

    return (
        <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Rumah</TableHead>
                            <TableHead>Nama Kepala Keluarga</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Kelayakan</TableHead>
                            <TableHead>Status Kepemilikan</TableHead>
                            <TableHead className="text-center">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {households.map((household) => (
                            <TableRow key={household.id}>
                                <TableCell className="font-medium">
                                    {household.id}
                                </TableCell>
                                <TableCell>
                                    {household.head_name}
                                </TableCell>
                                <TableCell className="max-w-[280px] truncate">
                                    {household.address_text}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            household.habitability_status ===
                                            'RLH'
                                                ? 'default'
                                                : 'destructive'
                                        }
                                    >
                                        {household.habitability_status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant='secondary'>
                                        {getOwnershipLabel(household.ownership_status_building)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/households/${household.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="gap-2"
                                            disabled={isProcessing}
                                            onClick={() =>
                                                handleApprove(household.id)
                                            }
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            disabled={isProcessing}
                                            onClick={() =>
                                                handleReject(household.id)
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {households.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                        Tidak ada data rumah yang menunggu approval
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
