import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Head, router, usePage } from '@inertiajs/react';
import {
    Edit,
    Eye,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    User,
    UserCog,
    Users as UsersIcon,
} from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import DeleteUser from '@/components/delete-user';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useCan } from '@/utils/permissions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Pengguna',
        href: '/users',
    },
];

export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Role[];
    email_verified_at: string | null;
    created_at: string;
    permissions: string[];
}

export interface PageProps extends InertiaPageProps {
    auth: {
        user: User | null;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flash?: Record<string, any>;
    [key: string]: unknown;
}

export default function Users() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLevel, setFilterLevel] = useState<string>('all');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { flash, users } = usePage<{ flash?: any; users: User[] }>().props;
    const hasShownToast = React.useRef(false);

    const { props } = usePage<PageProps>();
    const { auth } = props;
    const user = auth.user;
    const can = useCan();

    console.log(user?.permissions);

    useEffect(() => {
        if (!hasShownToast.current && (flash?.success || flash?.error)) {
            if (flash?.success) toast.success(flash.success);
            if (flash?.error) toast.error(flash.error);
            hasShownToast.current = true;
        }
    }, [flash]);

    // Action handlers
    const handleView = (id: number) => {
        router.visit(`users/show/${id}`);
    };

    const handleEdit = (id: number) => {
        router.visit(`/users/edit/${id}`);
    };

    const [dialog, setDialog] = useState<{ open: boolean; id: number | null }>({
        open: false,
        id: null,
    });

    const handleDelete = (id: number) => {
        setDialog({ open: true, id });
    };

    const handleAdd = () => {
        router.visit('/users/create');
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const adminUsers = users.filter((u) => u.roles?.[0]?.name === 'admin').length;
        const operatorUsers = users.filter(
            (u: User) => u.roles?.[0]?.name === 'operator',
        ).length;

        return {
            totalUsers,
            adminUsers,
            operatorUsers,
        };
    }, [users]);

    // Get unique levels for filter
    const userLevels = useMemo(() => {
        const uniqueLevels = Array.from(
            new Set(
                users
                    .map((u) => u.roles?.[0]?.name)
                    .filter((v): v is string => typeof v === "string")
            )
        );
        return uniqueLevels.sort();
    }, [users]);

    // Filter and search
    const filteredUsers = useMemo(() => {
        return users.filter((user: User) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.id.toString().includes(searchQuery);

            const matchesLevel =
                filterLevel === 'all' || user.roles?.[0]?.name === filterLevel;

            return matchesSearch && matchesLevel;
        });
    }, [searchQuery, filterLevel, users]);

    // Helper function to get role icon
    const getLevelIcon = (levelName: string | undefined | null) => {
        const iconMap: Record<string, React.ReactNode> = {
            superadmin: <UserCog className="h-4 w-4 text-red-600" />,
            admin: <User className="h-4 w-4 text-blue-600" />,
            operator: <UsersIcon className="h-4 w-4 text-green-600" />,
        };

        return levelName ? iconMap[levelName] ?? <User className="h-4 w-4" /> : <User className="h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
            <Toaster richColors position="top-right" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Pengguna</h1>
                    <p className="text-muted-foreground">
                        Kelola pengguna dan hak akses sistem
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pengguna
                            </CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalUsers.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Jumlah total pengguna
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Admin
                            </CardTitle>
                            <User className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.adminUsers.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pengguna admin
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Operator
                            </CardTitle>
                            <UsersIcon className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.operatorUsers.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pengguna operator
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle>Daftar Pengguna</CardTitle>
                                    <CardDescription>
                                        Menampilkan {filteredUsers.length} dari{' '}
                                        {users.length} pengguna
                                    </CardDescription>
                                </div>
                                {can('users.create') && (
                                    <Button
                                        onClick={handleAdd}
                                        className="gap-2 sm:w-auto"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Tambah Pengguna</span>
                                    </Button>
                                )}
                            </div>
                            {/* Search and Filters */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan nama atau email..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select
                                        value={filterLevel}
                                        onValueChange={setFilterLevel}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Peran Pengguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Level
                                            </SelectItem>
                                            {userLevels.map((level) => (
                                                <SelectItem
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table View */}
                        <div className="hidden overflow-x-auto md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Id Pengguna</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Terdaftar</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getLevelIcon(user?.roles?.[0].name)}
                                                    <span className="font-medium">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        user.roles?.[0]?.name ===
                                                        'superadmin'
                                                            ? 'destructive'
                                                            : user.roles?.[0]?.name ===
                                                                'admin'
                                                              ? 'default'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {user.roles?.[0]?.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(can('users.view') || can('users.edit') || can('users.delete')) ? (
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
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Aksi
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            {can('users.view') && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleView(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </DropdownMenuItem>
                                                            )}
                                                            {can('users.edit') && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            {can('users.delete') && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user.id,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="space-y-4 md:hidden">
                            {filteredUsers.map((user) => (
                                <Card key={user.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    {getLevelIcon(user.roles?.[0].name)}
                                                    <CardTitle className="text-base">
                                                        {user.name}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="text-xs">
                                                    ID: {user.id} • {user.email}
                                                </CardDescription>
                                            </div>
                                            {dialog.open && (
                                                <DeleteUser
                                                    open={dialog.open}
                                                    onOpenChange={(open) =>
                                                        setDialog({ open, id: open ? dialog.id : null })
                                                    }
                                                    userId={dialog.id}
                                                />
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Aksi
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleView(user.id)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(user.id)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                            )
                                                        }
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant={
                                                    user?.roles?.[0].name === 'superadmin'
                                                        ? 'destructive'
                                                        : user?.roles?.[0].name === 'admin'
                                                            ? 'default'
                                                            : user?.roles?.[0].name === 'operator'
                                                                ? 'secondary'
                                                                : 'outline'
                                                }
                                            >
                                                {user?.roles?.[0].name || 'Tidak ada role'}
                                            </Badge>
                                            <Badge variant="outline">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
