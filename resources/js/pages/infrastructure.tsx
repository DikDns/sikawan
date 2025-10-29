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
import { Head } from '@inertiajs/react';
import {
    Building2,
    Droplet,
    Edit,
    Eye,
    GraduationCap,
    Hospital,
    MoreVertical,
    Network,
    Plus,
    Search,
    Trash2,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'PSU',
        href: '/infrastructure',
    },
];

// Mock data types based on SCHEMA_DB.md
// Ref: infrastructure_groups and infrastructures tables
interface InfrastructureGroup {
    id: number;
    code: string; // 'WATER_PIPE','POWER_POLE','SCHOOL','HOSPITAL', etc
    name: string; // infrastructure_groups.name
    category: string; // 'Air Bersih','Listrik','Pendidikan','Kesehatan'
    jenis: 'PRASARANA' | 'SARANA'; // infrastructure_groups.jenis
    legend_color_hex: string; // infrastructure_groups.legend_color_hex
    legend_icon: string; // infrastructure_groups.legend_icon
    infrastructure_count: number; // COUNT dari infrastructures
}

// Helper function to get icon based on code
const getInfraIcon = (code: string) => {
    const iconMap: Record<string, React.ReactNode> = {
        WATER_PIPE: <Droplet className="h-4 w-4" />,
        POWER_POLE: <Zap className="h-4 w-4" />,
        POWER_LINE: <Zap className="h-4 w-4" />,
        HOSPITAL: <Hospital className="h-4 w-4" />,
        SCHOOL: <GraduationCap className="h-4 w-4" />,
        SMA: <GraduationCap className="h-4 w-4" />,
        SD: <GraduationCap className="h-4 w-4" />,
        PUSKESMAS: <Hospital className="h-4 w-4" />,
    };
    return iconMap[code] || <Building2 className="h-4 w-4" />;
};

// Mock data - fully consistent with SCHEMA_DB.md
const MOCK_INFRASTRUCTURE_GROUPS: InfrastructureGroup[] = [
    {
        id: 1501341233,
        code: 'WATER_PIPE',
        name: 'Jalur Pipa Air',
        category: 'Air Bersih',
        jenis: 'PRASARANA',
        legend_color_hex: '#00D9FF',
        legend_icon: 'droplet',
        infrastructure_count: 4,
    },
    {
        id: 1501341234,
        code: 'POWER_POLE',
        name: 'Tiang PLN',
        category: 'Listrik',
        jenis: 'PRASARANA',
        legend_color_hex: '#FFD700',
        legend_icon: 'zap',
        infrastructure_count: 4,
    },
    {
        id: 1501341235,
        code: 'SCHOOL',
        name: 'Sekolah Menengah Atas',
        category: 'Pendidikan',
        jenis: 'SARANA',
        legend_color_hex: '#4C6EF5',
        legend_icon: 'graduation-cap',
        infrastructure_count: 4,
    },
    {
        id: 1501341236,
        code: 'HOSPITAL',
        name: 'Rumah Sakit',
        category: 'Kesehatan',
        jenis: 'SARANA',
        legend_color_hex: '#FF6B9D',
        legend_icon: 'hospital',
        infrastructure_count: 4,
    },
    {
        id: 1501341237,
        code: 'PUSKESMAS',
        name: 'Puskesmas',
        category: 'Kesehatan',
        jenis: 'SARANA',
        legend_color_hex: '#FA5252',
        legend_icon: 'hospital',
        infrastructure_count: 8,
    },
    {
        id: 1501341238,
        code: 'SD',
        name: 'Sekolah Dasar',
        category: 'Pendidikan',
        jenis: 'SARANA',
        legend_color_hex: '#20C997',
        legend_icon: 'graduation-cap',
        infrastructure_count: 15,
    },
    {
        id: 1501341239,
        code: 'POWER_LINE',
        name: 'Jaringan Listrik',
        category: 'Listrik',
        jenis: 'PRASARANA',
        legend_color_hex: '#FFA94D',
        legend_icon: 'zap',
        infrastructure_count: 12,
    },
    {
        id: 1501341240,
        code: 'DRAINAGE',
        name: 'Saluran Drainase',
        category: 'Drainase',
        jenis: 'PRASARANA',
        legend_color_hex: '#74C0FC',
        legend_icon: 'droplet',
        infrastructure_count: 6,
    },
];

