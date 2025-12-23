import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rumah', href: '/households' },
    { title: 'Import', href: '/households/import' },
];

interface AreaOption {
    value: string;
    label: string;
}

interface Props {
    areas: AreaOption[];
}

export default function HouseholdImport({ areas }: Props) {
    const [fileName, setFileName] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
        area_id: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
        setFileName(file?.name || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/households/import', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Data Rumah" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-background p-6">
                <div className="flex items-center gap-4">
                    <Link href="/households">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Import Data Rumah
                        </h1>
                        <p className="text-muted-foreground">
                            Upload file Excel untuk mengimpor data rumah tangga
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            Upload File Excel
                        </CardTitle>
                        <CardDescription>
                            File harus berformat .xlsx atau .xls dengan struktur
                            sesuai template baseline data 100-0-100.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Pilih Area (RT/RW)
                                </label>
                                <Select
                                    value={data.area_id}
                                    onValueChange={(value) =>
                                        setData('area_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih area tujuan import" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areas.map((area) => (
                                            <SelectItem
                                                key={area.value}
                                                value={area.value}
                                            >
                                                {area.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.area_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.area_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    File Excel
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-muted-foreground/50 px-6 py-10 transition-colors hover:border-primary hover:bg-muted/50">
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <div className="text-center">
                                            {fileName ? (
                                                <p className="font-medium text-primary">
                                                    {fileName}
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="font-medium">
                                                        Klik untuk upload
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        atau drag & drop
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                                {errors.file && (
                                    <p className="text-sm text-destructive">
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.file ||
                                        !data.area_id
                                    }
                                >
                                    {processing
                                        ? 'Mengimpor...'
                                        : 'Import Data'}
                                </Button>
                                <Link href="/households/preview">
                                    <Button variant="outline">
                                        Lihat Preview
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
