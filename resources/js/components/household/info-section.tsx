interface InfoItem {
    label: string;
    value: string | number | null | undefined;
}

interface InfoSectionProps {
    title: string;
    items: InfoItem[];
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

export default function InfoSection({
    title,
    items,
    columns = 2,
    className = '',
}: InfoSectionProps) {
    const gridCols = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className={`grid gap-4 ${gridCols[columns]}`}>
                {items.map((item, index) => (
                    <div key={index}>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                            {item.label}
                        </p>
                        <p className="font-semibold text-foreground">
                            {item.value || '-'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
