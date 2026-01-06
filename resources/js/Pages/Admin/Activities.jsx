import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    SparklesIcon,
    ClockIcon,
    UserGroupIcon,
    BanknotesIcon,
    SignalIcon
} from '@heroicons/react/24/outline';

export default function Activities({ auth, activities }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const createForm = useForm({
        name: '',
        description: '',
        capacity: '',
        price_per_person: '',
        image: null,
        image_url: '',
        vr_tour_image: null,
        vr_tour_image_url: '',
        duration: '',
        requirements: '',
        difficulty_level: 'easy',
        status: 'available',
    });

    const editForm = useForm({
        name: '',
        description: '',
        capacity: '',
        price_per_person: '',
        image: null,
        image_url: '',
        vr_tour_image: null,
        vr_tour_image_url: '',
        duration: '',
        requirements: '',
        difficulty_level: '',
        status: '',
    });

    const deleteForm = useForm({});

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.activities.store'), {
            forceFormData: true,
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (activity) => {
        setSelectedActivity(activity);
        editForm.setData({
            name: activity.name,
            description: activity.description,
            capacity: activity.capacity,
            price_per_person: activity.price_per_person,
            image: null,
            image_url: activity.image || '',
            vr_tour_image: null,
            vr_tour_image_url: activity.vr_tour_image || '',
            duration: activity.duration || '',
            requirements: activity.requirements || '',
            difficulty_level: activity.difficulty_level || 'easy',
            status: activity.status,
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.post(route('admin.activities.update', selectedActivity.id), {
            _method: 'put',
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedActivity(null);
                editForm.reset();
            },
        });
    };

    const handleDeleteClick = (activity) => {
        setSelectedActivity(activity);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        deleteForm.delete(route('admin.activities.destroy', selectedActivity.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedActivity(null);
            },
        });
    };

    const getDifficultyBadge = (difficulty) => {
        const badges = {
            easy: 'bg-green-100 text-green-800',
            moderate: 'bg-yellow-100 text-yellow-800',
            hard: 'bg-red-100 text-red-800',
        };
        return badges[difficulty] || badges.easy;
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: 'bg-green-100 text-green-800',
            unavailable: 'bg-red-100 text-red-800',
        };
        return badges[status] || badges.available;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Activities</h2>}
        >
            <Head title="Manage Activities" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Activity Management</h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage beach and recreation activities
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Add Activity
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search activities..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Activities Grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                    >
                                        {/* Image */}
                                        {activity.image ? (
                                            <img
                                                src={activity.image}
                                                alt={activity.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                <SparklesIcon className="h-20 w-20 text-blue-400" />
                                            </div>
                                        )}

                                        <div className="p-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-lg font-semibold text-gray-900">{activity.name}</h4>
                                                <div className="flex gap-1">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(activity.status)}`}>
                                                        {activity.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Difficulty */}
                                            {activity.difficulty_level && (
                                                <div className="mb-2">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(activity.difficulty_level)}`}>
                                                        <SignalIcon className="h-3 w-3 mr-1" />
                                                        {activity.difficulty_level}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {activity.description}
                                            </p>

                                            {/* Details */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="font-medium">Capacity:</span>
                                                    <span className="ml-1">{activity.capacity} people</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <BanknotesIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="font-medium">Price:</span>
                                                    <span className="ml-1">${activity.price_per_person}/person</span>
                                                </div>
                                                {activity.duration && (
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                        <span className="font-medium">Duration:</span>
                                                        <span className="ml-1">{activity.duration}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Requirements */}
                                            {activity.requirements && (
                                                <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                                    <span className="font-semibold">Requirements: </span>
                                                    {activity.requirements}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(activity)}
                                                    className="flex-1 inline-flex justify-center items-center px-3 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    <PencilIcon className="h-4 w-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(activity)}
                                                    className="flex-1 inline-flex justify-center items-center px-3 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredActivities.length === 0 && (
                                <div className="text-center py-12">
                                    <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No activities found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new activity.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Create New Activity</h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="px-6 py-4">
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Activity Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.name}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        rows="3"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                    {createForm.errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.description}</p>
                                    )}
                                </div>

                                {/* Row: Capacity, Price, Duration */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Capacity *
                                        </label>
                                        <input
                                            type="number"
                                            value={createForm.data.capacity}
                                            onChange={(e) => createForm.setData('capacity', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                            min="1"
                                        />
                                        {createForm.errors.capacity && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.capacity}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price/Person *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={createForm.data.price_per_person}
                                            onChange={(e) => createForm.setData('price_per_person', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                            min="0"
                                        />
                                        {createForm.errors.price_per_person && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.price_per_person}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.data.duration}
                                            onChange={(e) => createForm.setData('duration', e.target.value)}
                                            placeholder="e.g. 2 hours"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {createForm.errors.duration && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.duration}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Image Uploads */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Activity Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => createForm.setData('image', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Upload image or use URL below (Max: 5MB)</p>
                                        <input
                                            type="text"
                                            value={createForm.data.image_url}
                                            onChange={(e) => createForm.setData('image_url', e.target.value)}
                                            placeholder="Or paste image URL"
                                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {createForm.errors.image && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.image}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            VR Tour Image (360° Photo)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => createForm.setData('vr_tour_image', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Upload 360° image or use URL below (Max: 10MB)</p>
                                        <input
                                            type="text"
                                            value={createForm.data.vr_tour_image_url}
                                            onChange={(e) => createForm.setData('vr_tour_image_url', e.target.value)}
                                            placeholder="Or paste 360° image URL"
                                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {createForm.errors.vr_tour_image && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.vr_tour_image}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Requirements
                                    </label>
                                    <textarea
                                        value={createForm.data.requirements}
                                        onChange={(e) => createForm.setData('requirements', e.target.value)}
                                        rows="2"
                                        placeholder="e.g. Must be able to swim, Age 18+"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {createForm.errors.requirements && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.requirements}</p>
                                    )}
                                </div>

                                {/* Row: Difficulty & Status */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Difficulty Level
                                        </label>
                                        <select
                                            value={createForm.data.difficulty_level}
                                            onChange={(e) => createForm.setData('difficulty_level', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        {createForm.errors.difficulty_level && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.difficulty_level}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            value={createForm.data.status}
                                            onChange={(e) => createForm.setData('status', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                        {createForm.errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{createForm.errors.status}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Activity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedActivity && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Edit Activity</h3>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-500">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="px-6 py-4">
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Activity Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.name}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        rows="3"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                    {editForm.errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.description}</p>
                                    )}
                                </div>

                                {/* Row: Capacity, Price, Duration */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Capacity *
                                        </label>
                                        <input
                                            type="number"
                                            value={editForm.data.capacity}
                                            onChange={(e) => editForm.setData('capacity', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                            min="1"
                                        />
                                        {editForm.errors.capacity && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.capacity}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price/Person *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editForm.data.price_per_person}
                                            onChange={(e) => editForm.setData('price_per_person', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                            min="0"
                                        />
                                        {editForm.errors.price_per_person && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.price_per_person}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.data.duration}
                                            onChange={(e) => editForm.setData('duration', e.target.value)}
                                            placeholder="e.g. 2 hours"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {editForm.errors.duration && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.duration}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Image Uploads */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Activity Image
                                        </label>
                                        {editForm.data.image_url && (
                                            <div className="mb-2">
                                                <img src={editForm.data.image_url} alt="Current" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200" />
                                                <p className="text-xs text-gray-500 mt-1">Current image</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => editForm.setData('image', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Upload new image or use URL below (Max: 5MB)</p>
                                        <input
                                            type="text"
                                            value={editForm.data.image_url}
                                            onChange={(e) => editForm.setData('image_url', e.target.value)}
                                            placeholder="Or paste image URL"
                                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {editForm.errors.image && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.image}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            VR Tour Image (360° Photo)
                                        </label>
                                        {editForm.data.vr_tour_image_url && (
                                            <div className="mb-2">
                                                <img src={editForm.data.vr_tour_image_url} alt="Current VR" className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200" />
                                                <p className="text-xs text-gray-500 mt-1">Current VR tour image</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => editForm.setData('vr_tour_image', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Upload new 360° image or use URL below (Max: 10MB)</p>
                                        <input
                                            type="text"
                                            value={editForm.data.vr_tour_image_url}
                                            onChange={(e) => editForm.setData('vr_tour_image_url', e.target.value)}
                                            placeholder="Or paste 360° image URL"
                                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {editForm.errors.vr_tour_image && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.vr_tour_image}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Requirements
                                    </label>
                                    <textarea
                                        value={editForm.data.requirements}
                                        onChange={(e) => editForm.setData('requirements', e.target.value)}
                                        rows="2"
                                        placeholder="e.g. Must be able to swim, Age 18+"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {editForm.errors.requirements && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.requirements}</p>
                                    )}
                                </div>

                                {/* Row: Difficulty & Status */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Difficulty Level
                                        </label>
                                        <select
                                            value={editForm.data.difficulty_level}
                                            onChange={(e) => editForm.setData('difficulty_level', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        {editForm.errors.difficulty_level && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.difficulty_level}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            value={editForm.data.status}
                                            onChange={(e) => editForm.setData('status', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                        {editForm.errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{editForm.errors.status}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Updating...' : 'Update Activity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedActivity && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                                <TrashIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-lg font-semibold text-gray-900">Delete Activity</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Are you sure you want to delete <span className="font-semibold">{selectedActivity.name}</span>?
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-lg">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteForm.processing}
                                className="px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                            >
                                {deleteForm.processing ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}