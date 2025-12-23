import { Button } from '@/components/ui/button';
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
import { router } from '@inertiajs/react';
import { Eye, FileSpreadsheet, Loader2, PenLine, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

export default function HouseholdsHeader() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [showAreaDialog, setShowAreaDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setShowAreaDialog(true);
            setImportError(null);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleImportConfirm = () => {
        if (!selectedFile) return;

        setIsImporting(true);
        setShowAreaDialog(false);

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
                setShowAreaDialog(true);
            },
        });
    };

    return (
        <>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Data Rumah
                    </h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="lg" className="gap-2" variant="default">
                            <Plus className="h-4 w-4" />
                            Tambah
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => router.visit('/households/create')}
                        >
                            <PenLine className="mr-2 h-4 w-4" />
                            Masukan Manual
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleImportClick}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Import Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.visit('/households/preview')}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Data Import
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Area selection dialog */}
            <Dialog open={showAreaDialog} onOpenChange={setShowAreaDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Data Rumah Tangga</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <FileSpreadsheet className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium">{selectedFile?.name}</p>
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
                        <Button onClick={handleImportConfirm}>Import</Button>
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
        </>
    );
}
