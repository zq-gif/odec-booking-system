import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';

export default function EmbeddedVRTour({ onClose, openInNewWindow = false }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (openInNewWindow) {
            // Open VR tour in a new window
            const vrWindow = window.open('/vr-tour/index.html', 'VR Tour', 'width=' + screen.width + ',height=' + screen.height);

            // Close the overlay immediately since we're opening in new window
            if (vrWindow) {
                setTimeout(() => {
                    onClose();
                }, 500);
            } else {
                alert('Please allow popups to view the VR tour, or visit /vr-tour/index.html directly');
                onClose();
            }
        }
    }, [openInNewWindow, onClose]);

    // If opening in new window, show loading state
    if (openInNewWindow) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 max-w-md text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Opening VR Tour...</h3>
                    <p className="text-gray-600">The VR tour will open in a new window</p>
                </div>
            </div>
        );
    }

    // Otherwise, show embedded iframe
    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all group"
                title="Close VR Tour"
            >
                <XMarkIcon className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Instructions Overlay */}
            <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs">
                <h3 className="font-bold mb-2">VR Tour Controls</h3>
                <ul className="text-sm space-y-1">
                    <li>🖱️ <strong>Desktop:</strong> Click and drag to look around</li>
                    <li>📱 <strong>Mobile:</strong> Move your phone to explore</li>
                    <li>⌨️ <strong>Keyboard:</strong> Arrow keys or WASD to navigate</li>
                    <li>🔍 <strong>Zoom:</strong> Scroll wheel or pinch</li>
                </ul>
            </div>

            {/* Embedded VR Tour iFrame */}
            <iframe
                ref={iframeRef}
                src="/vr-tour/index.html"
                className="w-full h-full border-0"
                title="UMS Beach VR Tour"
                allow="accelerometer; gyroscope; vr; xr-spatial-tracking; fullscreen"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
        </div>
    );
}