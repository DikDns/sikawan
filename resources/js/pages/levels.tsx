import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Level',
        href: '/levels',
    },
];

export default function Levels() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Level" />
        </AppLayout>
    )
}
