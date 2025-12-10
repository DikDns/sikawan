import ReportGenerateDialog from '@/components/report/create-report';
import DeleteReport from '@/components/report/delete-report';
import EditReportDialog from '@/components/report/edit-report';
import HouseholdLineChart from '@/components/report/household-line-chart';
import HouseholdStatusChart from '@/components/report/household-status-chart';
import InfrastructureBarChart from '@/components/report/infrastructure-bar-chart';
import ReportViewDialog from '@/components/report/view-report';
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
import { useCan } from '@/utils/permissions';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
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
import { useMemo, useRef, useState } from 'react';

dayjs.locale('id');

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
    format?: 'PDF' | 'EXCEL' | null;
}

type ReportItem = Report;

export default function Reports({
    reports,
    houses,
    infrastructures,
}: {
    reports: Report[];
    houses: {
        id: number;
        habitability_status?: string | null;
        created_at?: string | null;
    }[];
    infrastructures: {
        id: number;
        name?: string | null;
        category?: string | null;
    }[];
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const refLine = useRef<HTMLDivElement>(null);
    const refStatus = useRef<HTMLDivElement>(null);
    const refInfra = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const perPage = 5;
    const formatDate = (date: string | null) =>
        date ? dayjs(date).format('DD MMM YYYY') : '-';
    const can = useCan();

    const [viewDialog, setViewDialog] = useState({
        open: false,
        report: null as Report | null,
    });

    // Action handlers
    const handleView = (report: Report) => {
        setViewDialog({
            open: true,
            report: report,
        });
    };

    const [editOpen, setEditOpen] = useState({
        open: false,
        report: null as Report | null,
    });

    const handleEdit = (report: Report) => {
        setEditOpen({
            open: true,
            report: report,
        });
    };

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedReports, setSelectedReports] = useState<ReportItem[]>([]);

    const handleDelete = (report: ReportItem) => {
        setSelectedReports([report]);
        setDeleteOpen(true);
    };

    const handleDownload = (filePath: string) => {
        const encoded = encodeURIComponent(filePath);
        window.open(`/reports/download/${encoded}`, '_blank');
    };

    const handleAdd = () => {
        setOpenCreate(true);
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const totalReports = reports.length;
        const generatedReports = reports.filter(
            (r) => r.status === 'GENERATED',
        ).length;
        const draftReports = reports.filter((r) => r.status === 'DRAFT').length;

        return { totalReports, generatedReports, draftReports };
    }, [reports]);

    // Get unique types for filter
    const reportTypes = useMemo(() => {
        if (!reports) return [];

        const uniqueTypes = Array.from(new Set(reports.map((r) => r.type)));

        return uniqueTypes.sort();
    }, [reports]);

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchSearch =
                report.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (report.description &&
                    report.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            const matchType =
                filterType === 'all' || report.type === filterType;
            const matchStatus =
                filterStatus === 'all' || report.status === filterStatus;

            return matchSearch && matchType && matchStatus;
        });
    }, [reports, searchQuery, filterType, filterStatus]);

    const totalPages = Math.ceil(filteredReports.length / perPage);
    const paginatedReports = filteredReports.slice(
        (page - 1) * perPage,
        page * perPage,
    );
    const [openCreate, setOpenCreate] = useState(false);
    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return '';
        return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
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
                                        dari {reports.length} laporan
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="cursor-pointer gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Buat Laporan</span>
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
                                    {paginatedReports.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-6 text-center text-muted-foreground"
                                            >
                                                Tidak ada data laporan yang
                                                tersedia.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">
                                                    {report.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {truncateText(
                                                                report.title,
                                                                50,
                                                            )}
                                                        </div>
                                                        {report.description && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {truncateText(
                                                                    report.description,
                                                                    60,
                                                                )}
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
                                                        {`${report.start_date ? formatDate(report.start_date) : 'Semua'} - ${
                                                            report.end_date
                                                                ? formatDate(
                                                                      report.end_date,
                                                                  )
                                                                : 'Semua'
                                                        }`}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {can('reports.view') ||
                                                    can('reports.download') ||
                                                    can('reports.update') ||
                                                    can('reports.destroy') ? (
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
                                                                        Open
                                                                        menu
                                                                    </span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>
                                                                    Aksi
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                {can(
                                                                    'reports.view',
                                                                ) && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleView(
                                                                                report,
                                                                            )
                                                                        }
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Lihat
                                                                        Detail
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {can(
                                                                    'reports.download',
                                                                ) && (
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
                                                                        Unduh
                                                                        Laporan
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {can(
                                                                    'reports.update',
                                                                ) && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                report,
                                                                            )
                                                                        }
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                {can(
                                                                    'reports.destroy',
                                                                ) && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                report,
                                                                            )
                                                                        }
                                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Hapus
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="space-y-4 md:hidden">
                            {paginatedReports.length === 0 ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Data Tidak Ditemukan
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground">
                                            Tidak ada data laporan yang
                                            tersedia.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ) : (
                                paginatedReports.map((report) => (
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
                                                {can('reports.view') ||
                                                can('reports.download') ||
                                                can('reports.update') ||
                                                can('reports.destroy') ? (
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
                                                            {can(
                                                                'reports.view',
                                                            ) && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleView(
                                                                            report,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can(
                                                                'reports.download',
                                                            ) && (
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
                                                                    Unduh
                                                                    Laporan
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can(
                                                                'reports.update',
                                                            ) && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            report,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            {can(
                                                                'reports.destroy',
                                                            ) && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            report,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
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
                                                    {`${report.start_date ? formatDate(report.start_date) : 'Semua'} - ${
                                                        report.end_date
                                                            ? formatDate(
                                                                  report.end_date,
                                                              )
                                                            : 'Semua'
                                                    }`}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                        {/* pagination */}
                        <div className="mt-6 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                page > 1 && setPage(page - 1)
                                            }
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }).map(
                                        (_, idx) => (
                                            <PaginationItem key={idx}>
                                                <PaginationLink
                                                    isActive={page === idx + 1}
                                                    onClick={() =>
                                                        setPage(idx + 1)
                                                    }
                                                >
                                                    {idx + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ),
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                page < totalPages &&
                                                setPage(page + 1)
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
                {/* charts */}
                <div id="chart-status">
                    <HouseholdStatusChart ref={refStatus} houses={houses} />
                </div>
                <div id="chart-line">
                    <HouseholdLineChart ref={refLine} houses={houses} />
                </div>
                <div id="chart-infra">
                    <InfrastructureBarChart
                        ref={refInfra}
                        infrastructures={infrastructures}
                    />
                </div>

                {/* dialogs */}
                <ReportGenerateDialog
                    open={openCreate}
                    onOpenChange={setOpenCreate}
                />
                <DeleteReport
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    reports={selectedReports}
                />
                <ReportViewDialog
                    open={viewDialog.open}
                    onOpenChange={(open) =>
                        setViewDialog({ ...viewDialog, open })
                    }
                    report={viewDialog.report}
                />
                <EditReportDialog
                    open={editOpen.open}
                    onOpenChange={(open) => setEditOpen({ ...editOpen, open })}
                    report={editOpen.report}
                />
            </div>
        </AppLayout>
    );
}
