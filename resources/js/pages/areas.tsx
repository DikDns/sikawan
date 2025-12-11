import { AreaGroupStats } from '@/components/area-group/area-group-stats';
import { AreaGroupTable } from '@/components/area-group/area-group-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { csrfFetch, handleCsrfError } from '@/lib/csrf';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kawasan',
        href: '/areas',
    },
];
interface AreaGroup {
    id: number;
    code: string; // 'SLUM','SETTLEMENT','DISASTER_RISK','PRIORITY_DEV'
    name: string; // area_groups.name
    description: string | null; // area_groups.description
    areas_count: number; // count of area_features in this group
    legend_color_hex: string; // area_groups.legend_color_hex
    legend_icon: string | null;
    geometry_json: unknown | null;
    centroid_lat: number | null;
    centroid_lng: number | null;
}

interface Props {
    areaGroups: AreaGroup[];
    stats: {
        totalGroups: number;
    };
}

export default function Areas({ areaGroups, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [syncAllOpen, setSyncAllOpen] = useState(false);
    const [syncAllLoading, setSyncAllLoading] = useState(false);
    const [syncStarted, setSyncStarted] = useState(false);
    const [syncAllStatus, setSyncAllStatus] = useState<{
        status: string;
        total: number;
        pending: number;
        start_at?: string | null;
    } | null>(null);

    // Poll status when dialog is open
    useSyncDialogPolling(
        syncAllOpen,
        setSyncAllOpen,
        setSyncAllLoading,
        setSyncAllStatus,
        syncStarted,
        setSyncStarted,
    );

    // Action handlers
    const handleView = (id: number) => {
        router.visit(`/areas/${id}`);
    };

    const handleEdit = (id: number) => {
        router.visit(`/areas/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        router.delete(`/areas/${id}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAdd = () => {
        router.visit('/areas/create');
    };

    // Filter and search
    const filteredAreaGroups = useMemo(() => {
        return areaGroups.filter((group) => {
            const matchesSearch =
                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (group.description &&
                    group.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                group.id.toString().includes(searchQuery);

            const matchesFilter = filterType === 'all';

            return matchesSearch && matchesFilter;
        });
    }, [areaGroups, searchQuery, filterType]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Kawasan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Data Kawasan</h1>
                    <p className="text-muted-foreground">
                        Kelola data kawasan dan area permukiman
                    </p>
                </div>

                {/* Statistics Cards & Table */}
                <AreaGroupStats stats={stats} />

                {/* Toolbar (Search + Add) */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <CardTitle>Daftar Kawasan</CardTitle>
                                <CardDescription>
                                    Menampilkan {filteredAreaGroups.length} dari{' '}
                                    {areaGroups.length} kelompok kawasan
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    onClick={handleAdd}
                                    className="gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Kawasan</span>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setSyncAllOpen(true)}
                                    variant="secondary"
                                    className="gap-2 sm:w-auto"
                                    aria-label="Sinkronisasi Rumah"
                                >
                                    <span>Sinkronisasi Rumah</span>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari berdasarkan nama kawasan..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filterType}
                                onValueChange={setFilterType}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter Kawasan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kawasan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                </Card>

                <Dialog open={syncAllOpen} onOpenChange={setSyncAllOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Sinkronisasi Rumah dan Kawasan
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            {syncAllLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Spinner className="h-4 w-4" />
                                    <span>
                                        Memeriksa status sinkronisasi...
                                    </span>
                                </div>
                            ) : syncAllStatus?.status === 'running' &&
                              syncAllStatus.pending > 0 ? (
                                <Alert>
                                    <Spinner className="h-4 w-4 text-primary" />
                                    <AlertTitle>
                                        Sinkronisasi Sedang Berjalan
                                    </AlertTitle>
                                    <AlertDescription>
                                        <div>
                                            Proses:{' '}
                                            {Math.max(
                                                0,
                                                syncAllStatus.total -
                                                    syncAllStatus.pending,
                                            )}
                                            /{syncAllStatus.total}
                                        </div>
                                        {syncAllStatus.start_at && (
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                Dimulai:{' '}
                                                {new Date(
                                                    syncAllStatus.start_at,
                                                ).toLocaleString()}
                                            </div>
                                        )}
                                        <Progress
                                            value={
                                                syncAllStatus.total > 0
                                                    ? (Math.max(
                                                          0,
                                                          syncAllStatus.total -
                                                              syncAllStatus.pending,
                                                      ) /
                                                          syncAllStatus.total) *
                                                      100
                                                    : 0
                                            }
                                            className="mt-2"
                                        />
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Tindakan ini akan menyinkronkan semua Rumah
                                    dan Kawasan berdasarkan posisi geografis
                                    (koordinat lat/long rumah berada di dalam
                                    poligon kawasan).
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setSyncAllOpen(false)}
                            >
                                {syncAllStatus?.status === 'running' &&
                                syncAllStatus.pending > 0
                                    ? 'Tutup'
                                    : 'Batal'}
                            </Button>
                            {/* Only hide button when actively running */}
                            {!(
                                syncAllStatus?.status === 'running' &&
                                syncAllStatus.pending > 0
                            ) && (
                                <Button
                                    type="button"
                                    disabled={syncAllLoading}
                                    onClick={async () => {
                                        try {
                                            const res = await csrfFetch(
                                                '/areas/sync-all',
                                                { method: 'POST' },
                                            );
                                            if (!res.ok) {
                                                const data = await res
                                                    .json()
                                                    .catch(() => ({}));
                                                toast.error(
                                                    handleCsrfError(res, data),
                                                );
                                                return;
                                            }
                                            // Keep dialog open and set status to running
                                            setSyncStarted(true);
                                            setSyncAllStatus({
                                                status: 'running',
                                                total: 0,
                                                pending: 1,
                                                start_at:
                                                    new Date().toISOString(),
                                            });
                                        } catch {
                                            toast.error(
                                                'Terjadi kesalahan jaringan',
                                            );
                                        }
                                    }}
                                    className="gap-2"
                                >
                                    Mulai Sinkronisasi
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Statistics Cards & Table */}
                <AreaGroupTable
                    groups={filteredAreaGroups}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </AppLayout>
    );
}

// Poll sync status when dialog is open
function useSyncDialogPolling(
    dialogOpen: boolean,
    setDialogOpen: (v: boolean) => void,
    setLoading: (v: boolean) => void,
    setStatus: (
        s: {
            status: string;
            total: number;
            pending: number;
            start_at?: string | null;
        } | null,
    ) => void,
    syncStarted: boolean,
    setSyncStarted: (v: boolean) => void,
) {
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        let isFirstLoad = true;
        let completedCount = 0;

        const poll = async () => {
            if (isFirstLoad) {
                setLoading(true);
            }
            try {
                const res = await csrfFetch('/areas/sync-all/status', {
                    method: 'GET',
                });
                const data = await res.json().catch(() => ({}));
                const status = String(data?.status || 'idle');
                const total = Number(data?.total || 0);
                const pending = Number(data?.pending || 0);
                const start_at = data?.start_at || null;

                setStatus({
                    status,
                    total,
                    pending,
                    start_at,
                });

                // If first load and sync is already running, mark as started
                const isRunning = status === 'running' && pending > 0;
                if (isFirstLoad && isRunning && !syncStarted) {
                    setSyncStarted(true);
                }

                // Only check for completion if sync was started by user
                if (syncStarted || isRunning) {
                    const isCompleted =
                        status === 'completed' || (total > 0 && pending <= 0);

                    if (isCompleted) {
                        completedCount++;
                        // After 3 consecutive completed checks, close dialog
                        if (completedCount >= 3) {
                            toast.success('Sinkronisasi semua kawasan selesai');
                            setDialogOpen(false);
                            setSyncStarted(false);
                            if (timer) clearInterval(timer);
                        }
                    } else {
                        completedCount = 0; // Reset if not completed
                    }
                }
            } catch {
                // swallow errors
            } finally {
                if (isFirstLoad) {
                    setLoading(false);
                    isFirstLoad = false;
                }
            }
        };

        if (dialogOpen) {
            completedCount = 0; // Reset on dialog open
            poll();
            // Poll every 2 seconds while dialog is open
            timer = setInterval(poll, 2000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [
        dialogOpen,
        setDialogOpen,
        setLoading,
        setStatus,
        syncStarted,
        setSyncStarted,
    ]);
}
