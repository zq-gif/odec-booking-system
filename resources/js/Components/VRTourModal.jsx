import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Global flag to track if A-Frame is loaded or loading
let aframeLoadingPromise = null;

export default function VRTourModal({ isOpen, onClose, imageUrl, activityName }) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        if (!isOpen || !imageUrl) return;

        let isMounted = true;

        // Load A-Frame library dynamically
        const loadAFrame = async () => {
            // If A-Frame is already loaded
            if (window.AFRAME) {
                if (isMounted) {
                    initScene();
                }
                return;
            }

            // If A-Frame is currently loading, wait for it
            if (aframeLoadingPromise) {
                try {
                    await aframeLoadingPromise;
                    if (isMounted) {
                        initScene();
                    }
                } catch (error) {
                    if (isMounted) {
                        setLoadError(true);
                        setIsLoading(false);
                    }
                }
                return;
            }

            // Start loading A-Frame
            aframeLoadingPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
                script.onload = () => {
                    resolve();
                };
                script.onerror = () => {
                    reject(new Error('Failed to load A-Frame'));
                };
                document.head.appendChild(script);
            });

            try {
                await aframeLoadingPromise;
                if (isMounted) {
                    initScene();
                }
            } catch (error) {
                console.error('Failed to load A-Frame:', error);
                if (isMounted) {
                    setLoadError(true);
                    setIsLoading(false);
                }
            }
        };

        const initScene = () => {
            if (!containerRef.current || !isMounted) return;

            setIsLoading(true);
            setLoadError(false);
            setLoadProgress(0);

            // Clear existing content
            if (sceneRef.current) {
                cleanupScene();
            }

            // Simulate progress for better UX (since we can't get real download progress with CORS)
            const progressInterval = setInterval(() => {
                setLoadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90; // Stop at 90%, complete when image loads
                    }
                    return prev + 10;
                });
            }, 200);

            // Preload the image first with timeout
            const preloadImage = new Image();
            const imageLoadTimeout = setTimeout(() => {
                console.warn('Image taking too long to load');
            }, 10000); // 10 seconds timeout

            preloadImage.onload = () => {
                clearTimeout(imageLoadTimeout);
                clearInterval(progressInterval);
                setLoadProgress(100);
                if (!isMounted || !containerRef.current) return;

                // Create A-Frame scene after image is loaded
                const scene = document.createElement('a-scene');
                scene.setAttribute('embedded', '');
                scene.setAttribute('vr-mode-ui', 'enabled: true');
                scene.setAttribute('loading-screen', 'enabled: false');

                // Create sky element for 360 image with preload
                const assets = document.createElement('a-assets');
                const img = document.createElement('img');
                img.id = 'vr-image';
                img.src = imageUrl;
                img.crossOrigin = 'anonymous';

                // Mark as already loaded for faster rendering
                img.setAttribute('data-loaded', 'true');
                assets.appendChild(img);
                scene.appendChild(assets);

                const sky = document.createElement('a-sky');
                sky.setAttribute('src', '#vr-image');
                sky.setAttribute('rotation', '0 0 0');

                // Create camera with look controls
                const cameraRig = document.createElement('a-entity');
                const camera = document.createElement('a-camera');
                camera.setAttribute('look-controls', 'enabled: true');
                camera.setAttribute('wasd-controls', 'enabled: false');
                cameraRig.appendChild(camera);

                // Append elements to scene
                scene.appendChild(sky);
                scene.appendChild(cameraRig);

                // Listen for scene loaded event
                scene.addEventListener('loaded', () => {
                    if (isMounted) {
                        // Small delay to ensure smooth transition
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 300);
                    }
                });

                // Append scene to container
                containerRef.current.appendChild(scene);
                sceneRef.current = scene;
            };

            preloadImage.onerror = () => {
                clearTimeout(imageLoadTimeout);
                console.error('Failed to load VR image:', imageUrl);
                if (isMounted) {
                    setLoadError(true);
                    setIsLoading(false);
                }
            };

            // Start preloading with cache busting disabled
            preloadImage.crossOrigin = 'anonymous';
            preloadImage.src = imageUrl;
        };

        const cleanupScene = () => {
            if (sceneRef.current && containerRef.current) {
                // Pause the scene first
                if (sceneRef.current.pause) {
                    sceneRef.current.pause();
                }

                // Remove all event listeners
                sceneRef.current.removeEventListener('loaded', () => {});

                // Remove scene from DOM
                containerRef.current.removeChild(sceneRef.current);
                sceneRef.current = null;
            }
        };

        loadAFrame();

        return () => {
            isMounted = false;
            cleanupScene();
        };
    }, [isOpen, imageUrl]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-95 backdrop-blur-sm transition-opacity"
                style={{ zIndex: 1 }}
            />

            {/* Modal Content */}
            <div className="relative h-full flex items-center justify-center">
                <div className="relative w-full h-full bg-black">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 pointer-events-none" style={{ zIndex: 30 }}>
                        <div className="flex items-center justify-between pointer-events-auto">
                            <div>
                                <h3 className="text-xl font-bold text-white">{activityName} - 360° VR Tour</h3>
                                <p className="text-sm text-gray-300 mt-1">
                                    🖱️ Drag to look around • Click VR button for immersive mode
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                                title="Close"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && !loadError && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                            <div className="text-center max-w-md px-6">
                                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
                                <p className="text-white text-lg font-semibold">Loading VR Tour...</p>
                                <p className="text-gray-400 text-sm mt-2 mb-4">
                                    {loadProgress < 100
                                        ? 'Downloading 360° panoramic image...'
                                        : 'Initializing VR scene...'}
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${loadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">{loadProgress}%</p>

                                {loadProgress > 50 && loadProgress < 100 && (
                                    <p className="text-yellow-400 text-xs mt-3">
                                        Large image file (~2MB) - please be patient
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {loadError && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                            <div className="text-center px-4">
                                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                                <p className="text-white text-xl font-semibold mb-2">Failed to Load VR Tour</p>
                                <p className="text-gray-400 text-sm">Please check your internet connection and try again.</p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* A-Frame 360° VR Viewer */}
                    <div
                        ref={containerRef}
                        className="w-full h-full"
                        style={{
                            width: '100vw',
                            height: '100vh',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 10,
                            opacity: isLoading ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                    />

                    {/* Instructions */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pointer-events-none" style={{ zIndex: 30 }}>
                        <div className="flex items-center justify-center gap-8 text-white text-sm flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    🖱️
                                </div>
                                <span>Drag to look around 360°</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    📱
                                </div>
                                <span>Use VR headset for full immersion</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    ⌨️
                                </div>
                                <span>Press ESC to exit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
