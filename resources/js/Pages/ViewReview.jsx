import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function ViewReview({ auth, review, booking }) {
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <StarIconSolid key={star} className="h-6 w-6 text-yellow-400" />
                    ) : (
                        <StarIcon key={star} className="h-6 w-6 text-gray-300" />
                    )
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Review for ${booking.facility}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.visit('/my-bookings')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to My Bookings
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Your Review</h1>
                        <p className="mt-1 text-sm text-gray-600">Review submitted for {booking.facility}</p>
                    </div>

                    {/* Review Card */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Review Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {booking.facility}
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    review.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : review.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {review.status === 'approved' ? 'Published' : review.status === 'pending' ? 'Pending Approval' : review.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Booking Info */}
                            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600">Facility/Activity:</p>
                                    <p className="font-semibold text-gray-900">{booking.facility}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Booking Date:</p>
                                    <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Reference Number:</p>
                                    <p className="font-semibold text-gray-900">{booking.ref}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Review Submitted:</p>
                                    <p className="font-semibold text-gray-900">{formatDate(review.created_at)}</p>
                                </div>
                            </div>

                            {/* Overall Rating */}
                            <div>
                                <p className="text-sm font-medium text-gray-900 mb-2">Your Rating</p>
                                <div className="flex items-center gap-3">
                                    {renderStars(review.overall_rating)}
                                    <span className="text-lg font-semibold text-gray-900">
                                        {review.overall_rating}/5
                                    </span>
                                </div>
                            </div>

                            {/* Would Recommend */}
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    review.would_recommend
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {review.would_recommend ? 'Would Recommend' : 'Would Not Recommend'}
                                </span>
                            </div>

                            {/* Comments */}
                            {review.comment && (
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">Your Comments</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {review.suggestions && (
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">Your Suggestions</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{review.suggestions}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                            <p className="text-sm text-gray-600">
                                Thank you for sharing your feedback! Your review helps us improve our services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
