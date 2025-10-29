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
        title: 'Peta Sebaran',
        href: '/distribution-map',
    },
];

export default function DistributionMap() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Sebaran" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Peta Sebaran</h1>
                        <p className="text-muted-foreground">
                            Visualisasi distribusi data geografis
                        </p>
                    </div>
                </div>

                <div className="relative min-h-[600px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="mb-2 text-lg font-semibold">
                                Peta Sebaran
                            </h3>
                            <p className="text-muted-foreground">
                                Map visualization will be implemented here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
