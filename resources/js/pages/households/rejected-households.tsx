import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from "@/types";
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { HouseholdListItem } from '@/types/household';
import RejectedHouseholdsTable from '@/components/household/households-list/rejected-household-table';
import { toast, Toaster } from 'sonner';
import React, { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard'
    },
    {
        title: 'Rumah',
        href: '/households'
    },
    {
        title: 'Rejected',
        href: '/households/rejected'
    }
]

interface Props {
    households: HouseholdListItem[];
}

export default function HouseholdApproval({ households }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { flash } = usePage<{ flash?: any; }>().props;
    const hasShownToast = React.useRef(false);

    useEffect(() => {
        if (!hasShownToast.current && (flash?.success || flash?.error)) {
            if (flash?.success) toast.success(flash.success);
            if (flash?.error) toast.error(flash.error);
            hasShownToast.current = true;
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Rejected Rumah' />
            <Toaster richColors />
            <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
                {/* header */}
                <div>
                    <div className='flex flex-row gap-3'>
                        <Button
                            variant='ghost'
                            onClick={() => router.visit('/households/approval')}
                            className="mb-4 w-fit"
                        >
                            <ArrowLeft className='h-4 w-4' />
                        </Button>
                        <h1 className="text-2xl font-bold">Data Rumah Ditolak</h1>
                    </div>
                </div>

                {/* rejected table */}
                <RejectedHouseholdsTable
                    households={households}
                />
            </div>
        </AppLayout>
    )
}
