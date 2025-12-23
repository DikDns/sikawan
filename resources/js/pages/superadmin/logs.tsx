import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pager } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
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

// Helper to extract metadata entries for CREATE/DELETE actions
function getMetadataEntries(
    metadata: Record<string, unknown> | null | undefined,
    action: string,
): Array<[string, unknown]> {
    if (!metadata || typeof metadata !== 'object') return [];

    // If metadata has before/after structure, extract the appropriate data
    if ('before' in metadata || 'after' in metadata) {
        let data: unknown = null;
        if (action === 'CREATE' && 'after' in metadata) {
            data = metadata.after;
        } else if (action === 'DELETE' && 'before' in metadata) {
            data = metadata.before;
        } else if ('after' in metadata) {
            data = metadata.after;
        } else if ('before' in metadata) {
            data = metadata.before;
        }

        // If data is a string (JSON), try to parse it
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                // If parsing fails, return as single entry
                return [['Data', data]];
            }
        }

        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return Object.entries(data as Record<string, unknown>);
        }
        return data ? [['Data', data]] : [];
    }

    // Flat structure - return all entries
    return Object.entries(metadata);
}

// Helper to render a single metadata value
function renderMetadataValue(value: unknown): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }
    return String(value);
}

interface LogRow {
    id: number;
    created_at: string;
    user_name?: string | null;
    action: string;
    description?: string | null;
    entity_type?: string | null;
    entity_id?: number | null;
    metadata_json?:
        | (Record<string, unknown> & {
              before?: Record<string, unknown>;
              after?: Record<string, unknown>;
          })
        | null;
}

interface FilterUser {
    id: number;
    name: string;
}

interface FilterModel {
    value: string;
    name: string;
}

interface LogsPageProps {
    logs: {
        data: LogRow[];
        current_page: number;
        last_page: number;
    };
    filters: {
        applied?: {
            user_id?: string;
            model?: string;
            start_date?: string;
            end_date?: string;
        };
        users?: FilterUser[];
        models?: FilterModel[];
    };
    [key: string]: unknown;
}

