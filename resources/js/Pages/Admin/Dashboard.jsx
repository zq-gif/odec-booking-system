import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UsersIcon,
    BuildingOfficeIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ClipboardDocumentCheckIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ auth, stats, recentActivity }) {
    const displayStats = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toString(),
            icon: UsersIcon,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Active Bookings',
            value: stats.activeBookings.toString(),
            icon: CalendarDaysIcon,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Total Facilities',
            value: stats.totalFacilities.toString(),
            icon: BuildingOfficeIcon,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Revenue (This Month)',
            value: `$${parseFloat(stats.monthlyRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: ChartBarIcon,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'View and manage user accounts',
            icon: UsersIcon,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            href: '/admin/users'
        },
        {
            title: 'Manage Facilities',
            description: 'Add, edit, or remove facilities',
            icon: BuildingOfficeIcon,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            href: '/admin/facilities'
        },
        {
            title: 'View Bookings',
            description: 'Monitor all facility bookings',
            icon: CalendarDaysIcon,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            href: '/admin/bookings'
        },
        {
            title: 'Manage Staff',
            description: 'Manage staff accounts and permissions',
            icon: ClipboardDocumentCheckIcon,
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            href: '/admin/staff'
        },
        {
            title: 'Reports',
            description: 'View analytics and generate reports',
            icon: ChartBarIcon,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            href: '/admin/reports'
        },
        {
            title: 'Maintenance',
            description: 'Schedule facility maintenance',
            icon: WrenchScrewdriverIcon,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            href: '/admin/maintenance'
        },
        {
            title: 'Issue Reports',
            description: 'View and respond to reported issues',
            icon: ExclamationTriangleIcon,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            href: '/admin/issues'
        },
        {
            title: 'Feedback',
            description: 'Review user feedback and ratings',
            icon: ChatBubbleLeftRightIcon,
            iconBg: 'bg-pink-100',
            iconColor: 'text-pink-600',
            href: '/admin/feedback'
        }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white">
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Welcome Section with Vibrant Design */}
                        <div className="mb-10 relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl p-8 md:p-12 shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

                            <div className="relative z-10">
                                <div className="flex items-center mb-4">
                                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                                        <ChartBarIcon className="h-12 w-12 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                                            Admin Control Center
                                        </h1>
                                        <p className="text-white/90 text-lg">
                                            Manage your beach paradise operations with ease
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid with Gradient Cards */}
                        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
                            {displayStats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.iconBg.replace('bg-', 'from-').replace('-100', '-100')} to-white opacity-20 rounded-full -mr-16 -mt-16`}></div>

                                    <div className="relative p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.iconBg} ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="w-8 h-8" />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
                                            {stat.value}
                                        </h3>
                                        <p className="text-sm font-semibold text-gray-600">
                                            {stat.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions Grid with Tourism Theme */}
                        <div className="mb-10">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl mr-3">
                                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Management Tools</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="group block p-6 transition-all duration-300 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                                    >
                                        <div className={`inline-flex p-3 rounded-xl ${action.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                                            <action.icon className={`w-7 h-7 ${action.iconColor}`} />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {action.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity with Modern Design */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl mr-3">
                                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Recent Activity
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all border-l-4 border-orange-400"
                                    >
                                        <div className="flex items-start">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                                            <p className="text-gray-800 font-medium">
                                                <span className="font-bold text-orange-600">{activity.user}</span> {activity.action}
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                            {activity.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}