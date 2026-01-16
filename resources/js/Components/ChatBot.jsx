import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    QuestionMarkCircleIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function ChatBot({ hidden = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Hello! 👋 Welcome to ODEC UMS Beach Club FAQ Bot. I can answer your questions about bookings, facilities, activities, and more!',
            timestamp: new Date(),
            suggestions: ['Book a facility', 'View activities', 'Check pricing', 'Operating hours']
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationContext, setConversationContext] = useState([]);
    const [chatbotData, setChatbotData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch chatbot data from API
    useEffect(() => {
        const fetchChatbotData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/chatbot/data');
                const result = await response.json();
                if (result.success) {
                    setChatbotData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch chatbot data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatbotData();
    }, []);

    // Enhanced FAQ knowledge base with categories and intent detection
    const knowledgeBase = {
        booking: {
            intents: ['book', 'reserve', 'reservation', 'schedule', 'appointment'],
            responses: {
                'how_to_book': {
                    answer: '📅 **Booking a Facility or Activity:**\n\n1. Click "Book Facility" or "Book Activity" from your dashboard\n2. Browse available options with photos and details\n3. Select your preferred date and time slot\n4. Fill in your details (guests, purpose, contact)\n5. Choose payment method and confirm\n6. Get instant confirmation with reference number!\n\n✨ Need help choosing? Ask me about specific facilities!',
                    actions: [
                        { label: 'Book Facility', href: '/book-facility', type: 'link' },
                        { label: 'Book Activity', href: '/book-activity', type: 'link' }
                    ]
                },
                'cancel': {
                    answer: '❌ **Cancellation Process:**\n\nTo cancel a booking:\n1. Go to "My Bookings"\n2. Find your booking\n3. Click the "Cancel" button\n4. Confirm cancellation\n\n⚠️ **Cancellation Policy:**\n• More than 48 hours: Full refund\n• 24-48 hours: 50% refund\n• Less than 24 hours: No refund\n\nNeed help with a specific booking?',
                    actions: [
                        { label: 'View My Bookings', href: '/my-bookings', type: 'link' }
                    ]
                },
                'modify': {
                    answer: '✏️ **Modifying Your Booking:**\n\nCurrently, to modify a booking:\n1. Cancel your existing booking\n2. Create a new booking with updated details\n\nWe\'re working on a direct modification feature!\n\nWould you like to view your bookings?',
                    actions: [
                        { label: 'My Bookings', href: '/my-bookings', type: 'link' }
                    ]
                }
            }
        },
        facilities: {
            intents: ['facility', 'facilities', 'venue', 'hall', 'room', 'space'],
            responses: {
                'available': {
                    answer: '🏢 **Available Facilities:**\n\n• Beach Area - Perfect for events and gatherings\n• Meeting Rooms - Professional spaces\n• Sports Courts - Basketball, volleyball & more\n• Event Halls - Large capacity venues\n• Recreational Spaces - Family-friendly areas\n\nEach facility comes with:\n✓ High-quality amenities\n✓ Flexible time slots\n✓ Competitive pricing\n✓ Professional support\n\nWant to see detailed info about a specific facility?',
                    actions: [
                        { label: 'Browse All Facilities', href: '/facilities', type: 'link' }
                    ]
                },
                'pricing': {
                    answer: '💰 **Facility Pricing:**\n\nPricing varies by facility type:\n• Beach Areas: $50-100/4 hours\n• Meeting Rooms: $30-80/4 hours\n• Sports Courts: $40-90/4 hours\n• Event Halls: $100-300/4 hours\n\n🎉 **Discounts Available:**\n• Group bookings (10+ people): 10% off\n• Full-day bookings: 15% off\n• Monthly packages: Contact us!\n\nView exact pricing on the facilities page.',
                    actions: [
                        { label: 'View Pricing', href: '/facilities', type: 'link' }
                    ]
                }
            }
        },
        activities: {
            intents: ['activity', 'activities', 'things to do', 'water sport', 'beach game'],
            responses: {
                'available': {
                    answer: '🌊 **Beach Activities:**\n\n**Water Sports:**\n• Parasailing - Soar above the ocean\n• Jet Skiing - Adrenaline rush\n• Kayaking - Peaceful paddling\n• Banana Boat - Group fun\n\n**Beach Activities:**\n• Beach Volleyball\n• Beach Soccer\n• Camping - Overnight adventures\n• Sunset Cruises - Romantic evenings\n\n**Guided Experiences:**\n• Snorkeling Tours\n• Island Hopping\n• Fishing Trips\n\nEach activity includes safety equipment and professional guides!',
                    actions: [
                        { label: 'Book Activity', href: '/book-activity', type: 'link' },
                        { label: 'VR Tour', href: '/vr-tour', type: 'link' }
                    ]
                },
                'duration': {
                    answer: '⏱️ **Activity Durations:**\n\n• Water Sports: 30-60 minutes\n• Beach Games: 1-2 hours\n• Camping: Overnight (sunset to sunrise)\n• Sunset Cruises: 2-3 hours\n• Guided Tours: 3-4 hours\n\nAll activities include:\n✓ Safety briefing\n✓ Equipment provided\n✓ Professional instructors\n✓ Insurance coverage',
                    actions: [
                        { label: 'Check Schedule', href: '/book-activity', type: 'link' }
                    ]
                }
            }
        },
        payment: {
            intents: ['pay', 'payment', 'cost', 'price', 'fee', 'charge', 'refund'],
            responses: {
                'methods': {
                    answer: '💳 **Payment Methods:**\n\nWe accept:\n1. **Credit/Debit Cards** - Visa, Mastercard, AmEx\n2. **Cash on Arrival** - Pay at the venue\n3. **Bank Transfer** - Direct deposit\n4. **Digital Wallets** - GrabPay, Touch \'n Go\n\n🔒 **Secure Payment:**\nAll online payments are encrypted and PCI-compliant.\n\n💵 **Payment Terms:**\n• Deposits: 30% upfront for large bookings\n• Full payment: Due at booking or arrival\n• Receipts: Emailed immediately',
                    actions: []
                },
                'refund': {
                    answer: '💸 **Refund Policy:**\n\n**Cancellation Refunds:**\n• 48+ hours before: 100% refund\n• 24-48 hours: 50% refund\n• Less than 24 hours: No refund\n\n**Processing Time:**\n• Credit Card: 5-7 business days\n• Bank Transfer: 3-5 business days\n• Cash: Immediate (if paid in cash)\n\n**Weather Cancellations:**\nFull refund or free rescheduling for severe weather.\n\nQuestions about a specific refund?',
                    actions: [
                        { label: 'Contact Support', href: '/report-issue', type: 'link' }
                    ]
                }
            }
        },
        general: {
            intents: ['hours', 'time', 'location', 'where', 'contact', 'help'],
            responses: {
                'hours': {
                    answer: '🕐 **Operating Hours:**\n\n**Daily Operations:**\n• Monday - Sunday: 8:00 AM - 6:00 PM\n• Last booking entry: 5:00 PM\n\n**Extended Hours:**\n• Beach camping: Until 10:00 PM\n• Special events: Available on request\n\n**Best Times to Visit:**\n• Sunrise: 6:30 AM - 8:00 AM\n• Sunset: 5:30 PM - 6:30 PM\n\nWe\'re open every day, rain or shine!',
                    actions: [
                        { label: 'Book Now', href: '/book-facility', type: 'link' }
                    ]
                },
                'location': {
                    answer: '📍 **Find Us:**\n\n**Address:**\nUMS ODEC Beach Club\nUnnamed Road, 88400\nKota Kinabalu, Sabah, Malaysia\n\n**Getting Here:**\n• 15 mins from KK City Center\n• Free parking available\n• Accessible by public transport\n\n**What to Bring:**\n• Booking confirmation\n• Valid ID\n• Swimwear & towels\n• Sunscreen\n\nTake a virtual tour before you visit!',
                    actions: [
                        { label: 'Google Maps', href: 'https://www.google.com/maps/search/?api=1&query=UMS%20ODEC%20beach%20Unnamed%20Road%2C%2088400%20Kota%20Kinabalu%2C%20Sabah%2C%20Malaysia', type: 'external' },
                        { label: 'VR Tour', href: '/vr-tour', type: 'link' }
                    ]
                },
                'contact': {
                    answer: '📞 **Contact Us:**\n\n**Customer Service:**\n• Hours: 8:00 AM - 6:00 PM Daily\n• Response Time: Within 24 hours\n\n**For Assistance:**\n• Report an issue through our portal\n• Submit feedback\n• Live chat (right here!)\n\n**Emergency Contact:**\n• On-site security: 24/7\n• First aid: Available at beach\n\nHow else can I help you today?',
                    actions: [
                        { label: 'Report Issue', href: '/report-issue', type: 'link' },
                        { label: 'Give Feedback', href: '/feedback', type: 'link' }
                    ]
                }
            }
        },
        account: {
            intents: ['account', 'profile', 'my booking', 'history', 'login', 'register'],
            responses: {
                'bookings': {
                    answer: '📋 **Your Bookings:**\n\nIn "My Bookings" you can:\n• View all past and upcoming bookings\n• Check booking status (Pending/Confirmed/Cancelled)\n• Download confirmation receipts\n• Cancel or modify bookings\n• Track payment status\n• Submit feedback after your visit\n\nBooking reference numbers are always visible for easy tracking!',
                    actions: [
                        { label: 'View Bookings', href: '/my-bookings', type: 'link' }
                    ]
                },
                'profile': {
                    answer: '👤 **Your Profile:**\n\nManage your account:\n• Update personal information\n• Change password\n• Set notification preferences\n• View booking history\n• Manage payment methods\n• Delete account (if needed)\n\nYour data is secure and encrypted!',
                    actions: [
                        { label: 'Edit Profile', href: '/profile', type: 'link' }
                    ]
                }
            }
        }
    };

    // Advanced intent detection with NLP-like matching
    const detectIntent = (message) => {
        const msg = message.toLowerCase().trim();

        // Multi-word phrase matching
        const phrases = {
            'how to book': 'booking.how_to_book',
            'how do i book': 'booking.how_to_book',
            'make a reservation': 'booking.how_to_book',
            'cancel booking': 'booking.cancel',
            'cancel reservation': 'booking.cancel',
            'modify booking': 'booking.modify',
            'change booking': 'booking.modify',
            'what facilities': 'facilities.available',
            'available facilities': 'facilities.available',
            'facility price': 'facilities.pricing',
            'how much': 'facilities.pricing',
            'what activities': 'activities.available',
            'available activities': 'activities.available',
            'activity duration': 'activities.duration',
            'how long': 'activities.duration',
            'payment method': 'payment.methods',
            'how to pay': 'payment.methods',
            'refund policy': 'payment.refund',
            'get refund': 'payment.refund',
            'operating hours': 'general.hours',
            'opening hours': 'general.hours',
            'what time': 'general.hours',
            'where are you': 'general.location',
            'location': 'general.location',
            'how to get there': 'general.location',
            'contact': 'general.contact',
            'my booking': 'account.bookings',
            'view bookings': 'account.bookings',
            'my profile': 'account.profile',
            'account settings': 'account.profile',
        };

        // Check for phrase matches first
        for (const [phrase, intent] of Object.entries(phrases)) {
            if (msg.includes(phrase)) {
                return intent;
            }
        }

        // Category-based intent detection
        for (const [category, data] of Object.entries(knowledgeBase)) {
            for (const intent of data.intents) {
                if (msg.includes(intent)) {
                    // Find the most relevant response
                    const responses = Object.keys(data.responses);
                    for (const responseKey of responses) {
                        if (msg.includes(responseKey) || msg.includes(responseKey.replace('_', ' '))) {
                            return `${category}.${responseKey}`;
                        }
                    }
                    // Return first response as default for category
                    return `${category}.${responses[0]}`;
                }
            }
        }

        return null;
    };

    // Generate dynamic response based on database data
    const getDynamicResponse = (intent) => {
        if (!chatbotData) return null;

        const [category, responseKey] = intent.split('.');

        // Generate dynamic facilities response
        if (category === 'facilities' && responseKey === 'available') {
            const facilities = chatbotData.facilities || [];
            if (facilities.length === 0) {
                return {
                    answer: '🏢 **Available Facilities:**\n\nCurrently, we are updating our facilities list. Please check back soon or contact us for more information!',
                    actions: [{ label: 'Contact Us', href: '/report-issue', type: 'link' }]
                };
            }

            let answer = '🏢 **Available Facilities:**\n\n';
            facilities.forEach((facility, index) => {
                answer += `${index + 1}. **${facility.name}** - $${facility.price}/${facility.slot_duration}h\n`;
                answer += `   ${facility.description}\n`;
                answer += `   Capacity: ${facility.capacity} people\n\n`;
            });
            answer += '\nEach facility comes with:\n✓ High-quality amenities\n✓ Flexible time slots\n✓ Professional support\n\nReady to book?';

            return {
                answer,
                actions: [{ label: 'Book Now', href: '/book-facility', type: 'link' }]
            };
        }

        // Generate dynamic facilities pricing response
        if (category === 'facilities' && responseKey === 'pricing') {
            const stats = chatbotData.stats;
            const facilities = chatbotData.facilities || [];

            let answer = '💰 **Facility Pricing:**\n\n';
            if (facilities.length > 0) {
                answer += `Price range: $${stats.facility_price_range.min} - $${stats.facility_price_range.max} per hour\n\n`;
                answer += '**Our Facilities:**\n';
                facilities.forEach(facility => {
                    answer += `• ${facility.name}: $${facility.price}/${facility.slot_duration}h\n`;
                });
            } else {
                answer += 'Please contact us for current pricing information.';
            }

            answer += '\n🎉 **Discounts Available:**\n• Group bookings: Ask for special rates\n• Full-day bookings: Better value\n• Monthly packages: Contact us!';

            return {
                answer,
                actions: [{ label: 'View All Facilities', href: '/facilities', type: 'link' }]
            };
        }

        // Generate dynamic activities response
        if (category === 'activities' && responseKey === 'available') {
            const activities = chatbotData.activities || [];
            if (activities.length === 0) {
                return {
                    answer: '🌊 **Beach Activities:**\n\nWe are currently updating our activities list. Please check back soon or contact us!',
                    actions: [{ label: 'Contact Us', href: '/report-issue', type: 'link' }]
                };
            }

            let answer = '🌊 **Beach Activities:**\n\n';
            activities.forEach((activity, index) => {
                answer += `${index + 1}. **${activity.name}** - $${activity.price}\n`;
                answer += `   ${activity.description}\n`;
                answer += `   Duration: ${activity.duration} | Max: ${activity.max_participants} participants\n\n`;
            });
            answer += '\nEach activity includes:\n✓ Safety briefing & equipment\n✓ Professional guides\n✓ Insurance coverage\n\nReady for adventure?';

            return {
                answer,
                actions: [
                    { label: 'Book Activity', href: '/book-activity', type: 'link' },
                    { label: 'VR Tour', href: '/vr-tour', type: 'link' }
                ]
            };
        }

        // Generate dynamic activity duration response
        if (category === 'activities' && responseKey === 'duration') {
            const activities = chatbotData.activities || [];

            let answer = '⏱️ **Activity Durations:**\n\n';
            if (activities.length > 0) {
                activities.forEach(activity => {
                    answer += `• ${activity.name}: ${activity.duration}\n`;
                });
            } else {
                answer += 'Duration varies by activity. Contact us for specific information!';
            }

            answer += '\n\nAll activities include:\n✓ Safety briefing\n✓ Equipment provided\n✓ Professional instructors';

            return {
                answer,
                actions: [{ label: 'Book Now', href: '/book-activity', type: 'link' }]
            };
        }

        return null;
    };

    // Get response based on detected intent
    const getResponse = (intent) => {
        if (!intent) return null;

        // Try to get dynamic response first
        const dynamicResponse = getDynamicResponse(intent);
        if (dynamicResponse) return dynamicResponse;

        // Fall back to static response
        const [category, responseKey] = intent.split('.');
        return knowledgeBase[category]?.responses[responseKey];
    };

    // Enhanced response generation with context awareness
    const generateResponse = (userMessage) => {
        const intent = detectIntent(userMessage);
        const response = getResponse(intent);

        if (response) {
            return {
                text: response.answer,
                actions: response.actions || [],
                suggestions: generateSuggestions(intent)
            };
        }

        // Greeting detection
        if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/.test(userMessage.toLowerCase())) {
            return {
                text: '👋 Hello! Welcome to ODEC UMS Beach Club!\n\nI\'m here to help you with:\n• Booking facilities and activities\n• Pricing and payment info\n• Location and directions\n• Your account and bookings\n\nWhat would you like to know?',
                actions: [],
                suggestions: ['Book a facility', 'View activities', 'Operating hours', 'Location']
            };
        }

        // Thank you detection
        if (/^(thanks|thank you|appreciate)/.test(userMessage.toLowerCase())) {
            return {
                text: '😊 You\'re welcome! Happy to help!\n\nIs there anything else you\'d like to know about ODEC UMS Beach Club?',
                actions: [],
                suggestions: ['More questions', 'Book now', 'View facilities']
            };
        }

        // Default fallback with smart suggestions
        return {
            text: '🤔 I\'m not quite sure about that, but I can help you with:\n\n**Popular Topics:**\n• How to book facilities or activities\n• Available facilities and pricing\n• Beach activities and water sports\n• Payment methods and refunds\n• Operating hours and location\n• Your bookings and account\n\nTry asking about any of these topics!',
            actions: [
                { label: 'Browse Facilities', href: '/facilities', type: 'link' },
                { label: 'View Activities', href: '/book-activity', type: 'link' }
            ],
            suggestions: ['How to book?', 'What facilities?', 'Operating hours?', 'Where are you?']
        };
    };

    // Generate contextual suggestions
    const generateSuggestions = (intent) => {
        const suggestionMap = {
            'booking.how_to_book': ['Cancel booking?', 'Payment methods?', 'View my bookings'],
            'booking.cancel': ['Refund policy?', 'Modify booking?', 'Contact support'],
            'facilities.available': ['Facility pricing?', 'Book facility', 'VR tour'],
            'facilities.pricing': ['Book now', 'Available time slots?', 'Payment methods?'],
            'activities.available': ['Activity duration?', 'Book activity', 'Pricing info?'],
            'payment.methods': ['Refund policy?', 'Book now', 'Payment issues?'],
            'general.hours': ['Book now', 'Location?', 'Contact info?'],
            'general.location': ['Operating hours?', 'VR tour', 'How to get there?'],
            'account.bookings': ['Cancel booking?', 'Book again', 'Submit feedback'],
        };

        return suggestionMap[intent] || ['How to book?', 'View facilities', 'Operating hours?', 'Contact us'];
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        // Add user message
        const userMsg = {
            type: 'user',
            text: inputMessage,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        // Update conversation context
        setConversationContext(prev => [...prev, inputMessage]);

        const currentInput = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        // Simulate bot thinking and respond
        setTimeout(() => {
            const response = generateResponse(currentInput);
            const botMsg = {
                type: 'bot',
                text: response.text,
                timestamp: new Date(),
                actions: response.actions,
                suggestions: response.suggestions,
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 400); // Variable delay for more natural feel
    };

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        // Auto-submit the suggestion
        setTimeout(() => {
            const event = new Event('submit', { cancelable: true, bubbles: true });
            document.querySelector('#chatbot-form')?.dispatchEvent(event);
        }, 100);
    };

    const handleActionClick = (action) => {
        if (action.type === 'external') {
            window.open(action.href, '_blank', 'noopener,noreferrer');
        }
    };

    const resetConversation = () => {
        setMessages([
            {
                type: 'bot',
                text: '🔄 Chat reset! How can I help you today?',
                timestamp: new Date(),
                suggestions: ['Book a facility', 'View activities', 'Check pricing', 'Operating hours']
            }
        ]);
        setConversationContext([]);
        setInputMessage('');
    };

    // Don't render if hidden
    if (hidden) return null;

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 group hover:scale-110 animate-pulse"
                    title="FAQ Help Center - Get instant answers"
                    aria-label="Open FAQ Help Center"
                >
                    <ChatBubbleLeftRightIcon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                        <QuestionMarkCircleIcon className="h-4 w-4" />
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-purple-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full mr-3">
                                <QuestionMarkCircleIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">FAQ Help Center</h3>
                                <p className="text-xs text-purple-100 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                    Online • Get instant answers
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={resetConversation}
                                className="hover:bg-white/20 p-2 rounded-full transition-all"
                                title="Reset conversation"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-2 rounded-full transition-all"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                            message.type === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-white text-gray-800 shadow-md border border-purple-100'
                                        }`}
                                    >
                                        <div className="text-sm whitespace-pre-line leading-relaxed">
                                            {message.text}
                                        </div>
                                        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {message.actions && message.actions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 ml-0">
                                        {message.actions.map((action, idx) => (
                                            action.type === 'link' ? (
                                                <Link
                                                    key={idx}
                                                    href={action.href}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                                                >
                                                    {action.label}
                                                </Link>
                                            ) : (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleActionClick(action)}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                                                >
                                                    {action.label}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                )}

                                {/* Suggestions */}
                                {message.suggestions && message.suggestions.length > 0 && index === messages.length - 1 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {message.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="text-xs px-3 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-all border border-purple-200 hover:border-purple-300 font-medium"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 shadow-md border border-purple-100 rounded-2xl px-5 py-3">
                                    <div className="flex space-x-2 items-center">
                                        <ArrowPathIcon className="h-4 w-4 text-purple-600 animate-spin" />
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form id="chatbot-form" onSubmit={handleSendMessage} className="p-4 bg-white border-t-2 border-purple-100">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-purple-50/30"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            FAQ Support • Instant answers to common questions
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}
