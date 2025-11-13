import { AreaGroupForm } from '@/components/area-group/area-group-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kawasan', href: '/areas' },
    { title: 'Tambah Kawasan', href: '/areas/create' },
];

export default function AreasCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kawasan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <h1 className="text-2xl font-bold">Tambah Kawasan</h1>
                <p className="text-muted-foreground">
                    Buat kelompok kawasan baru.
                </p>
                <AreaGroupForm mode="create" />
            </div>
        </AppLayout>
    );
}
