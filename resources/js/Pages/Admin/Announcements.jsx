import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    MegaphoneIcon,
    ClockIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

export default function Announcements({ auth, announcements }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [createPhotoType, setCreatePhotoType] = useState('file'); // 'file' or 'url'
    const [editPhotoType, setEditPhotoType] = useState('file');

    const createForm = useForm({
        title: '',
        message: '',
        photo: null,
        photo_url: '',
        is_active: true,
        expires_at: '',
    });

    const editForm = useForm({
        title: '',
        message: '',
        photo: null,
        photo_url: '',
        is_active: true,
        expires_at: '',
    });

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateModal = () => {
        createForm.reset();
        setCreatePhotoType('file');
        setShowCreateModal(true);
    };

    const openEditModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        editForm.setData({
            title: announcement.title,
            message: announcement.message,
            photo: null,
            photo_url: '',
            is_active: announcement.is_active,
            expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : '',
        });
        setEditPhotoType('file');
        setShowEditModal(true);
    };

    const openDeleteModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowDeleteModal(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        console.log('Creating announcement with data:', createForm.data);
        console.log('Photo file:', createForm.data.photo);
        createForm.post(route('admin.announcements.store'), {
            forceFormData: true,
            onBefore: () => {
                console.log('Before submit - form data:', createForm.data);
            },
            onSuccess: () => {
                console.log('Announcement created successfully');
                setShowCreateModal(false);
                createForm.reset();
            },
            onError: (errors) => {
                console.error('Error creating announcement:', errors);
            }
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        console.log('Editing announcement with data:', editForm.data);
        console.log('Photo file:', editForm.data.photo);
        editForm.post(route('admin.announcements.update', selectedAnnouncement.id), {
            forceFormData: true,
            _method: 'patch',
            onBefore: () => {
                console.log('Before submit - form data:', editForm.data);
            },
            onSuccess: () => {
                console.log('Announcement updated successfully');
                setShowEditModal(false);
                editForm.reset();
            },
            onError: (errors) => {
                console.error('Error updating announcement:', errors);
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.announcements.destroy', selectedAnnouncement.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedAnnouncement(null);
            }
        });
    };

    const toggleStatus = (announcement) => {
        router.patch(route('admin.announcements.toggle', announcement.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Announcements Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <MegaphoneIcon className="mr-3 h-8 w-8 text-orange-600" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                                        <p className="text-sm text-gray-600">Manage system-wide announcements</p>
                                    </div>
                                </div>
                                <button
                                    onClick={openCreateModal}
                                    className="flex items-center rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                                >
                                    <PlusIcon className="mr-2 h-5 w-5" />
                                    Create Announcement
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search announcements..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Announcements Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Message
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Photo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Expires
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredAnnouncements.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    No announcements found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAnnouncements.map((announcement) => (
                                                <tr key={announcement.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {announcement.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            by {announcement.creator?.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs truncate text-sm text-gray-900">
                                                            {announcement.message}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {announcement.photo_path ? (
                                                            <img
                                                                src={
                                                                    announcement.photo_path.startsWith('http')
                                                                        ? announcement.photo_path // Cloudinary or external URL
                                                                        : announcement.photo_path.startsWith('/storage/')
                                                                            ? announcement.photo_path // Old format with /storage/
                                                                            : `/storage/${announcement.photo_path}` // New local storage format
                                                                }
                                                                alt="Announcement"
                                                                className="h-12 w-12 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No photo</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => toggleStatus(announcement)}
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                                announcement.is_active
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {announcement.is_active ? 'Active' : 'Inactive'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {announcement.expires_at ? (
                                                            <div className="flex items-center text-xs">
                                                                <ClockIcon className="mr-1 h-4 w-4" />
                                                                {new Date(announcement.expires_at).toLocaleDateString()}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Never</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openEditModal(announcement)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(announcement)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Create Announcement</h3>
                            <button onClick={() => setShowCreateModal(false)}>
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Message</label>
                                    <textarea
                                        value={createForm.data.message}
                                        onChange={(e) => createForm.setData('message', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                        rows="4"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Photo (Optional)</label>
                                    {/* Toggle between file and URL */}
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => { setCreatePhotoType('file'); createForm.setData('photo_url', ''); }}
                                            className={`px-3 py-1 text-sm rounded-lg ${createPhotoType === 'file' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setCreatePhotoType('url'); createForm.setData('photo', null); }}
                                            className={`px-3 py-1 text-sm rounded-lg ${createPhotoType === 'url' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Image URL
                                        </button>
                                    </div>
                                    {createPhotoType === 'file' ? (
                                        <div className="flex items-center gap-3">
                                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 hover:border-orange-400">
                                                <PhotoIcon className="h-6 w-6 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {createForm.data.photo ? createForm.data.photo.name : 'Choose photo'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => createForm.setData('photo', e.target.files[0])}
                                                    className="hidden"
                                                />
                                            </label>
                                            {createForm.data.photo && (
                                                <button
                                                    type="button"
                                                    onClick={() => createForm.setData('photo', null)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="url"
                                            value={createForm.data.photo_url}
                                            onChange={(e) => createForm.setData('photo_url', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full rounded border px-3 py-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Expires At (Optional)</label>
                                    <input
                                        type="date"
                                        value={createForm.data.expires_at}
                                        onChange={(e) => createForm.setData('expires_at', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={createForm.data.is_active}
                                        onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium">Active</label>
                                </div>
                            </div>
                            {createForm.errors && Object.keys(createForm.errors).length > 0 && (
                                <div className="mt-4 rounded bg-red-50 border border-red-200 p-3">
                                    <p className="text-sm font-semibold text-red-800 mb-1">Errors:</p>
                                    <ul className="list-disc list-inside text-sm text-red-700">
                                        {Object.entries(createForm.errors).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Edit Announcement</h3>
                            <button onClick={() => setShowEditModal(false)}>
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEdit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        value={editForm.data.title}
                                        onChange={(e) => editForm.setData('title', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Message</label>
                                    <textarea
                                        value={editForm.data.message}
                                        onChange={(e) => editForm.setData('message', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                        rows="4"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Photo (Optional)</label>
                                    {selectedAnnouncement?.photo_path && (
                                        <div className="mb-2">
                                            <img
                                                src={
                                                    selectedAnnouncement.photo_path.startsWith('http')
                                                        ? selectedAnnouncement.photo_path // Cloudinary or external URL
                                                        : selectedAnnouncement.photo_path.startsWith('/storage/')
                                                            ? selectedAnnouncement.photo_path // Old format with /storage/
                                                            : `/storage/${selectedAnnouncement.photo_path}` // New local storage format
                                                }
                                                alt="Current"
                                                className="h-24 w-24 rounded object-cover"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Current photo</p>
                                        </div>
                                    )}
                                    {/* Toggle between file and URL */}
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => { setEditPhotoType('file'); editForm.setData('photo_url', ''); }}
                                            className={`px-3 py-1 text-sm rounded-lg ${editPhotoType === 'file' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setEditPhotoType('url'); editForm.setData('photo', null); }}
                                            className={`px-3 py-1 text-sm rounded-lg ${editPhotoType === 'url' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Image URL
                                        </button>
                                    </div>
                                    {editPhotoType === 'file' ? (
                                        <div className="flex items-center gap-3">
                                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 hover:border-orange-400">
                                                <PhotoIcon className="h-6 w-6 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {editForm.data.photo ? editForm.data.photo.name : 'Choose new photo'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => editForm.setData('photo', e.target.files[0])}
                                                    className="hidden"
                                                />
                                            </label>
                                            {editForm.data.photo && (
                                                <button
                                                    type="button"
                                                    onClick={() => editForm.setData('photo', null)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="url"
                                            value={editForm.data.photo_url}
                                            onChange={(e) => editForm.setData('photo_url', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full rounded border px-3 py-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Expires At (Optional)</label>
                                    <input
                                        type="date"
                                        value={editForm.data.expires_at}
                                        onChange={(e) => editForm.setData('expires_at', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium">Active</label>
                                </div>
                            </div>
                            {editForm.errors && Object.keys(editForm.errors).length > 0 && (
                                <div className="mt-4 rounded bg-red-50 border border-red-200 p-3">
                                    <p className="text-sm font-semibold text-red-800 mb-1">Errors:</p>
                                    <ul className="list-disc list-inside text-sm text-red-700">
                                        {Object.entries(editForm.errors).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Delete Announcement</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Are you sure you want to delete "{selectedAnnouncement.title}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}