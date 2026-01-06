import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    TrashIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    StarIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function Feedback({ auth, feedbacks }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedback_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openDetailModal = (feedback) => {
        setSelectedFeedback(feedback);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedFeedback(null);
    };

    const openDeleteModal = (feedback) => {
        setSelectedFeedback(feedback);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedFeedback(null);
    };

    const handleDelete = () => {
        router.delete(route('admin.feedback.destroy', selectedFeedback.id), {
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    const getRatingStars = (rating) => {
        if (!rating) return 'N/A';

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
                    ) : (
                        <StarIcon key={star} className="h-4 w-4 text-gray-300" />
                    )
                ))}
                <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
            </div>
        );
    };

    const getRecommendationBadge = (wouldRecommend) => {
        if (wouldRecommend === null || wouldRecommend === undefined) {
            return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">N/A</span>;
        }
        return wouldRecommend ? (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
        ) : (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">No</span>
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'reviewed': 'bg-green-100 text-green-800',
            'archived': 'bg-gray-100 text-gray-800',
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Feedback Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            View and manage user feedback and ratings
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search feedback by title, type, user, or booking reference..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Feedback List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Overall Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recommend
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFeedbacks.map((feedback) => (
                                        <tr key={feedback.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {feedback.user ? feedback.user.name : 'Anonymous'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {feedback.booking_reference || 'No Reference'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{feedback.title || 'No Title'}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {feedback.comment?.substring(0, 50) || 'No comment'}
                                                    {feedback.comment && feedback.comment.length > 50 ? '...' : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {feedback.feedback_type || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRatingStars(feedback.overall_rating)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRecommendationBadge(feedback.would_recommend)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(feedback.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openDetailModal(feedback)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(feedback)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredFeedbacks.length === 0 && (
                            <div className="text-center py-12">
                                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
                                <p className="mt-1 text-sm text-gray-500">No feedback has been submitted yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                            <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">User Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedFeedback.user ? selectedFeedback.user.name : 'Anonymous'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedFeedback.user ? selectedFeedback.user.email : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Booking Reference</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedFeedback.booking_reference || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Feedback Type</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedFeedback.feedback_type || 'General'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ratings */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Ratings</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Overall Rating</span>
                                        {getRatingStars(selectedFeedback.overall_rating)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Cleanliness</span>
                                        {getRatingStars(selectedFeedback.cleanliness_rating)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Staff</span>
                                        {getRatingStars(selectedFeedback.staff_rating)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Facilities</span>
                                        {getRatingStars(selectedFeedback.facilities_rating)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Value for Money</span>
                                        {getRatingStars(selectedFeedback.value_rating)}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Would Recommend</span>
                                        {getRecommendationBadge(selectedFeedback.would_recommend)}
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Content */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Feedback</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Title</p>
                                        <p className="text-gray-900">{selectedFeedback.title || 'No title provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Comment</p>
                                        <p className="text-gray-900 whitespace-pre-wrap">
                                            {selectedFeedback.comment || 'No comment provided'}
                                        </p>
                                    </div>
                                    {selectedFeedback.suggestions && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Suggestions for Improvement</p>
                                            <p className="text-gray-900 whitespace-pre-wrap">
                                                {selectedFeedback.suggestions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Submitted On</p>
                                        <p className="font-medium text-gray-900">{formatDate(selectedFeedback.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedFeedback.status)}`}>
                                            {selectedFeedback.status?.charAt(0).toUpperCase() + selectedFeedback.status?.slice(1) || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={closeDetailModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    closeDetailModal();
                                    openDeleteModal(selectedFeedback);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Feedback</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this feedback from <strong>{selectedFeedback.user?.name || 'Anonymous'}</strong>? This action cannot be undone.
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
                                Delete Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
