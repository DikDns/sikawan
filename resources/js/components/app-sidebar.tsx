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

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Peta Sebaran',
        href: distributionMap(),
        icon: MapPin,
    },
    {
        title: 'Rumah',
        href: '/households',
        icon: Home,
    },
    {
        title: 'Kawasan',
        href: areas(),
        icon: Layers,
    },
    {
        title: 'PSU',
        href: infrastructure(),
        icon: Wrench,
    },
    {
        title: 'Laporan',
        href: reports(),
        icon: FileText,
    },
    {
        title: 'Pesan',
        href: messages(),
        icon: MessageSquare,
    },
    {
        title: 'Pengguna',
        href: users(),
        icon: Users,
    },
    {
        title: 'Level',
        href: levels(),
        icon: Shield,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
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
