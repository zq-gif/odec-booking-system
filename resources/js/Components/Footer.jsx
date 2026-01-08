import { Link } from '@inertiajs/react';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Footer() {
    return (
        <footer className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-gray-900 to-black text-white" id="contact">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                            <img
                                src="/images/ums-beach-club-logo.avif"
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
                            <a href="/#home" className="text-gray-400 hover:text-orange-400 transition-colors">Home</a>
                            <a href="/#about" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</a>
                            <a href="/#amenities" className="text-gray-400 hover:text-orange-400 transition-colors">Amenities</a>
                            <a href="/#activities" className="text-gray-400 hover:text-orange-400 transition-colors">Activities</a>
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

                {/* Social Media Section */}
                <div className="border-t border-gray-800 pt-8 pb-6">
                    <div className="flex justify-center items-center space-x-4">
                        <span className="text-gray-400 text-sm">Follow us:</span>
                        <a
                            href="https://www.tiktok.com/@umsbeachclub?_r=1&_t=ZS-92u6IFFHJFS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-cyan-500 transition-all transform hover:scale-110"
                            aria-label="Follow us on TikTok"
                        >
                            <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; 2025 ODEC UMS Beach Club. All rights reserved. | Made with love in Sabah
                    </p>
                </div>
            </div>
        </footer>
    );
}
