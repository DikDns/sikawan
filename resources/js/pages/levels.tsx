import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import DeleteLevel from "@/components/level/delete-level";
import ViewLevel from "@/components/level/view-level";
import EditLevel from "@/components/level/edit-level";
import { useCan } from '@/utils/permissions';

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Levels", href: "/levels" },
];

interface Permission {
  id: number;
  name: string;
  can_access: boolean;
}

interface PermissionGroup {
  id: string;
  name: string;
  features: Permission[];
}

interface Role {
  id: number;
  name: string;
  created_at: string;
  feature_groups: PermissionGroup[];
  is_superadmin?: boolean;
}

export default function Roles({ roles }: { roles: Role[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { flash } = usePage<{ flash?: any }>().props;
  const hasShownToast = React.useRef(false);
  const can = useCan();

  useEffect(() => {
    if (!hasShownToast.current && (flash?.success || flash?.error)) {
      if (flash.success) toast.success(flash.success);
      if (flash.error) toast.error(flash.error);
      hasShownToast.current = true;
    }
  }, [flash]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return roles;
    const lower = searchQuery.toLowerCase();
    return roles.filter((rl) => {
      const permText = rl.feature_groups
        .flatMap((g) => g.features.map((f) => f.name))
        .join(" ")
        .toLowerCase();
      return rl.name.toLowerCase().includes(lower) || permText.includes(lower);
    });
  }, [searchQuery, roles]);

  const toggleSelect = (id: number) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    selectedRoles.length === filteredData.length && filteredData.length > 0;

  const toggleSelectAll = () => {
    setSelectedRoles(allSelected ? [] : filteredData.map((rl) => rl.id));
  };

  const handleAdd = () => router.visit("/levels/create");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewDialog, setViewDialog] = useState<{ open: boolean; role: any | null }>({
    open: false,
    role: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleView = (role: any) => {
    setViewDialog({ open: true, role });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editDialog, setEditDialog] = useState<{ open: boolean; role: any | null }>({
    open: false,
    role: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (role: any) => {
    setEditDialog({ open: true, role });
  };

  const [dialog, setDialog] = useState<{ open: boolean; roles: Role[] }>({
    open: false,
    roles: [],
  });

  const handleDelete = (role: Role) => {
    setDialog({ open: true, roles: [role] });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Level" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:w-1/2">
            <h1 className="text-2xl font-bold">Level</h1>
            <p className="text-muted-foreground">
              Kelola peran dan hak akses pengguna
            </p>
          </div>
          <div className="relative sm:w-1/2 mt-4 sm:mt-0 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari level..."
                className="pl-9"
              />
            </div>
            {can('levels.create') && (
                <Button className="gap-2 whitespace-nowrap" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                <span>Tambah Level</span>
                </Button>
            )}
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-sm">
                  <TableHead className="w-[80px]">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                      <span className="text-xs">ID</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-1/4">Nama Level</TableHead>
                  <TableHead>Hak Akses</TableHead>
                  <TableHead className="text-right w-28">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((rl) => (
                  <TableRow key={rl.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedRoles.includes(rl.id)}
                          onCheckedChange={() => toggleSelect(rl.id)}
                        />
                        <span className="text-sm">{rl.id}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{rl.name}</span>
                        <span className="text-xs text-gray-500">
                          Dibuat: {new Date(rl.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {rl.is_superadmin ? (
                        <span className="text-green-700 font-semibold">Semua akses</span>
                      ) : rl.feature_groups.length === 0 ? (
                        <span className="text-gray-400">Tidak ada hak akses</span>
                      ) : (
                        (() => {
                          const accessibleFeatures = rl.feature_groups.flatMap((g) =>
                            g.features.filter((f) => f.can_access).map((f) => f.name)
                          );

                          if (accessibleFeatures.length === 0) {
                            return <span className="text-gray-400">Tidak ada hak akses</span>;
                          }

                          const preview = accessibleFeatures.slice(0, 3);
                          const remaining = accessibleFeatures.length - preview.length;

                          return (
                            <div className="text-sm">
                              <ul className="list-disc list-inside space-y-1">
                                {preview.map((name, idx) => (
                                  <li key={idx} className="text-xs text-muted-foreground">
                                    {name}
                                  </li>
                                ))}
                              </ul>
                              {remaining > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  +{remaining} lainnya
                                </p>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {can('levels.show') && (
                            <DropdownMenuItem onClick={() => handleView(rl)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                          )}
                          {can('levels.update') && (
                            <DropdownMenuItem onClick={() => handleEdit(rl)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {can('levels.destroy') && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(rl)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* dialogs */}
            {dialog.open && (
              <DeleteLevel
                open={dialog.open}
                onOpenChange={(open) =>
                  setDialog({ open, roles: open ? dialog.roles : [] })
                }
                roles={dialog.roles}
                onDeleted={() => {
                  setDialog({ open: false, roles: [] });
                  router.reload();
                }}
              />
            )}
            {viewDialog.open && (
              <ViewLevel
                open={viewDialog.open}
                onOpenChange={(open) =>
                  setViewDialog({ open, role: open ? viewDialog.role : null })
                }
                role={viewDialog.role}
              />
            )}
            <EditLevel
              open={editDialog.open}
              onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
              role={editDialog.role}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
