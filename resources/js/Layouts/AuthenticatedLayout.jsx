import { Link, usePage } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import ChatBot from '@/Components/ChatBot';
import Footer from '@/Components/Footer';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import {
    HomeIcon,
    BuildingOfficeIcon,
    DevicePhoneMobileIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ChatBubbleLeftRightIcon,
    ExclamationCircleIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    UsersIcon,
    ChartBarIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    MegaphoneIcon,
    ChevronDownIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const locale = usePage().props.locale || 'en';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Check if user is admin
    const isAdmin = user.role === 'admin';

    // Initialize expanded sections - Overview always open, others based on active item
    const getInitialExpandedSections = () => {
        const sections = { 'Overview': true };
        return sections;
    };
    const [expandedSections, setExpandedSections] = useState(getInitialExpandedSections);

    // Toggle section expand/collapse
    const toggleSection = (sectionTitle) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle]
        }));
    };

    // Check if section has active item
    const sectionHasActiveItem = (items) => items.some(item => item.current);

    // Admin navigation - organized by sections
    const adminNavSections = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, current: route().current('admin.dashboard') },
            ]
        },
        {
            title: 'Booking Management',
            items: [
                { name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon, current: route().current('admin.bookings') },
                { name: 'Facilities', href: '/admin/facilities', icon: BuildingOfficeIcon, current: route().current('admin.facilities') },
                { name: 'Activities', href: '/admin/activities', icon: SparklesIcon, current: route().current('admin.activities') },
            ]
        },
        {
            title: 'People',
            items: [
                { name: 'Users', href: '/admin/users', icon: UsersIcon, current: route().current('admin.users') },
                { name: 'Staff', href: '/admin/staff', icon: ClipboardDocumentListIcon, current: route().current('admin.staff') },
            ]
        },
        {
            title: 'Reports & Feedback',
            items: [
                { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon, current: route().current('admin.reports') },
                { name: 'Reviews', href: '/admin/feedback', icon: ChatBubbleLeftRightIcon, current: route().current('admin.feedback') },
                { name: 'Issues', href: '/admin/issues', icon: ExclamationTriangleIcon, current: route().current('admin.issues') },
            ]
        },
        {
            title: 'System',
            items: [
                { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon, current: route().current('admin.announcements.*') },
                { name: 'Maintenance', href: '/admin/maintenance', icon: WrenchScrewdriverIcon, current: route().current('admin.maintenance') },
                { name: 'QR Code', href: '/admin/settings', icon: Cog6ToothIcon, current: route().current('admin.settings') },
            ]
        },
    ];

    // Flat admin navigation for mobile menu
    const adminNavigation = adminNavSections.flatMap(section => section.items);

    // Regular user navigation
    const userNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: route().current('dashboard') },
        { name: 'Book Facility', href: '/book-facility', icon: CalendarIcon, current: route().current('book-facility') },
        { name: 'Book Activity', href: '/book-activity', icon: SparklesIcon, current: route().current('book-activity') },
        { name: 'My Bookings', href: '/my-bookings', icon: ClipboardDocumentListIcon, current: route().current('my-bookings') },
        { name: 'Report Issue', href: '/report-issue', icon: ExclamationCircleIcon, current: route().current('report-issue') },
    ];

    const navigation = isAdmin ? adminNavigation : userNavigation;
    const userRole = isAdmin ? 'Administrator' : 'Visitor';

    // Admin Layout (Side Navigation)
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Mobile sidebar */}
                <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? '' : 'pointer-events-none'}`}>
                    <div
                        className={`fixed inset-0 bg-gray-900/80 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className={`fixed inset-y-0 left-0 w-64 bg-white transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-orange-600 text-white font-bold text-lg">
                                    ODEC
                                </div>
                                <span className="ml-3 text-lg font-semibold text-gray-900">Admin Panel</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                            {adminNavSections.map((section, sectionIdx) => {
                                const isExpanded = expandedSections[section.title] || sectionHasActiveItem(section.items);
                                const hasActive = sectionHasActiveItem(section.items);

                                return (
                                    <div key={section.title} className={sectionIdx > 0 ? 'mt-2' : ''}>
                                        <button
                                            onClick={() => toggleSection(section.title)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg ${
                                                hasActive
                                                    ? 'text-orange-600 bg-orange-50'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{section.title}</span>
                                            <ChevronDownIcon
                                                className={`h-4 w-4 transition-transform duration-200 ${
                                                    isExpanded ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-200 ${
                                            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                            <div className="space-y-0.5 mt-1 ml-2">
                                                {section.items.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                                                            item.current
                                                                ? 'bg-gradient-to-r from-blue-100 to-orange-100 text-orange-600'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <item.icon className={`mr-3 h-4 w-4 ${item.current ? 'text-orange-600' : 'text-gray-400'}`} />
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex items-center mb-3">
                                <UserCircleIcon className="h-8 w-8 text-orange-600" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{userRole}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <LanguageSwitcher currentLocale={locale} />
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                            >
                                <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
                        <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-orange-50">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-orange-600 text-white font-bold text-lg shadow-md">
                                ODEC
                            </div>
                            <span className="ml-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Admin Panel</span>
                        </div>

                        {/* User info */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-orange-50/50">
                            <div className="flex items-center">
                                <UserCircleIcon className="h-10 w-10 text-orange-600" />
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-orange-600 font-medium">{userRole}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-3 py-4 overflow-y-auto">
                            {adminNavSections.map((section, sectionIdx) => {
                                const isExpanded = expandedSections[section.title] || sectionHasActiveItem(section.items);
                                const hasActive = sectionHasActiveItem(section.items);

                                return (
                                    <div key={section.title} className={sectionIdx > 0 ? 'mt-2' : ''}>
                                        <button
                                            onClick={() => toggleSection(section.title)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                                                hasActive
                                                    ? 'text-orange-600 bg-orange-50'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                            }`}
                                        >
                                            <span>{section.title}</span>
                                            <ChevronDownIcon
                                                className={`h-4 w-4 transition-transform duration-200 ${
                                                    isExpanded ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-200 ${
                                            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                            <div className="space-y-0.5 mt-1 ml-2">
                                                {section.items.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            item.current
                                                                ? 'bg-gradient-to-r from-blue-100 to-orange-100 text-orange-600 shadow-sm'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        <item.icon className={`mr-3 h-4 w-4 ${item.current ? 'text-orange-600' : 'text-gray-400'}`} />
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Logout */}
                        <div className="border-t border-gray-200 p-4">
                            <div className="mb-3">
                                <LanguageSwitcher currentLocale={locale} />
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Top bar for mobile */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
                            ODEC Admin Panel
                        </div>
                        <UserCircleIcon className="h-8 w-8 text-orange-600" />
                    </div>

                    <main className="bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    // User Layout (Top Navigation)
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-amber-50">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-md border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="/images/ums-beach-club-logo.avif"
                                alt="UMS Beach Club"
                                className="h-10 w-auto"
                            />
                            <div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    ODEC UMS Beach
                                </h2>
                                <p className="text-xs text-gray-500 font-medium hidden sm:block">Booking System</p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navigation.slice(0, 6).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                        item.current
                                            ? 'bg-gradient-to-r from-blue-100 to-orange-100 text-orange-600'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                                    }`}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Language Switcher */}
                            <div className="hidden lg:block">
                                <LanguageSwitcher currentLocale={locale} />
                            </div>

                            {/* Desktop User Dropdown */}
                            <div className="hidden lg:block relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                                >
                                    <UserCircleIcon className="h-8 w-8 text-orange-600" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{userRole}</p>
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <UserCircleIcon className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                {mobileMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6 text-gray-700" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6 text-gray-700" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-gray-200 py-4">
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                                            item.current
                                                ? 'bg-gradient-to-r from-blue-100 to-orange-100 text-orange-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex items-center px-4 mb-3">
                                    <UserCircleIcon className="h-10 w-10 text-orange-600" />
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{userRole}</p>
                                    </div>
                                </div>
                                <div className="px-4 mb-3">
                                    <LanguageSwitcher currentLocale={locale} />
                                </div>
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                                >
                                    <UserCircleIcon className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2"
                                >
                                    <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                                    Logout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main content with header spacing */}
            <main className="flex-grow pt-16">
                {children}
            </main>

            {/* AI ChatBot for FAQ */}
            <ChatBot />

            {/* Footer */}
            <Footer />
        </div>
    );
}
