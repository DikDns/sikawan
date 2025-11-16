import { MapPin } from 'lucide-react';

interface DetailHeaderProps {
    headName: string;
    addressText: string;
}

export default function DetailHeader({
    headName,
    addressText,
}: DetailHeaderProps) {
    return (
        <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">{headName}</h1>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{addressText}</span>
            </div>
        </div>
    );
}
