import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Props {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function HouseholdsSearch({
    searchQuery,
    onSearchChange,
}: Props) {
    return (
        <Card className="border-border bg-card shadow-sm">
            <CardHeader>
                <CardTitle>Cari</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Cari nama, alamat, atau ID rumah..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="border-border pl-10"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
