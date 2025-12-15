import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCan } from '@/utils/permissions';

interface Props {
    approvalCount: number;
    rejectedCount: number;
}

export default function HouseholdsHeader({ approvalCount, rejectedCount}: Props) {
    const can = useCan();

    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Data Rumah
                </h1>
            </div>
            <div className="flex flex-row gap-4 items-center">
                {can('households.approval') &&
                    <Button
                        size="lg"
                        className='gap-2'
                        variant='outline'
                        onClick={() => router.visit('/households/approval')}
                    >
                        Approval
                        {approvalCount > 0 && (
                            <Badge variant='destructive' className='pt-1'>
                                {approvalCount}
                            </Badge>
                        )}
                    </Button>
                }
                {can('households.rejected') &&
                    <Button
                        size='lg'
                        className='gap-2'
                        variant='destructive'
                        onClick={() => router.visit('/households/rejected')}
                    >
                        Data Ditolak
                        {rejectedCount > 0 && (
                            <Badge className='pt-1 bg-gray-100'>
                                {rejectedCount}
                            </Badge>
                        )}
                    </Button>
                }
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
        </div>
    );
}
