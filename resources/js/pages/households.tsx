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
    Edit,
    Eye,
    Home,
    MapPin,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
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

// Mock data types based on SCHEMA_DB.md
// Ref: households table and house_eligibilities table
interface Household {
    id: number;
    head_name: string; // households.head_name
    nik: string | null; // households.nik
    address_text: string; // households.address_text
    rt_rw: string; // households.rt_rw
    status_mbr: 'MBR' | 'NON_MBR'; // households.status_mbr
    member_total: number; // households.member_total
    male_count: number; // households.male_count
    female_count: number; // households.female_count
    kk_count: number; // households.kk_count
    // From house_eligibilities
    habitability_status: 'LAYAK' | 'RLH' | 'RTLH'; // house_eligibilities.habitability_status
    // From households (added fields)
    ownership_status_building: 'OWN' | 'RENT' | 'OTHER'; // households.ownership_status_building
    latitude: number | null;
    longitude: number | null;
}

// Mock data - fully consistent with SCHEMA_DB.md
const MOCK_HOUSEHOLDS: Household[] = [
    {
        id: 1501341233,
        head_name: 'Anastasya Risna T.',
        nik: '1671234567890123',
        address_text: 'Jl. Merdeka No. 456, Kel. Cipta Jaya, Kec. Mekarsari',
        rt_rw: '003/012',
        status_mbr: 'NON_MBR',
        member_total: 4,
        male_count: 2,
        female_count: 2,
        kk_count: 1,
        habitability_status: 'LAYAK',
        ownership_status_building: 'OWN',
        latitude: -3.0627,
        longitude: 104.7429,
    },
    {
        id: 5101345246,
        head_name: 'Supriyadi',
        nik: '1671234567890234',
        address_text: 'Jl. Merpati No. 87, Kel. Cinta Abadi, Kec. Harapan',
        rt_rw: '005/008',
        status_mbr: 'MBR',
        member_total: 3,
        male_count: 1,
        female_count: 2,
        kk_count: 1,
        habitability_status: 'RTLH',
        ownership_status_building: 'OWN',
        latitude: -3.0632,
        longitude: 104.7435,
    },
    {
        id: 2730175548,
        head_name: 'Sulistyo Budi',
        nik: '1671234567890345',
        address_text:
            'Jl. Diponegoro No. 789, Kel. Harapan Jaya, Kec. Sejahtera',
        rt_rw: '002/015',
        status_mbr: 'NON_MBR',
        member_total: 5,
        male_count: 3,
        female_count: 2,
        kk_count: 1,
        habitability_status: 'LAYAK',
        ownership_status_building: 'RENT',
        latitude: -3.065,
        longitude: 104.7445,
    },
    {
        id: 9506932861,
        head_name: 'Joko Darwono',
        nik: '1671234567890456',
        address_text:
            'Jl. Melati Indah No. 777, Kel. Bahagia Jaya, Kec. Sejahtera',
        rt_rw: '007/003',
        status_mbr: 'MBR',
        member_total: 6,
        male_count: 4,
        female_count: 2,
        kk_count: 2,
        habitability_status: 'RTLH',
        ownership_status_building: 'RENT',
        latitude: -3.0615,
        longitude: 104.741,
    },
    {
        id: 3910793817,
        head_name: 'Putu Pageh',
        nik: '1671234567890567',
        address_text: 'Jl. Gajah Sakti No. 666, Kel. Cinta Damai, Kec. Harapan',
        rt_rw: '001/009',
        status_mbr: 'NON_MBR',
        member_total: 4,
        male_count: 2,
        female_count: 2,
        kk_count: 1,
        habitability_status: 'LAYAK',
        ownership_status_building: 'OWN',
        latitude: -3.068,
        longitude: 104.7455,
    },
    {
        id: 1696086371,
        head_name: 'Dewa Gede Adhiyaksa',
        nik: '1671234567890678',
        address_text:
            'Jl. Kebun Raya No. 101, Kel. Taman Indah, Kec. Mawarnada',
        rt_rw: '004/011',
        status_mbr: 'NON_MBR',
        member_total: 3,
        male_count: 1,
        female_count: 2,
        kk_count: 1,
        habitability_status: 'RLH',
        ownership_status_building: 'OWN',
        latitude: -3.0642,
        longitude: 104.7418,
    },
    {
        id: 6072232892,
        head_name: 'Muhammad Mualim',
        nik: '1671234567890789',
        address_text: 'Jl. Diponegoro No. 432, Kel. Karya Jaya, Kec. Damai',
        rt_rw: '006/007',
        status_mbr: 'MBR',
        member_total: 5,
        male_count: 2,
        female_count: 3,
        kk_count: 1,
        habitability_status: 'RTLH',
        ownership_status_building: 'OWN',
        latitude: -3.0658,
        longitude: 104.744,
    },
    {
        id: 7119240081,
        head_name: 'Viola Salvadora',
        nik: '1671234567890890',
        address_text: 'Jl. Diponegoro Murni No. 555, Kel. Wijaya Kusuma',
        rt_rw: '008/002',
        status_mbr: 'MBR',
        member_total: 4,
        male_count: 1,
        female_count: 3,
        kk_count: 1,
        habitability_status: 'RTLH',
        ownership_status_building: 'OWN',
        latitude: -3.0625,
        longitude: 104.7422,
    },
    {
        id: 3954212189,
        head_name: 'Nanda Mahardika',
        nik: '1671234567890901',
        address_text:
            'Jl. Merdeka Jaya No. 777, Kel. Maju Sentosa, Kec. Bahagia',
        rt_rw: '003/014',
        status_mbr: 'NON_MBR',
        member_total: 3,
        male_count: 2,
        female_count: 1,
        kk_count: 1,
        habitability_status: 'LAYAK',
        ownership_status_building: 'OWN',
        latitude: -3.0638,
        longitude: 104.7432,
    },
    {
        id: 4693691121,
        head_name: 'Rato Tangela',
        nik: '1671234567891012',
        address_text: 'Jl. Dipa Mulya No. 321, Kel. Wijaya Kusuma, Kec. Mawar',
        rt_rw: '002/010',
        status_mbr: 'MBR',
        member_total: 4,
        male_count: 2,
        female_count: 2,
        kk_count: 1,
        habitability_status: 'RLH',
        ownership_status_building: 'OWN',
        latitude: -3.0648,
        longitude: 104.7438,
    },
];

