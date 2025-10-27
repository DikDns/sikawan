import { login } from '@/routes';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="SI-KAWAN">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=poppins:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="fixed w-full bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/sikawan-logo.png"
                                    alt="SI-KAWAN"
                                    className="h-8 w-8"
                                />
                                <span className="text-lg font-semibold text-[#4F46E5]">
                                    SI-KAWAN
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href={login()}
                                    className="rounded-full bg-[#4F46E5] px-6 py-2 text-white hover:bg-[#4338CA]"
                                >
                                    Login
                                </Link>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="relative bg-[#4F46E5] pt-20">
                    <div className="container mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="flex flex-col justify-center">
                                <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
                                    Membangun{' '}
                                    <span className="text-[#A5B4FC]">
                                        Kawasan
                                    </span>
                                    <br />
                                    yang Lebih Baik.
                                </h1>
                                <Link
                                    href="#"
                                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#A5B4FC] px-8 py-3 font-semibold text-[#4F46E5] hover:bg-white"
                                >
                                    Jelajahi Peta
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
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
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <img
                                    src="/images/kawasan-1.jpg"
                                    alt="Kawasan 1"
                                    className="rounded-lg object-cover"
                                />
                                <img
                                    src="/images/kawasan-2.jpg"
                                    alt="Kawasan 2"
                                    className="rounded-lg object-cover"
                                />
                                <img
                                    src="/images/kawasan-3.jpg"
                                    alt="Kawasan 3"
                                    className="col-span-2 rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Satu Sistem Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-3xl font-bold">
                                Satu Sistem,
                                <br />
                                Satu{' '}
                                <span className="text-[#4F46E5]">
                                    Data Kawasan.
                                </span>
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <span className="font-semibold text-[#4F46E5]">
                                        SI-KAWAN (Sistem Informasi Pemukiman dan
                                        Kawasan)
                                    </span>{' '}
                                    bertujuan mendukung tata kelola kawasan
                                    perumahan & pemukiman yang berkelanjutan dan
                                    tertata melalui pemanfaatan teknologi
                                    digital.
                                </p>
                                <p>
                                    Dengan sistem berbasis data yang akurat dan
                                    terintegrasi,{' '}
                                    <span className="font-semibold text-[#4F46E5]">
                                        SI-KAWAN
                                    </span>{' '}
                                    membantu instansi dan masyarakat mengakses
                                    informasi kawasan secara mudah untuk
                                    mewujudkan lingkungan hunian yang layak,
                                    tertib, dan sejahtera.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
                                <span className="mb-2 text-4xl font-bold text-[#4F46E5]">
                                    128
                                </span>
                                <span className="text-center text-sm text-gray-600">
                                    Kawasan Terdata
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
                                <span className="mb-2 text-4xl font-bold text-[#4F46E5]">
                                    128
                                </span>
                                <span className="text-center text-sm text-gray-600">
                                    Rumah Terdata
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
                                <span className="mb-2 text-4xl font-bold text-[#4F46E5]">
                                    20
                                </span>
                                <span className="text-center text-sm text-gray-600">
                                    RTLH
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terpadu Section */}
                <div className="bg-[#4F46E5] py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center text-3xl font-bold text-white">
                            Terpadu dalam{' '}
                            <span className="text-[#A5B4FC]">Data</span>{' '}
                            Terwujud dalam{' '}
                            <span className="text-[#A5B4FC]">Nyata</span>
                        </h2>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <img
                                src="/images/kantor.jpg"
                                alt="Kantor"
                                className="rounded-lg"
                            />
                            <div className="mt-8">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Alamat Utama
                                </h3>
                                <p className="text-gray-600">
                                    Jl. Mayor Tjik Agnes Kiemas, Kab. Cemp.
                                    Werang, Kec. Merapi Tim,
                                    <br />
                                    Kabupaten Muara Enim, Sumatera Selatan 31315
                                </p>
                                <div className="mt-4">
                                    <h4 className="font-semibold">
                                        Jam Pelayanan
                                    </h4>
                                    <p className="text-gray-600">
                                        Senin - Jumat
                                        <br />
                                        08:00 - 15:00 WIB
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="mb-8 text-2xl font-bold">
                                Punya pertanyaan?
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Kirim pesan sekarang — kami siap membantu Anda!
                            </p>
                            <form className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full rounded-lg border border-gray-300 p-2.5"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full rounded-lg border border-gray-300 p-2.5"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 p-2.5"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-full bg-[#4F46E5] px-8 py-3 font-semibold text-white hover:bg-[#4338CA]"
                                >
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-[#4F46E5] py-4">
                    <div className="container mx-auto px-4">
                        <p className="text-center text-sm text-white">
                            ©2025 Dinas Perumahan Rakyat dan Kawasan Permukiman
                            Kabupaten Muara Enim. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
