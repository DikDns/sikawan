import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    can: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    show?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface DashboardProps {
    statCardsData: { label: string; value: number | string; href?: string }[];
    analysisData: {
        year: string;
        rumah: number;
        rlh: number;
        rtlh: number;
    }[];
    chartSectionData: {
        rtlh: { name: string; value: number; fill: string }[];
    };
    psuData: { name: string; value: number; color: string }[];
    improvedPSUData: { name: string; value: number; color: string }[];
    bottomStatsData: { population: number; kk: number };
    economicData: { indicator: string; value: string }[];
    availableYears: string[];
    selectedEconomicYear: string | null;
    selectedRegionYear: string | null;
    areaSummaryRows: { name: string; rumah: number; luas_m2: number }[];
    regionStats: {
        region: { name: string; houses: string };
        data: { label: string; value: number; color: string }[];
    }[];
    slumAreaTotalM2: number;
    householdsInSlumArea: number;
    rtlhTotal: number;
    [key: string]: unknown;
}
