import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date-formatters';
import { Head, router, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Detail User',
        href: '#',
    },
];

const ViewUser: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { props }: any = usePage();
    const user = props.user;

    const handleClose = () => {
        router.visit('/users');
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Detail User - ${user.name}`} />
                <div className="p-6 md:p-10">
                    <Card className="border border-gray-200 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <CardTitle className="text-2xl font-semibold text-gray-800">
                                    Detail Pengguna
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={user.name}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email_verified_at">
                                        Email Verified At
                                    </Label>
                                    <Input
                                        id="email_verified_at"
                                        type="text"
                                        value={formatDate(
                                            user.email_verified_at,
                                        )}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="created_at">
                                        Terdaftar
                                    </Label>
                                    <Input
                                        id="created_at"
                                        type="text"
                                        value={formatDate(user.created_at)}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Level</Label>
                                    <Input
                                        id="role"
                                        type="role"
                                        value={user.roles?.[0]?.name}
                                        disabled
                                        className="cursor-not-allowed bg-gray-100"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                    >
                                        Kembali
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
};

export default ViewUser;
