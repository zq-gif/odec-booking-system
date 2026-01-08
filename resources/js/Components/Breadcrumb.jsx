import { Link } from '@inertiajs/react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
                href="/admin/dashboard"
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
                <HomeIcon className="h-4 w-4" />
                <span className="sr-only">Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
