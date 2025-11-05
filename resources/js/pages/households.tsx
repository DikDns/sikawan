import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, Home, MapPin, Plus, Search, Users } from 'lucide-react';
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

interface Household {
    id: number;
    head_name: string;
    nik: string | null;
    address_text: string;
    rt_rw: string;
    status_mbr: 'MBR' | 'NON_MBR';
    member_total: number;
    male_count: number;
    female_count: number;
    kk_count: number;
    habitability_status: 'RLH' | 'RTLH';
    ownership_status_building: 'OWN' | 'RENT' | 'OTHER';
    latitude: number | null;
    longitude: number | null;
}

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
        habitability_status: 'RLH',
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
        habitability_status: 'RLH',
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
        habitability_status: 'RLH',
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
        habitability_status: 'RLH',
        ownership_status_building: 'OWN',
        latitude: -3.0638,
        longitude: 104.7432,
    },
];
export default function Households() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const stats = useMemo(() => {
        const total = MOCK_HOUSEHOLDS.length;
        const rlh = MOCK_HOUSEHOLDS.filter(
            (h) => h.habitability_status === 'RLH',
        ).length;
        const rtlh = MOCK_HOUSEHOLDS.filter(
            (h) => h.habitability_status === 'RTLH',
        ).length;

        return { total, rlh, rtlh };
    }, []);

    const filteredHouseholds = useMemo(() => {
        return MOCK_HOUSEHOLDS.filter((household) => {
            const matchesSearch =
                household.head_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.address_text
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.id.toString().includes(searchQuery);

            const matchesFilter =
                filterStatus === 'all' ||
                household.ownership_status_building === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, filterStatus]);

    const getStatusColor = (status: string) => {
        if (status === 'RTLH') return 'text-destructive bg-accent';
        if (status === 'RLH') return 'text-primary bg-primary';
        return 'text-secondary bg-secondary';
    };

    // const getStatusLabel = (status: string) => {
    //     if (status === 'RTLH') return 'Rumah Tidak Layak Huni';
    //     if (status === 'RLH') return 'Rumah Layak Huni';
    //     return 'Rumah Layak Huni (Perlu Perbaikan)';
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Rumah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-background p-4">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Data
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <Card className="justify-center border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center justify-between pb-0">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-medium text-foreground">
                                    Rumah
                                </div>
                                <div className="text-3xl font-bold text-secondary">
                                    {stats.total.toLocaleString('id-ID')}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center rounded bg-secondary/25 p-4">
                                    <Home className="h-10 w-10 text-secondary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center justify-between pb-0">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-medium text-foreground">
                                    RLH
                                </div>
                                <div className="text-3xl font-bold text-secondary">
                                    {stats.rlh.toLocaleString('id-ID')}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center rounded bg-primary/25 p-4">
                                    <Home className="h-10 w-10 text-primary/75" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center justify-between pb-0">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-medium text-foreground">
                                    RTLH
                                </div>
                                <div className="text-3xl font-bold text-secondary">
                                    {stats.rtlh.toLocaleString('id-ID')}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center rounded bg-destructive/25 p-4">
                                    <Home className="h-10 w-10 text-destructive" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card className="mb-6 border-border bg-card shadow-sm">
                    <CardHeader>
                        <CardTitle>Cari Rumah</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari nama, alamat, atau ID rumah..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="border-border pl-10"
                                />
                            </div>
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-full border-border sm:w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="OWN">
                                        Milik Sendiri
                                    </SelectItem>
                                    <SelectItem value="RENT">Sewa</SelectItem>
                                    <SelectItem value="OTHER">
                                        Lainnya
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Household Cards Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredHouseholds.map((household) => (
                        <Card
                            key={household.id}
                            className="group cursor-pointer overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-lg"
                            onClick={() => {
                                router.visit('/households/' + household.id);
                            }}
                        >
                            <CardHeader className="border-b border-border pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-base font-semibold text-foreground">
                                            {household.head_name}
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-xs text-muted-foreground">
                                            ID: {household.id}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${getStatusColor(household.habitability_status)} border-0 text-xs font-medium`}
                                    >
                                        {household.habitability_status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <span className="line-clamp-2 text-foreground">
                                        {household.address_text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground">
                                        {household.member_total} jiwa •{' '}
                                        {household.kk_count} KK
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {household.ownership_status_building ===
                                        'OWN'
                                            ? 'Milik Sendiri'
                                            : household.ownership_status_building ===
                                                'RENT'
                                              ? 'Sewa'
                                              : 'Lainnya'}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {household.status_mbr}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-4 w-full gap-2 group-hover:bg-muted"
                                >
                                    <Eye className="h-4 w-4" />
                                    Lihat Detail
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredHouseholds.length === 0 && (
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Tidak ada data rumah yang ditemukan
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
