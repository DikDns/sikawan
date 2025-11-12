import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Download } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import ViewMessage from '@/components/message/view-message';
import DeleteMessage from '@/components/message/delete-message';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useCan } from '@/utils/permissions';

dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Pesan',
        href: '/messages',
    },
];

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Message({ messages }: { messages: any[] }) {
    const today = dayjs().startOf("day");
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
    const can = useCan();
    const formatDate = (date: string) => {
        const messageDate = dayjs(date);
        return messageDate.isAfter(today) ? messageDate.format("HH:mm") : messageDate.format("DD MMM");
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return messages;
        const lowerQuery = searchQuery.toLowerCase();
        return messages.filter(
            (item) =>
                item.name?.toLowerCase().includes(lowerQuery) ||
                item.email?.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, messages]);

    const toggleSelect = (id: number) => {
        setSelectedMessages((prev) =>
            prev.includes(id)
                ? prev.filter((msgId) => msgId !== id)
                : [...prev, id]
        );
    };

    const allSelected = selectedMessages.length === filteredData.length && filteredData.length > 0;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(filteredData.map((msg) => msg.id));
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { flash } = usePage<{ flash?:any }>().props;
    const hasShownToast = React.useRef(false);

    useEffect(() => {
        if (!hasShownToast.current && (flash?.success || flash?.error)) {
            if (flash?.success) toast.success(flash.success);
            if (flash?.error) toast.error(flash.error);
            hasShownToast.current = true;
        }
    }, [flash]);

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        ids: number[];
    }>({
        open: false,
        ids: [],
    });

    const handleDelete = () => {
        if (selectedMessages.length === 0) return;
        setDeleteDialog({
            open: true,
            ids: selectedMessages,
        });
    };

    const handleDownload = () => {
        alert(`Mengunduh ${selectedMessages.length} pesan`);
    };

    const [viewDialog, setViewDialog] = useState<{ open: boolean; id: number | null }>({
        open: false,
        id: null,
    });

    const selectedMessage = messages.find((m) => m.id === viewDialog.id) || null;

    const handleViewMessage = (id: number) => {
        setViewDialog({ open: true, id });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold">Pesan</h1>
                    <p className="text-muted-foreground">Kelola pesan masuk</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="sm:w-1/2">
                                    <CardTitle>Daftar Pesan</CardTitle>
                                    <CardDescription>
                                        Menampilkan semua pesan masuk dari pengguna
                                    </CardDescription>
                                </div>

                                {selectedMessages.length > 0 ? (
                                    <div className="flex gap-2 justify-end sm:w-1/2">
                                        {can('messages.destroy') && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </Button>
                                        )}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleDownload}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="relative sm:w-1/2 mt-4 sm:mt-0">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Cari email berdasarkan nama pengirim atau email pengirim..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-9"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {filteredData.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10">
                                Belum ada pesan masuk.
                            </div>
                        ) : (
                            <div className="divide-y">
                                <div className="flex items-center py-2 px-2">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        Pilih Semua
                                    </span>
                                </div>
                                {filteredData.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition ${
                                            selectedMessages.includes(msg.id)
                                                ? 'bg-muted/70'
                                                : ''
                                        }`}
                                        onClick={() => handleViewMessage(msg.id)}
                                    >
                                        <div className="flex items-start gap-3 w-1/3">
                                            <Checkbox
                                                className="mt-2"
                                                checked={selectedMessages.includes(
                                                    msg.id
                                                )}
                                                onClick={(e) => e.stopPropagation()}
                                                onCheckedChange={() =>
                                                    toggleSelect(msg.id)
                                                }
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">
                                                    {msg.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {msg.email}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-1/2 truncate text-sm text-gray-700">
                                            {msg.subject}
                                        </div>
                                        <div className="w-20 text-right text-xs text-gray-500">
                                            {formatDate(msg.created_at)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* dialogs */}
                        {can('messages.show') && (
                            <ViewMessage
                                open={viewDialog.open}
                                onOpenChange={(open) =>
                                    setViewDialog((prev) => ({ ...prev, open }))
                                }
                                message={selectedMessage}
                            />
                        )}
                        <DeleteMessage
                            open={deleteDialog.open}
                            onOpenChange={(open) =>
                                setDeleteDialog((prev) => ({
                                    ...prev,
                                    open,
                                }))
                            }
                            messages={messages.filter((msg) => selectedMessages.includes(msg.id))}
                            onDeleted={() =>  {
                                setSelectedMessages([]);
                                setDeleteDialog({
                                    open:false,
                                    ids: [],
                                })
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
