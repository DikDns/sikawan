import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    getAssistanceStatusColor,
    getAssistanceStatusLabel,
    getAssistanceTypeLabel,
} from '@/constants/assistance';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit, FileText, MoreVertical, Trash2 } from 'lucide-react';
import type { AssistanceCardProps } from '../types';

export function AssistanceCard({
    assistance,
    onEdit,
    onDelete,
    onStatusChange,
}: AssistanceCardProps) {
    const formatCurrency = (amount?: number) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'd MMMM yyyy', { locale: id });
        } catch {
            return '-';
        }
    };

    const statusColor = getAssistanceStatusColor(assistance.status);
    const statusVariant =
        statusColor === 'success'
            ? 'default'
            : statusColor === 'warning'
              ? 'secondary'
              : 'destructive';

    return (
        <Card className="relative">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                                {getAssistanceTypeLabel(
                                    assistance.assistance_type,
                                )}
                            </h3>
                            <Badge variant={statusVariant}>
                                {getAssistanceStatusLabel(assistance.status)}
                            </Badge>
                        </div>
                        {assistance.program && (
                            <p className="text-sm text-muted-foreground">
                                {assistance.program}
                            </p>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onEdit(assistance)}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(assistance.id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                        <p className="text-muted-foreground">Tanggal Mulai</p>
                        <p className="font-medium">
                            {formatDate(assistance.started_at)}
                        </p>
                    </div>
                    {assistance.completed_at && (
                        <div>
                            <p className="text-muted-foreground">
                                Tanggal Selesai
                            </p>
                            <p className="font-medium">
                                {formatDate(assistance.completed_at)}
                            </p>
                        </div>
                    )}
                    {assistance.funding_source && (
                        <div>
                            <p className="text-muted-foreground">Sumber Dana</p>
                            <p className="font-medium">
                                {assistance.funding_source}
                            </p>
                        </div>
                    )}
                    {assistance.cost_amount_idr && (
                        <div>
                            <p className="text-muted-foreground">Biaya</p>
                            <p className="font-medium">
                                {formatCurrency(assistance.cost_amount_idr)}
                            </p>
                        </div>
                    )}
                </div>

                {assistance.description && (
                    <div className="pt-1">
                        <p className="text-sm text-muted-foreground">
                            Keterangan
                        </p>
                        <p className="text-sm">{assistance.description}</p>
                    </div>
                )}

                {assistance.document_path && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                            window.open(
                                `/storage/${assistance.document_path}`,
                                '_blank',
                            );
                        }}
                    >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Lihat Dokumen
                    </Button>
                )}
            </CardContent>

            <CardFooter className="pt-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                            Ubah Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                        <DropdownMenuItem
                            onClick={() =>
                                onStatusChange(assistance.id, 'PROSES')
                            }
                            disabled={assistance.status === 'PROSES'}
                        >
                            Proses
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                onStatusChange(assistance.id, 'SELESAI')
                            }
                            disabled={assistance.status === 'SELESAI'}
                        >
                            Selesai
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                onStatusChange(assistance.id, 'DIBATALKAN')
                            }
                            disabled={assistance.status === 'DIBATALKAN'}
                        >
                            Dibatalkan
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
