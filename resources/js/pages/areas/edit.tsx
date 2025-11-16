import {
    AreaGroupForm,
    type AreaGroup,
} from '@/components/area-group/area-group-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    group: AreaGroup;
}

const breadcrumbs = (id: number): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kawasan', href: '/areas' },
    { title: `Edit Kawasan`, href: `/areas/${id}/edit` },
];

export default function AreasEdit({ group }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(group.id!)}>
            <Head title={`Edit Kawasan`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <h1 className="text-2xl font-bold">Edit Kawasan</h1>
                <p className="text-muted-foreground">
                    Perbarui informasi kawasan.
                </p>
                <AreaGroupForm mode="edit" initial={group} />
            </div>
        </AppLayout>
    );
}
