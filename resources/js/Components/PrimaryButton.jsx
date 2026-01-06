export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-full border border-transparent bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3 text-sm font-semibold tracking-wide text-white transition duration-150 ease-in-out hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:from-orange-700 active:to-amber-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
