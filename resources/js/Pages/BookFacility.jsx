import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CheckCircleIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    CreditCardIcon,
    CheckBadgeIcon,
    MapPinIcon,
    ClockIcon,
    UserCircleIcon,
    PrinterIcon,
    DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

export default function BookFacility({ auth, facilities, paymentQrCode }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingData, setBookingData] = useState({
        facility: null,
        date: '',
        time: '',
        name: auth.user.name,
        email: auth.user.email,
        phone: '',
        attendees: '',
        purpose: '',
        paymentMethod: '',
        receiptFile: null
    });

    // Generate time slots based on facility's slot_duration
    const generateTimeSlots = () => {
        const duration = bookingData.facility?.slot_duration || 4;
        const slots = [];
        const startHour = 8;
        const endHour = 22;

        for (let hour = startHour; hour + duration <= endHour; hour += duration) {
            const startTime = hour.toString().padStart(2, '0') + ':00';
            const endTime = (hour + duration).toString().padStart(2, '0') + ':00';
            const label = hour < 12
                ? `${hour}:00 AM`
                : hour === 12
                ? `12:00 PM`
                : `${hour - 12}:00 PM`;
            slots.push({ value: startTime, label, endTime, duration });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Fetch booked slots when facility and date change
    useEffect(() => {
        if (bookingData.facility && bookingData.date) {
            fetchBookedSlots();
        }
    }, [bookingData.facility, bookingData.date]);

    const fetchBookedSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await axios.get('/api/facility-bookings/booked-slots', {
                params: {
                    facility_id: bookingData.facility.id,
                    date: bookingData.date
                }
            });
            setBookedSlots(response.data);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
        }
        setLoadingSlots(false);
    };

    const isSlotBooked = (startTime) => {
        return bookedSlots.some(slot => slot.start_time === startTime + ':00' || slot.start_time === startTime);
    };

    const steps = [
        { number: 1, name: 'Select Facility', icon: ClipboardDocumentListIcon },
        { number: 2, name: 'Choose Date & Time', icon: CalendarIcon },
        { number: 3, name: 'Enter Details', icon: ClipboardDocumentListIcon },
        { number: 4, name: 'Payment', icon: CreditCardIcon },
        { number: 5, name: 'Confirmation', icon: CheckBadgeIcon }
    ];

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleFacilitySelect = (facility) => {
        setBookingData({ ...bookingData, facility });
        handleNext();
    };

    // Calculate total price based on facility's slot duration
    const calculateTotal = () => {
        if (!bookingData.facility?.price_per_hour) return 0;
        const durationHours = bookingData.facility?.slot_duration || 4;
        return (parseFloat(bookingData.facility.price_per_hour) * durationHours).toFixed(2);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Use facility's slot duration
        const durationHours = bookingData.facility?.slot_duration || 4;

        // Calculate end time
        const startTime = bookingData.time;
        const [hours] = startTime.split(':');
        const endHours = (parseInt(hours) + durationHours).toString().padStart(2, '0');
        const endTime = `${endHours}:00`;

        try {
            // Use FormData to handle file upload
            const formData = new FormData();
            formData.append('facility_id', bookingData.facility.id);
            formData.append('booking_date', bookingData.date);
            formData.append('start_time', startTime);
            formData.append('end_time', endTime);
            formData.append('duration_hours', durationHours);
            formData.append('number_of_guests', parseInt(bookingData.attendees));
            formData.append('purpose', bookingData.purpose);
            formData.append('phone_number', bookingData.phone);
            formData.append('payment_method', bookingData.paymentMethod);

            // Add receipt file if provided
            if (bookingData.receiptFile) {
                formData.append('payment_receipt', bookingData.receiptFile);
            }

            const response = await axios.post('/facility-bookings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response data:', response.data);

            if (response.data.success) {
                setReferenceNumber(response.data.reference_number);
                handleNext();
            } else {
                alert(response.data.message || 'Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert('Validation errors:\n' + errorMessages);
            } else {
                alert('An error occurred while creating your booking. Please try again.');
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Book a Facility" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Book a Facility</h1>
                        <p className="mt-1 text-sm text-gray-600">Reserve ODEC facilities for your events</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                                            currentStep >= step.number
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'bg-white border-gray-300'
                                        }`}>
                                            <step.icon className={`h-6 w-6 ${
                                                currentStep >= step.number ? 'text-white' : 'text-gray-400'
                                            }`} />
                                        </div>
                                        <p className={`mt-2 text-xs font-medium ${
                                            currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                            {step.name}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 ${
                                            currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {/* Step 1: Select Facility */}
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Select a Facility</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {facilities.map((facility) => (
                                        <div
                                            key={facility.id}
                                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                            onClick={() => handleFacilitySelect(facility)}
                                        >
                                            <img
                                                src={facility.image}
                                                alt={facility.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                                                    <span className="text-blue-600 font-bold">${facility.price_per_hour}/hour</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{facility.description}</p>
                                                <p className="text-xs text-gray-500">Capacity: {facility.capacity}</p>
                                                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Choose Date & Time */}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Date & Time</h2>
                                <div className="max-w-md mx-auto space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Selected Facility
                                        </label>
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="font-semibold text-gray-900">{bookingData.facility?.name}</p>
                                            <p className="text-sm text-gray-600">${bookingData.facility?.price_per_hour}/hour</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Time Slot
                                        </label>
                                        {loadingSlots ? (
                                            <div className="text-center py-4 text-gray-500">Loading available slots...</div>
                                        ) : !bookingData.date ? (
                                            <div className="text-center py-4 text-gray-500">Please select a date first</div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                {timeSlots.map((slot) => {
                                                    const booked = isSlotBooked(slot.value);
                                                    const selected = bookingData.time === slot.value;
                                                    return (
                                                        <button
                                                            key={slot.value}
                                                            type="button"
                                                            disabled={booked}
                                                            onClick={() => !booked && setBookingData({ ...bookingData, time: slot.value })}
                                                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                                                                booked
                                                                    ? 'bg-red-100 border-red-300 text-red-500 cursor-not-allowed'
                                                                    : selected
                                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                                    : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 cursor-pointer'
                                                            }`}
                                                        >
                                                            <div className="font-semibold">{slot.label}</div>
                                                            <div className="text-xs mt-1">
                                                                {booked ? 'Booked' : 'Available'}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        <div className="flex gap-4 mt-3 text-xs">
                                            <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span>
                                                <span>Available</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-red-100 border border-red-300 rounded"></span>
                                                <span>Booked</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-blue-600 rounded"></span>
                                                <span>Selected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Enter Details */}
                        {currentStep === 3 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Enter Booking Details</h2>
                                <div className="max-w-md mx-auto space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={bookingData.name}
                                            onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={bookingData.email}
                                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={bookingData.phone}
                                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Attendees</label>
                                        <input
                                            type="number"
                                            value={bookingData.attendees}
                                            onChange={(e) => setBookingData({ ...bookingData, attendees: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Booking</label>
                                        <textarea
                                            value={bookingData.purpose}
                                            onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Payment */}
                        {currentStep === 4 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment</h2>
                                <div className="max-w-md mx-auto space-y-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Facility:</span>
                                                <span className="font-medium">{bookingData.facility?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Date:</span>
                                                <span className="font-medium">{bookingData.date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Time:</span>
                                                <span className="font-medium">{bookingData.time}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Duration:</span>
                                                <span className="font-medium">4 hours</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-300">
                                                <span className="font-semibold">Total:</span>
                                                <span className="font-bold text-blue-600">${calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cash"
                                                    checked={bookingData.paymentMethod === 'cash'}
                                                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                                                    className="mr-3"
                                                />
                                                <span>Cash on Arrival</span>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="bank_transfer"
                                                    checked={bookingData.paymentMethod === 'bank_transfer'}
                                                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                                                    className="mr-3"
                                                />
                                                <span>Bank Transfer</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Receipt Upload for Cash on Arrival or Bank Transfer */}
                                    {(bookingData.paymentMethod === 'cash' || bookingData.paymentMethod === 'bank_transfer') && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Upload Payment Receipt
                                                {bookingData.paymentMethod === 'cash' && (
                                                    <span className="text-amber-600 ml-1">(10% Deposit Receipt)</span>
                                                )}
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                                                <div className="space-y-1 text-center">
                                                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="receipt-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="receipt-upload"
                                                                name="receipt-upload"
                                                                type="file"
                                                                accept="image/*,.pdf"
                                                                className="sr-only"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        setBookingData({ ...bookingData, receiptFile: file });
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                                    {bookingData.receiptFile && (
                                                        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600">
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                            <span>{bookingData.receiptFile.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {bookingData.paymentMethod === 'cash' && (
                                                <div className="mt-2 space-y-3">
                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <p className="text-xs text-blue-800">
                                                            <strong>Bank Details for Deposit Transfer:</strong><br />
                                                            Maybank - ODEC UMS Beach Club<br />
                                                            Account: 1234567890<br />
                                                            Amount: ${(parseFloat(calculateTotal()) * 0.1).toFixed(2)} (10% deposit)
                                                        </p>
                                                    </div>
                                                    {paymentQrCode && (
                                                        <div className="p-4 bg-white border-2 border-blue-300 rounded-lg">
                                                            <p className="text-sm font-semibold text-gray-900 mb-2 text-center">
                                                                Scan QR Code to Pay
                                                            </p>
                                                            <img
                                                                src={`/storage/${paymentQrCode}`}
                                                                alt="Payment QR Code"
                                                                className="max-w-full h-auto mx-auto rounded"
                                                                style={{ maxHeight: '250px' }}
                                                            />
                                                            <p className="text-xs text-gray-600 text-center mt-2">
                                                                Scan this QR code with your banking app to pay the deposit
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {bookingData.paymentMethod === 'bank_transfer' && (
                                                <div className="mt-2 space-y-3">
                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <p className="text-xs text-blue-800">
                                                            <strong>Bank Details for Full Payment:</strong><br />
                                                            Maybank - ODEC UMS Beach Club<br />
                                                            Account: 1234567890<br />
                                                            Amount: ${calculateTotal()}
                                                        </p>
                                                    </div>
                                                    {paymentQrCode && (
                                                        <div className="p-4 bg-white border-2 border-blue-300 rounded-lg">
                                                            <p className="text-sm font-semibold text-gray-900 mb-2 text-center">
                                                                Scan QR Code to Pay
                                                            </p>
                                                            <img
                                                                src={`/storage/${paymentQrCode}`}
                                                                alt="Payment QR Code"
                                                                className="max-w-full h-auto mx-auto rounded"
                                                                style={{ maxHeight: '250px' }}
                                                            />
                                                            <p className="text-xs text-gray-600 text-center mt-2">
                                                                Scan this QR code with your banking app to pay the full amount
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Confirmation */}
                        {currentStep === 5 && (
                            <>
                                <style>{`
                                    @media print {
                                        body * {
                                            visibility: hidden;
                                        }
                                        .printable-area, .printable-area * {
                                            visibility: visible;
                                        }
                                        .printable-area {
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            width: 100%;
                                        }
                                        .no-print {
                                            display: none !important;
                                        }
                                        .print-header {
                                            display: block !important;
                                            margin-bottom: 20px;
                                            padding-bottom: 20px;
                                            border-bottom: 2px solid #000;
                                        }
                                    }
                                    .print-header {
                                        display: none;
                                    }
                                `}</style>
                                <div className="py-8 printable-area">
                                    <div className="max-w-2xl mx-auto">
                                        {/* Print Header (only visible when printing) */}
                                        <div className="print-header text-center">
                                            <h1 className="text-3xl font-bold text-gray-900">ODEC Booking System</h1>
                                            <p className="text-gray-600 mt-2">Facility Booking Confirmation</p>
                                        </div>

                                        {/* Success Icon and Message */}
                                        <div className="text-center mb-8 no-print">
                                            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                                            <p className="text-gray-600">
                                                Your booking has been successfully submitted.
                                            </p>
                                        </div>

                                        {/* Print Button */}
                                        <div className="flex justify-end mb-4 no-print">
                                            <button
                                                onClick={handlePrint}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <PrinterIcon className="h-5 w-5" />
                                                Print Confirmation
                                            </button>
                                        </div>

                                        {/* Booking Details Card */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                            {/* Reference Number */}
                                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                                                <span className="text-sm text-gray-600">
                                                    Reference: <span className="font-semibold text-gray-900">{referenceNumber}</span>
                                                </span>
                                            </div>

                                        {/* Details with Icons */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-start">
                                                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">Facility</p>
                                                    <p className="font-medium text-gray-900">{bookingData.facility?.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">Time</p>
                                                    <p className="font-medium text-gray-900">{bookingData.time}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">Date</p>
                                                    <p className="font-medium text-gray-900">{bookingData.date}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <UserCircleIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">Booked By</p>
                                                    <p className="font-medium text-gray-900">{bookingData.name}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Information */}
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Payment Method</span>
                                                <span className="font-medium text-gray-900">
                                                    {bookingData.paymentMethod === 'credit_card' && 'Credit Card'}
                                                    {bookingData.paymentMethod === 'cash' && 'Cash on Arrival'}
                                                    {bookingData.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-900">Amount Paid</span>
                                                <span className="font-bold text-lg text-green-600">${calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Confirmation Message */}
                                    <div className="text-center mb-6">
                                        <p className="text-sm text-gray-600">
                                            A confirmation email has been sent to <span className="font-medium text-gray-900">{bookingData.email}</span> with all the booking details.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 justify-center no-print">
                                        <button
                                            onClick={() => window.location.href = '/book-facility'}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                        >
                                            Make Another Booking
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/my-bookings'}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            View My Bookings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                        )}

                        {/* Navigation Buttons */}
                        {currentStep < 5 && (
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={currentStep === 4 ? handleSubmit : handleNext}
                                    disabled={
                                        (currentStep === 2 && (!bookingData.date || !bookingData.time)) ||
                                        (currentStep === 3 && (!bookingData.phone || !bookingData.attendees || !bookingData.purpose)) ||
                                        (currentStep === 4 && !bookingData.paymentMethod)
                                    }
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {currentStep === 4 ? 'Confirm Booking' : 'Next'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}