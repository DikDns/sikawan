import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles?: string[];
    email_verified_at: string | null;
    created_at: string;
    permissions: string[];
}

export interface PageProps extends InertiaPageProps {
    auth: {
        user: User | null;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flash?: Record<string, any>;
    [key: string]: unknown;
}

export const useCan = () => {
    const { props } = usePage<PageProps>();
    const permissions = props.auth?.user?.permissions || [];

    return (perm: string) => permissions.includes(perm);
};