export default function Infrastructure() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterJenis, setFilterJenis] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Action handlers
    const handleView = (id: number) => {
        console.log('View infrastructure group:', id);
        // TODO: Navigate to detail page showing all infrastructures in this group
    };

    const handleEdit = (id: number) => {
        console.log('Edit infrastructure group:', id);
        // TODO: Navigate to edit page or open edit modal
    };

    const handleDelete = (id: number) => {
        console.log('Delete infrastructure group:', id);
        // TODO: Show confirmation dialog and delete
    };

    const handleAdd = () => {
        console.log('Add new infrastructure group');
        // TODO: Navigate to add page or open add modal
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const totalGroups = MOCK_INFRASTRUCTURE_GROUPS.length;
        const totalPrasarana = MOCK_INFRASTRUCTURE_GROUPS.filter(
            (g) => g.jenis === 'PRASARANA',
        ).reduce((sum, g) => sum + g.infrastructure_count, 0);
        const totalSarana = MOCK_INFRASTRUCTURE_GROUPS.filter(
            (g) => g.jenis === 'SARANA',
        ).reduce((sum, g) => sum + g.infrastructure_count, 0);
        const totalInfrastructure = MOCK_INFRASTRUCTURE_GROUPS.reduce(
            (sum, g) => sum + g.infrastructure_count,
            0,
        );

        return {
            totalGroups,
            totalPrasarana,
            totalSarana,
            totalInfrastructure,
        };
    }, []);

    // Get unique categories for filter
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(MOCK_INFRASTRUCTURE_GROUPS.map((g) => g.category)),
        );
        return uniqueCategories.sort();
    }, []);

    // Filter and search
    const filteredGroups = useMemo(() => {
        return MOCK_INFRASTRUCTURE_GROUPS.filter((group) => {
            const matchesSearch =
                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                group.id.toString().includes(searchQuery);

            const matchesJenis =
                filterJenis === 'all' || group.jenis === filterJenis;

            const matchesCategory =
                filterCategory === 'all' || group.category === filterCategory;

            return matchesSearch && matchesJenis && matchesCategory;
        });
    }, [searchQuery, filterJenis, filterCategory]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data PSU" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Data PSU</h1>
                    <p className="text-muted-foreground">
                        Kelola data Prasarana, Sarana, dan Utilitas
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kelompok PSU
                            </CardTitle>
                            <Network className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalGroups.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total kelompok infrastruktur
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Prasarana
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalPrasarana.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total prasarana terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sarana
                            </CardTitle>
                            <Hospital className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalSarana.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total sarana terdaftar
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
                                    <CardTitle>Daftar PSU</CardTitle>
                                    <CardDescription>
                                        Menampilkan {filteredGroups.length} dari{' '}
                                        {MOCK_INFRASTRUCTURE_GROUPS.length}{' '}
                                        kelompok PSU
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah PSU</span>
                                </Button>
                            </div>
                            {/* Search and Filters */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan nama, kategori, atau kode..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select
                                        value={filterCategory}
                                        onValueChange={setFilterCategory}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Kategori
                                            </SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat}
                                                    value={cat}
                                                >
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={filterJenis}
                                        onValueChange={setFilterJenis}
                                    >
                                        <SelectTrigger className="w-full sm:w-[160px]">
                                            <SelectValue placeholder="Jenis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Jenis
                                            </SelectItem>
                                            <SelectItem value="PRASARANA">
                                                Prasarana
                                            </SelectItem>
                                            <SelectItem value="SARANA">
                                                Sarana
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table View */}
                        <div className="hidden overflow-x-auto md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Id PSU</TableHead>
                                        <TableHead>Nama PSU</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Legend</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredGroups.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell className="font-medium">
                                                {group.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getInfraIcon(group.code)}
                                                    <span className="font-medium">
                                                        {group.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {group.category}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        group.jenis ===
                                                        'PRASARANA'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {group.jenis}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {group.infrastructure_count}{' '}
                                                    item
                                                </span>
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
                            {filteredGroups.map((group) => (
                                <Card key={group.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <div
                                                        className="flex h-8 w-8 items-center justify-center rounded border"
                                                        style={{
                                                            backgroundColor:
                                                                group.legend_color_hex,
                                                        }}
                                                    >
                                                        {getInfraIcon(
                                                            group.code,
                                                        )}
                                                    </div>
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
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Kategori:
                                            </span>
                                            <span className="font-medium">
                                                {group.category}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant={
                                                    group.jenis === 'PRASARANA'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {group.jenis}
                                            </Badge>
                                            <Badge variant="outline">
                                                {group.infrastructure_count}{' '}
                                                Item
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
