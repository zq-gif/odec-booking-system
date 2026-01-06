import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import VRTourModal from '@/Components/VRTourModal';
import {
    CheckCircleIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    CreditCardIcon,
    CheckBadgeIcon,
    SparklesIcon,
    ClockIcon,
    UserCircleIcon,
    PrinterIcon,
    UserGroupIcon,
    BanknotesIcon,
    SignalIcon,
    EyeIcon,
    DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

export default function BookActivity({ auth, activities, paymentQrCode }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [showVRTour, setShowVRTour] = useState(false);
    const [selectedVRActivity, setSelectedVRActivity] = useState(null);
    const [bookingData, setBookingData] = useState({
        activity: null,
        date: '',
        time: '',
        name: auth.user.name,
        email: auth.user.email,
        phone: '',
        participants: 1,
        paymentMethod: '',
        receiptFile: null
    });

    // Parse duration string (e.g., "2 hours", "1.5 hours", "30 minutes") to minutes
    const parseDurationToMinutes = (durationStr) => {
        if (!durationStr) return 120; // default 2 hours = 120 minutes

        // Check if duration is in minutes
        if (durationStr.toLowerCase().includes('minute')) {
            const match = durationStr.match(/(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : 120;
        }

        // Check if duration is in hours
        if (durationStr.toLowerCase().includes('hour')) {
            const match = durationStr.match(/(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) * 60 : 120;
        }

        // Default: assume it's hours if no unit specified
        const match = durationStr.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) * 60 : 120;
    };

    // Generate time slots based on activity's duration
    const generateTimeSlots = () => {
        if (!bookingData.activity) return [];

        const durationInMinutes = parseDurationToMinutes(bookingData.activity?.duration);
        const slots = [];
        const startHour = 8;
        const endHour = 18;
        const startMinutes = startHour * 60; // 8:00 AM = 480 minutes
        const endMinutes = endHour * 60; // 6:00 PM = 1080 minutes

        // Generate slots based on duration in minutes
        for (let currentMinutes = startMinutes; currentMinutes + durationInMinutes <= endMinutes; currentMinutes += durationInMinutes) {
            const startHourSlot = Math.floor(currentMinutes / 60);
            const startMinuteSlot = currentMinutes % 60;
            const endMinutesSlot = currentMinutes + durationInMinutes;
            const endHourSlot = Math.floor(endMinutesSlot / 60);
            const endMinuteSlot = endMinutesSlot % 60;

            const startTime = `${startHourSlot.toString().padStart(2, '0')}:${startMinuteSlot.toString().padStart(2, '0')}`;
            const endTime = `${endHourSlot.toString().padStart(2, '0')}:${endMinuteSlot.toString().padStart(2, '0')}`;

            // Format label for display
            const formatTime = (hour, minute) => {
                const period = hour < 12 ? 'AM' : 'PM';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const displayMinute = minute > 0 ? `:${minute.toString().padStart(2, '0')}` : ':00';
                return `${displayHour}${displayMinute} ${period}`;
            };

            const label = formatTime(startHourSlot, startMinuteSlot);
            slots.push({ value: startTime, label, endTime, duration: durationInMinutes });
        }
        return slots;
    };

    // Recalculate time slots whenever the activity changes
    const timeSlots = generateTimeSlots();

    // Fetch booked slots when activity and date change
    useEffect(() => {
        if (bookingData.activity && bookingData.date) {
            fetchBookedSlots();
        }
    }, [bookingData.activity, bookingData.date]);

    const fetchBookedSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await axios.get('/api/activity-bookings/booked-slots', {
                params: {
                    activity_id: bookingData.activity.id,
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
        { number: 1, name: 'Select Activity', icon: ClipboardDocumentListIcon },
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

    const handleActivitySelect = (activity) => {
        setBookingData({ ...bookingData, activity });
        handleNext();
    };

    const calculateTotal = () => {
        if (!bookingData.activity?.price_per_person) return 0;
        return (parseFloat(bookingData.activity.price_per_person) * bookingData.participants).toFixed(2);
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

    const getDifficultyBadge = (difficulty) => {
        const badges = {
            easy: 'bg-green-100 text-green-800',
            moderate: 'bg-yellow-100 text-yellow-800',
            hard: 'bg-red-100 text-red-800',
        };
        return badges[difficulty] || badges.easy;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Calculate end time from selected slot
        const selectedSlot = timeSlots.find(s => s.value === bookingData.time);
        const endTime = selectedSlot?.endTime || bookingData.time;

        try {
            // Use FormData to handle file upload
            const formData = new FormData();
            formData.append('activity_id', bookingData.activity.id);
            formData.append('booking_date', bookingData.date);
            formData.append('start_time', bookingData.time);
            formData.append('end_time', endTime);
            formData.append('number_of_participants', parseInt(bookingData.participants));
            formData.append('phone_number', bookingData.phone);
            formData.append('payment_method', bookingData.paymentMethod);

            // Add receipt file if provided
            if (bookingData.receiptFile) {
                formData.append('payment_receipt', bookingData.receiptFile);
            }

            const response = await axios.post('/api/activity-bookings', formData, {
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
            <Head title="Book an Activity" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Book an Activity</h1>
                        <p className="mt-1 text-sm text-gray-600">Choose from our exciting beach and recreation activities</p>
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
                        {/* Step 1: Select Activity */}
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Select an Activity</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${activity.status !== 'available' ? 'opacity-50' : ''}`}
                                        >
                                            <div className="relative">
                                                {activity.image ? (
                                                    <img
                                                        src={activity.image}
                                                        alt={activity.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                        <SparklesIcon className="h-20 w-20 text-blue-400" />
                                                    </div>
                                                )}
                                                {activity.vr_tour_image && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedVRActivity(activity);
                                                            setShowVRTour(true);
                                                        }}
                                                        className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-1 text-xs font-semibold"
                                                        title="View VR Tour"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                        VR Tour
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                                                    <span className="text-blue-600 font-bold">${activity.price_per_person}/person</span>
                                                </div>
                                                {activity.difficulty_level && (
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full mb-2 ${getDifficultyBadge(activity.difficulty_level)}`}>
                                                        <SignalIcon className="h-3 w-3 mr-1" />
                                                        {activity.difficulty_level}
                                                    </span>
                                                )}
                                                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                    <span className="flex items-center">
                                                        <UserGroupIcon className="h-4 w-4 mr-1" />
                                                        Capacity: {activity.capacity}
                                                    </span>
                                                    {activity.duration && (
                                                        <span className="flex items-center">
                                                            <ClockIcon className="h-4 w-4 mr-1" />
                                                            {activity.duration}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => activity.status === 'available' && handleActivitySelect(activity)}
                                                    className={`w-full py-2 rounded-lg ${activity.status === 'available' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                                    disabled={activity.status !== 'available'}
                                                >
                                                    {activity.status === 'available' ? 'Select Activity' : 'Unavailable'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {activities.length === 0 && (
                                    <div className="text-center py-12">
                                        <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No activities available</h3>
                                        <p className="mt-1 text-sm text-gray-500">Check back later for new activities.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Choose Date & Time */}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Date & Time</h2>
                                <div className="max-w-md mx-auto space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Selected Activity
                                        </label>
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="font-semibold text-gray-900">{bookingData.activity?.name}</p>
                                            <p className="text-sm text-gray-600">${bookingData.activity?.price_per_person}/person</p>
                                            {bookingData.activity?.duration && (
                                                <p className="text-sm text-gray-600">Duration: {bookingData.activity?.duration}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value, time: '' })}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Participants</label>
                                        <input
                                            type="number"
                                            value={bookingData.participants}
                                            onChange={(e) => setBookingData({ ...bookingData, participants: e.target.value })}
                                            min="1"
                                            max={bookingData.activity?.capacity || 100}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Maximum capacity: {bookingData.activity?.capacity} people
                                        </p>
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
                                                <span>Activity:</span>
                                                <span className="font-medium">{bookingData.activity?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Date:</span>
                                                <span className="font-medium">{bookingData.date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Participants:</span>
                                                <span className="font-medium">{bookingData.participants}</span>
                                            </div>
                                            {bookingData.activity?.duration && (
                                                <div className="flex justify-between">
                                                    <span>Duration:</span>
                                                    <span className="font-medium">{bookingData.activity?.duration}</span>
                                                </div>
                                            )}
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

                                    {/* Receipt Upload for Cash on Arrival (Deposit) or Bank Transfer */}
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
                                                            Amount: ${calculateDeposit()} (10% deposit)
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
                                        {/* Print Header */}
                                        <div className="print-header text-center">
                                            <h1 className="text-3xl font-bold text-gray-900">ODEC Booking System</h1>
                                            <p className="text-gray-600 mt-2">Activity Booking Confirmation</p>
                                        </div>

                                        {/* Success Icon and Message */}
                                        <div className="text-center mb-8 no-print">
                                            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                                            <p className="text-gray-600">
                                                Your activity booking has been successfully submitted.
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
                                                    <SparklesIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">Activity</p>
                                                        <p className="font-medium text-gray-900">{bookingData.activity?.name}</p>
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
                                                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">Participants</p>
                                                        <p className="font-medium text-gray-900">{bookingData.participants}</p>
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
                                                                <li>Collect your receipt and enjoy your activity!</li>
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
                                                            <p className="font-medium">Please transfer the amount to:</p>
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
                                                                    <span className="text-gray-600">Amount to Transfer:</span>
                                                                    <span className="font-bold text-lg text-blue-600">${calculateTotal()}</span>
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
                                                                    <li>Your booking will be confirmed once payment is verified (usually within 24 hours)</li>
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
                                                onClick={() => window.location.href = '/book-activity'}
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
                                        (currentStep === 3 && (!bookingData.phone || !bookingData.participants)) ||
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
            {/* VR Tour Modal */}
            <VRTourModal
                isOpen={showVRTour}
                onClose={() => {
                    setShowVRTour(false);
                    setSelectedVRActivity(null);
                }}
                imageUrl={selectedVRActivity?.vr_tour_image}
                activityName={selectedVRActivity?.name}
            />
        </AuthenticatedLayout>
    );
}
