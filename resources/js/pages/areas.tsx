import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Head, router } from '@inertiajs/react';
import {
    Edit,
    Eye,
    Home,
    Layers,
    MapPin,
    MoreVertical,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
    description: string | null;
    legend_color_hex: string; // area_groups.legend_color_hex
    legend_icon: string | null;
    is_active: boolean;
    feature_count: number; // COUNT dari area_features
    household_count: number; // SUM household_count dari area_features
    family_count: number; // SUM family_count dari area_features
}

interface Props {
    areaGroups: AreaGroup[];
    stats: {
        totalGroups: number;
        totalFeatures: number;
        totalHouseholds: number;
    };
}

export default function Areas({ areaGroups, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    // Action handlers
    const handleView = (id: number) => {
        router.visit(`/areas/${id}`);
    };

    const handleEdit = (id: number) => {
        console.log('Edit area group:', id);
        // TODO: Navigate to edit page or open edit modal
    };

    const handleDelete = (id: number) => {
        console.log('Delete area group:', id);
        // TODO: Show confirmation dialog and delete
    };

    const handleAdd = () => {
        console.log('Add new area group');
        // TODO: Navigate to add page or open add modal
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

            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'has_household' && group.household_count > 0) ||
                (filterType === 'no_household' && group.household_count === 0);

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

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kelompok Kawasan
                            </CardTitle>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalGroups.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total kelompok kawasan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Area Terdaftar
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalFeatures.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total fitur kawasan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rumah di Kawasan
                            </CardTitle>
                            <Home className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalHouseholds.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total rumah tercakup
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle>Daftar Kawasan</CardTitle>
                                    <CardDescription>
                                        Menampilkan {filteredAreaGroups.length}{' '}
                                        dari {areaGroups.length} kelompok
                                        kawasan
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Kawasan</span>
                                </Button>
                            </div>
                            {/* Search and Filter */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan nama atau kode kawasan..."
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
                                        <SelectItem value="has_household">
                                            Ada Rumah
                                        </SelectItem>
                                        <SelectItem value="no_household">
                                            Tanpa Rumah
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table View */}
                        <div className="hidden overflow-x-auto md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Id Kawasan</TableHead>
                                        <TableHead>Nama Kawasan</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Legend</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAreaGroups.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell className="font-medium">
                                                {group.id}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {group.name}
                                                    </div>
                                                    {group.description && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {group.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div>
                                                        {group.feature_count}{' '}
                                                        item
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {group.household_count}{' '}
                                                        rumah •{' '}
                                                        {group.family_count} KK
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-6 w-6 rounded border"
                                                        style={{
                                                            backgroundColor:
                                                                group.legend_color_hex,
                                                        }}
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {group.code}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Aksi
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleView(
                                                                    group.id,
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleEdit(
                                                                    group.id,
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    group.id,
                                                                )
                                                            }
                                                            className="cursor-pointer text-destructive focus:text-destructive"
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
                        </div>

                        {/* Mobile Card View */}
                        <div className="space-y-4 md:hidden">
                            {filteredAreaGroups.map((group) => (
                                <Card key={group.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <div
                                                        className="h-4 w-4 rounded border"
                                                        style={{
                                                            backgroundColor:
                                                                group.legend_color_hex,
                                                        }}
                                                    />
                                                    <CardTitle className="text-base">
                                                        {group.name}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="text-xs">
                                                    ID: {group.id} • Code:{' '}
                                                    {group.code}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Aksi
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleView(group.id)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(group.id)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(
                                                                group.id,
                                                            )
                                                        }
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {group.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {group.description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="default">
                                                {group.feature_count} Item
                                            </Badge>
                                            <Badge variant="secondary">
                                                {group.household_count} Rumah
                                            </Badge>
                                            <Badge variant="secondary">
                                                {group.family_count} KK
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
