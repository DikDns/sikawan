import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pager } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Superadmin', href: '/superadmin/logs' },
];

const actionColors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const entityNames: Record<string, string> = {
    Household: 'Rumah',
    Area: 'Kawasan',
    AreaGroup: 'Kelompok Kawasan',
    Infrastructure: 'PSU',
    InfrastructureGroup: 'Kelompok PSU',
    User: 'Pengguna',
    Member: 'Anggota Keluarga',
    Photo: 'Foto',
    Score: 'Skor',
    TechnicalData: 'Data Teknis',
    Assistance: 'Bantuan',
    Province: 'Provinsi',
    City: 'Kota/Kabupaten',
    SubDistrict: 'Kecamatan',
    Village: 'Desa/Kelurahan',
};

const actionNames: Record<string, string> = {
    CREATE: 'Membuat',
    UPDATE: 'Mengubah',
    DELETE: 'Menghapus',
};

function formatDescription(row: {
    description?: string | null;
    action: string;
    entity_type?: string | null;
}): string {
    if (row.description) return row.description;

    const entityShort = row.entity_type?.split('\\').pop() || 'Data';
    const entityName = entityNames[entityShort] || entityShort;
    const actionName = actionNames[row.action] || row.action;

    return `${actionName} ${entityName}`;
}

export default function SuperadminLogs() {
    const { logs, filters } = usePage().props as any;
    const [userId, setUserId] = useState<string>(
        filters?.applied?.user_id || 'all',
    );
    const [model, setModel] = useState<string>(
        filters?.applied?.model || 'all',
    );
    const [start, setStart] = useState<string>(
        filters?.applied?.start_date || '',
    );
    const [end, setEnd] = useState<string>(filters?.applied?.end_date || '');

    const applyFilters = (page?: number) => {
        const query: any = {
            user_id: userId && userId !== 'all' ? userId : undefined,
            model: model && model !== 'all' ? model : undefined,
            start_date: start || undefined,
            end_date: end || undefined,
        };
        if (page) query.page = page;
        router.get('/superadmin/logs', query, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/superadmin/logs/activity/${id}`, {
            preserveScroll: true,
        });
    };

    const pageChange = (p: number) => applyFilters(p);

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle>Audit Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    User
                                </label>
                                <Select
                                    value={userId}
                                    onValueChange={(val) =>
                                        setUserId(val || 'all')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua
                                        </SelectItem>
                                        {filters?.users?.map((u: any) => (
                                            <SelectItem
                                                key={u.id}
                                                value={String(u.id)}
                                            >
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Model
                                </label>
                                <Select
                                    value={model}
                                    onValueChange={(val) =>
                                        setModel(val || 'all')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua
                                        </SelectItem>
                                        {filters?.models?.map(
                                            (m: any, idx: number) => (
                                                <SelectItem
                                                    key={idx}
                                                    value={m.value}
                                                >
                                                    {m.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Mulai
                                </label>
                                <Input
                                    type="date"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Selesai
                                </label>
                                <Input
                                    type="date"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => applyFilters()}
                            >
                                Terapkan
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setUserId('all');
                                    setModel('all');
                                    setStart('');
                                    setEnd('');
                                    applyFilters();
                                }}
                            >
                                Reset
                            </Button>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">
                                            Waktu
                                        </TableHead>
                                        <TableHead className="w-[120px]">
                                            User
                                        </TableHead>
                                        <TableHead className="w-[80px]">
                                            Aksi
                                        </TableHead>
                                        <TableHead className="min-w-[300px]">
                                            Deskripsi
                                        </TableHead>
                                        <TableHead className="w-[100px] text-right">
                                            Detail
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs?.data?.map((row: any) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDateTime(row.created_at)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {row.user_name || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        actionColors[
                                                            row.action
                                                        ] ||
                                                        'bg-gray-100 text-gray-800'
                                                    }
                                                >
                                                    {row.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        {formatDescription(row)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Sheet>
                                                        <SheetTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </SheetTrigger>
                                                        <SheetContent className="w-[400px] sm:w-[540px]">
                                                            <SheetHeader>
                                                                <SheetTitle>
                                                                    Detail Log
                                                                </SheetTitle>
                                                                <SheetDescription>
                                                                    {row.description ||
                                                                        row.action}{' '}
                                                                    -{' '}
                                                                    {formatDateTime(
                                                                        row.created_at,
                                                                    )}
                                                                </SheetDescription>
                                                            </SheetHeader>
                                                            <div className="mt-6 space-y-4">
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <p className="font-medium text-muted-foreground">
                                                                            User
                                                                        </p>
                                                                        <p>
                                                                            {row.user_name ||
                                                                                '-'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-muted-foreground">
                                                                            Aksi
                                                                        </p>
                                                                        <Badge
                                                                            className={
                                                                                actionColors[
                                                                                    row
                                                                                        .action
                                                                                ] ||
                                                                                ''
                                                                            }
                                                                        >
                                                                            {
                                                                                row.action
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-muted-foreground">
                                                                            Model
                                                                        </p>
                                                                        <p>
                                                                            {row.entity_type
                                                                                ?.split(
                                                                                    '\\',
                                                                                )
                                                                                .pop()}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-muted-foreground">
                                                                            ID
                                                                        </p>
                                                                        <p>
                                                                            {row.entity_id ??
                                                                                '-'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-2 font-medium text-muted-foreground">
                                                                        Data
                                                                        Perubahan
                                                                    </p>
                                                                    <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4 text-xs">
                                                                        {JSON.stringify(
                                                                            row.metadata_json,
                                                                            null,
                                                                            2,
                                                                        )}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </SheetContent>
                                                    </Sheet>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(row.id)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <Pager
                                page={logs?.current_page || 1}
                                pageCount={logs?.last_page || 1}
                                onChange={pageChange}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
