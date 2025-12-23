import { type HouseholdListItem, type HouseholdStats } from '@/types/household';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import HouseholdsHeader from './households-header';
import HouseholdsSearch from './households-search';
import HouseholdsStats from './households-stats';
import HouseholdsTable from './households-table';

interface AreaOption {
    value: string;
    label: string;
}

interface PaginationInfo {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    households: HouseholdListItem[];
    pagination: PaginationInfo;
    stats: HouseholdStats;
    approvalCount: number;
    rejectedCount: number;
    areas?: AreaOption[];
    filters?: {
        habitability_status?: string;
        district_id?: string;
        village_id?: string;
        area_id?: string;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

export default function HouseholdsList({
    households,
    pagination,
    stats,
    approvalCount,
    rejectedCount,
    filters,
    areas,
}: Props) {
    const [householdToDelete, setHouseholdToDelete] = useState<number | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    // Server-side filter/sort/search handler
    const handleFilterChange = (newValues: Record<string, string | null>) => {
        const updatedFilters: Record<string, string | null> = {
            ...filters,
            ...newValues,
        };

        // Remove null/undefined values to keep URL clean
        Object.keys(updatedFilters).forEach((key) => {
            if (!updatedFilters[key]) {
                delete updatedFilters[key];
            }
        });

        router.get('/households', updatedFilters as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Server-side search handler (debounced in search component)
    const handleSearchChange = (value: string) => {
        handleFilterChange({ search: value || null });
    };

    // Handle column sorting
    const handleSort = (column: string) => {
        const currentSortBy = filters?.sort_by || 'id';
        const currentSortOrder = filters?.sort_order || 'desc';

        let newSortOrder = 'asc';
        if (currentSortBy === column) {
            newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        }

        handleFilterChange({
            sort_by: column,
            sort_order: newSortOrder,
        });
    };

    // Handle pagination with page number
    const handlePageChange = (page: number) => {
        const updatedFilters: Record<string, string | null> = {
            ...filters,
            page: String(page),
        };

        // Remove null/undefined values
        Object.keys(updatedFilters).forEach((key) => {
            if (!updatedFilters[key]) {
                delete updatedFilters[key];
            }
        });

        router.get('/households', updatedFilters as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDeleteClick = (id: number) => {
        setHouseholdToDelete(id);
    };

    const handleDeleteConfirm = async () => {
        if (!householdToDelete) return;

        setIsDeleting(true);
        try {
            router.delete(`/households/${householdToDelete}`, {
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
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            <HouseholdsHeader />
            <HouseholdsStats stats={stats} />
            <HouseholdsSearch
                searchQuery={filters?.search || ''}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                areas={areas}
            />
            <HouseholdsTable
                households={households}
                householdToDelete={householdToDelete}
                isDeleting={isDeleting}
                onDeleteClick={handleDeleteClick}
                onDeleteConfirm={handleDeleteConfirm}
                onDeleteCancel={handleDeleteCancel}
                sortBy={filters?.sort_by || 'id'}
                sortOrder={(filters?.sort_order as 'asc' | 'desc') || 'desc'}
                onSort={handleSort}
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
