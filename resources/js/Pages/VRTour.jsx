import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function VRTour({ auth }) {
    useEffect(() => {
        // Open VR tour in new window immediately and go back
        const vrWindow = window.open('/vr-tour/index.html', 'VR Tour', 'width=' + screen.width + ',height=' + screen.height);

        if (vrWindow) {
            // Go back to previous page after opening
            setTimeout(() => {
                window.history.back();
            }, 500);
        } else {
            alert('Please allow popups to view the VR tour');
            window.history.back();
        }
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="VR Tour - UMS Beach Club" />

            {/* Loading state while opening VR tour */}
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-700">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Opening VR Tour...</h3>
                    <p className="text-white/80">The VR tour will open in a new window</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}