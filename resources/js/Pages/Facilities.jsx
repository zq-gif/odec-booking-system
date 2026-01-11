import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Facilities({ auth, facilities = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // Map status to display category
    const getCategory = (status) => {
        if (!status) return 'All';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const filters = ['all', 'available', 'unavailable', 'maintenance'];

    const filteredFacilities = facilities.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (facility.description && facility.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (facility.location && facility.location.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = activeFilter === 'all' || facility.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Facilities" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Browse and book ODEC facilities</h1>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search facilities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filter:</span>
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        activeFilter === filter
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Facilities Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredFacilities.map((facility) => (
                            <div
                                key={facility.id}
                                className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={
                                            facility.image
                                                ? (facility.image.startsWith('http')
                                                    ? facility.image
                                                    : facility.image.startsWith('/storage/')
                                                        ? facility.image
                                                        : `/storage/${facility.image}`)
                                                : 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop'
                                        }
                                        alt={facility.name}
                                        className="h-full w-full object-cover transition-transform hover:scale-105"
                                    />
                                    {/* Status Badge */}
                                    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                                        facility.status === 'available' ? 'bg-green-100 text-green-800' :
                                        facility.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {getCategory(facility.status)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        {facility.name}
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-600">
                                        {facility.description}
                                    </p>

                                    {/* Price and Location */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-blue-600">
                                            RM {facility.price_per_hour}/hour
                                        </p>
                                        {facility.location && (
                                            <p className="text-xs text-gray-500">
                                                {facility.location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            href="/vr-tour"
                                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            VR Tour
                                        </Link>
                                        <Link
                                            href={`/book-facility?facility=${facility.id}`}
                                            className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-white transition-colors ${
                                                facility.status === 'available'
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                            disabled={facility.status !== 'available'}
                                        >
                                            {facility.status === 'available' ? 'Book Now' : 'Unavailable'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredFacilities.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-gray-500">No facilities found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}