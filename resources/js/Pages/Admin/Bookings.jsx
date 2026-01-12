import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Breadcrumb from '@/Components/Breadcrumb';
import {
    CalendarIcon,
    BuildingOfficeIcon,
    SparklesIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentTextIcon,
    XMarkIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function Bookings({ auth, bookings }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, facility, activity
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, confirmed, cancelled, completed
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const updateForm = useForm({
        type: '',
        status: '',
    });

    const deleteForm = useForm({});

    const handleStatusUpdate = (booking, newStatus) => {
        updateForm.setData({
            type: booking.type,
            status: newStatus,
        });

        updateForm.put(route('admin.bookings.update', booking.id), {
            onSuccess: () => {
                updateForm.reset();
            },
        });
    };

    const handleDelete = (booking) => {
        if (confirm(`Are you sure you want to delete this booking (${booking.reference_number})?`)) {
            deleteForm.delete(route('admin.bookings.destroy', { id: booking.id, type: booking.type }));
        }
    };

    const handleViewReceipt = (booking) => {
        setSelectedReceipt({
            receiptUrl: booking.payment_receipt,
            bookingRef: booking.reference_number,
            userName: booking.user_name,
            amount: booking.total_amount,
            paymentMethod: booking.payment_method
        });
        setShowReceiptModal(true);
    };

    const handleDownloadReceipt = (receiptUrl, bookingRef) => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = receiptUrl; // Backend already provides full URL with /storage/ prefix
        link.download = `receipt_${bookingRef}.${receiptUrl.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
        };
        return badges[status] || badges.pending;
    };

    const getTypeBadge = (type) => {
        const badges = {
            facility: 'bg-blue-100 text-blue-800',
            activity: 'bg-purple-100 text-purple-800',
        };
        return badges[type] || badges.facility;
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.item_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || booking.type === filterType;
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Breadcrumb */}
                            <Breadcrumb items={[{ label: 'Bookings' }]} />

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    View and manage all facility and activity bookings
                                </p>
                            </div>

                            {/* Search and Filters */}
                            <div className="mb-6 space-y-4">
                                {/* Search */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by reference, user, or item name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                                    </div>

                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="facility">Facilities</option>
                                        <option value="activity">Activities</option>
                                    </select>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-sm text-yellow-800">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-900">
                                        {bookings.filter(b => b.status === 'pending').length}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-green-800">Confirmed</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {bookings.filter(b => b.status === 'confirmed').length}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-blue-800">Completed</p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {bookings.filter(b => b.status === 'completed').length}
                                    </p>
                                </div>
                            </div>

                            {/* Bookings Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Booking Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr key={`${booking.type}-${booking.id}`} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {booking.type === 'facility' ? (
                                                            <BuildingOfficeIcon className="h-10 w-10 text-blue-500" />
                                                        ) : (
                                                            <SparklesIcon className="h-10 w-10 text-purple-500" />
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {booking.item_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {booking.reference_number}
                                                            </div>
                                                            <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeBadge(booking.type)}`}>
                                                                {booking.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {booking.user_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {booking.user_email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-start">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                        <div>
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(booking.booking_date)}
                                                            </div>
                                                            {booking.start_time && (
                                                                <div className="text-sm text-gray-500">
                                                                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {booking.type === 'facility' ? (
                                                            <span>{booking.number_of_guests} guests</span>
                                                        ) : (
                                                            <span>{booking.number_of_participants} participants</span>
                                                        )}
                                                    </div>
                                                    {booking.special_requests && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            <span className="font-medium">Note: </span>
                                                            {booking.special_requests.substring(0, 50)}
                                                            {booking.special_requests.length > 50 && '...'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ${booking.total_amount}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex flex-wrap gap-2">
                                                        {booking.payment_receipt && (
                                                            <button
                                                                onClick={() => handleViewReceipt(booking)}
                                                                className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
                                                                title="View payment receipt"
                                                            >
                                                                <DocumentTextIcon className="h-4 w-4 mr-1" />
                                                                Receipt
                                                            </button>
                                                        )}
                                                        {booking.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking, 'confirmed')}
                                                                disabled={updateForm.processing}
                                                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50"
                                                                title="Confirm booking"
                                                            >
                                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                                Accept
                                                            </button>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking, 'completed')}
                                                                disabled={updateForm.processing}
                                                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
                                                                title="Mark as completed"
                                                            >
                                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                                Complete
                                                            </button>
                                                        )}
                                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking, 'cancelled')}
                                                                disabled={updateForm.processing}
                                                                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50"
                                                                title="Cancel booking"
                                                            >
                                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                                Cancel
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(booking)}
                                                            disabled={deleteForm.processing}
                                                            className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50"
                                                            title="Delete booking"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {filteredBookings.length === 0 && (
                                <div className="text-center py-12">
                                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookings found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                                            ? 'Try adjusting your search or filters.'
                                            : 'No bookings have been made yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceiptModal && selectedReceipt && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                            onClick={() => setShowReceiptModal(false)}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            {/* Header */}
                            <div className="bg-purple-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="h-6 w-6 text-white mr-2" />
                                        <h3 className="text-lg font-semibold text-white">Payment Receipt</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowReceiptModal(false)}
                                        className="text-white hover:text-gray-200 transition"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6">
                                {/* Booking Details */}
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Booking Reference</p>
                                            <p className="font-semibold text-gray-900">{selectedReceipt.bookingRef}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Customer</p>
                                            <p className="font-semibold text-gray-900">{selectedReceipt.userName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Payment Method</p>
                                            <p className="font-semibold text-gray-900">
                                                {selectedReceipt.paymentMethod === 'cash' ? 'Cash on Arrival (10% Deposit)' : 'Bank Transfer'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Total Amount</p>
                                            <p className="font-semibold text-gray-900">${selectedReceipt.amount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Receipt Image */}
                                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Receipt Image</p>
                                    {selectedReceipt.receiptUrl ? (
                                        <img
                                            src={selectedReceipt.receiptUrl}
                                            alt="Payment Receipt"
                                            className="max-w-full h-auto mx-auto rounded shadow-lg"
                                            style={{ maxHeight: '500px' }}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No receipt uploaded
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowReceiptModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Close
                                </button>
                                {selectedReceipt.receiptUrl && (
                                    <>
                                        <button
                                            onClick={() => handleDownloadReceipt(selectedReceipt.receiptUrl, selectedReceipt.bookingRef)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                                            Download
                                        </button>
                                        <a
                                            href={selectedReceipt.receiptUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            Open in New Tab
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}