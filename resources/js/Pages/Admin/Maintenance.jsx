import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    WrenchScrewdriverIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Maintenance({ auth, maintenances, facilities, staff }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        facility_id: '',
        title: '',
        description: '',
        type: 'routine',
        priority: 'medium',
        status: 'scheduled',
        scheduled_date: '',
        scheduled_time: '',
        completion_date: '',
        assigned_to: '',
        cost: '',
        notes: '',
    });

    const editForm = useForm({
        facility_id: '',
        title: '',
        description: '',
        type: '',
        priority: '',
        status: '',
        scheduled_date: '',
        scheduled_time: '',
        completion_date: '',
        assigned_to: '',
        cost: '',
        notes: '',
    });

    const filteredMaintenances = maintenances.filter(maintenance =>
        maintenance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateModal = () => {
        createForm.reset();
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        createForm.reset();
    };

    const openEditModal = (maintenance) => {
        setSelectedMaintenance(maintenance);
        editForm.setData({
            facility_id: maintenance.facility_id || '',
            title: maintenance.title,
            description: maintenance.description,
            type: maintenance.type,
            priority: maintenance.priority,
            status: maintenance.status,
            scheduled_date: maintenance.scheduled_date,
            scheduled_time: maintenance.scheduled_time || '',
            completion_date: maintenance.completion_date || '',
            assigned_to: maintenance.assigned_to || '',
            cost: maintenance.cost || '',
            notes: maintenance.notes || '',
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedMaintenance(null);
        editForm.reset();
    };

    const openDeleteModal = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedMaintenance(null);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.maintenance.store'), {
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.maintenance.update', selectedMaintenance.id), {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.maintenance.destroy', selectedMaintenance.id), {
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'scheduled': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
            'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: ExclamationCircleIcon },
            'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
            'cancelled': { color: 'bg-red-100 text-red-800', icon: XMarkIcon },
        };
        return badges[status] || badges.scheduled;
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            'low': 'bg-gray-100 text-gray-800',
            'medium': 'bg-blue-100 text-blue-800',
            'high': 'bg-orange-100 text-orange-800',
            'urgent': 'bg-red-100 text-red-800',
        };
        return badges[priority] || badges.medium;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Maintenance Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Schedule and track facility maintenance tasks
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Schedule Maintenance
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search maintenance by title, type, status, or priority..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Maintenance List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Facility
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Scheduled Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cost
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMaintenances.map((maintenance) => {
                                        const StatusIcon = getStatusBadge(maintenance.status).icon;
                                        return (
                                            <tr key={maintenance.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{maintenance.title}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{maintenance.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {maintenance.facility ? maintenance.facility.name : 'General'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        {maintenance.type.charAt(0).toUpperCase() + maintenance.type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(maintenance.priority)}`}>
                                                        {maintenance.priority.charAt(0).toUpperCase() + maintenance.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(maintenance.status).color}`}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {maintenance.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(maintenance.scheduled_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {maintenance.assigned_staff ? maintenance.assigned_staff.name : 'Unassigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {maintenance.cost ? `$${parseFloat(maintenance.cost).toFixed(2)}` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditModal(maintenance)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(maintenance)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredMaintenances.length === 0 && (
                            <div className="text-center py-12">
                                <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance records found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by scheduling a new maintenance task.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Schedule New Maintenance</h3>
                            <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.title}</p>
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
                                        Facility
                                    </label>
                                    <select
                                        value={createForm.data.facility_id}
                                        onChange={(e) => createForm.setData('facility_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">General Maintenance</option>
                                        {facilities.map((facility) => (
                                            <option key={facility.id} value={facility.id}>
                                                {facility.name}
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.facility_id && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.facility_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        value={createForm.data.type}
                                        onChange={(e) => createForm.setData('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="routine">Routine</option>
                                        <option value="repair">Repair</option>
                                        <option value="upgrade">Upgrade</option>
                                        <option value="inspection">Inspection</option>
                                        <option value="cleaning">Cleaning</option>
                                    </select>
                                    {createForm.errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.type}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority *
                                    </label>
                                    <select
                                        value={createForm.data.priority}
                                        onChange={(e) => createForm.setData('priority', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                    {createForm.errors.priority && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.priority}</p>
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
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {createForm.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.status}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Scheduled Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={createForm.data.scheduled_date}
                                        onChange={(e) => createForm.setData('scheduled_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.scheduled_date && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.scheduled_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Scheduled Time
                                    </label>
                                    <input
                                        type="time"
                                        value={createForm.data.scheduled_time}
                                        onChange={(e) => createForm.setData('scheduled_time', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.scheduled_time && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.scheduled_time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Completion Date
                                    </label>
                                    <input
                                        type="date"
                                        value={createForm.data.completion_date}
                                        onChange={(e) => createForm.setData('completion_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.completion_date && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.completion_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign To
                                    </label>
                                    <select
                                        value={createForm.data.assigned_to}
                                        onChange={(e) => createForm.setData('assigned_to', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Unassigned</option>
                                        {staff.map((staffMember) => (
                                            <option key={staffMember.id} value={staffMember.id}>
                                                {staffMember.name} - {staffMember.role}
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.assigned_to && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.assigned_to}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.data.cost}
                                        onChange={(e) => createForm.setData('cost', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.cost && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.cost}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={createForm.data.notes}
                                        onChange={(e) => createForm.setData('notes', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.notes}</p>
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
                                    {createForm.processing ? 'Scheduling...' : 'Schedule Maintenance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedMaintenance && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Maintenance</h3>
                            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.title}
                                        onChange={(e) => editForm.setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.title}</p>
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
                                        Facility
                                    </label>
                                    <select
                                        value={editForm.data.facility_id}
                                        onChange={(e) => editForm.setData('facility_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">General Maintenance</option>
                                        {facilities.map((facility) => (
                                            <option key={facility.id} value={facility.id}>
                                                {facility.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editForm.errors.facility_id && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.facility_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        value={editForm.data.type}
                                        onChange={(e) => editForm.setData('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="routine">Routine</option>
                                        <option value="repair">Repair</option>
                                        <option value="upgrade">Upgrade</option>
                                        <option value="inspection">Inspection</option>
                                        <option value="cleaning">Cleaning</option>
                                    </select>
                                    {editForm.errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.type}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority *
                                    </label>
                                    <select
                                        value={editForm.data.priority}
                                        onChange={(e) => editForm.setData('priority', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                    {editForm.errors.priority && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.priority}</p>
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
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {editForm.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.status}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Scheduled Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.data.scheduled_date}
                                        onChange={(e) => editForm.setData('scheduled_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.scheduled_date && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.scheduled_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Scheduled Time
                                    </label>
                                    <input
                                        type="time"
                                        value={editForm.data.scheduled_time}
                                        onChange={(e) => editForm.setData('scheduled_time', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.scheduled_time && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.scheduled_time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Completion Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.data.completion_date}
                                        onChange={(e) => editForm.setData('completion_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.completion_date && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.completion_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign To
                                    </label>
                                    <select
                                        value={editForm.data.assigned_to}
                                        onChange={(e) => editForm.setData('assigned_to', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Unassigned</option>
                                        {staff.map((staffMember) => (
                                            <option key={staffMember.id} value={staffMember.id}>
                                                {staffMember.name} - {staffMember.role}
                                            </option>
                                        ))}
                                    </select>
                                    {editForm.errors.assigned_to && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.assigned_to}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.data.cost}
                                        onChange={(e) => editForm.setData('cost', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.cost && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.cost}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={editForm.data.notes}
                                        onChange={(e) => editForm.setData('notes', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.notes}</p>
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
                                    {editForm.processing ? 'Updating...' : 'Update Maintenance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedMaintenance && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Maintenance Record</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedMaintenance.title}</strong>? This action cannot be undone.
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
                                Delete Maintenance
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}