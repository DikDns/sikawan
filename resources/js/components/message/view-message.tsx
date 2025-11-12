import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    content: string;
    created_at: string;
}

interface ViewMessageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: Message | null;
}

export default function ViewMessage({
    open,
    onOpenChange,
    message,
}: ViewMessageProps) {
    if (!message) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Pesan</DialogTitle>
                    <DialogDescription>
                        Pesan yang dikirim oleh pengguna melalui form kontak.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Nama Pengirim</p>
                        <p className="font-medium">{message.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{message.email}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Subjek</p>
                        <p className="font-medium">{message.subject}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Isi Pesan</p>
                        <p className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                            {message.content}
                        </p>
                    </div>

                    <div className="text-right text-xs text-muted-foreground">
                        Dikirim pada:{" "}
                        {dayjs(message.created_at).format("dddd, DD MMMM YYYY • HH:mm")}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
