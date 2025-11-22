import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

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

interface RoleDetail {
    id: number;
    name: string;
    created_at: string;
    feature_groups: FeatureGroup[];
    is_superadmin: boolean;
}

interface EditRoleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: RoleDetail | null;
}

export default function EditRole({ open, onOpenChange, role }: EditRoleProps) {
    const [formData, setFormData] = useState<RoleDetail | null>(role);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setFormData(role);
    }, [role]);

    if (!formData) return null;

    const handleCheckboxChange = (groupId: string, featureId: number) => {
        const updated = {
            ...formData,
            feature_groups: formData.feature_groups.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          features: group.features.map((f) =>
                              f.id === featureId
                                  ? { ...f, can_access: !f.can_access }
                                  : f
                          ),
                      }
                    : group
            ),
        };
        setFormData(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setProcessing(true);

        const selectedPermissionIds = formData.feature_groups
            .flatMap((g) => g.features)
            .filter((f) => f.can_access)
            .map((f) => f.id);

        router.post(
            `/levels/update/${formData.id}`,
            {
                name: formData.name,
                permission_ids: selectedPermissionIds,
            },
            {
                onSuccess: () => {
                    setProcessing(false);
                    onOpenChange(false);
                },
                onError: () => {
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-background">
                <DialogHeader className="px-6 pt-6 pb-2 border-b">
                    <DialogTitle className="text-xl font-semibold">
                        Edit Role
                    </DialogTitle>
                    <DialogDescription>
                        Atur hak akses fitur yang bisa digunakan oleh role ini.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="edit-role-form"
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
                >
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">
                            Nama Role
                        </p>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            disabled={formData.is_superadmin}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formData.is_superadmin && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Role ini adalah Superadmin dan tidak dapat diubah.
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Hak Akses Fitur
                        </p>
                        <div className="space-y-4">
                            {formData.feature_groups.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                    Tidak ada grup fitur yang tersedia.
                                </p>
                            ) : (
                                formData.feature_groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="border rounded-lg p-4 bg-muted/40"
                                    >
                                        <p className="font-medium text-sm mb-3">
                                            {group.name}
                                        </p>
                                        <div className="space-y-2">
                                            {group.features.length === 0 ? (
                                                <p className="text-xs text-muted-foreground italic">
                                                    Tidak ada fitur dalam grup ini.
                                                </p>
                                            ) : (
                                                group.features.map((f) => (
                                                    <label
                                                        key={f.id}
                                                        className="flex items-center space-x-3 text-sm"
                                                    >
                                                        <Checkbox
                                                            checked={f.can_access}
                                                            onCheckedChange={() =>
                                                                handleCheckboxChange(
                                                                    group.id,
                                                                    f.id
                                                                )
                                                            }
                                                            disabled={
                                                                formData.is_superadmin
                                                            }
                                                        />
                                                        <span>{f.name}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                        Dibuat pada:{" "}
                        {new Date(formData.created_at).toLocaleDateString()}
                    </div>
                </form>

                <DialogFooter className="px-6 py-4 border-t bg-background">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        form="edit-role-form"
                        disabled={processing || formData.is_superadmin}
                    >
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
