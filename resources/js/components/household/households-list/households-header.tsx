import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function HouseholdsHeader() {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Data Rumah
                </h1>
            </div>
            <Button
                size="lg"
                className="gap-2"
                variant="default"
                onClick={() => router.visit('/households/create')}
            >
                <Plus className="h-4 w-4" />
                Tambah
            </Button>
        </div>
    );
}
