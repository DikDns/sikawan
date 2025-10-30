import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { login } from '@/routes';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=poppins:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="fixed z-50 w-full">
                    <div className="bg-secondary/75 text-secondary-foreground backdrop-blur-sm">
                        <Container>
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/images/sikawan-logo.png"
                                        alt="SI-KAWAN"
                                        className="h-8 w-8"
                                    />
                                    <span className="text-lg font-semibold text-primary">
                                        SI-KAWAN
                                    </span>
                                </div>
                                <nav className="flex items-center gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href="#">Home</Link>
                                    </Button>
                                    <Button variant="ghost" asChild>
                                        <Link href="#">Features</Link>
                                    </Button>
                                    <Button variant="ghost" asChild>
                                        <Link href="#">Pricing</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={login()}>Login</Link>
                                    </Button>
                                </nav>
                            </div>
                        </Container>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-16">
                    <Container className="py-8">
                        <div className="grid max-h-screen grid-cols-1 grid-rows-3 gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
                            {/* Kiri: Card besar untuk judul, highlight, tombol */}
                            <div className="order-2 col-span-1 flex flex-col justify-center rounded-2xl bg-[#552C91] p-10 shadow-lg lg:col-span-2">
                                <div className="mb-6 flex items-center gap-2">
                                    <img
                                        src="/images/sikawan-logo.png"
                                        alt="SI-KAWAN"
                                        className="h-8 w-8"
                                    />
                                    <span className="text-lg font-extrabold tracking-wide text-lime-300">
                                        SI-KAWAN
                                    </span>
                                </div>
                                <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                                    Membangun{' '}
                                    <span className="text-lime-300">
                                        Kawasan
                                    </span>{' '}
                                    <br /> yang Lebih Baik.
                                </h1>
                                <Button
                                    size="lg"
                                    className="mt-6 w-fit bg-lime-300 font-semibold text-[#552C91] hover:bg-lime-400 hover:text-[#552C91]"
                                    asChild
                                >
                                    <Link href="#">
                                        Jelajahi Peta
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="ml-2 h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>
                                </Button>
                            </div>
                            {/* Kanan atas: 1 gambar besar potrait */}
                            <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl shadow-lg lg:order-none lg:row-span-2">
                                <img
                                    src="/images/kawasan-3.jpg"
                                    alt="Kawasan besar"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {/* Kanan bawah: 2 gambar landscape kecil */}
                            <div className="order-3 col-span-1 grid grid-cols-4 gap-4 lg:col-span-2 lg:row-span-1">
                                <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src="/images/kawasan-1.jpg"
                                        alt="Kawasan 1"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src="/images/kawasan-2.jpg"
                                        alt="Kawasan 2"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Satu Sistem Section */}
                <section className="bg-muted/50">
                    <Container className="py-24">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-6 text-3xl font-bold">
                                    Satu Sistem,
                                    <br />
                                    <span className="text-secondary">
                                        Satu Data Kawasan.
                                    </span>
                                </h2>
                                <div className="space-y-4 text-base text-muted-foreground">
                                    <p>
                                        <span className="font-semibold text-secondary">
                                            SI-KAWAN (Sistem Informasi Pemukiman
                                            dan Kawasan)
                                        </span>{' '}
                                        bertujuan mendukung tata kelola kawasan
                                        perumahan & pemukiman yang berkelanjutan
                                        dan tertata melalui pemanfaatan
                                        teknologi digital.
                                    </p>
                                    <p>
                                        Dengan sistem berbasis data yang akurat
                                        dan terintegrasi,{' '}
                                        <span className="font-semibold text-secondary">
                                            SI-KAWAN
                                        </span>{' '}
                                        membantu instansi dan masyarakat
                                        mengakses informasi kawasan secara mudah
                                        untuk mewujudkan lingkungan hunian yang
                                        layak, tertib, dan sejahtera.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Card className="bg-background shadow-lg transition-all hover:scale-105">
                                            <CardContent className="flex flex-col items-center justify-center p-6">
                                                <span className="mb-2 text-4xl font-bold text-secondary">
                                                    128
                                                </span>
                                                <span className="text-center text-sm text-muted-foreground">
                                                    Kawasan Terdata
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">
                                                Kawasan Terdata
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Total kawasan yang telah
                                                terdaftar dan terdata dalam
                                                sistem SI-KAWAN.
                                            </p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Card className="bg-background shadow-lg transition-all hover:scale-105">
                                            <CardContent className="flex flex-col items-center justify-center p-6">
                                                <span className="mb-2 text-4xl font-bold text-secondary">
                                                    128
                                                </span>
                                                <span className="text-center text-sm text-muted-foreground">
                                                    Rumah Terdata
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">
                                                Rumah Terdata
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Jumlah total rumah yang telah
                                                didata dalam sistem SI-KAWAN.
                                            </p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Card className="bg-background shadow-lg transition-all hover:scale-105">
                                            <CardContent className="flex flex-col items-center justify-center p-6">
                                                <span className="mb-2 text-4xl font-bold text-secondary">
                                                    20
                                                </span>
                                                <span className="text-center text-sm text-muted-foreground">
                                                    RTLH
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">
                                                RTLH
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Rumah Tidak Layak Huni yang
                                                teridentifikasi dan memerlukan
                                                perbaikan.
                                            </p>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Terpadu Section */}
                <section className="bg-secondary py-16">
                    <Container>
                        <h2 className="text-center text-3xl font-bold text-secondary-foreground">
                            Terpadu dalam{' '}
                            <span className="text-primary">Data</span> Terwujud
                            dalam <span className="text-primary">Nyata</span>
                        </h2>
                    </Container>
                </section>

                {/* Contact Form Section */}
                <section className="bg-muted/50 py-24">
                    <Container>
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div>
                                <Card className="overflow-hidden shadow-lg">
                                    <AspectRatio ratio={16 / 9}>
                                        <img
                                            src="/images/kantor.png"
                                            alt="Kantor"
                                            className="h-full w-full object-cover"
                                        />
                                    </AspectRatio>
                                </Card>
                                <div className="mt-8">
                                    <h3 className="mb-4 text-xl font-semibold">
                                        Alamat Utama
                                    </h3>
                                    <p className="text-base text-muted-foreground">
                                        Jl. Mayor Tjik Agnes Kiemas, Kab. Cemp.
                                        Werang, Kec. Merapi Tim,
                                        <br />
                                        Kabupaten Muara Enim, Sumatera Selatan
                                        31315
                                    </p>
                                    <Separator className="my-6" />
                                    <h4 className="font-semibold">
                                        Jam Pelayanan
                                    </h4>
                                    <p className="text-base text-muted-foreground">
                                        Senin - Jumat
                                        <br />
                                        08:00 - 15:00 WIB
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h2 className="mb-4 text-2xl font-bold">
                                    Punya pertanyaan?
                                </h2>
                                <p className="mb-6 text-base text-muted-foreground">
                                    Kirim pesan sekarang — kami siap membantu
                                    Anda!
                                </p>
                                <Card className="bg-background">
                                    <CardContent className="p-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Nama Lengkap
                                                </Label>
                                                <Input type="text" id="name" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="message">
                                                    Pesan
                                                </Label>
                                                <textarea
                                                    id="message"
                                                    rows={4}
                                                    className="w-full rounded-md border bg-background p-3"
                                                ></textarea>
                                            </div>
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                            >
                                                Kirim Pesan
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Footer */}
                <footer className="bg-secondary py-4">
                    <Container>
                        <p className="text-center text-sm text-secondary-foreground/80">
                            ©2025 Dinas Perumahan Rakyat dan Kawasan Permukiman
                            Kabupaten Muara Enim. All rights reserved.
                        </p>
                    </Container>
                </footer>
            </div>
        </>
    );
}
