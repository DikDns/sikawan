import StatsCard from '@/components/household/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { type HouseholdListItem, type HouseholdStats } from '@/types/household';
import { Head, router } from '@inertiajs/react';
import { Home, MapPin, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Rumah',
        href: '/households',
    },
];

interface Props {
    households: HouseholdListItem[];
    stats: HouseholdStats;
}

export default function Households({ households, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const filteredHouseholds = useMemo(() => {
        return households.filter((household) => {
            const matchesSearch =
                household.head_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.address_text
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.id.toString().includes(searchQuery);

            return matchesSearch;
        });
    }, [searchQuery, households]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredHouseholds.map((h) => h.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(
                selectedIds.filter((selectedId) => selectedId !== id),
            );
        }
    };

    const getStatusBadge = (status: string | null) => {
        if (status === 'RTLH') {
            return (
                <Badge
                    variant="destructive"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                    RTLH
                </Badge>
            );
        }
        if (status === 'RLH') {
            return (
                <Badge
                    variant="default"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                    Layak Huni
                </Badge>
            );
        }
        return <Badge variant="secondary">-</Badge>;
    };

    const getOwnershipLabel = (status: string | null) => {
        if (status === 'OWN') return 'Milik Pribadi';
        if (status === 'RENT') return 'Sewa';
        if (status === 'OTHER') return 'Lainnya';
        return '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Rumah" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-background p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Data Rumah
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Kelola dan pantau data hunian di wilayah Anda
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="gap-2 bg-[#B4F233] text-[#3A3A3A] hover:bg-[#B4F233]/90"
                        onClick={() => router.visit('/households/create')}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <StatsCard
                        title="Rumah"
                        value={stats.total}
                        icon={Home}
                        iconColor="text-[#8B87E8]"
                        iconBgColor="bg-[#8B87E8]/10"
                    />
                    <StatsCard
                        title="RLH"
                        value={stats.rlh}
                        icon={Home}
                        iconColor="text-[#8AD463]"
                        iconBgColor="bg-[#8AD463]/10"
                    />
                    <StatsCard
                        title="RTLH"
                        value={stats.rtlh}
                        icon={Home}
                        iconColor="text-[#EC6767]"
                        iconBgColor="bg-[#EC6767]/10"
                    />
                </div>

                {/* Search */}
                <Card className="border-border bg-card shadow-sm">
                    <CardHeader>
                        <CardTitle>Cari</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama, alamat, atau ID rumah..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-border pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={
                                                selectedIds.length ===
                                                    filteredHouseholds.length &&
                                                filteredHouseholds.length > 0
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Id Rumah ▼</TableHead>
                                    <TableHead>
                                        Nama Kepala Keluarga ▼
                                    </TableHead>
                                    <TableHead>Alamat ▼</TableHead>
                                    <TableHead>Kelayakan ▼</TableHead>
                                    <TableHead>Status Kepemilikan ▼</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHouseholds.map((household) => (
                                    <TableRow
                                        key={household.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() =>
                                            router.visit(
                                                `/households/${household.id}`,
                                            )
                                        }
                                    >
                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={selectedIds.includes(
                                                    household.id,
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleSelectOne(
                                                        household.id,
                                                        checked as boolean,
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {household.id}
                                        </TableCell>
                                        <TableCell>
                                            {household.head_name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <span className="line-clamp-2">
                                                    {household.address_text}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(
                                                household.habitability_status,
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-0 bg-[#D7EDFF] text-[#4A9FFF]"
                                            >
                                                {getOwnershipLabel(
                                                    household.ownership_status_building,
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.visit(
                                                                `/households/${household.id}`,
                                                            )
                                                        }
                                                    >
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.visit(
                                                                `/households/${household.id}/edit`,
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Apakah Anda yakin ingin menghapus data rumah ini?',
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    `/households/${household.id}`,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredHouseholds.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                Tidak ada data rumah yang ditemukan
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
