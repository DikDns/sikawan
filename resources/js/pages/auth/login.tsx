import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Form, Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen">
                {/* Left Side - Image with Overlay */}
                <div className="relative hidden w-1/2 lg:block">
                    {/* Background Image */}
                    <img
                        src="/images/login-bg.webp"
                        alt="Kawasan Permukiman"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-[#1a1625]/60" />

                    {/* Content on top of image */}
                    <div className="relative z-10 p-6">
                        <div className="flex items-center justify-between">
                            {/* Government Logos */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1.5">
                                    <img
                                        src="/images/muara-enim-logo.webp"
                                        alt="Kabupaten Muara Enim"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="flex h-12 w-32 items-center justify-center rounded-full bg-white p-1">
                                    <img
                                        src="/images/disperkimtan-logo.webp"
                                        alt="Disperkimtan"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Back to Website Button */}
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full bg-[#552C91] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#6b3ba8]"
                            >
                                Kembali ke Website
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex w-full flex-col justify-between bg-[#1a1625] px-8 py-10 lg:w-1/2 lg:px-16 xl:px-24">
                    {/* Mobile Header - Only visible on smaller screens */}
                    <div className="mb-8 flex items-center justify-between lg:hidden">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
                                <img
                                    src="/images/muara-enim-logo.webp"
                                    alt="Kabupaten Muara Enim"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="flex h-10 w-32 items-center justify-center rounded-full bg-white p-1">
                                <img
                                    src="/images/disperkimtan-logo.webp"
                                    alt="Disperkimtan"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 rounded-full bg-[#552C91] px-4 py-2 text-xs font-medium text-white transition-all hover:bg-[#6b3ba8]"
                        >
                            Kembali ke Website
                            <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-1 flex-col justify-center">
                        <div className="mx-auto w-full max-w-md">
                            {/* SIHUMA Logo */}
                            <div className="mb-8 flex items-center gap-3">
                                <img
                                    src="/images/sihuma-logo-white.webp"
                                    alt="SIHUMA Logo"
                                    className="h-32 w-auto lg:h-52"
                                />
                            </div>

                            {/* Header */}
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold text-white md:text-4xl">
                                    Selamat Datang
                                </h1>
                                <p className="mt-3 text-base text-gray-400">
                                    Masukan username dan password kamu untuk
                                    akses halaman admin
                                </p>
                            </div>

                            {/* Login Form */}
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-5">
                                            {/* Username/Email Field */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm font-medium text-white"
                                                >
                                                    Username
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    className="h-12 rounded-lg border border-gray-600 bg-[#2d2640] px-4 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-lime-400/50"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-sm font-medium text-white"
                                                >
                                                    Password
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    className="h-12 rounded-lg border border-gray-600 bg-[#2d2640] px-4 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-lime-400/50"
                                                />
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            {/* Hidden Remember Me - Always enabled */}
                                            <input
                                                type="hidden"
                                                name="remember"
                                                value="on"
                                            />

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                className="mt-4 h-12 w-full rounded-lg bg-lime-400 text-base font-semibold text-[#1a1625] transition-all hover:bg-lime-500 focus-visible:ring-2 focus-visible:ring-lime-400/50"
                                                tabIndex={3}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing && <Spinner />}
                                                Masuk
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>

                            {status && (
                                <div className="mt-6 text-center text-sm font-medium text-green-400">
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            ©2025 Dinas Perumahan Rakyat dan Kawasan Permukiman
                            serta Petanahan Kabupaten Muara Enim. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
