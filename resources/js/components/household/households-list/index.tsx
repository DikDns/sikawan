import { getCsrfToken } from '@/lib/csrf';
import { type HouseholdListItem, type HouseholdStats } from '@/types/household';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import HouseholdsHeader from './households-header';
import HouseholdsSearch from './households-search';
import HouseholdsStats from './households-stats';
import HouseholdsTable from './households-table';

interface Props {
    households: HouseholdListItem[];
    stats: HouseholdStats;
}

export default function HouseholdsList({ households, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [householdToDelete, setHouseholdToDelete] = useState<number | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredHouseholds = useMemo(() => {
        return households.filter((household) => {
            const matchesSearch =
                household.head_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.address_text
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                household.id.toString().includes(searchQuery);

            return matchesSearch;
        });
    }, [searchQuery, households]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredHouseholds.map((h) => h.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(
                selectedIds.filter((selectedId) => selectedId !== id),
            );
        }
    };

    const handleDeleteClick = (id: number) => {
        setHouseholdToDelete(id);
    };

    const handleDeleteConfirm = async () => {
        if (!householdToDelete) return;

        setIsDeleting(true);
        try {
            router.delete(`/households/${householdToDelete}`, {
                data: { _token: getCsrfToken() },
                preserveState: true,
                preserveScroll: true,
            });
            setHouseholdToDelete(null);
        } catch (error) {
            console.error('Error deleting household:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setHouseholdToDelete(null);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 bg-background p-6">
            <HouseholdsHeader />
            <HouseholdsStats stats={stats} />
            <HouseholdsSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <HouseholdsTable
                households={filteredHouseholds}
                selectedIds={selectedIds}
                householdToDelete={householdToDelete}
                isDeleting={isDeleting}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                onDeleteClick={handleDeleteClick}
                onDeleteConfirm={handleDeleteConfirm}
                onDeleteCancel={handleDeleteCancel}
            />
        </div>
    );
}
