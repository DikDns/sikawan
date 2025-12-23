import PublicNavbar from '@/components/public-navbar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface WelcomeProps {
    stats: {
        kawasan: number;
        rumah: number;
        rtlh: number;
    };
}

export default function Welcome({ stats }: WelcomeProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { flash } = usePage<{ flash?: any }>().props;
    const hasShownToast = React.useRef(false);

    useEffect(() => {
        if (!hasShownToast.current && (flash?.success || flash?.error)) {
            if (flash?.success) toast.success(flash.success);
            if (flash?.error) toast.error(flash.error);
            hasShownToast.current = true;
        }
    }, [flash]);

    const { data, setData, processing, reset, errors, post } = useForm({
        name: '',
        email: '',
        subject: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/messages/store', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=poppins:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            {/* <Toaster richColors position="top-right" /> */}
            <div className="min-h-screen bg-background">
                <PublicNavbar />

                {/* Hero Section */}
                <section className="pt-16">
                    <Container className="py-8">
                        <div className="grid max-h-screen grid-cols-1 grid-rows-3 gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
                            {/* Kanan / Headline: Card besar untuk judul, highlight, tombol */}
                            <div className="relative order-2 col-span-1 flex overflow-hidden rounded-2xl bg-[#552C91] p-6 shadow-lg lg:order-1 lg:col-span-2 lg:p-10">
                                {/* Background Patterns */}
                                <div
                                    className="absolute inset-0 z-0 opacity-80"
                                    style={{
                                        backgroundImage:
                                            "url('/images/pattern-1.webp')",
                                        backgroundRepeat: 'repeat',
                                        backgroundSize: '150px',
                                    }}
                                />
                                <div
                                    className="absolute inset-0 z-0 opacity-80"
                                    style={{
                                        backgroundImage:
                                            "url('/images/pattern-2.webp')",
                                        backgroundRepeat: 'repeat',
                                        backgroundSize: '300px',
                                    }}
                                />

                                <div className="relative z-10 grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-5 lg:gap-8">
                                    {/* Character Icon */}
                                    <div className="flex justify-center lg:col-span-2">
                                        <img
                                            src="/images/sihuma-icon.webp"
                                            alt="SIHUMA Icon"
                                            className="aspect-square h-18 drop-shadow-2xl lg:h-64"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col items-center text-center lg:col-span-3 lg:items-start lg:text-left">
                                        <h1
                                            className="mb-2 text-6xl font-black tracking-tight text-lime-400 lg:text-7xl"
                                            style={{
                                                fontFamily:
                                                    'Poppins, sans-serif',
                                            }}
                                        >
                                            sihuma
                                        </h1>
                                        <h2 className="mb-8 text-xl leading-tight font-bold text-white lg:text-2xl">
                                            Membangun{' '}
                                            <span className="text-lime-400">
                                                Kawasan
                                            </span>{' '}
                                            yang Lebih Baik.
                                        </h2>
                                        <Button
                                            size="lg"
                                            className="h-12 w-full rounded-xl bg-lime-400 px-8 text-lg font-bold text-[#552C91] hover:bg-lime-500 sm:w-auto"
                                            asChild
                                        >
                                            <Link href="/peta-sebaran">
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
                                </div>
                            </div>
                            {/* Kanan atas: 1 gambar besar potrait */}
                            <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl shadow-lg lg:order-2 lg:row-span-2">
                                <img
                                    src="/images/kawasan-3.webp"
                                    alt="Kawasan besar"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {/* Kanan bawah: 2 gambar landscape kecil */}
                            <div className="order-3 col-span-1 grid grid-cols-4 gap-4 lg:col-span-2 lg:row-span-1">
                                <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src="/images/kawasan-1.webp"
                                        alt="Kawasan 1"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src="/images/kawasan-2.webp"
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
                    <Container className="py-16 lg:py-24">
                        {/* Top Row: Title Left, Description Right */}
                        <div className="mb-32 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                            <div>
                                <h2 className="text-3xl leading-tight font-black lg:text-4xl">
                                    Satu Sistem,
                                    <br />
                                    Satu{' '}
                                    <span className="text-secondary">
                                        Data Kawasan.
                                    </span>
                                    <br />
                                    Menuju{' '}
                                    <span className="text-secondary">
                                        Muara Enim
                                    </span>
                                    <br />
                                    <span className="text-secondary">
                                        Layak Huni
                                    </span>
                                </h2>
                            </div>
                            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                                <p>
                                    <span className="font-semibold text-secondary">
                                        SIHUMA (Sistem Informasi Hunian
                                        Masyarakat)
                                    </span>{' '}
                                    bertujuan mendukung tata kelola kawasan
                                    perumahan & pemukiman yang berkelanjutan dan
                                    tertata melalui pemanfaatan teknologi
                                    digital.
                                </p>
                                <p>
                                    Dengan sistem berbasis data yang akurat dan
                                    terintegrasi,{' '}
                                    <span className="font-semibold text-secondary">
                                        SIHUMA
                                    </span>{' '}
                                    membantu instansi dan masyarakat mengakses
                                    informasi kawasan secara mudah untuk
                                    mewujudkan lingkungan hunian yang layak,
                                    tertib, dan sejahtera.
                                </p>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 lg:gap-8">
                            <div className="flex flex-col items-center border-r border-border py-4">
                                <span className="text-5xl font-bold text-secondary lg:text-6xl">
                                    {stats.kawasan}
                                </span>
                                <span className="mt-2 text-center text-sm text-muted-foreground lg:text-base">
                                    Kawasan Terdata
                                </span>
                            </div>
                            <div className="flex flex-col items-center border-r border-border py-4">
                                <span className="text-5xl font-bold text-secondary lg:text-6xl">
                                    {stats.rumah}
                                </span>
                                <span className="mt-2 text-center text-sm text-muted-foreground lg:text-base">
                                    Rumah Terdata
                                </span>
                            </div>
                            <div className="flex flex-col items-center py-4">
                                <span className="text-5xl font-bold text-secondary lg:text-6xl">
                                    {stats.rtlh}
                                </span>
                                <span className="mt-2 text-center text-sm text-muted-foreground lg:text-base">
                                    RTLH
                                </span>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Terpadu Section */}
                <section className="bg-secondary py-12 lg:py-16">
                    <Container>
                        <h2 className="text-center text-2xl font-bold text-secondary-foreground lg:text-3xl">
                            Terpadu dalam{' '}
                            <span className="text-lime-400">Data</span> Terwujud
                            dalam <span className="text-lime-400">Nyata</span>
                        </h2>
                        <p className="mt-2 text-center text-xl font-bold text-secondary-foreground lg:text-2xl">
                            Kawasan Hunian{' '}
                            <span className="text-lime-400">Muara Enim</span>.
                        </p>
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
                                            src="/images/kantor.webp"
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
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Nama Lengkap
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="subject">
                                                    Subjek
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="subject"
                                                    value={data.subject}
                                                    onChange={(e) =>
                                                        setData(
                                                            'subject',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors.subject && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.subject}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="message">
                                                    Pesan
                                                </Label>
                                                <textarea
                                                    id="content"
                                                    rows={4}
                                                    value={data.content}
                                                    onChange={(e) =>
                                                        setData(
                                                            'content',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-md border bg-background p-3 focus:ring-2 focus:ring-primary focus:outline-none"
                                                ></textarea>
                                                {errors.content && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.content}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Mengirim...'
                                                    : 'Kirim Pesan'}
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
                            serta Petanahan Kabupaten Muara Enim. All rights
                            reserved.
                        </p>
                    </Container>
                </footer>
            </div>
        </>
    );
}
