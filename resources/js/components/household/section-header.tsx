interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export default function SectionHeader({
    title,
    subtitle,
    action,
}: SectionHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
                <h2 className="text-xl font-bold text-secondary">{title}</h2>
                {subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
