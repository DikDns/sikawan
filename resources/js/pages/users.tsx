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
import { Head } from '@inertiajs/react';
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
import { useMemo, useState } from 'react';

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

// Mock data types based on user table schema
interface User {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'operator';
    email_verified_at: string | null;
    created_at: string;
}

// Mock data - fully consistent with schema
const MOCK_USERS: User[] = [
    {
        id: 1501341233,
        name: 'Alex Reynoso',
        email: 'alex.reynoso@sikawan.com',
        role: 'superadmin',
        email_verified_at: '2025-01-01T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: 1501341234,
        name: 'Gordon Walker',
        email: 'gordon.walker@sikawan.com',
        role: 'admin',
        email_verified_at: '2025-02-15T00:00:00Z',
        created_at: '2025-02-15T00:00:00Z',
    },
    {
        id: 1501341235,
        name: 'Devon Robinson',
        email: 'devon.robinson@sikawan.com',
        role: 'admin',
        email_verified_at: '2025-03-20T00:00:00Z',
        created_at: '2025-03-20T00:00:00Z',
    },
    {
        id: 1501341236,
        name: 'Shemar Sanford',
        email: 'shemar.sanford@sikawan.com',
        role: 'operator',
        email_verified_at: '2025-04-10T00:00:00Z',
        created_at: '2025-04-10T00:00:00Z',
    },
];

export default function Users() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');

    // Action handlers
    const handleView = (id: number) => {
        console.log('View user:', id);
        // TODO: Navigate to user detail page
    };

    const handleEdit = (id: number) => {
        console.log('Edit user:', id);
        // TODO: Navigate to edit user page or open edit modal
    };

    const handleDelete = (id: number) => {
        console.log('Delete user:', id);
        // TODO: Show confirmation dialog and delete
    };

    const handleAdd = () => {
        console.log('Add new user');
        // TODO: Navigate to add user page or open add modal
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const totalUsers = MOCK_USERS.length;
        const adminUsers = MOCK_USERS.filter((u) => u.role === 'admin').length;
        const operatorUsers = MOCK_USERS.filter(
            (u) => u.role === 'operator',
        ).length;

        return {
            totalUsers,
            adminUsers,
            operatorUsers,
        };
    }, []);

    // Get unique roles for filter
    const userRoles = useMemo(() => {
        const uniqueRoles = Array.from(new Set(MOCK_USERS.map((u) => u.role)));
        return uniqueRoles.sort();
    }, []);

    // Filter and search
    const filteredUsers = useMemo(() => {
        return MOCK_USERS.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.id.toString().includes(searchQuery);

            const matchesRole =
                filterRole === 'all' || user.role === filterRole;

            return matchesSearch && matchesRole;
        });
    }, [searchQuery, filterRole]);

    // Helper function to get role icon
    const getRoleIcon = (role: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            superadmin: <UserCog className="h-4 w-4 text-red-600" />,
            admin: <User className="h-4 w-4 text-blue-600" />,
            operator: <UsersIcon className="h-4 w-4 text-green-600" />,
        };
        return iconMap[role] || <User className="h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
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
                                        {MOCK_USERS.length} pengguna
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="gap-2 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Pengguna</span>
                                </Button>
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
                                        value={filterRole}
                                        onValueChange={setFilterRole}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Peran Pengguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Peran
                                            </SelectItem>
                                            {userRoles.map((role) => (
                                                <SelectItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
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
                                        <TableHead>Peran</TableHead>
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
                                                    {getRoleIcon(user.role)}
                                                    <span className="font-medium">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        user.role ===
                                                        'superadmin'
                                                            ? 'destructive'
                                                            : user.role ===
                                                                'admin'
                                                              ? 'default'
                                                              : user.role ===
                                                                  'operator'
                                                                ? 'secondary'
                                                                : 'outline'
                                                    }
                                                >
                                                    {user.role}
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
                                                    {getRoleIcon(user.role)}
                                                    <CardTitle className="text-base">
                                                        {user.name}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="text-xs">
                                                    ID: {user.id} • {user.email}
                                                </CardDescription>
                                            </div>
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
                                                    user.role === 'superadmin'
                                                        ? 'destructive'
                                                        : user.role === 'admin'
                                                          ? 'default'
                                                          : user.role ===
                                                              'operator'
                                                            ? 'secondary'
                                                            : 'outline'
                                                }
                                            >
                                                {user.role}
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
