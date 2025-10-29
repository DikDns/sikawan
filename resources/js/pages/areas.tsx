import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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

export default function Kawasan() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kawasan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kawasan</h1>
                        <p className="text-muted-foreground">
                            Manajemen data kawasan dan area
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h3 className="mb-2 text-lg font-semibold">
                                    Data Kawasan
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Area data management
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <h3 className="mb-2 text-lg font-semibold">
                                    Peta Kawasan
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Area mapping
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="mb-2 text-lg font-semibold">
                                Detail Kawasan
                            </h3>
                            <p className="text-muted-foreground">
                                Detailed area information will be displayed here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
