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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { getCsrfToken } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Building2,
    Droplet,
    Edit,
    GraduationCap,
    Hospital,
    MoreVertical,
    Network,
    Plus,
    Search,
    SquareArrowUpRight,
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
    code: string;
    name: string;
    category: string;
    type: 'Marker' | 'Polyline' | 'Polygon';
    legend_color_hex: string | null;
    legend_icon: string | null;
    infrastructure_count: number;
    description: string;
}

interface Props {
    groups: InfrastructureGroup[];
    stats: {
        totalGroups: number;
    };
}

const getCategoryIcon = (category: string, legendIcon?: string | null) => {
    if (legendIcon === 'hospital') return <Hospital className="h-4 w-4" />;
    if (legendIcon === 'graduation-cap')
        return <GraduationCap className="h-4 w-4" />;
    if (legendIcon === 'zap') return <Zap className="h-4 w-4" />;
    if (legendIcon === 'droplet') return <Droplet className="h-4 w-4" />;
    if (legendIcon === 'building-2') return <Building2 className="h-4 w-4" />;
    if (legendIcon === 'trash-2') return <Trash2 className="h-4 w-4" />;
    const byCategory: Record<string, React.ReactNode> = {
        Kesehatan: <Hospital className="h-4 w-4" />,
        Pendidikan: <GraduationCap className="h-4 w-4" />,
        Listrik: <Zap className="h-4 w-4" />,
        'Air Bersih': <Droplet className="h-4 w-4" />,
        Drainase: <Droplet className="h-4 w-4" />,
        Sampah: <Trash2 className="h-4 w-4" />,
        Lainnya: <Building2 className="h-4 w-4" />,
    };
    return byCategory[category] || <Building2 className="h-4 w-4" />;
};

