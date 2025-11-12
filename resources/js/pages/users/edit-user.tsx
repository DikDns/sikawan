import React, { useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { toast } from 'sonner';

const EditUser: React.FC = () => {
  // ambil data user dari props inertia
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props }: any = usePage();
  const { user } = props; // user dari backend: Inertia::render('Users/Edit', ['user' => $user])

  interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: string;
  }

  const { data, setData, processing, errors, post } = useForm<UserFormData>({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "",
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error("Periksa kembali input Anda, terdapat kesalahan pada form.");
    }

    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [errors, props.flash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(`/users/update/${user.id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success("Data pengguna berhasil diperbarui."),
    });
  };

  const handleClose = () => {
    router.visit('/users');
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
    { title: `Edit User`, href: `/users/edit/${user.id}` },
  ];

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Edit User" />
        <div className="p-6 md:p-10">
          <Card className="shadow-lg border border-gray-200">
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
                  Edit Data Pengguna
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="example@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Level</Label>
                  <Select
                    value={data.role}
                    onValueChange={(value) => setData("role", value)}
                  >
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Pilih role pengguna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={processing}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? "Menyimpan..." : "Perbarui Data"}
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

export default EditUser;
