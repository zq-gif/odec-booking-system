import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    UserGroupIcon,
    CalendarDaysIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function StaffDashboard({ auth }) {
    const stats = [
        {
            title: 'Total Bookings',
            value: '156',
            icon: CalendarDaysIcon,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            change: '+12% from last month'
        },
        {
            title: 'Active Users',
            value: '89',
            icon: UserGroupIcon,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            change: '+5 new this week'
        },
        {
            title: 'Facilities',
            value: '12',
            icon: BuildingOfficeIcon,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            change: 'All operational'
        },
        {
            title: 'Pending Approvals',
            value: '8',
            icon: ClockIcon,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            change: 'Needs attention'
        }
    ];

    const recentBookings = [
        { id: 1, user: 'John Doe', facility: 'Beach Area', date: '2023-12-20', status: 'confirmed' },
        { id: 2, user: 'Jane Smith', facility: 'Conference Hall', date: '2023-12-19', status: 'pending' },
        { id: 3, user: 'Mike Johnson', facility: 'Basketball Court', date: '2023-12-18', status: 'confirmed' },
        { id: 4, user: 'Sarah Williams', facility: 'Tennis Court', date: '2023-12-17', status: 'pending' },
        { id: 5, user: 'David Brown', facility: 'Swimming Pool', date: '2023-12-16', status: 'confirmed' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Staff Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Welcome back, {auth.user.name} (Staff)
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-lg ${stat.iconBg} p-3`}>
                                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-gray-500">{stat.change}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Facility
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.user}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.facility}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{booking.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}