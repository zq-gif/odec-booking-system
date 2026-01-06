import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Feedback({ auth }) {
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Sample bookings data
    const bookings = [
        {
            id: 1,
            facility: 'Beach Area',
            date: '2023-12-15',
            ref: 'ODEC-1234'
        },
        {
            id: 2,
            facility: 'Conference Hall',
            date: '2023-11-20',
            ref: 'ODEC-5678'
        },
        {
            id: 3,
            facility: 'Basketball Court',
            date: '2023-10-05',
            ref: 'ODEC-9012'
        }
    ];

    const handleBookingSelect = (bookingId) => {
        const booking = bookings.find(b => b.id === bookingId);
        setSelectedBooking(booking);
        // Navigate to feedback form for this booking
        router.visit(`/feedback/${bookingId}`);
    };

    const handleGeneralFeedback = () => {
        router.visit('/feedback/general');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Feedback" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
                        <p className="mt-1 text-sm text-gray-600">Share your experience with ODEC facilities</p>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Select a Booking Section */}
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Booking</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Please select a booking you'd like to provide feedback for:
                            </p>

                            {/* Bookings List */}
                            <div className="space-y-3">
                                {bookings.map((booking) => (
                                    <button
                                        key={booking.id}
                                        onClick={() => handleBookingSelect(booking.id)}
                                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-left"
                                    >
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {booking.facility}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Date: {booking.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-500">
                                                Ref: {booking.ref}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Provide General Feedback Section */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Provide General Feedback
                            </h2>

                            <button
                                onClick={handleGeneralFeedback}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                                Submit General Feedback
                            </button>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Note:</span> Your feedback helps us improve our facilities and services.
                            We appreciate you taking the time to share your experience with us.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}