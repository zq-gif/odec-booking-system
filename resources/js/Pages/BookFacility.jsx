import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EquipmentSelector from '@/Components/EquipmentSelector';
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
        receiptFile: null,
        equipment: []
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
            console.log('Fetching booked slots for:', {
                facility_id: bookingData.facility.id,
                date: bookingData.date
            });
            const response = await axios.get('/api/facility-bookings/booked-slots', {
                params: {
                    facility_id: bookingData.facility.id,
                    date: bookingData.date
                }
            });
            console.log('Booked slots received:', response.data);
            setBookedSlots(response.data);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            console.error('Error response:', error.response?.data);
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

    const calculateDeposit = () => {
        const total = calculateTotal();
        return (parseFloat(total) * 0.1).toFixed(2);
    };

    const calculateRemainingBalance = () => {
        const total = calculateTotal();
        const deposit = calculateDeposit();
        return (parseFloat(total) - parseFloat(deposit)).toFixed(2);
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

            // Add equipment if selected
            if (bookingData.equipment && bookingData.equipment.length > 0) {
                bookingData.equipment.forEach((item, index) => {
                    formData.append(`equipment[${index}][id]`, item.id);
                    formData.append(`equipment[${index}][quantity]`, item.quantity);
                });
            }

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
                                <div className="max-w-2xl mx-auto space-y-6">
                                    <div className="space-y-4">
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

                                    {/* Equipment Selector */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <EquipmentSelector
                                            selectedEquipment={bookingData.equipment}
                                            onEquipmentChange={(equipment) => setBookingData({ ...bookingData, equipment })}
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
                                                <span className="font-medium">{bookingData.facility?.slot_duration || 4} hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rate:</span>
                                                <span className="font-medium">${bookingData.facility?.price_per_hour}/hour</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-300">
                                                <span className="font-semibold">Total Amount:</span>
                                                <span className="font-bold text-blue-600">${calculateTotal()}</span>
                                            </div>
                                            {bookingData.paymentMethod === 'cash' && (
                                                <>
                                                    <div className="flex justify-between text-sm pt-2">
                                                        <span className="text-amber-700">Deposit Required (10%):</span>
                                                        <span className="font-semibold text-amber-700">${calculateDeposit()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Pay on Arrival:</span>
                                                        <span className="font-medium text-gray-600">${calculateRemainingBalance()}</span>
                                                    </div>
                                                </>
                                            )}
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
                                                Upload Payment Receipt <span className="text-red-600">*</span>
                                                <span className="text-amber-600 ml-1">(10% Deposit Receipt Required)</span>
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
                                                                src={
                                                                    paymentQrCode.startsWith('http')
                                                                        ? paymentQrCode
                                                                        : paymentQrCode.startsWith('/storage/')
                                                                            ? paymentQrCode
                                                                            : `/storage/${paymentQrCode}`
                                                                }
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
                                                            <strong>Bank Details for Deposit Transfer:</strong><br />
                                                            Maybank - ODEC UMS Beach Club<br />
                                                            Account: 1234567890<br />
                                                            Amount: ${calculateDeposit()} (10% deposit)
                                                        </p>
                                                    </div>
                                                    {paymentQrCode && (
                                                        <div className="p-4 bg-white border-2 border-blue-300 rounded-lg">
                                                            <p className="text-sm font-semibold text-gray-900 mb-2 text-center">
                                                                Scan QR Code to Pay
                                                            </p>
                                                            <img
                                                                src={
                                                                    paymentQrCode.startsWith('http')
                                                                        ? paymentQrCode
                                                                        : paymentQrCode.startsWith('/storage/')
                                                                            ? paymentQrCode
                                                                            : `/storage/${paymentQrCode}`
                                                                }
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
                                        .security-watermark {
                                            display: block !important;
                                        }
                                        .security-border {
                                            border: 3px double #000 !important;
                                            padding: 20px !important;
                                        }
                                    }
                                    .print-header {
                                        display: none;
                                    }
                                    .security-watermark {
                                        display: none;
                                        position: fixed;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%, -50%) rotate(-45deg);
                                        font-size: 120px;
                                        font-weight: bold;
                                        color: rgba(0, 0, 0, 0.05);
                                        z-index: -1;
                                        pointer-events: none;
                                        white-space: nowrap;
                                    }
                                `}</style>
                                <div className="security-watermark">OFFICIAL RECEIPT</div>
                                <div className="py-8 printable-area">
                                    <div className="max-w-2xl mx-auto">
                                        {/* Print Header (only visible when printing) */}
                                        <div className="print-header text-center">
                                            <h1 className="text-3xl font-bold text-gray-900">ODEC UMS BEACH CLUB</h1>
                                            <p className="text-gray-600 mt-1">Official Booking System</p>
                                            <p className="text-sm text-gray-500 mt-1">Facility Booking Confirmation</p>
                                            <p className="text-xs text-gray-400 mt-2">Issued: {new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
                                        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 security-border">
                                            {/* Security Header */}
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 -m-6 mb-6 rounded-t-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wide opacity-90">Official Document</p>
                                                        <h3 className="text-xl font-bold mt-1">Booking Confirmation</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs opacity-90">Reference No.</p>
                                                        <p className="text-lg font-mono font-bold tracking-wider">{referenceNumber}</p>
                                                    </div>
                                                </div>
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
                                                <span className="text-sm text-gray-600">Duration</span>
                                                <span className="font-medium text-gray-900">{bookingData.facility?.slot_duration || 4} hours</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Rate</span>
                                                <span className="font-medium text-gray-900">${bookingData.facility?.price_per_hour}/hour</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Payment Method</span>
                                                <span className="font-medium text-gray-900">
                                                    {bookingData.paymentMethod === 'credit_card' && 'Credit Card'}
                                                    {bookingData.paymentMethod === 'cash' && 'Cash on Arrival (10% Deposit)'}
                                                    {bookingData.paymentMethod === 'bank_transfer' && 'Bank Transfer (10% Deposit)'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                                                <span className="text-sm font-semibold text-gray-900">Total Booking Amount</span>
                                                <span className="font-semibold text-gray-900">${calculateTotal()}</span>
                                            </div>
                                            {(bookingData.paymentMethod === 'cash' || bookingData.paymentMethod === 'bank_transfer') && (
                                                <>
                                                    <div className="flex justify-between items-center pt-2">
                                                        <span className="text-sm font-bold text-amber-700">Amount Paid (10% Deposit)</span>
                                                        <span className="font-bold text-lg text-amber-700">${calculateDeposit()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Balance Due at Check-in</span>
                                                        <span className="font-semibold text-gray-900">${calculateRemainingBalance()}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                            {/* Security Footer */}
                                            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-xs font-semibold text-gray-700 mb-2">VERIFICATION INFORMATION</p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Document ID:</span> {referenceNumber}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Issue Date:</span> {new Date().toLocaleDateString('en-MY')}
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Verification:</span> This is an official booking confirmation from ODEC UMS Beach Club
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
                                                    <p className="text-xs text-amber-900">
                                                        <span className="font-bold">⚠ IMPORTANT:</span> This document is for verification purposes only.
                                                        Please present this confirmation along with valid identification upon arrival.
                                                        Any alterations to this document will render it invalid.
                                                    </p>
                                                </div>
                                            </div>
                                    </div>

                                    {/* Email Confirmation Message */}
                                    <div className="text-center mb-6">
                                        <p className="text-sm text-gray-600">
                                            A confirmation email has been sent to <span className="font-medium text-gray-900">{bookingData.email}</span> with all the booking details.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            For verification inquiries, contact ODEC UMS Beach Club with reference number: <span className="font-mono font-semibold">{referenceNumber}</span>
                                        </p>
                                    </div>

                                    {/* Payment Instructions */}
                                    {bookingData.paymentMethod === 'cash' && (
                                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <h3 className="text-base font-semibold text-amber-900 mb-2">Cash on Arrival - Payment Instructions</h3>
                                                    <div className="text-sm text-amber-800 space-y-3">
                                                        <div className="bg-white p-4 rounded-lg border border-amber-200">
                                                            <p className="font-semibold text-amber-900 mb-2">Payment Breakdown:</p>
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between">
                                                                    <span>Total Amount:</span>
                                                                    <span className="font-semibold">${calculateTotal()}</span>
                                                                </div>
                                                                <div className="flex justify-between text-amber-700 bg-amber-50 p-2 rounded">
                                                                    <span className="font-semibold">Deposit Required (10%):</span>
                                                                    <span className="font-bold">${calculateDeposit()}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Remaining Balance:</span>
                                                                    <span className="font-semibold">${calculateRemainingBalance()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="font-medium">Please follow these steps:</p>
                                                        <ol className="list-decimal list-inside space-y-2 ml-2">
                                                            <li>
                                                                <span className="font-semibold">Pay Deposit:</span> Transfer the 10% deposit (<span className="font-bold">${calculateDeposit()}</span>) to secure your booking
                                                                <div className="ml-6 mt-1 text-xs bg-blue-50 p-2 rounded border border-blue-200">
                                                                    <p className="font-semibold text-blue-900">Bank Details:</p>
                                                                    <p>Maybank - ODEC UMS Beach Club</p>
                                                                    <p>Account: 1234567890</p>
                                                                    <p>Reference: {referenceNumber}</p>
                                                                </div>
                                                            </li>
                                                            <li>Arrive at ODEC UMS Beach Club on your booking date</li>
                                                            <li>Present your booking reference number: <span className="font-bold">{referenceNumber}</span></li>
                                                            <li>Pay the remaining balance of <span className="font-bold">${calculateRemainingBalance()}</span> at the reception desk</li>
                                                            <li>Collect your receipt and enjoy your facility!</li>
                                                        </ol>
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                                                            <p className="text-xs font-semibold text-yellow-900 mb-1">⚠️ Important:</p>
                                                            <ul className="text-xs text-yellow-800 space-y-1 ml-4 list-disc">
                                                                <li>Deposit must be paid within 24 hours to confirm your booking</li>
                                                                <li>Receipt has been uploaded with your booking</li>
                                                                <li>Please arrive at least 15 minutes before your scheduled time</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {bookingData.paymentMethod === 'bank_transfer' && (
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <h3 className="text-base font-semibold text-blue-900 mb-2">Bank Transfer - Payment Instructions</h3>
                                                    <div className="text-sm text-blue-800 space-y-3">
                                                        <p className="font-medium">Please transfer the deposit amount to:</p>
                                                        <div className="bg-white p-4 rounded-lg border border-blue-200 space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Bank Name:</span>
                                                                <span className="font-semibold">Maybank</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Account Name:</span>
                                                                <span className="font-semibold">ODEC UMS Beach Club</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Account Number:</span>
                                                                <span className="font-semibold">1234567890</span>
                                                            </div>
                                                            <div className="flex justify-between border-t pt-2">
                                                                <span className="text-gray-600">Deposit Amount (10%):</span>
                                                                <span className="font-bold text-lg text-blue-600">${calculateDeposit()}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Reference:</span>
                                                                <span className="font-semibold">{referenceNumber}</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                                            <p className="text-xs font-semibold text-yellow-900 mb-1">⚠️ Important:</p>
                                                            <ul className="text-xs text-yellow-800 space-y-1 ml-4 list-disc">
                                                                <li>Include your booking reference number <span className="font-bold">{referenceNumber}</span> in the transfer description</li>
                                                                <li>Receipt has been uploaded with your booking</li>
                                                                <li>Pay remaining balance of <span className="font-bold">${calculateRemainingBalance()}</span> at check-in</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                        (currentStep === 4 && (!bookingData.paymentMethod ||
                                            ((bookingData.paymentMethod === 'cash' || bookingData.paymentMethod === 'bank_transfer') && !bookingData.receiptFile)))
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