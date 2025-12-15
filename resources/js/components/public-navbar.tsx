import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { home, login } from '@/routes';
import { Link } from '@inertiajs/react';

interface PublicNavbarProps {
    showPetaSebaran?: boolean;
}

export default function PublicNavbar({
    showPetaSebaran = true,
}: PublicNavbarProps) {
    return (
        <header className="fixed top-0 z-50 w-full">
            <div className="bg-background/75 text-foreground backdrop-blur-sm">
                <Container>
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Government Logos */}
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/muara-enim-logo.png"
                                    alt="Kabupaten Muara Enim"
                                    className="h-10 w-auto object-contain"
                                />
                                <img
                                    src="/images/disperkimtan-logo.png"
                                    alt="Disperkimtan"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                        </div>
                        <nav className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href={home()}>Home</Link>
                            </Button>
                            {showPetaSebaran && (
                                <Button variant="ghost" asChild>
                                    <Link href="/peta-sebaran">
                                        Peta Sebaran
                                    </Link>
                                </Button>
                            )}
                            <Button asChild>
                                <Link href={login()}>Login</Link>
                            </Button>
                        </nav>
                    </div>
                </Container>
            </div>
        </header>
    );
}