export default function Infrastructure({ groups, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [openForm, setOpenForm] = useState(false);
    const [editing, setEditing] = useState<InfrastructureGroup | null>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        category: 'Kesehatan',
        type: 'Marker' as 'Marker' | 'Polyline' | 'Polygon',
        legend_color_hex: '#20C997',
        legend_icon: 'building-2' as string,
        description: '' as string | null,
    });

    // Action handlers
    const handleView = (id: number) => {
        router.visit(`/infrastructure/${id}`);
    };

    const handleEdit = (id: number) => {
        const found = groups.find((g) => g.id === id) || null;
        setEditing(found);
        if (found) {
            setData({
                code: found.code,
                name: found.name,
                category: found.category,
                type: found.type,
                legend_color_hex: found.legend_color_hex || '',
                legend_icon: (found.legend_icon || 'building-2') as string,
                description: found.description || '',
            });
        }
        setOpenForm(true);
    };

    const handleDelete = (id: number) => {
        router.delete(`/infrastructure/${id}`, {
            data: { _token: getCsrfToken() },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAdd = () => {
        setEditing(null);
        reset();
        setData({
            code: '',
            name: '',
            category: 'Kesehatan',
            type: 'Marker',
            legend_color_hex: '#20C997',
            legend_icon: 'building-2',
            description: '',
        });
        setOpenForm(true);
    };

    // Calculate statistics
    // Removed unused totalInfrastructure to satisfy lint rules

    // Get unique categories for filter
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(groups.map((g) => g.category)),
        );
        return uniqueCategories.sort();
    }, [groups]);

    // Filter and search
    const filteredGroups = useMemo(() => {
        return groups.filter((group) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                group.name.toLowerCase().includes(q) ||
                group.code.toLowerCase().includes(q) ||
                group.category.toLowerCase().includes(q) ||
                group.id.toString().includes(searchQuery);

            const matchesType =
                filterType === 'all' || group.type === filterType;
            const matchesCategory =
                filterCategory === 'all' || group.category === filterCategory;

            return matchesSearch && matchesType && matchesCategory;
        });
    }, [groups, searchQuery, filterType, filterCategory]);

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
                                Marker
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {groups
                                    .filter((g) => g.type === 'Marker')
                                    .reduce(
                                        (sum, g) =>
                                            sum + (g.infrastructure_count || 0),
                                        0,
                                    )
                                    .toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total titik
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Jaringan
                            </CardTitle>
                            <Hospital className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {groups
                                    .filter(
                                        (g) =>
                                            g.type === 'Polyline' ||
                                            g.type === 'Polygon',
                                    )
                                    .reduce(
                                        (sum, g) =>
                                            sum + (g.infrastructure_count || 0),
                                        0,
                                    )
                                    .toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total jaringan
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
                                        {stats.totalGroups.toLocaleString()}{' '}
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
                                        value={filterType}
                                        onValueChange={setFilterType}
                                    >
                                        <SelectTrigger className="w-full sm:w-[160px]">
                                            <SelectValue placeholder="Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Tipe
                                            </SelectItem>
                                            <SelectItem value="Marker">
                                                Marker
                                            </SelectItem>
                                            <SelectItem value="Polyline">
                                                Polyline
                                            </SelectItem>
                                            <SelectItem value="Polygon">
                                                Polygon
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
                                        <TableHead>Tipe</TableHead>
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
                                                    {getCategoryIcon(
                                                        group.category,
                                                        group.legend_icon,
                                                    )}
                                                    <span className="font-medium">
                                                        {group.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {group.category}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {group.type}
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
                                                                group.legend_color_hex ||
                                                                undefined,
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
                                                            <SquareArrowUpRight className="mr-2 h-4 w-4" />
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
                                                                group.legend_color_hex ||
                                                                '#e2e8f0',
                                                        }}
                                                    >
                                                        {getCategoryIcon(
                                                            group.category,
                                                            group.legend_icon,
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
                                                        <SquareArrowUpRight className="mr-2 h-4 w-4" />
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
                                            <Badge variant="outline">
                                                {group.type}
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
            {/* Create/Edit Dialog */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editing
                                ? 'Edit Kelompok PSU'
                                : 'Tambah Kelompok PSU'}
                        </DialogTitle>
                        <DialogDescription>
                            Isi detail kelompok PSU untuk ditampilkan di tabel.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (editing) {
                                put(`/infrastructure/${editing.id}`, {
                                    onSuccess: () => {
                                        setOpenForm(false);
                                        setEditing(null);
                                        router.reload({
                                            only: ['groups', 'stats'],
                                        });
                                    },
                                });
                            } else {
                                post('/infrastructure', {
                                    onSuccess: () => {
                                        setOpenForm(false);
                                        setEditing(null);
                                        router.reload({
                                            only: ['groups', 'stats'],
                                        });
                                    },
                                });
                            }
                        }}
                        className="space-y-4"
                    >
                        <Field>
                            <FieldLabel htmlFor="code">Kode</FieldLabel>
                            <FieldContent>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                    placeholder="Mis. POWER_LINE"
                                />
                                <FieldError
                                    errors={
                                        errors.code
                                            ? [{ message: errors.code }]
                                            : []
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="name">Nama</FieldLabel>
                            <FieldContent>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Nama kelompok PSU"
                                />
                                <FieldError
                                    errors={
                                        errors.name
                                            ? [{ message: errors.name }]
                                            : []
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <div
                            className={cn(
                                !editing && 'grid gap-3 sm:grid-cols-2',
                            )}
                        >
                            <Field>
                                <FieldLabel htmlFor="category">
                                    Kategori
                                </FieldLabel>
                                <FieldContent>
                                    <Select
                                        value={data.category}
                                        onValueChange={(v) =>
                                            setData('category', v)
                                        }
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Kesehatan">
                                                Kesehatan
                                            </SelectItem>
                                            <SelectItem value="Pendidikan">
                                                Pendidikan
                                            </SelectItem>
                                            <SelectItem value="Listrik">
                                                Listrik
                                            </SelectItem>
                                            <SelectItem value="Air Bersih">
                                                Air Bersih
                                            </SelectItem>
                                            <SelectItem value="Drainase">
                                                Drainase
                                            </SelectItem>
                                            <SelectItem value="Sanitasi">
                                                Sanitasi
                                            </SelectItem>
                                            <SelectItem value="Sampah">
                                                Sampah
                                            </SelectItem>
                                            <SelectItem value="Jalan">
                                                Jalan
                                            </SelectItem>
                                            <SelectItem value="Lainnya">
                                                Lainnya
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError
                                        errors={
                                            errors.category
                                                ? [{ message: errors.category }]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                            {!editing && (
                                <Field>
                                    <FieldLabel htmlFor="type">Tipe</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            value={data.type}
                                            onValueChange={(v) =>
                                                setData(
                                                    'type',
                                                    v as
                                                        | 'Marker'
                                                        | 'Polyline'
                                                        | 'Polygon',
                                                )
                                            }
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Marker">
                                                    Marker
                                                </SelectItem>
                                                <SelectItem value="Polyline">
                                                    Polyline
                                                </SelectItem>
                                                <SelectItem value="Polygon">
                                                    Polygon
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            errors={
                                                errors.type
                                                    ? [{ message: errors.type }]
                                                    : []
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="legend_color_hex">
                                    Warna Legend
                                </FieldLabel>
                                <FieldContent>
                                    <Input
                                        id="legend_color_hex"
                                        type="color"
                                        value={data.legend_color_hex || ''}
                                        onChange={(e) =>
                                            setData(
                                                'legend_color_hex',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <FieldError
                                        errors={
                                            errors.legend_color_hex
                                                ? [
                                                      {
                                                          message:
                                                              errors.legend_color_hex,
                                                      },
                                                  ]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="legend_icon">
                                    Ikon Legend
                                </FieldLabel>
                                <FieldContent>
                                    <Select
                                        value={data.legend_icon || ''}
                                        onValueChange={(v) =>
                                            setData('legend_icon', v)
                                        }
                                    >
                                        <SelectTrigger id="legend_icon">
                                            <SelectValue placeholder="Pilih ikon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hospital">
                                                <Hospital /> (Kesehatan)
                                            </SelectItem>
                                            <SelectItem value="graduation-cap">
                                                <GraduationCap /> (Pendidikan)
                                            </SelectItem>
                                            <SelectItem value="zap">
                                                <Zap /> (Listrik)
                                            </SelectItem>
                                            <SelectItem value="droplet">
                                                <Droplet /> (Air)
                                            </SelectItem>
                                            <SelectItem value="trash-2">
                                                <Trash2 /> (Sampah)
                                            </SelectItem>
                                            <SelectItem value="building-2">
                                                <Building2 /> (Lainnya)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError
                                        errors={
                                            errors.legend_icon
                                                ? [
                                                      {
                                                          message:
                                                              errors.legend_icon,
                                                      },
                                                  ]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="description">
                                Deskripsi
                            </FieldLabel>
                            <FieldContent>
                                <Textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Deskripsi singkat kelompok PSU"
                                    className="min-h-24"
                                />
                                <FieldError
                                    errors={
                                        errors.description
                                            ? [{ message: errors.description }]
                                            : []
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpenForm(false);
                                    setEditing(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editing ? 'Simpan Perubahan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
