import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface ViewRoleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: RoleDetail | null;
}

export default function ViewRole({
    open,
    onOpenChange,
    role,
}: ViewRoleProps) {
    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    max-w-5xl w-[95vw]
                    max-h-[90vh]
                    flex flex-col
                    rounded-2xl
                    overflow-hidden
                    bg-background
                "
            >
                <DialogHeader className="px-6 pt-6 pb-2 border-b">
                    <DialogTitle className="text-xl font-semibold">
                        Detail Role
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap mengenai role dan hak akses fitur.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Nama Role
                        </p>
                        <p className="font-medium text-base">
                            {role.name}
                            {role.is_superadmin && (
                                <Badge
                                    variant="default"
                                    className="ml-2 bg-blue-500/80 text-white"
                                >
                                    Superadmin
                                </Badge>
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Hak Akses
                        </p>

                        <div className="space-y-4">
                            {role.feature_groups.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                    Tidak ada grup fitur yang terdaftar.
                                </p>
                            ) : (
                                role.feature_groups.map((group) => (
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
                                                    <div
                                                        key={f.id}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span>{f.name}</span>
                                                        <Badge
                                                            variant={
                                                                f.can_access
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={
                                                                f.can_access
                                                                    ? "bg-green-500/80"
                                                                    : "bg-gray-300 text-gray-700"
                                                            }
                                                        >
                                                            {f.can_access
                                                                ? "Diizinkan"
                                                                : "Tidak"}
                                                        </Badge>
                                                    </div>
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
                        {new Date(role.created_at).toLocaleDateString()}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-background sticky bottom-0">
                    <Button className="cursor-pointer" onClick={() => onOpenChange(false)}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
