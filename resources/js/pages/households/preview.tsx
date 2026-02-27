import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    CheckCircle,
    Edit,
    Eye,
    FileSpreadsheet,
    Loader2,
    MoreVertical,
    Trash2,
    Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Preview Import', href: '/households/preview' },
];

interface PreviewHousehold {
    id: number;
    head_name: string;
    nik: string;
    province_name: string | null;
    regency_name: string | null;
    district_name: string | null;
    village_name: string | null;
    status_mbr: string;
    member_total: number;
    ownership_status_building: string | null;
    created_at: string;
}

interface Props {
    households: PreviewHousehold[];
    stats: {
        total: number;
    };
}

export default function HouseholdPreview({ households, stats }: Props) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [householdToDelete, setHouseholdToDelete] =
        useState<PreviewHousehold | null>(null);

    // Import states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    const handlePublishAll = () => {
        setIsPublishing(true);
        router.post(
            '/households/preview/publish',
            {},
            {
                onFinish: () => setIsPublishing(false),
            },
        );
    };

    const handleDeleteAll = () => {
        setIsDeletingAll(true);
        router.delete('/households/preview/delete-all', {
            onFinish: () => {
                setIsDeletingAll(false);
                setDeleteAllDialogOpen(false);
            },
        });
    };

    const handleDeleteClick = (household: PreviewHousehold) => {
        setHouseholdToDelete(household);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!householdToDelete) return;
        setDeletingId(householdToDelete.id);
        router.delete(`/households/${householdToDelete.id}?returnTo=preview`, {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setDeleteDialogOpen(false);
                setHouseholdToDelete(null);
            },
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setShowImportDialog(true);
            setImportError(null);
        }
        e.target.value = '';
    };

    const handleImportConfirm = () => {
        if (!selectedFile) return;

        setIsImporting(true);
        setShowImportDialog(false);

        const formData = new FormData();
        formData.append('file', selectedFile);

        router.post('/households/import', formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsImporting(false);
                setSelectedFile(null);
            },
            onError: (errors) => {
                setIsImporting(false);
                setImportError(errors.file || 'Gagal mengimpor file');
                setShowImportDialog(true);
            },
        });
    };

    const formatOwnership = (status: string | null) => {
        switch (status) {
            case 'OWN':
                return 'Milik Sendiri';
            case 'RENT':
                return 'Sewa';
            case 'OTHER':
                return 'Lainnya';
            default:
                return '-';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preview Import" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-background p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Preview Data Import
                        </h1>
                        <p className="text-muted-foreground">
                            {stats.total} data rumah tangga menunggu publikasi
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleImportClick}>
                            <Upload className="mr-2 h-4 w-4" />
                            Import Baru
                        </Button>
                        {stats.total > 0 && (
                            <AlertDialog
                                open={deleteAllDialogOpen}
                                onOpenChange={setDeleteAllDialogOpen}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        disabled={isDeletingAll}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {isDeletingAll
                                            ? 'Menghapus...'
                                            : 'Hapus Semua'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Hapus semua data preview?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {stats.total} data rumah tangga akan
                                            dihapus permanen dan tidak dapat
                                            dikembalikan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAll}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Ya, Hapus Semua
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        {stats.total > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={isPublishing}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {isPublishing
                                            ? 'Memproses...'
                                            : 'Publikasi Semua'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Publikasi semua data?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {stats.total} data rumah tangga akan
                                            dipublikasi dan menjadi data resmi.
                                            Pastikan semua data sudah benar.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handlePublishAll}
                                        >
                                            Ya, Publikasi
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Import confirmation dialog */}
                <Dialog
                    open={showImportDialog}
                    onOpenChange={setShowImportDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Import Data Rumah Tangga</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <FileSpreadsheet className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium">
                                    {selectedFile?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Data akan diimpor sebagai draft
                                </p>
                            </div>
                            {importError && (
                                <div className="w-full rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {importError}
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button onClick={handleImportConfirm}>
                                Import
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Loading overlay */}
                <Dialog open={isImporting}>
                    <DialogContent className="sm:max-w-md">
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">
                                    Mengimpor Data...
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Mohon tunggu, sedang memproses file Excel
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete confirmation dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Data {householdToDelete?.head_name} akan dihapus
                                permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {deletingId === householdToDelete?.id
                                    ? 'Menghapus...'
                                    : 'Hapus'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {households.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16">
                        <FileSpreadsheet className="h-16 w-16 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">
                            Belum ada data preview
                        </h3>
                        <p className="text-muted-foreground">
                            Import file Excel untuk melihat preview data
                        </p>
                        <Button className="mt-4" onClick={handleImportClick}>
                            <Upload className="mr-2 h-4 w-4" />
                            Import Data
                        </Button>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Preview ({stats.total})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama KRT</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead>Status MBR</TableHead>
                                        <TableHead>Anggota</TableHead>
                                        <TableHead>Kepemilikan</TableHead>
                                        <TableHead>Import</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {households.map((household) => (
                                        <TableRow key={household.id}>
                                            <TableCell className="font-medium">
                                                {household.head_name}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {household.nik}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>
                                                        {household.village_name}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {
                                                            household.district_name
                                                        }
                                                        ,{' '}
                                                        {household.regency_name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        household.status_mbr ===
                                                        'MBR'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {household.status_mbr}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {household.member_total} jiwa
                                            </TableCell>
                                            <TableCell>
                                                {formatOwnership(
                                                    household.ownership_status_building,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {household.created_at}
                                            </TableCell>
                                            <TableCell>
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
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/households/${household.id}?returnTo=preview`,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/households/${household.id}/edit?returnTo=preview`,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    household,
                                                                )
                                                            }
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
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
