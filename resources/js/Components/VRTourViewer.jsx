import React, { useState, useEffect } from 'react';
import { Pannellum } from 'react-pannellum';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function VRTourViewer({ spots, onClose }) {
    const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const currentSpot = spots[currentSpotIndex];

    const goToNextSpot = () => {
        if (currentSpotIndex < spots.length - 1) {
            setCurrentSpotIndex(currentSpotIndex + 1);
        }
    };

    const goToPreviousSpot = () => {
        if (currentSpotIndex > 0) {
            setCurrentSpotIndex(currentSpotIndex - 1);
        }
    };

    const toggleFullscreen = () => {
        const element = document.getElementById('vr-tour-container');
        if (!document.fullscreenElement) {
            element.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Handle device orientation for mobile VR
    useEffect(() => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        console.log('Device orientation permission granted');
                    }
                })
                .catch(console.error);
        }
    }, []);

    if (!currentSpot) {
        return null;
    }

    return (
        <div id="vr-tour-container" className="fixed inset-0 z-50 bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                    <div className="text-white">
                        <h2 className="text-xl font-bold">{currentSpot.title}</h2>
                        {currentSpot.description && (
                            <p className="text-sm text-gray-300 mt-1">{currentSpot.description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
            </div>

            {/* 360° Viewer */}
            <div className="w-full h-full">
                <Pannellum
                    width="100%"
                    height="100%"
                    image={currentSpot.image_path}
                    pitch={parseFloat(currentSpot.pitch) || 0}
                    yaw={parseFloat(currentSpot.yaw) || 0}
                    hfov={110}
                    autoLoad
                    showZoomCtrl={true}
                    mouseZoom={true}
                    showFullscreenCtrl={false}
                    orientationOnByDefault={true}
                    draggable={true}
                    onLoad={() => console.log('Panorama loaded')}
                >
                    {/* Hotspots */}
                    {currentSpot.hotspots && currentSpot.hotspots.map((hotspot, index) => (
                        <Pannellum.Hotspot
                            key={index}
                            type="info"
                            pitch={hotspot.pitch}
                            yaw={hotspot.yaw}
                            text={hotspot.text}
                        />
                    ))}
                </Pannellum>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    {/* Previous Button */}
                    <button
                        onClick={goToPreviousSpot}
                        disabled={currentSpotIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentSpotIndex === 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                        Previous
                    </button>

                    {/* Spot Indicator */}
                    <div className="flex items-center gap-2">
                        {spots.map((spot, index) => (
                            <button
                                key={spot.id}
                                onClick={() => setCurrentSpotIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    index === currentSpotIndex
                                        ? 'bg-orange-500 w-8'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                                title={spot.title}
                            />
                        ))}
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors md:block hidden"
                    >
                        <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNextSpot}
                        disabled={currentSpotIndex === spots.length - 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentSpotIndex === spots.length - 1
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                    >
                        Next
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile Instructions */}
                <div className="text-center mt-4 text-white/70 text-sm md:hidden">
                    <p>Move your phone to look around or swipe to navigate</p>
                </div>
            </div>
        </div>
    );
}