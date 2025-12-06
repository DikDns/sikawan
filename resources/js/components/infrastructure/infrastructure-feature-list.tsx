import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface InfrastructureItem {
    id: number;
    name: string;
    description?: string | null;
    geometry_type: 'Point' | 'LineString' | 'Polygon';
    geometry_json?: unknown | null;
    condition_status?: string | null;
}

export interface InfrastructureFeatureListProps {
    items: InfrastructureItem[];
    selectedItemId?: number | null;
    onItemSelect?: (item: InfrastructureItem) => void;
    onItemEdit?: (item: InfrastructureItem) => void;
    className?: string;
}

export function InfrastructureFeatureList({
    items,
    selectedItemId,
    onItemSelect,
    onItemEdit,
    className,
}: InfrastructureFeatureListProps) {
    return (
        <ScrollArea className={cn('max-h-screen', className)}>
            <div className="space-y-3 px-2 py-4">
                {items.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Tidak ada data PSU. Tambahkan dengan menggambar di peta.
                    </div>
                ) : (
                    items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onItemSelect?.(item)}
                            className={cn(
                                'w-full rounded-md border p-3 text-left transition-colors hover:bg-muted',
                                selectedItemId === item.id
                                    ? 'ring-2 ring-primary'
                                    : '',
                            )}
                        >
                            <div className="font-medium">{item.name}</div>
                            {item.description ? (
                                <div className="text-xs text-muted-foreground">
                                    {item.description}
                                </div>
                            ) : null}
                            <div className="mt-2 text-xs text-muted-foreground">
                                {item.geometry_type} &bull;{' '}
                                {item.condition_status
                                    ? item.condition_status
                                          .replace('_', ' ')
                                          .replace(/\b\w/g, (c) =>
                                              c.toUpperCase(),
                                          )
                                    : '-'}
                            </div>
                            <div className="mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onItemEdit?.(item);
                                    }}
                                >
                                    Edit
                                </Button>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </ScrollArea>
    );
}
