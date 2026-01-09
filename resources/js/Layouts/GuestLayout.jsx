import Footer from '@/Components/Footer';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link, usePage } from '@inertiajs/react';
import { SunIcon } from '@heroicons/react/24/outline';

export default function GuestLayout({ children }) {
    const locale = usePage().props.locale || 'en';

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
            {/* Main Content Area */}
            <div className="flex-grow flex flex-col items-center pt-6 sm:justify-center sm:pt-0 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 w-full sm:max-w-md px-6">
                    {/* Language Switcher */}
                    <div className="flex justify-end mb-4">
                        <LanguageSwitcher currentLocale={locale} />
                    </div>

                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center justify-center space-x-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl">
                                    <SunIcon className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                ODEC UMS Beach
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">Your Paradise Awaits</p>
                        </Link>
                    </div>

                    {/* Form Container */}
                    <div className="overflow-hidden bg-white/90 backdrop-blur-sm px-8 py-8 shadow-2xl rounded-3xl border border-orange-100">
                        {children}
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-6 mb-12 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-orange-600 transition-colors font-medium"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
