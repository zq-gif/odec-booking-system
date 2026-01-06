import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function Facilities({ auth, facilities }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        name: '',
        description: '',
        capacity: '',
        price_per_hour: '',
        slot_duration: '4',
        image: '',
        amenities: '',
        location: '',
        status: 'available',
    });

    const editForm = useForm({
        name: '',
        description: '',
        capacity: '',
        price_per_hour: '',
        slot_duration: '4',
        image: '',
        amenities: '',
        location: '',
        status: '',
    });

    const filteredFacilities = facilities.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateModal = () => {
        createForm.reset();
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        createForm.reset();
    };

    const openEditModal = (facility) => {
        setSelectedFacility(facility);
        editForm.setData({
            name: facility.name,
            description: facility.description,
            capacity: facility.capacity,
            price_per_hour: facility.price_per_hour,
            slot_duration: facility.slot_duration || '4',
            image: facility.image || '',
            amenities: facility.amenities || '',
            location: facility.location || '',
            status: facility.status,
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedFacility(null);
        editForm.reset();
    };

    const openDeleteModal = (facility) => {
        setSelectedFacility(facility);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedFacility(null);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.facilities.store'), {
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.facilities.update', selectedFacility.id), {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.facilities.destroy', selectedFacility.id), {
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: 'bg-green-100 text-green-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            unavailable: 'bg-red-100 text-red-800',
        };
        return badges[status] || badges.available;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Facilities" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Manage Facilities</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Create, edit, and manage ODEC facilities
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Facility
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search facilities by name, location, or status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Facilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFacilities.map((facility) => (
                            <div key={facility.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                                <img
                                    src={facility.image || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop'}
                                    alt={facility.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(facility.status)}`}>
                                            {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{facility.description}</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <span className="font-medium mr-2">Capacity:</span>
                                            <span>{facility.capacity} people</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-700">
                                            <span className="font-medium mr-2">Price:</span>
                                            <span>${facility.price_per_hour}/hour</span>
                                        </div>
                                        {facility.location && (
                                            <div className="flex items-center text-sm text-gray-700">
                                                <span className="font-medium mr-2">Location:</span>
                                                <span>{facility.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(facility)}
                                            className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(facility)}
                                            className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredFacilities.length === 0 && (
                        <div className="text-center py-12">
                            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new facility.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Facility</h3>
                            <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Facility Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Capacity *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={createForm.data.capacity}
                                        onChange={(e) => createForm.setData('capacity', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.capacity && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.capacity}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price per Hour ($) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.data.price_per_hour}
                                        onChange={(e) => createForm.setData('price_per_hour', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.price_per_hour && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.price_per_hour}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slot Duration (hours) *
                                    </label>
                                    <select
                                        value={createForm.data.slot_duration}
                                        onChange={(e) => createForm.setData('slot_duration', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="1">1 hour</option>
                                        <option value="2">2 hours</option>
                                        <option value="3">3 hours</option>
                                        <option value="4">4 hours</option>
                                        <option value="5">5 hours</option>
                                        <option value="6">6 hours</option>
                                    </select>
                                    {createForm.errors.slot_duration && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.slot_duration}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.image}
                                        onChange={(e) => createForm.setData('image', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {createForm.errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.image}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.location}
                                        onChange={(e) => createForm.setData('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.location}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={createForm.data.status}
                                        onChange={(e) => createForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="available">Available</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                    {createForm.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.status}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amenities
                                    </label>
                                    <textarea
                                        value={createForm.data.amenities}
                                        onChange={(e) => createForm.setData('amenities', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="WiFi, Projector, Air Conditioning, etc."
                                    />
                                    {createForm.errors.amenities && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.amenities}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Facility'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedFacility && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Facility</h3>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Facility Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Capacity *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.data.capacity}
                                        onChange={(e) => editForm.setData('capacity', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.capacity && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.capacity}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price per Hour ($) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.data.price_per_hour}
                                        onChange={(e) => editForm.setData('price_per_hour', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.price_per_hour && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.price_per_hour}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slot Duration (hours) *
                                    </label>
                                    <select
                                        value={editForm.data.slot_duration}
                                        onChange={(e) => editForm.setData('slot_duration', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="1">1 hour</option>
                                        <option value="2">2 hours</option>
                                        <option value="3">3 hours</option>
                                        <option value="4">4 hours</option>
                                        <option value="5">5 hours</option>
                                        <option value="6">6 hours</option>
                                    </select>
                                    {editForm.errors.slot_duration && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.slot_duration}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.image}
                                        onChange={(e) => editForm.setData('image', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {editForm.errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.image}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.location}
                                        onChange={(e) => editForm.setData('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.location}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="available">Available</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                    {editForm.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.status}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amenities
                                    </label>
                                    <textarea
                                        value={editForm.data.amenities}
                                        onChange={(e) => editForm.setData('amenities', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="WiFi, Projector, Air Conditioning, etc."
                                    />
                                    {editForm.errors.amenities && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.amenities}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Updating...' : 'Update Facility'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedFacility && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Facility</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedFacility.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete Facility
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}