export default function SuperadminLogs() {
    const { logs, filters } = usePage<LogsPageProps>().props;
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
        const query: Record<string, string | number | undefined> = {
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
            timeZone: 'Asia/Jakarta',
        });
    };

    // Helper untuk mendapatkan nama entity yang ramah pengguna
    const getEntityDisplayName = (
        entityType: string | null | undefined,
    ): string => {
        if (!entityType) return '-';
        const shortName = entityType.split('\\').pop() || '';
        return entityNames[shortName] || shortName;
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
                                        {filters?.users?.map(
                                            (u: FilterUser) => (
                                                <SelectItem
                                                    key={u.id}
                                                    value={String(u.id)}
                                                >
                                                    {u.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Jenis Data
                                </label>
                                <Select
                                    value={model}
                                    onValueChange={(val) =>
                                        setModel(val || 'all')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua jenis data" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua
                                        </SelectItem>
                                        {filters?.models?.map(
                                            (m: FilterModel, idx: number) => (
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
                                    {logs?.data?.map((row: LogRow) => (
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
                                                            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                                                                <div className="mt-6 space-y-4 px-4">
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
                                                                                Jenis
                                                                                Data
                                                                            </p>
                                                                            <p>
                                                                                {getEntityDisplayName(
                                                                                    row.entity_type,
                                                                                )}
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
                                                                    {row.metadata_json && (
                                                                        <div className="space-y-3">
                                                                            <p className="font-medium text-muted-foreground">
                                                                                Data
                                                                                Perubahan
                                                                            </p>
                                                                            {row.action ===
                                                                                'UPDATE' &&
                                                                            row
                                                                                .metadata_json
                                                                                .before &&
                                                                            row
                                                                                .metadata_json
                                                                                .after ? (
                                                                                <div className="space-y-3">
                                                                                    {/* Before Section */}
                                                                                    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                                                                                        <div className="border-b border-red-200 px-3 py-2 dark:border-red-900">
                                                                                            <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                                                                                                SEBELUM
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="p-3">
                                                                                            <div className="space-y-1.5">
                                                                                                {Object.entries(
                                                                                                    row
                                                                                                        .metadata_json
                                                                                                        .before,
                                                                                                ).map(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                key
                                                                                                            }
                                                                                                            className="flex flex-col gap-0.5 text-xs"
                                                                                                        >
                                                                                                            <span className="font-medium text-muted-foreground">
                                                                                                                {
                                                                                                                    key
                                                                                                                }
                                                                                                            </span>
                                                                                                            <span className="rounded bg-white/50 px-2 py-1 break-all dark:bg-black/20">
                                                                                                                {typeof value === 'string' &&
                                                                                                                    !isNaN(Date.parse(value))
                                                                                                                        ? formatDateTime(value)
                                                                                                                        : typeof value === 'object'
                                                                                                                            ? JSON.stringify(value)
                                                                                                                            : String(value ?? '-')}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    ),
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* After Section */}
                                                                                    <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                                                                                        <div className="border-b border-green-200 px-3 py-2 dark:border-green-900">
                                                                                            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                                                                                SESUDAH
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="p-3">
                                                                                            <div className="space-y-1.5">
                                                                                                {Object.entries(
                                                                                                    row
                                                                                                        .metadata_json
                                                                                                        .after,
                                                                                                ).map(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                key
                                                                                                            }
                                                                                                            className="flex flex-col gap-0.5 text-xs"
                                                                                                        >
                                                                                                            <span className="font-medium text-muted-foreground">
                                                                                                                {
                                                                                                                    key
                                                                                                                }
                                                                                                            </span>
                                                                                                            <span className="rounded bg-white/50 px-2 py-1 break-all dark:bg-black/20">
                                                                                                                {typeof value === 'string' &&
                                                                                                                    !isNaN(Date.parse(value))
                                                                                                                        ? formatDateTime(value)
                                                                                                                        : typeof value === 'object'
                                                                                                                            ? JSON.stringify(value)
                                                                                                                            : String(value ?? '-')}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    ),
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : row.action ===
                                                                              'CREATE' ? (
                                                                                // CREATE Action - Green Card
                                                                                <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                                                                                    <div className="border-b border-green-200 px-3 py-2 dark:border-green-900">
                                                                                        <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                                                                            DATA
                                                                                            DITAMBAHKAN
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="p-3">
                                                                                        <div className="space-y-1.5">
                                                                                            {getMetadataEntries(
                                                                                                row.metadata_json,
                                                                                                'CREATE',
                                                                                            )
                                                                                                .length >
                                                                                            0 ? (
                                                                                                getMetadataEntries(
                                                                                                    row.metadata_json,
                                                                                                    'CREATE',
                                                                                                ).map(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                key
                                                                                                            }
                                                                                                            className="flex flex-col gap-0.5 text-xs"
                                                                                                        >
                                                                                                            <span className="font-medium text-muted-foreground">
                                                                                                                {
                                                                                                                    key
                                                                                                                }
                                                                                                            </span>
                                                                                                            <span className="rounded bg-white/50 px-2 py-1 break-all dark:bg-black/20">
                                                                                                                {renderMetadataValue(
                                                                                                                    value,
                                                                                                                )}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    ),
                                                                                                )
                                                                                            ) : (
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    Tidak
                                                                                                    ada
                                                                                                    data
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : row.action ===
                                                                              'DELETE' ? (
                                                                                // DELETE Action - Red Card
                                                                                <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                                                                                    <div className="border-b border-red-200 px-3 py-2 dark:border-red-900">
                                                                                        <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                                                                                            DATA
                                                                                            DIHAPUS
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="p-3">
                                                                                        <div className="space-y-1.5">
                                                                                            {getMetadataEntries(
                                                                                                row.metadata_json,
                                                                                                'DELETE',
                                                                                            )
                                                                                                .length >
                                                                                            0 ? (
                                                                                                getMetadataEntries(
                                                                                                    row.metadata_json,
                                                                                                    'DELETE',
                                                                                                ).map(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                key
                                                                                                            }
                                                                                                            className="flex flex-col gap-0.5 text-xs"
                                                                                                        >
                                                                                                            <span className="font-medium text-muted-foreground">
                                                                                                                {
                                                                                                                    key
                                                                                                                }
                                                                                                            </span>
                                                                                                            <span className="rounded bg-white/50 px-2 py-1 break-all dark:bg-black/20">
                                                                                                                {renderMetadataValue(
                                                                                                                    value,
                                                                                                                )}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    ),
                                                                                                )
                                                                                            ) : (
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    Tidak
                                                                                                    ada
                                                                                                    data
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                // Fallback for other actions
                                                                                <div className="rounded-lg border bg-muted/50 p-3">
                                                                                    <div className="space-y-1.5">
                                                                                        {typeof row.metadata_json ===
                                                                                            'object' &&
                                                                                        row.metadata_json !==
                                                                                            null ? (
                                                                                            Object.entries(
                                                                                                row.metadata_json,
                                                                                            ).map(
                                                                                                ([
                                                                                                    key,
                                                                                                    value,
                                                                                                ]) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            key
                                                                                                        }
                                                                                                        className="flex flex-col gap-0.5 text-xs"
                                                                                                    >
                                                                                                        <span className="font-medium text-muted-foreground">
                                                                                                            {
                                                                                                                key
                                                                                                            }
                                                                                                        </span>
                                                                                                        <span className="rounded bg-background px-2 py-1 break-all">
                                                                                                            {typeof value ===
                                                                                                            'object'
                                                                                                                ? JSON.stringify(
                                                                                                                      value,
                                                                                                                      null,
                                                                                                                      2,
                                                                                                                  )
                                                                                                                : String(
                                                                                                                      value ??
                                                                                                                          '-',
                                                                                                                  )}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                ),
                                                                                            )
                                                                                        ) : (
                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                {String(
                                                                                                    row.metadata_json,
                                                                                                )}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ScrollArea>
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
