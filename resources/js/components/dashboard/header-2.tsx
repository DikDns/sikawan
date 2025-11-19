import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export function Header2() {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Kelayakan Rumah & Kebutuhan Rumah Baru
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        per Kecamatan
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 bg-transparent font-semibold text-secondary"
                >
                    2025
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
