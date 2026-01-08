export default function LoadingSpinner({ size = 'md', color = 'orange', fullScreen = false }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const colors = {
        orange: 'border-orange-600',
        blue: 'border-blue-600',
        green: 'border-green-600',
        red: 'border-red-600',
        gray: 'border-gray-600',
    };

    const spinner = (
        <div
            className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
            role="status"
            aria-label="Loading"
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
                    {spinner}
                    <p className="text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return spinner;
}

// Inline Loading Component (for buttons)
export function ButtonSpinner({ className = '' }) {
    return (
        <svg
            className={`animate-spin h-5 w-5 ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );
}

// Skeleton Loading Component (for content placeholders)
export function SkeletonLoader({ className = '', rows = 3 }) {
    return (
        <div className={`animate-pulse space-y-4 ${className}`}>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
}

// Card Skeleton Loader (for card grids)
export function CardSkeleton({ count = 3 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <div className="bg-white p-4 rounded-b-lg space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Table Skeleton Loader
export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="animate-pulse">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {[...Array(columns)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
                {/* Rows */}
                {[...Array(rows)].map((_, rowIndex) => (
                    <div key={rowIndex} className="border-b border-gray-200 p-4">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {[...Array(columns)].map((_, colIndex) => (
                                <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
