import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function Issues({ auth, issues, facilities, staff, users }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        user_id: '',
        facility_id: '',
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        status: 'open',
        assigned_to: '',
        reported_date: new Date().toISOString().split('T')[0],
        resolved_date: '',
        admin_notes: '',
        resolution_details: '',
    });

    const editForm = useForm({
        user_id: '',
        facility_id: '',
        title: '',
        description: '',
        category: '',
        priority: '',
        status: '',
        assigned_to: '',
        reported_date: '',
        resolved_date: '',
        admin_notes: '',
        resolution_details: '',
    });

    const filteredIssues = issues.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateModal = () => {
        createForm.reset();
        createForm.setData('reported_date', new Date().toISOString().split('T')[0]);
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        createForm.reset();
    };

    const openEditModal = (issue) => {
        setSelectedIssue(issue);
        editForm.setData({
            user_id: issue.user_id,
            facility_id: issue.facility_id || '',
            title: issue.title,
            description: issue.description,
            category: issue.category,
            priority: issue.priority,
            status: issue.status,
            assigned_to: issue.assigned_to || '',
            reported_date: issue.reported_date,
            resolved_date: issue.resolved_date || '',
            admin_notes: issue.admin_notes || '',
            resolution_details: issue.resolution_details || '',
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedIssue(null);
        editForm.reset();
    };

    const openDeleteModal = (issue) => {
        setSelectedIssue(issue);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedIssue(null);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.issues.store'), {
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.issues.update', selectedIssue.id), {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.issues.destroy', selectedIssue.id), {
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'open': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
            'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon },
            'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
            'closed': { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon },
        };
        return badges[status] || badges.open;
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

    const getCategoryBadge = (category) => {
        const badges = {
            'maintenance': 'bg-purple-100 text-purple-800',
            'cleanliness': 'bg-teal-100 text-teal-800',
            'equipment': 'bg-indigo-100 text-indigo-800',
            'safety': 'bg-red-100 text-red-800',
            'other': 'bg-gray-100 text-gray-800',
        };
        return badges[category] || badges.other;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Issue Reports Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Issue Reports Management</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage and track reported issues
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Issue
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search issues by title, category, status, or priority..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reported By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Facility
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reported Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredIssues.map((issue) => {
                                        const StatusIcon = getStatusBadge(issue.status).icon;
                                        return (
                                            <tr key={issue.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{issue.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {issue.user ? issue.user.name : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {issue.facility ? issue.facility.name : 'General'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(issue.category)}`}>
                                                        {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(issue.priority)}`}>
                                                        {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(issue.status).color}`}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {issue.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(issue.reported_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {issue.assigned_staff ? issue.assigned_staff.name : 'Unassigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditModal(issue)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(issue)}
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

                        {filteredIssues.length === 0 && (
                            <div className="text-center py-12">
                                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new issue report.</p>
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
                            <h3 className="text-lg font-semibold text-gray-900">Create New Issue</h3>
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
                                        Reported By *
                                    </label>
                                    <select
                                        value={createForm.data.user_id}
                                        onChange={(e) => createForm.setData('user_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.user_id && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.user_id}</p>
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
                                        <option value="">General Issue</option>
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
                                        Category *
                                    </label>
                                    <select
                                        value={createForm.data.category}
                                        onChange={(e) => createForm.setData('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="maintenance">Maintenance</option>
                                        <option value="cleanliness">Cleanliness</option>
                                        <option value="equipment">Equipment</option>
                                        <option value="safety">Safety</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {createForm.errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.category}</p>
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
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    {createForm.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.status}</p>
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
                                        Reported Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={createForm.data.reported_date}
                                        onChange={(e) => createForm.setData('reported_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {createForm.errors.reported_date && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.reported_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resolved Date
                                    </label>
                                    <input
                                        type="date"
                                        value={createForm.data.resolved_date}
                                        onChange={(e) => createForm.setData('resolved_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.resolved_date && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.resolved_date}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={createForm.data.admin_notes}
                                        onChange={(e) => createForm.setData('admin_notes', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.admin_notes && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.admin_notes}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resolution Details
                                    </label>
                                    <textarea
                                        value={createForm.data.resolution_details}
                                        onChange={(e) => createForm.setData('resolution_details', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {createForm.errors.resolution_details && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.resolution_details}</p>
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
                                    {createForm.processing ? 'Creating...' : 'Create Issue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal - Similar structure to Create Modal */}
            {showEditModal && selectedIssue && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Issue</h3>
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
                                        Reported By *
                                    </label>
                                    <select
                                        value={editForm.data.user_id}
                                        onChange={(e) => editForm.setData('user_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {editForm.errors.user_id && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.user_id}</p>
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
                                        <option value="">General Issue</option>
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
                                        Category *
                                    </label>
                                    <select
                                        value={editForm.data.category}
                                        onChange={(e) => editForm.setData('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="maintenance">Maintenance</option>
                                        <option value="cleanliness">Cleanliness</option>
                                        <option value="equipment">Equipment</option>
                                        <option value="safety">Safety</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {editForm.errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.category}</p>
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
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    {editForm.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.status}</p>
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
                                        Reported Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.data.reported_date}
                                        onChange={(e) => editForm.setData('reported_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {editForm.errors.reported_date && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.reported_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resolved Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.data.resolved_date}
                                        onChange={(e) => editForm.setData('resolved_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.resolved_date && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.resolved_date}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={editForm.data.admin_notes}
                                        onChange={(e) => editForm.setData('admin_notes', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.admin_notes && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.admin_notes}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resolution Details
                                    </label>
                                    <textarea
                                        value={editForm.data.resolution_details}
                                        onChange={(e) => editForm.setData('resolution_details', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editForm.errors.resolution_details && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.resolution_details}</p>
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
                                    {editForm.processing ? 'Updating...' : 'Update Issue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedIssue && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Issue</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedIssue.title}</strong>? This action cannot be undone.
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
                                Delete Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}