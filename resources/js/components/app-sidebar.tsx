import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    areas,
    dashboard,
    distributionMap,
    infrastructure,
    levels,
    messages,
    reports,
    users,
} from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    FileText,
    Home,
    Layers,
    LayoutGrid,
    MapPin,
    MessageSquare,
    Shield,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';
import { useCan } from '@/utils/permissions';

export function AppSidebar() {
    const can = useCan();
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
            show: true,
        },
        {
            title: 'Peta Sebaran',
            href: distributionMap(),
            icon: MapPin,
            show: can('distribution-map'),
        },
        {
            title: 'Rumah',
            href: '/households',
            icon: Home,
            show: can('households.index'),
        },
        {
            title: 'Kawasan',
            href: areas(),
            icon: Square,
            show: can('areas'),
        },
        {
            title: 'PSU',
            href: infrastructure(),
            icon: Wrench,
            show: can('infrastructure'),
        },
        {
            title: 'Laporan',
            href: '/reports',
            icon: FileText,
            show: can('reports'),
        },
        {
            title: 'Pesan',
            href:  messages(),
            icon: MessageSquare,
            show: can('messages'),
        },
        {
            title: 'Pengguna',
            href: users(),
            icon: Users,
            show: can('users'),
        },
        {
            title: 'Level',
            href: levels(),
            icon: Shield,
            show: can('levels'),
        },
    ].filter(item => item.show);

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
