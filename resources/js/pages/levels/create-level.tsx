import React, { useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import type { BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Feature {
    id: number;
    name: string;
    can_access: boolean;
}

interface FeatureGroup {
    id: string;
    name: string;
    features: Feature[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard"
    },
    {
        title: "Level",
        href: "/levels"
    },
    {
        title: "Tambah Level",
        href: "/levels/create"
    },
];

const CreateLevel: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { props }: any = usePage();

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        permission_ids: [] as number[],
    });

    const toggleFeature = (id: number) => {
        setData(
            "permission_ids",
            data.permission_ids.includes(id)
                ? data.permission_ids.filter((x) => x !== id)
                : [...data.permission_ids, id]
        );
    };

    const toggleGroup = (group: FeatureGroup) => {
        const allIds = group.features.map((f) => f.id);
        const allSelected = allIds.every((id) =>
            data.permission_ids.includes(id)
        );

        if (allSelected) {
            setData(
                "permission_ids",
                data.permission_ids.filter((x) => !allIds.includes(x))
            );
        } else {
            setData(
                "permission_ids",
                Array.from(new Set([...data.permission_ids, ...allIds]))
            );
        }
    };

    const getGroupState = (groupIds: number[]) => {
        const selected = groupIds.filter((id) =>
            data.permission_ids.includes(id)
        );

        if (selected.length === groupIds.length) return true;
        if (selected.length === 0) return false;
        return "indeterminate";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/levels/store", {
            onSuccess: () => reset(),
        });
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast.error("Periksa kembali input Anda.");
        }
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
    }, [errors, props.flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Level" />
            <div className="p-6 md:p-10">
                <Card className="shadow-lg border border-gray-200">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.visit("/levels")}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <CardTitle className="text-2xl font-semibold">
                                Tambah Level Baru
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Level</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    placeholder="Masukkan nama level"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label>Hak Akses</Label>
                                <div className="border rounded-md p-4 bg-white max-h-[500px] overflow-auto">
                                    {props.permissions?.map((group: FeatureGroup, idx: number) => {
                                        const allIds = group.features.map((f) => f.id);
                                        return (
                                            <div key={idx} className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Checkbox
                                                        checked={getGroupState(allIds)}
                                                        onCheckedChange={() => toggleGroup(group)}
                                                    />
                                                    <span className="font-semibold">
                                                        {group.name}
                                                    </span>
                                                </div>
                                                <div className="ml-6 space-y-2">
                                                    {group.features.map((feat) => (
                                                        <div
                                                            key={feat.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                checked={data.permission_ids.includes(feat.id)}
                                                                onCheckedChange={() =>
                                                                    toggleFeature(feat.id)
                                                                }
                                                            />
                                                            <span>{feat.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.permission_ids && (
                                    <p className="text-sm text-red-500">
                                        {errors.permission_ids}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                    onClick={() => reset()}
                                >
                                    Reset
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Menyimpan..." : "Simpan Level"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CreateLevel;
