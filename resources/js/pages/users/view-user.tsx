import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { BreadcrumbItem } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Users",
    href: "/users",
  },
  {
    title: "Detail User",
    href: "#",
  },
];

const ViewUser: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { props }: any = usePage();
  const user = props.user;

  const handleClose = () => {
    router.visit("/users");
  };

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Detail User - ${user.name}`} />
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
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_verified_at">Email Verified At</Label>
                  <Input
                    id="email_verified_at"
                    type="email_verified_at"
                    value={new Date(user.email_verified_at).toLocaleDateString()}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="created_at">Terdaftar</Label>
                  <Input
                    id="created_at"
                    type="created_at"
                    value={new Date(user.created_at).toLocaleDateString()}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Level</Label>
                  <Input
                    id="role"
                    type="role"
                    value={user.role}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
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
