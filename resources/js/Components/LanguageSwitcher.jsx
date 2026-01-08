import { router } from '@inertiajs/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LanguageSwitcher({ currentLocale = 'en' }) {
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    ];

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    const switchLanguage = (locale) => {
        router.post('/language', { locale }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            }
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Switch language"
            >
                <GlobeAltIcon className="h-5 w-5" />
                <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                <span className="sm:hidden">{currentLanguage.flag}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => switchLanguage(language.code)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                    language.code === currentLocale ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                }`}
                            >
                                <span className="text-xl">{language.flag}</span>
                                <span>{language.name}</span>
                                {language.code === currentLocale && (
                                    <svg className="ml-auto h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
