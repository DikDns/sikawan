import { AreaGroupStats } from '@/components/area-group/area-group-stats';
import { AreaGroupTable } from '@/components/area-group/area-group-table';
import { Button } from '@/components/ui/button';
import {
    Card,
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
import { Plus, Search } from 'lucide-react';
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
                            <Button
                                onClick={handleAdd}
                                className="gap-2 sm:w-auto"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Kawasan</span>
                            </Button>
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
