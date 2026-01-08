import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '@/Components/Toast';
import { ButtonSpinner } from '@/Components/LoadingSpinner';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon as PendingIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function MyBookings({ auth, bookings: dbBookings }) {
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState({});
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [modificationDetails, setModificationDetails] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toasts, removeToast, toast } = useToast();
    const { flash } = usePage().props;

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Transform database bookings to component format
    const bookings = (dbBookings || []).map(booking => ({
        id: booking.id,
        type: booking.type || 'facility',
        reference: booking.reference_number,
        facility: booking.item_name,
        date: new Date(booking.booking_date).toLocaleDateString(),
        rawDate: booking.booking_date,
        time: booking.start_time && booking.end_time ? `${booking.start_time} - ${booking.end_time}` : 'All Day',
        startTime: booking.start_time,
        endTime: booking.end_time,
        status: booking.status,
        image: booking.item_image || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
        contactName: auth.user.name,
        phone: booking.phone_number || 'N/A',
        email: auth.user.email,
        purpose: booking.type === 'activity' ? 'Activity Booking' : (booking.purpose || 'N/A'),
        attendees: booking.type === 'activity' ? (booking.number_of_participants || 'N/A') : (booking.number_of_guests || 'N/A'),
        bookedOn: new Date(booking.created_at).toLocaleDateString(),
        totalAmount: parseFloat(booking.total_amount),
        paymentMethod: booking.payment_method || 'N/A'
    }));

    const statusFilters = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

    const filteredBookings = selectedStatus === 'All'
        ? bookings
        : bookings.filter(b => b.status === selectedStatus.toLowerCase());

    const toggleDetails = (bookingId) => {
        setShowDetails(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
    };

    const openModal = (booking) => {
        setSelectedBooking(booking);
    };

    const closeModal = () => {
        setSelectedBooking(null);
        setShowCancelModal(false);
        setShowModifyModal(false);
        setCancelReason('');
        setModificationDetails('');
        setNewDate('');
        setNewStartTime('');
        setNewEndTime('');
    };

    const handleCancelBooking = () => {
        if (!cancelReason.trim()) {
            toast.error('Please provide a cancellation reason');
            return;
        }

        setIsSubmitting(true);
        router.post(`/bookings/${selectedBooking.id}/cancel`, {
            type: selectedBooking.type,
            reason: cancelReason
        }, {
            onSuccess: () => {
                closeModal();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleModifyBooking = () => {
        if (!modificationDetails.trim()) {
            toast.error('Please provide modification details');
            return;
        }

        setIsSubmitting(true);
        router.post(`/bookings/${selectedBooking.id}/request-modification`, {
            type: selectedBooking.type,
            modification_details: modificationDetails,
            new_date: newDate,
            new_start_time: newStartTime,
            new_end_time: newEndTime
        }, {
            onSuccess: () => {
                closeModal();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Confirmed' },
            completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, text: 'Completed' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: PendingIcon, text: 'Pending' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, text: 'Cancelled' }
        };

        const badge = badges[status];
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                <Icon className="h-4 w-4 mr-1" />
                {badge.text}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Bookings" />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                        <p className="mt-1 text-sm text-gray-600">View and manage your facility reservations</p>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-700 mb-3">Filter by status:</p>
                        <div className="flex gap-2 flex-wrap">
                            {statusFilters.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedStatus === status
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Bookings</h2>

                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {selectedStatus === 'All' ? 'You haven\'t made any bookings yet.' : `No ${selectedStatus.toLowerCase()} bookings.`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredBookings.map((booking) => (
                                    <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="flex items-center p-4">
                                            {/* Facility Image */}
                                            <img
                                                src={booking.image}
                                                alt={booking.facility}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />

                                            {/* Booking Info */}
                                            <div className="flex-1 ml-4">
                                                <h3 className="text-lg font-semibold text-gray-900">{booking.facility}</h3>
                                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                                    <span className="mr-4">{booking.date}</span>
                                                    <ClockIcon className="h-4 w-4 mr-1" />
                                                    <span>{booking.time}</span>
                                                </div>
                                            </div>

                                            {/* Status and Reference */}
                                            <div className="text-right mr-4">
                                                {getStatusBadge(booking.status)}
                                                <p className="text-xs text-gray-500 mt-2">Ref: {booking.reference}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => toggleDetails(booking.id)}
                                                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                                                >
                                                    <ChevronDownIcon
                                                        className={`h-4 w-4 mr-1 transition-transform ${
                                                            showDetails[booking.id] ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                    {showDetails[booking.id] ? 'Hide' : 'Show'} Details
                                                </button>
                                                <button
                                                    onClick={() => openModal(booking)}
                                                    className="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                                                >
                                                    View Full Details
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {showDetails[booking.id] && (
                                            <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Purpose</p>
                                                        <p className="font-medium text-gray-900">{booking.purpose}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Attendees</p>
                                                        <p className="font-medium text-gray-900">{booking.attendees}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Payment Method</p>
                                                        <p className="font-medium text-gray-900">{booking.paymentMethod}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Total Amount</p>
                                                        <p className="font-medium text-gray-900">RM {booking.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && !showCancelModal && !showModifyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                {getStatusBadge(selectedBooking.status)}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Reference</p>
                                <p className="font-semibold text-gray-900">{selectedBooking.reference}</p>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Facility Name */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedBooking.facility}</h2>

                            {/* Facility Image */}
                            <img
                                src={selectedBooking.image}
                                alt={selectedBooking.facility}
                                className="w-full h-48 object-cover rounded-lg mb-6"
                            />

                            {/* Booking Details Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="flex items-start">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Time</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Facility</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.facility}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Purpose</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.purpose}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium text-gray-900">{selectedBooking.contactName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium text-gray-900">{selectedBooking.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start col-span-2">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium text-gray-900">{selectedBooking.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Additional Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Number of Attendees</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.attendees}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Booked On</p>
                                        <p className="font-medium text-gray-900">{selectedBooking.bookedOn}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-gray-900">Total Amount</p>
                                    <p className="text-xl font-bold text-gray-900">RM {selectedBooking.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                            >
                                Close
                            </button>
                            {selectedBooking.status === 'confirmed' && (
                                <>
                                    <button
                                        onClick={() => setShowModifyModal(true)}
                                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                                        Modify Booking
                                    </button>
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        <TrashIcon className="h-5 w-5 mr-2" />
                                        Cancel Booking
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Booking Modal */}
            {showCancelModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Booking</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                                Cancellations must be made at least 24 hours in advance.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for cancellation <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="Please provide a reason for cancellation..."
                                    required
                                />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                disabled={isSubmitting}
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting || !cancelReason.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ButtonSpinner className="mr-2" />
                                        Cancelling...
                                    </>
                                ) : (
                                    'Confirm Cancellation'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modify Booking Modal */}
            {showModifyModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Request Booking Modification</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Submit a modification request for your booking. Our team will review and contact you shortly.
                                Requests must be submitted at least 48 hours in advance.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Modification Details <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={modificationDetails}
                                        onChange={(e) => setModificationDetails(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="4"
                                        placeholder="Describe what you'd like to change..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Start Time (Optional)
                                        </label>
                                        <input
                                            type="time"
                                            value={newStartTime}
                                            onChange={(e) => setNewStartTime(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New End Time (Optional)
                                        </label>
                                        <input
                                            type="time"
                                            value={newEndTime}
                                            onChange={(e) => setNewEndTime(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModifyModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModifyBooking}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting || !modificationDetails.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ButtonSpinner className="mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
