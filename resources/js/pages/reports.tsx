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
    Download,
    Edit,
    Eye,
    FileText,
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
        title: 'Laporan',
        href: '/reports',
    },
];

// Mock data types based on schema
interface Report {
    id: number;
    title: string;
    description: string | null;
    type: 'RUMAH' | 'KAWASAN' | 'PSU' | 'UMUM';
    category: string | null;
    file_path: string | null;
    generated_by: number;
    start_date: string | null;
    end_date: string | null;
    status: 'DRAFT' | 'GENERATED';
}

// Mock data - fully consistent with schema
const MOCK_REPORTS: Report[] = [
    {
        id: 1501341233,
        title: 'Laporan Kondisi Rumah Tahun 2025',
        description:
            'Laporan komprehensif kondisi perumahan di wilayah Muara Enim',
        type: 'RUMAH',
        category: 'Kelayakan',
        file_path: '/storage/reports/laporan_rumah_2025.pdf',
        generated_by: 1,
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        status: 'GENERATED',
    },
    {
        id: 1501341234,
        title: 'Analisis Kawasan Kumuh',
        description: 'Identifikasi dan pemetaan kawasan kumuh di Muara Enim',
        type: 'KAWASAN',
        category: 'Infrastruktur',
        file_path: '/storage/reports/kawasan_kumuh_2025.pdf',
        generated_by: 1,
        start_date: '2025-03-01',
        end_date: '2025-06-30',
        status: 'GENERATED',
    },
    {
        id: 1501341235,
        title: 'Laporan PSU Tahunan',
        description: 'Tinjauan prasarana dan sarana infrastruktur',
        type: 'PSU',
        category: 'Infrastruktur',
        file_path: '/storage/reports/psu_2025.pdf',
        generated_by: 1,
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        status: 'DRAFT',
    },
    {
        id: 1501341236,
        title: 'Laporan Umum Pembangunan',
        description: 'Ringkasan keseluruhan pembangunan di Muara Enim',
        type: 'UMUM',
        category: 'Pembangunan',
        file_path: '/storage/reports/laporan_umum_2025.pdf',
        generated_by: 1,
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        status: 'DRAFT',
    },
];

export default function Reports() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Action handlers
    const handleView = (id: number) => {
        console.log('View report:', id);
        // TODO: Navigate to report detail page
    };

    const handleEdit = (id: number) => {
        console.log('Edit report:', id);
        // TODO: Navigate to edit report page
    };

    const handleDelete = (id: number) => {
        console.log('Delete report:', id);
        // TODO: Show confirmation dialog and delete
    };

    const handleDownload = (filePath: string) => {
        console.log('Download report:', filePath);
        // TODO: Implement file download logic
        window.open(filePath, '_blank');
    };

    const handleAdd = () => {
        console.log('Add new report');
        // TODO: Navigate to add report page or open add modal
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const totalReports = MOCK_REPORTS.length;
        const generatedReports = MOCK_REPORTS.filter(
            (r) => r.status === 'GENERATED',
        ).length;
        const draftReports = MOCK_REPORTS.filter(
            (r) => r.status === 'DRAFT',
        ).length;

        return {
            totalReports,
            generatedReports,
            draftReports,
        };
    }, []);

    // Get unique types for filter
    const reportTypes = useMemo(() => {
        const uniqueTypes = Array.from(
            new Set(MOCK_REPORTS.map((r) => r.type)),
        );
        return uniqueTypes.sort();
    }, []);

    // Filter and search
    const filteredReports = useMemo(() => {
        return MOCK_REPORTS.filter((report) => {
            const matchesSearch =
                report.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (report.description &&
                    report.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                report.id.toString().includes(searchQuery);

            const matchesType =
                filterType === 'all' || report.type === filterType;

            const matchesStatus =
                filterStatus === 'all' || report.status === filterStatus;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [searchQuery, filterType, filterStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Laporan</h1>
                    <p className="text-muted-foreground">
                        Kelola dan buat laporan sistem informasi
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Laporan
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalReports.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Jumlah laporan yang dibuat
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Generated Laporan
                            </CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.generatedReports.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Laporan yang sudah dibuat
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Draft Laporan
                            </CardTitle>
                            <FileText className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.draftReports.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Laporan dalam status draft
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
                                    <CardTitle>Daftar Laporan</CardTitle>
                                    <CardDescription>
                                        Menampilkan {filteredReports.length}{' '}
                                        dari {MOCK_REPORTS.length} laporan
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Laporan</span>
                                </Button>
                            </div>
                            {/* Search and Filters */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan judul atau deskripsi..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select
                                        value={filterType}
                                        onValueChange={setFilterType}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Tipe Laporan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Tipe
                                            </SelectItem>
                                            {reportTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={filterStatus}
                                        onValueChange={setFilterStatus}
                                    >
                                        <SelectTrigger className="w-full sm:w-[160px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Status
                                            </SelectItem>
                                            <SelectItem value="DRAFT">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="GENERATED">
                                                Generated
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
                                        <TableHead>Id Laporan</TableHead>
                                        <TableHead>Judul Laporan</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Periode</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">
                                                {report.id}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {report.title}
                                                    </div>
                                                    {report.description && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {report.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {report.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        report.status ===
                                                        'GENERATED'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {report.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {report.start_date} -{' '}
                                                    {report.end_date}
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
                                                                    report.id,
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDownload(
                                                                    report.file_path ||
                                                                        '',
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Unduh Laporan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleEdit(
                                                                    report.id,
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
                                                                    report.id,
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
                            {filteredReports.map((report) => (
                                <Card key={report.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <CardTitle className="text-base">
                                                    {report.title}
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    ID: {report.id} •{' '}
                                                    {report.type}
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
                                                                report.id,
                                                            )
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDownload(
                                                                report.file_path ||
                                                                    '',
                                                            )
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Unduh Laporan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(
                                                                report.id,
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
                                                                report.id,
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
                                        {report.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {report.description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary">
                                                {report.type}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    report.status ===
                                                    'GENERATED'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {report.status}
                                            </Badge>
                                            <Badge variant="outline">
                                                {report.start_date} -{' '}
                                                {report.end_date}
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
