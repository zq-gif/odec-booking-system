import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    ChartBarIcon,
    UsersIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    TrophyIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

export default function Reports({
    auth,
    overviewStats,
    bookingTrends,
    revenueTrends,
    popularFacilities,
    popularActivities,
    recentBookings,
    userGrowth,
    filters
}) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [activeTab, setActiveTab] = useState('overview');

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.reports'), {
            start_date: startDate,
            end_date: endDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleExport = () => {
        // This will trigger a download
        window.open(
            `/admin/reports/export?start_date=${startDate}&end_date=${endDate}&format=pdf`,
            '_blank'
        );
    };

    const stats = [
        {
            title: 'Total Revenue',
            value: `$${parseFloat(overviewStats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: CurrencyDollarIcon,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            change: '+12.5%'
        },
        {
            title: 'Total Bookings',
            value: overviewStats.totalBookings,
            icon: CalendarDaysIcon,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            change: '+8.3%'
        },
        {
            title: 'New Users',
            value: overviewStats.newUsers,
            icon: UsersIcon,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            change: '+15.2%'
        },
        {
            title: 'Active Services',
            value: overviewStats.availableFacilities + overviewStats.availableActivities,
            icon: BuildingOfficeIcon,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            change: '+2'
        }
    ];

    const tabs = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'bookings', name: 'Booking Analytics', icon: CalendarDaysIcon },
        { id: 'revenue', name: 'Revenue Analytics', icon: CurrencyDollarIcon },
        { id: 'users', name: 'User Analytics', icon: UsersIcon }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reports & Analytics" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Comprehensive insights into your booking system performance
                            </p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            Export Report
                        </button>
                    </div>

                    {/* Date Filter */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <form onSubmit={handleFilterSubmit} className="flex items-end gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FunnelIcon className="h-5 w-5" />
                                <span className="font-medium">Filter Period:</span>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Apply Filter
                            </button>
                        </form>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.iconBg} p-3 rounded-lg`}>
                                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                    </div>
                                    <span className="text-green-600 text-sm font-semibold flex items-center">
                                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        <tab.icon className="h-5 w-5 mr-2" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Revenue Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Facility Bookings</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ${parseFloat(overviewStats.facilityRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(overviewStats.facilityRevenue / overviewStats.totalRevenue * 100).toFixed(1)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Activity Bookings</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ${parseFloat(overviewStats.activityRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-orange-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(overviewStats.activityRevenue / overviewStats.totalRevenue * 100).toFixed(1)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Distribution</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Facilities</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {overviewStats.facilityBookings} bookings
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-purple-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(overviewStats.facilityBookings / overviewStats.totalBookings * 100).toFixed(1)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Activities</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {overviewStats.activityBookings} bookings
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(overviewStats.activityBookings / overviewStats.totalBookings * 100).toFixed(1)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Popular Items */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center mb-4">
                                        <TrophyIcon className="h-6 w-6 text-yellow-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">Top Facilities</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {popularFacilities.length > 0 ? popularFacilities.map((facility, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{facility.name}</p>
                                                        <p className="text-xs text-gray-500">{facility.booking_count} bookings</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-green-600">
                                                    ${parseFloat(facility.revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        )) : (
                                            <p className="text-gray-500 text-center py-4">No facility bookings in this period</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center mb-4">
                                        <TrophyIcon className="h-6 w-6 text-yellow-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">Top Activities</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {popularActivities.length > 0 ? popularActivities.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{activity.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {activity.booking_count} bookings • {activity.total_participants} participants
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-green-600">
                                                    ${parseFloat(activity.revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        )) : (
                                            <p className="text-gray-500 text-center py-4">No activity bookings in this period</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Item
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentBookings.map((booking, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            booking.type === 'Facility'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-orange-100 text-orange-800'
                                                        }`}>
                                                            {booking.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {booking.item_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{booking.user_name}</div>
                                                        <div className="text-xs text-gray-500">{booking.user_email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                        ${parseFloat(booking.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            booking.status === 'confirmed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : booking.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends (Last 12 Months)</h3>
                            <div className="h-96 flex items-center justify-center text-gray-500">
                                <p>Chart visualization would go here (integrate Chart.js or similar library)</p>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Data available: {JSON.stringify(bookingTrends.labels)}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'revenue' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends (Last 12 Months)</h3>
                            <div className="h-96 flex items-center justify-center text-gray-500">
                                <p>Chart visualization would go here (integrate Chart.js or similar library)</p>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Data available: {JSON.stringify(revenueTrends.labels)}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (Last 12 Months)</h3>
                            <div className="h-96 flex items-center justify-center text-gray-500">
                                <p>Chart visualization would go here (integrate Chart.js or similar library)</p>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Data available: {JSON.stringify(userGrowth.labels)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