export default function Households() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Action handlers
    const handleView = (id: number) => {
        console.log('View household:', id);
        // TODO: Navigate to detail page or open modal
    };

    const handleEdit = (id: number) => {
        console.log('Edit household:', id);
        // TODO: Navigate to edit page or open edit modal
    };

    const handleDelete = (id: number) => {
        console.log('Delete household:', id);
        // TODO: Show confirmation dialog and delete
    };

    const handleAdd = () => {
        console.log('Add new household');
        // TODO: Navigate to add page or open add modal
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const total = MOCK_HOUSEHOLDS.length;
        const layak = MOCK_HOUSEHOLDS.filter(
            (h) => h.habitability_status === 'LAYAK',
        ).length;
        const rlh = MOCK_HOUSEHOLDS.filter(
            (h) => h.habitability_status === 'RLH',
        ).length;
        const rtlh = MOCK_HOUSEHOLDS.filter(
            (h) => h.habitability_status === 'RTLH',
        ).length;

        return { total, layak, rlh, rtlh };
    }, []);

    // Filter and search
    const filteredHouseholds = useMemo(() => {
        return MOCK_HOUSEHOLDS.filter((household) => {
            const matchesSearch =
                household.head_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.address_text
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.id.toString().includes(searchQuery) ||
                (household.nik && household.nik.includes(searchQuery));

            const matchesFilter =
                filterStatus === 'all' ||
                household.ownership_status_building === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, filterStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Rumah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Data Rumah</h1>
                    <p className="text-muted-foreground">
                        Kelola data rumah dan hunian
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rumah
                            </CardTitle>
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total rumah terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                RLH
                            </CardTitle>
                            <Home className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.rlh.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rumah Layak Huni (perlu perbaikan)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                RTLH
                            </CardTitle>
                            <Home className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.rtlh.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rumah Tidak Layak Huni
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
                                    <CardTitle>Daftar Rumah</CardTitle>
                                    <CardDescription>
                                        Menampilkan {filteredHouseholds.length}{' '}
                                        dari {MOCK_HOUSEHOLDS.length} rumah
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Rumah</span>
                                </Button>
                            </div>
                            {/* Search and Filter */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan nama, alamat, atau NIK..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <Select
                                    value={filterStatus}
                                    onValueChange={setFilterStatus}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Status Kepemilikan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="OWN">
                                            Milik Sendiri
                                        </SelectItem>
                                        <SelectItem value="RENT">
                                            Sewa
                                        </SelectItem>
                                        <SelectItem value="OTHER">
                                            Lainnya
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
                                        <TableHead>Id Rumah</TableHead>
                                        <TableHead>
                                            Nama Kepala Keluarga
                                        </TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Kelayakan</TableHead>
                                        <TableHead>
                                            Status Kepemilikan
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHouseholds.map((household) => (
                                        <TableRow key={household.id}>
                                            <TableCell className="font-medium">
                                                {household.id}
                                            </TableCell>
                                            <TableCell>
                                                {household.head_name}
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                    <span className="line-clamp-2 text-sm">
                                                        {household.address_text}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        household.habitability_status ===
                                                        'RTLH'
                                                            ? 'destructive'
                                                            : household.habitability_status ===
                                                                'LAYAK'
                                                              ? 'default'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {
                                                        household.habitability_status
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        household.ownership_status_building ===
                                                        'OWN'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {household.ownership_status_building ===
                                                    'OWN'
                                                        ? 'Milik Sendiri'
                                                        : household.ownership_status_building ===
                                                            'RENT'
                                                          ? 'Sewa'
                                                          : 'Lainnya'}
                                                </Badge>
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
                                                                    household.id,
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
                                                                    household.id,
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
                                                                    household.id,
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
                            {filteredHouseholds.map((household) => (
                                <Card key={household.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <CardTitle className="text-base">
                                                    {household.head_name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 text-xs">
                                                    ID: {household.id} • RT/RW:{' '}
                                                    {household.rt_rw}
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
                                                            handleView(
                                                                household.id,
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
                                                                household.id,
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
                                                                household.id,
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
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {household.address_text}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {household.member_total} jiwa (
                                                {household.male_count} L,{' '}
                                                {household.female_count} P) •{' '}
                                                {household.kk_count} KK
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant={
                                                    household.habitability_status ===
                                                    'RTLH'
                                                        ? 'destructive'
                                                        : household.habitability_status ===
                                                            'LAYAK'
                                                          ? 'default'
                                                          : 'secondary'
                                                }
                                            >
                                                {household.habitability_status}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    household.ownership_status_building ===
                                                    'OWN'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {household.ownership_status_building ===
                                                'OWN'
                                                    ? 'Milik Sendiri'
                                                    : household.ownership_status_building ===
                                                        'RENT'
                                                      ? 'Sewa'
                                                      : 'Lainnya'}
                                            </Badge>
                                            <Badge variant="outline">
                                                {household.status_mbr}
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
