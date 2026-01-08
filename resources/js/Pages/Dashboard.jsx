import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    BuildingOfficeIcon,
    DevicePhoneMobileIcon,
    ClipboardDocumentListIcon,
    BellIcon,
    SparklesIcon,
    MapPinIcon,
    SunIcon,
    ArrowRightIcon,
    CubeTransparentIcon,
    LifebuoyIcon,
    XMarkIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import EmbeddedVRTour from '@/Components/EmbeddedVRTour';

export default function Dashboard({ auth }) {
    const [showVRTour, setShowVRTour] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Fetch announcements on component mount
    useEffect(() => {
        fetchAnnouncements();

        // Set up polling for real-time updates every 30 seconds
        const interval = setInterval(fetchAnnouncements, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch('/api/announcements', {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const openAnnouncementDetail = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowDetailModal(true);
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    };

    const quickActions = [
        {
            title: 'Browse Facilities',
            description: 'Discover our beach paradise amenities',
            icon: BuildingOfficeIcon,
            gradient: 'from-blue-500 via-orange-500 to-amber-600',
            href: '/facilities'
        },
        {
            title: 'Browse Activities',
            description: 'Discover our beach paradise adventure',
            icon: LifebuoyIcon,
            gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
            href: '/book-activity'
        },
        {
            title: 'Book Your Stay',
            description: 'Reserve your perfect beach experience',
            icon: CalendarIcon,
            gradient: 'from-orange-500 via-amber-500 to-yellow-600',
            href: '/book-facility'
        },
        {
            title: 'My Reservations',
            description: 'Manage your beach bookings',
            icon: ClipboardDocumentListIcon,
            gradient: 'from-purple-500 via-pink-500 to-red-600',
            href: '/my-bookings'
        }
    ];

    const loadVRTour = () => {
        setShowVRTour(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div>
                {/* Hero Header with Photo */}
                <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                    {/* Background Image */}
                    <img
                        src="https://static.wixstatic.com/media/ee02ad_a1970405742c46b69b06e796bc1af31c~mv2.jpg/v1/fill/w_1901,h_878,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ee02ad_a1970405742c46b69b06e796bc1af31c~mv2.jpg"
                        alt="Beach Paradise"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-orange-900/70 to-amber-900/80"></div>

                    {/* Floating Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse" style={{animationDelay: '1s'}}></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                                        <SunIcon className="h-5 w-5 text-yellow-300" />
                                        <span className="text-white text-sm font-bold">Welcome to Paradise</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white mb-3">
                                        Welcome back, {auth.user.name}! 🌊
                                    </h1>
                                    <p className="text-white/90 text-base md:text-xl mb-6 max-w-2xl">
                                        Your beach paradise awaits. Let's make some amazing memories today!
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                                        <Link
                                            href="/book-facility"
                                            className="inline-flex items-center justify-center px-8 py-3 md:py-4 bg-white text-orange-700 rounded-full font-bold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-xl text-base md:text-lg"
                                        >
                                            <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                                            Book Now
                                        </Link>
                                        <Link
                                            href="/facilities"
                                            className="inline-flex items-center justify-center px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white rounded-full font-bold hover:bg-white/20 transition-all text-base md:text-lg"
                                        >
                                            Explore Facilities
                                            <ArrowRightIcon className="h-5 w-5 ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gradient-to-br from-sky-50 via-orange-50 to-amber-50 py-8 md:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        {/* Quick Actions Grid with Beach Theme */}
                        <div className="mb-8 md:mb-10">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-100 via-orange-100 to-amber-100 rounded-xl mr-3">
                                    <SparklesIcon className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Quick Actions</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                                        <div className="relative p-6 md:p-8">
                                            <div className={`inline-flex p-3 md:p-4 rounded-2xl bg-gradient-to-br ${action.gradient} mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                                                <action.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                {action.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {action.description}
                                            </p>
                                            <div className="mt-4 flex items-center text-orange-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                Get Started
                                                <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* VR Tour Section */}
                        <div className="mb-8 md:mb-10 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-purple-300">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mt-48 animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32 animate-pulse" style={{animationDelay: '1.5s'}}></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-3">
                                            <CubeTransparentIcon className="h-8 w-8 md:h-10 md:w-10 text-cyan-300" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Virtual Reality Beach Tour 🥽</h2>
                                    </div>
                                    <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
                                        Experience our beach paradise from anywhere! Take an immersive 360° tour of our facilities, beach areas, and amenities. Perfect for mobile VR viewing.
                                    </p>
                                    <button
                                        onClick={loadVRTour}
                                        className="inline-flex items-center justify-center px-8 py-3 md:py-4 bg-white text-indigo-700 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl text-base md:text-lg"
                                    >
                                        <DevicePhoneMobileIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                                        Start VR Tour
                                    </button>
                                    <p className="text-white/70 text-xs md:text-sm mt-3">
                                        📱 Works best on mobile - use your phone's gyroscope for immersive viewing
                                    </p>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="relative w-48 h-48">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
                                        <DevicePhoneMobileIcon className="absolute inset-0 m-auto h-32 w-32 text-white/40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Notifications with Beach Theme */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-orange-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gradient-to-br from-blue-100 via-orange-100 to-amber-100 rounded-xl mr-3 shadow-md">
                                        <BellIcon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                        Latest Updates 📢
                                    </h2>
                                </div>
                                <button className="text-sm text-orange-600 hover:text-orange-700 font-bold hover:underline transition-colors">
                                    Mark all as read
                                </button>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                                            <BellIcon className="h-12 w-12 mx-auto text-gray-300" />
                                        </div>
                                        <p className="text-lg font-medium">No announcements at the moment</p>
                                        <p className="text-sm mt-2">Check back later for updates and news</p>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <button
                                            key={announcement.id}
                                            onClick={() => openAnnouncementDetail(announcement)}
                                            className="w-full flex flex-col sm:flex-row items-start justify-between p-4 md:p-5 rounded-xl hover:shadow-lg transition-all border-l-4 border-orange-400 bg-orange-50 hover:bg-orange-100 cursor-pointer text-left group"
                                        >
                                            <div className="flex items-start flex-1 mb-2 sm:mb-0 gap-3">
                                                {announcement.photo_path && (
                                                    <img
                                                        src={announcement.photo_path.startsWith('http') ? announcement.photo_path : `/storage/${announcement.photo_path}`}
                                                        alt="Announcement"
                                                        className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border-2 border-orange-200"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="text-gray-900 font-bold mb-1 text-base md:text-lg group-hover:text-orange-700 transition-colors">
                                                        {announcement.title}
                                                    </h4>
                                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-2">
                                                        {announcement.message}
                                                    </p>
                                                    <span className="text-xs text-orange-600 font-medium mt-2 inline-block">
                                                        Click to view details →
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-4 mt-2 sm:mt-1 font-medium">
                                                {formatTimeAgo(announcement.created_at)}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Beach Promotion Banner */}
                        <div className="mt-8 md:mt-10 relative overflow-hidden bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600 rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-yellow-300">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 animate-pulse" style={{animationDelay: '2s'}}></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
                                        🎉 LIMITED TIME OFFER
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Special Beach Package</h3>
                                    <p className="text-white/90 text-base md:text-lg mb-4 leading-relaxed">Book 3 days, get 1 day free! Limited time offer for our loyal visitors.</p>
                                    <Link
                                        href="/facilities"
                                        className="inline-flex items-center justify-center px-8 py-3 md:py-4 bg-white text-orange-700 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl text-base md:text-lg"
                                    >
                                        View Packages
                                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                                    </Link>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
                                        <MapPinIcon className="h-24 w-24 text-white/90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Embedded VR Tour */}
            {showVRTour && (
                <EmbeddedVRTour onClose={() => setShowVRTour(false)} />
            )}

            {/* Announcement Detail Modal */}
            {showDetailModal && selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-orange-600 to-amber-600 p-6 rounded-t-3xl">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                            <div className="pr-12">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {selectedAnnouncement.title}
                                </h3>
                                <p className="text-white/90 text-sm">
                                    Posted {formatTimeAgo(selectedAnnouncement.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {selectedAnnouncement.photo_path && (
                                <div className="mb-6 rounded-2xl overflow-hidden shadow-xl">
                                    <img
                                        src={selectedAnnouncement.photo_path.startsWith('http') ? selectedAnnouncement.photo_path : `/storage/${selectedAnnouncement.photo_path}`}
                                        alt={selectedAnnouncement.title}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                    {selectedAnnouncement.message}
                                </p>
                            </div>

                            {selectedAnnouncement.expires_at && (
                                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                                    <p className="text-sm text-amber-800 font-medium">
                                        ⏰ This announcement expires on {new Date(selectedAnnouncement.expires_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-3xl">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full bg-gradient-to-r from-blue-600 via-orange-600 to-amber-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
