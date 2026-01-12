import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { StarIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function FeedbackForm({ auth, booking }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comments, setComments] = useState('');
    const [selectedAspects, setSelectedAspects] = useState([]);

    // Sample booking data (in real app, this would come from props)
    const bookingData = booking || {
        id: 1,
        facility: 'Beach Area',
        date: '2023-12-15',
        ref: 'ODEC-1234'
    };

    const aspects = [
        { id: 'cleanliness', label: 'Cleanliness' },
        { id: 'value', label: 'Value for Money' },
        { id: 'facilities', label: 'Facilities' },
        { id: 'staff', label: 'Staff' },
        { id: 'booking_process', label: 'Booking Process' },
        { id: 'location', label: 'Location' }
    ];

    const handleAspectToggle = (aspectId) => {
        setSelectedAspects(prev =>
            prev.includes(aspectId)
                ? prev.filter(id => id !== aspectId)
                : [...prev, aspectId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            return;
        }

        // Submit feedback to backend
        router.post('/feedback/submit', {
            booking_id: bookingData.id,
            booking_type: booking?.type || 'facility',
            booking_reference: bookingData.ref,
            overall_rating: rating,
            comment: comments,
            aspects: selectedAspects,
            would_recommend: rating >= 4
        }, {
            onSuccess: () => {
                router.visit('/my-bookings');
            },
            onError: (errors) => {
                console.error('Feedback submission error:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Feedback for ${bookingData.facility}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
                        <p className="mt-1 text-sm text-gray-600">Share your experience with ODEC facilities</p>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Feedback Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Feedback for {bookingData.facility}
                                </h2>
                                <button
                                    onClick={() => router.visit('/feedback')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Change Selection
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Booking Info */}
                            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600">Facility:</p>
                                    <p className="font-semibold text-gray-900">{bookingData.facility}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Date:</p>
                                    <p className="font-semibold text-gray-900">{bookingData.date}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Reference:</p>
                                    <p className="font-semibold text-gray-900">{bookingData.ref}</p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-3">
                                    How would you rate your experience?
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            {star <= (hoveredRating || rating) ? (
                                                <StarIconSolid className="h-10 w-10 text-yellow-400" />
                                            ) : (
                                                <StarIcon className="h-10 w-10 text-gray-300" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <label htmlFor="comments" className="block text-sm font-medium text-gray-900 mb-2">
                                    Comments
                                </label>
                                <textarea
                                    id="comments"
                                    rows={6}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Please share your thoughts about the facility, staff, booking process, etc."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Aspects to Comment On */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-3">
                                    What aspects would you like to comment on? (Optional)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {aspects.map((aspect) => (
                                        <label
                                            key={aspect.id}
                                            className="flex items-center cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedAspects.includes(aspect.id)}
                                                onChange={() => handleAspectToggle(aspect.id)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{aspect.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={rating === 0}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                                    Submit Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}