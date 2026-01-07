import { Head, Link } from '@inertiajs/react';
import {
    PlayCircleIcon,
    ArrowRightIcon,
    SunIcon,
    WifiIcon,
    CameraIcon,
    UserGroupIcon,
    SparklesIcon,
    MapPinIcon,
    CalendarIcon,
    StarIcon,
    ShieldCheckIcon,
    BuildingStorefrontIcon,
    HomeModernIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to ODEC UMS Beach Club" />

            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-amber-50">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 bg-white/95 backdrop-blur-lg shadow-md border-b border-orange-100">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="images/ums-beach-club-logo.avif"
                                alt="UMS Beach Club"
                                className="h-12 md:h-16 w-auto transition-transform hover:scale-105"
                            />
                            <div>
                                <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    ODEC UMS Beach
                                </h2>
                                <p className="text-xs text-gray-500 font-medium">🌴 Your Tropical Paradise</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden lg:flex space-x-6 xl:space-x-8">
                            <a href="#home" className="text-orange-600 font-semibold hover:text-orange-700 transition-all hover:scale-105 border-b-2 border-orange-600 pb-1">Home</a>
                            <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">About</a>
                            <a href="#amenities" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">Amenities</a>
                            <a href="#activities" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">Activities</a>
                            <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">Contact</a>
                        </nav>

                        {/* Auth Links */}
                        <div className="flex space-x-2 md:space-x-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-500 via-orange-500 to-amber-600 text-white rounded-full hover:shadow-2xl font-semibold transition-all transform hover:scale-105 text-sm md:text-base"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 md:px-6 py-2 md:py-2.5 text-gray-700 hover:text-orange-600 font-semibold transition-all hover:scale-105 text-sm md:text-base"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-500 via-orange-500 to-amber-600 text-white rounded-full hover:shadow-2xl font-semibold transition-all transform hover:scale-105 text-sm md:text-base"
                                    >
                                        Register Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                 {/* About Us Section */}
                <section className="py-24 md:py-32 px-4 md:px-6 bg-gradient-to-b from-white to-orange-50/30" id="about">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                            {/* Left - Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img
                                    src="/images/beach-about.jpg"
                                    alt="UMS Beach Club"
                                    className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {e.target.src = 'https://static.wixstatic.com/media/ee02ad_42194699c751478eb19905e0a90c820c~mv2.jpg/v1/crop/x_360,y_604,w_707,h_565/fill/w_605,h_484,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/494466358_122170920626555452_1084375682847930204_n.jpg'}}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent"></div>

                                {/* Floating Badge */}
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                    <p className="text-sm font-bold text-orange-600">🏖️ Sabah's Hidden Gem</p>
                                </div>
                            </div>

                            {/* Right - Content */}
                            <div className="space-y-6">
                                <div className="inline-block">
                                    <span className="text-orange-600 font-bold text-xs md:text-sm tracking-widest uppercase px-4 py-2 bg-orange-100 rounded-full">
                                        ✨ About Us
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                    Get to know us and our
                                    <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent"> vision</span>
                                </h2>

                                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                    At <span className="font-semibold text-orange-600">UMS Beach Club</span>, it's all about warm hospitality, laid-back comfort, and unforgettable experiences. Nestled in a vibrant coastal setting, we're the perfect escape for families, thrill-seekers, and casual vacationers alike.
                                </p>

                                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                    From adrenaline-pumping water activities to peaceful beachside camping, every detail is designed for joy and relaxation. With scenic views, friendly faces, and a splash of island fun - we're here to make your stay truly memorable.
                                </p>

                                <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-2xl border-l-4 border-orange-500">
                                    <p className="text-gray-800 font-medium italic">
                                        "Come as you are, leave with stories." 🌅
                                    </p>
                                </div>

                                <div className="mt-8">
                                    {!auth.user && (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-orange-500 to-amber-600 text-white rounded-full hover:shadow-2xl font-bold transition-all transform hover:scale-105 text-lg"
                                        >
                                            Join Our Community
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hero Section */}
                <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6" id="home">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left Content */}
                            <div className="space-y-6 md:space-y-8">

                                {/* Main Heading */}
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight">
                                    <span className="bg-gradient-to-r from-blue-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                                        Paradise Found
                                    </span>
                                    <br />
                                    <span className="text-gray-900">
                                        Your Perfect Beach Escape
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl">
                                    Experience the ultimate coastal getaway at <span className="font-semibold text-orange-600">ODEC UMS Beach Club</span>.
                                    Crystal-clear waters, golden sands, and world-class facilities await.
                                    Whether you're seeking adventure or relaxation, we've got everything
                                    you need for an unforgettable beach vacation in beautiful Sabah.
                                </p>

       

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    {!auth.user && (
                                        <Link
                                            href={route('register')}
                                            className="px-8 py-4 bg-gradient-to-r from-blue-600 via-orange-500 to-amber-600 text-white rounded-full hover:shadow-2xl font-bold transition-all transform hover:scale-105 inline-flex items-center justify-center text-lg"
                                        >
                                            Book Your Stay
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Link>
                                    )}
                                    <a
                                        href="/public-vr-tour"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 bg-white text-gray-700 rounded-full hover:bg-gray-50 font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center border-2 border-gray-200 text-lg"
                                    >
                                        <CameraIcon className="mr-2 h-6 w-6 text-orange-600" />
                                        Virtual Tour
                                    </a>
                                </div>
                            </div>

                            {/* Right Content - Images */}
                            <div className="relative mt-8 lg:mt-0">
                                {/* Main Image */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                    <img
                                        src="/images/beach-hero.jpg"
                                        alt="Beautiful Beach Paradise"
                                        className="w-full h-[450px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="eager"
                                        onError={(e) => {e.target.src = 'https://static.wixstatic.com/media/ee02ad_a1970405742c46b69b06e796bc1af31c~mv2.jpg/v1/fill/w_1901,h_878,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ee02ad_a1970405742c46b69b06e796bc1af31c~mv2.jpg'}}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>


                                    {/* Bottom Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl border-2 border-orange-200">
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">🏖️ UMS ODEC Beach</h3>
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <MapPinIcon className="h-5 w-5 mr-2 text-orange-600" />
                                                <span className="text-sm md:text-base">Kota Kinabalu, Sabah, Malaysia</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <a
                                                    href="https://www.google.com/maps/search/?api=1&query=UMS%20ODEC%20beach%20Unnamed%20Road%2C%2088400%20Kota%20Kinabalu%2C%20Sabah%2C%20Malaysia"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-orange-500 to-amber-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 text-center"
                                                >
                                                    📍 View on Map
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-orange-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-white via-blue-50/30 to-orange-50/30" id="amenities">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                                Endless Fun, All in One Place
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                                Everything you need for a perfect beach day in Sabah
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {[
                                { icon: ShieldCheckIcon, title: '24/7 Security', emoji: '🛡️', description: 'Your safety is our priority - day and night. With round-the-clock security, you can relax, explore, and enjoy every moment without a worry.' },
                                { icon: BuildingStorefrontIcon, title: 'Food & Drink', emoji: '🍽️', description: 'From quick bites to refreshing drinks, our beachside stalls keep you fueled for fun. Savor local flavors or grab an ice-cold treat between adventures.' },
                                { icon: HomeModernIcon, title: 'Public Restroom', emoji: '🚻', description: 'Clean, well-maintained, and easily accessible - because comfort counts, even when you are chasing the waves.' },
                                { icon: ClockIcon, title: 'Open Everyday', emoji: '⏰', description: 'Whether it is a spontaneous weekday splash or a weekend getaway, we are here to welcome you - sunrise to sunset, every single day.' }
                            ].map((feature, index) => (
                                <div key={index} className="group p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                                        <span className="text-3xl">{feature.emoji}</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Activities Preview */}
                <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-orange-50/30 to-white" id="activities">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">
                                🌊 Beach Activities
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                                One Beach. Endless Possibilities.
                            </h2>
                            <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto mb-2">
                                From water sports to beach camping, create memories that last a lifetime
                            </p>
                            <p className="text-orange-600 text-lg md:text-xl font-bold">
                                Discover the fun. Book now!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    title: 'Water Sports',
                                    emoji: '🏄',
                                    image: '/images/water-sports.jpg',
                                    fallback: 'https://imgs.search.brave.com/qgYvQUZECHbeufxfFiyppXOcwyaMT0V83bw2kCCOnC8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvOTkz/OTU0MDg4L3Bob3Rv/L2JhbmFuYS1ib2F0/LWZ1bi5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9ZmFGMk1q/R2VUekZmSF85WFlz/Q2RYTHFhSGE3MFdv/Sjc4VEVWOGI0RnRt/ND0',
                                    description: 'Parasailing, kayaking & more thrilling adventures'
                                },
                                {
                                    title: 'Beach Camping',
                                    emoji: '⛺',
                                    image: '/images/beach-camping.jpg',
                                    fallback: 'https://imgs.search.brave.com/-RboN0_vZRQ87VgE0SBy2ykwRP9r0PVg6KBUsp4i8Kw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/NTUxLzQxMS9zbWFs/bC9jYW1waW5nLW9u/LXRoZS13aGl0ZS1i/ZWFjaC13aXRoLWJl/YXV0aWZ1bC1wYW5v/cmFtYS1hdC1zdW5y/aXNlLWxpZ2h0LXZp/ZXctZnJvbS1hLXRl/bnQtZ2VuZXJhdGl2/ZS1haS1waG90by5q/cGc',
                                    description: 'Overnight under the stars with ocean breeze'
                                },
                                {
                                    title: 'Sunset Cruises',
                                    emoji: '⛵',
                                    image: '/images/sunset-cruise.jpg',
                                    fallback: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&auto=format&fit=crop',
                                    description: 'Romantic evening voyages on the sea'
                                }
                            ].map((activity, index) => (
                                <div key={index} className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="w-full h-72 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                        onError={(e) => {e.target.src = activity.fallback}}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                                    {/* Top Badge */}
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                                        <span className="text-2xl">{activity.emoji}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{activity.title}</h3>
                                        <p className="text-gray-200 text-sm md:text-base mb-4">{activity.description}</p>
                                        <button className="px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white hover:text-orange-600 transition-all font-semibold text-sm">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-blue-600 via-orange-600 to-amber-700 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold mb-6">
                            🎉 Limited Spots Available
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Ready for Your Beach Adventure?
                        </h2>
                        <p className="text-white/90 text-base md:text-lg mb-10 max-w-2xl mx-auto">
                            Book your stay now and experience the ultimate beach paradise in Kota Kinabalu, Sabah.
                            Your tropical escape awaits!
                        </p>
                        {!auth.user ? (
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href={route('register')}
                                    className="px-10 py-4 bg-white text-orange-700 rounded-full hover:bg-gray-50 font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 inline-flex items-center justify-center text-lg"
                                >
                                    <CalendarIcon className="mr-2 h-6 w-6" />
                                    Book Your Stay
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white rounded-full hover:bg-white/20 font-bold transition-all inline-flex items-center justify-center text-lg"
                                >
                                    Sign In
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href={route('dashboard')}
                                className="px-10 py-4 bg-white text-orange-700 rounded-full hover:bg-gray-50 font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 inline-flex items-center justify-center text-lg"
                            >
                                Go to Dashboard
                                <ArrowRightIcon className="ml-2 h-6 w-6" />
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-gray-900 to-black text-white" id="contact">
                    <div className="max-w-7xl mx-auto">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            {/* Brand Section */}
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                                    <img
                                        src="images/ums-beach-club-logo.avif"
                                        alt="UMS Beach Club"
                                        className="h-12 w-auto"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                                            ODEC UMS Beach
                                        </h3>
                                        <p className="text-xs text-gray-400">Your Gateway to Paradise</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Experience the ultimate coastal getaway in beautiful Kota Kinabalu, Sabah, Malaysia.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                                <div className="flex flex-col space-y-2">
                                    <a href="#home" className="text-gray-400 hover:text-orange-400 transition-colors">Home</a>
                                    <a href="#about" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</a>
                                    <a href="#amenities" className="text-gray-400 hover:text-orange-400 transition-colors">Amenities</a>
                                    <a href="#activities" className="text-gray-400 hover:text-orange-400 transition-colors">Activities</a>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="text-center md:text-right">
                                <h4 className="text-lg font-bold text-white mb-4">Visit Us</h4>
                                <div className="text-gray-400 text-sm space-y-2">
                                    <p className="flex items-center justify-center md:justify-end">
                                        <MapPinIcon className="h-5 w-5 mr-2 text-orange-400" />
                                        Kota Kinabalu, Sabah
                                    </p>
                                    <p>Malaysia</p>
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=UMS%20ODEC%20beach%20Unnamed%20Road%2C%2088400%20Kota%20Kinabalu%2C%20Sabah%2C%20Malaysia"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mt-2"
                                    >
                                        View on Map
                                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-gray-800 pt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                &copy; 2025 ODEC UMS Beach Club. All rights reserved. | Made with love in Sabah
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}