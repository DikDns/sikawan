import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    areas,
    dashboard,
    distributionMap,
    infrastructure,
    levels,
    messages,
    users,
} from '@/routes';
import { type NavItem } from '@/types';
import { useCan } from '@/utils/permissions';
import {
    FileText,
    Home,
    LayersIcon,
    LayoutGrid,
    MapPin,
    MessageSquare,
    ScrollText,
    Shield,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';

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
            icon: LayersIcon,
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
            href: messages(),
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
        {
            title: 'Logs',
            href: '/superadmin/logs',
            icon: ScrollText,
            show: can('logs'),
        },
    ].filter((item) => item.show);

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <AppLogo />
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
