import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { QrCodeIcon, PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Settings({ auth, paymentQrCode }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        qr_code: null,
    });
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('qr_code', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.qr-code'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="QR Code" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Payment QR Code</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Upload and manage payment QR code for customer transactions
                        </p>
                    </div>

                    {/* Payment QR Code Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-6">
                            <QrCodeIcon className="h-6 w-6 text-blue-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-900">QR Code Management</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current QR Code */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Current QR Code</h3>
                                {paymentQrCode ? (
                                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <img
                                            src={`/storage/${paymentQrCode}`}
                                            alt="Payment QR Code"
                                            className="max-w-full h-auto mx-auto"
                                            style={{ maxHeight: '300px' }}
                                        />
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            This QR code is displayed to users during booking
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                                        <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No QR code uploaded yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Upload New QR Code */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Upload New QR Code</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-gray-50">
                                        {preview ? (
                                            <div className="mb-4">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-w-full h-auto mx-auto rounded"
                                                    style={{ maxHeight: '200px' }}
                                                />
                                                <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                                                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                                                    Ready to upload
                                                </p>
                                            </div>
                                        ) : (
                                            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        )}

                                        <label htmlFor="qr-upload" className="cursor-pointer">
                                            <span className="text-blue-600 hover:text-blue-500 font-medium">
                                                Choose QR Code Image
                                            </span>
                                            <input
                                                id="qr-upload"
                                                name="qr-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                                    </div>

                                    {errors.qr_code && (
                                        <p className="text-sm text-red-600 mt-2">{errors.qr_code}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!data.qr_code || processing}
                                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {processing ? 'Uploading...' : 'Upload QR Code'}
                                    </button>
                                </form>

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <strong>Note:</strong> This QR code will be shown to users when they select
                                        Cash on Arrival or Bank Transfer payment methods. Make sure it contains your
                                        bank account details for receiving payments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
