import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    ExclamationTriangleIcon,
    PhotoIcon,
    ArrowUpTrayIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ReportIssue({ auth }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketNumber, setTicketNumber] = useState('');
    const [formData, setFormData] = useState({
        category: '',
        priority: 'Medium - Needs attention',
        title: '',
        description: '',
        location: '',
        relatedBooking: '',
        attachments: []
    });

    const [dragActive, setDragActive] = useState(false);

    const generateTicketNumber = () => {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `ISS-${randomNum}`;
    };

    const categories = [
        'Select category',
        'Facility Issue',
        'Booking System',
        'Payment Issue',
        'Staff Service',
        'Cleanliness',
        'Safety Concern',
        'Equipment Malfunction',
        'Other'
    ];

    const priorities = [
        'Low - Minor issue',
        'Medium - Needs attention',
        'High - Urgent',
        'Critical - Immediate action required'
    ];

    const bookings = [
        'Select a booking (if applicable)',
        'Beach Area - ODEC-1234 (1/25/2024)',
        'Conference Hall - ODEC-9012 (12/5/2023)',
        'Basketball Court - ODEC-5678 (11/20/2023)'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const newFiles = Array.from(files).filter(file => {
            const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type);
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValidType && isValidSize;
        });

        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...newFiles]
        }));
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const ticket = generateTicketNumber();
        setTicketNumber(ticket);
        console.log('Report submitted:', formData, 'Ticket:', ticket);
        setIsSubmitted(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Report Issue" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {!isSubmitted ? (
                        <>
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Report Issue</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Report any problems with facilities or the booking system
                                </p>
                            </div>

                            {/* Form Card */}
                            <div className="bg-white rounded-lg shadow-sm">
                        {/* Alert Banner */}
                        <div className="border-b border-gray-200 bg-yellow-50 px-6 py-4 rounded-t-lg">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                                <span className="text-sm font-medium text-gray-900">Issue Report Form</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Category and Priority Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Issue Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Issue Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    >
                                        {categories.map((category, index) => (
                                            <option key={index} value={category} disabled={index === 0}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Priority Level
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    >
                                        {priorities.map((priority, index) => (
                                            <option key={index} value={priority}>
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Issue Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Issue Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Brief title describing the issue"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                />
                            </div>

                            {/* Issue Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Issue Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Please provide detailed information about the issue"
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 resize-none"
                                />
                            </div>

                            {/* Location and Related Booking Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Location/Facility */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Location/Facility <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Where did this issue occur?"
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    />
                                </div>

                                {/* Related Booking */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Related Booking (Optional)
                                    </label>
                                    <select
                                        name="relatedBooking"
                                        value={formData.relatedBooking}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    >
                                        {bookings.map((booking, index) => (
                                            <option key={index} value={booking}>
                                                {booking}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Attach Images/Files */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Attach Images/Files (Optional)
                                </label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 bg-gray-50'
                                    }`}
                                >
                                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <div className="mb-2">
                                        <label
                                            htmlFor="file-upload"
                                            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                        >
                                            Upload files
                                        </label>
                                        <span className="text-gray-600"> or drag and drop</span>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/jpg,image/gif"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>

                                {/* Uploaded Files List */}
                                {formData.attachments.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {formData.attachments.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center">
                                                    <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">{file.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({(file.size / 1024).toFixed(1)} KB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                >
                                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                                    Submit Report
                                </button>
                            </div>
                        </form>
                            </div>
                        </>
                    ) : (
                        /* Success Screen */
                        <div className="text-center py-12">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-green-100 p-6">
                                    <CheckCircleIcon className="h-16 w-16 text-green-600" />
                                </div>
                            </div>

                            {/* Success Message */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Issue Reported Successfully!
                            </h1>
                            <p className="text-gray-600 mb-2">
                                Your issue has been reported and our team will look into it.
                            </p>
                            <p className="text-sm text-gray-600 mb-8">
                                Ticket Number:{' '}
                                <span className="font-semibold text-blue-600">{ticketNumber}</span>
                            </p>

                            {/* What Happens Next Box */}
                            <div className="max-w-2xl mx-auto mb-8">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                                    <h3 className="text-sm font-semibold text-blue-900 mb-3">
                                        What happens next?
                                    </h3>
                                    <ul className="space-y-2 text-sm text-blue-800">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Our team will review your issue within 24-48 hours.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>You'll receive an email notification when there's an update.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>You can track the status of your issue using the ticket number.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setFormData({
                                            category: '',
                                            priority: 'Medium - Needs attention',
                                            title: '',
                                            description: '',
                                            location: '',
                                            relatedBooking: '',
                                            attachments: []
                                        });
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Report Another Issue
                                </button>
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}