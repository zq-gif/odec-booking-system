<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\FacilityBookingController;
use App\Http\Controllers\ActivityBookingController;
use App\Http\Controllers\BookingActionController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\VRTourController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminFacilityController;
use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\MaintenanceController;
use App\Http\Controllers\Admin\IssueController;
use App\Http\Controllers\Admin\FeedbackController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Api\AnnouncementController as ApiAnnouncementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Inertia\Inertia;

// Check Vite manifest
Route::get('/test-vite', function () {
    $manifestPath = public_path('build/.vite/manifest.json');
    $buildPath = public_path('build');

    $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : null;

    return response()->json([
        'manifest_exists' => file_exists($manifestPath),
        'manifest_readable' => is_readable($manifestPath),
        'build_dir_exists' => file_exists($buildPath),
        'build_dir_readable' => is_readable($buildPath),
        'public_path' => public_path(),
        'manifest_path' => $manifestPath,
        'build_contents' => file_exists($buildPath) ? scandir($buildPath) : null,
        'manifest_content' => $manifest,
        'vite_helper' => Vite::isRunningHot(),
    ]);
});

// Test rendering a blade view with Vite
Route::get('/test-blade', function () {
    try {
        return view('app');
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});

// Public VR Tour route (no authentication required)
Route::get('/public-vr-tour', function () {
    return redirect('/vr-tour/index.html');
})->name('public-vr-tour');

Route::get('/', function () {
    try {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.dashboard');

Route::get('/staff/dashboard', function () {
    return Inertia::render('Staff/Dashboard');
})->middleware(['auth', 'verified'])->name('staff.dashboard');

Route::get('/facilities', [FacilityController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('facilities');

Route::get('/vr-tour', function () {
    return Inertia::render('VRTour');
})->middleware(['auth', 'verified'])->name('vr-tour');

Route::get('/book-facility', function () {
    $facilities = \App\Models\Facility::all();
    $paymentQrCode = \App\Models\Setting::get('payment_qr_code');
    return Inertia::render('BookFacility', [
        'facilities' => $facilities,
        'paymentQrCode' => $paymentQrCode
    ]);
})->middleware(['auth', 'verified'])->name('book-facility');

// Facility Booking Routes
Route::post('/facility-bookings', [FacilityBookingController::class, 'store'])
    ->middleware(['auth'])
    ->name('facility-bookings.store');

Route::get('/facility-bookings', [FacilityBookingController::class, 'index'])
    ->middleware(['auth'])
    ->name('facility-bookings.index');

Route::get('/api/facility-bookings/booked-slots', [FacilityBookingController::class, 'getBookedSlots'])
    ->middleware(['auth'])
    ->name('facility-bookings.booked-slots');

// API Routes for Announcements
Route::get('/api/announcements', [ApiAnnouncementController::class, 'index'])
    ->middleware(['auth'])
    ->name('api.announcements.index');

// API Routes for ChatBot
Route::get('/api/chatbot/data', [\App\Http\Controllers\Api\ChatBotController::class, 'getData'])
    ->name('api.chatbot.data');
Route::get('/api/chatbot/activity/{id}', [\App\Http\Controllers\Api\ChatBotController::class, 'getActivity'])
    ->name('api.chatbot.activity');
Route::get('/api/chatbot/facility/{id}', [\App\Http\Controllers\Api\ChatBotController::class, 'getFacility'])
    ->name('api.chatbot.facility');

// Activity Booking Routes
Route::get('/book-activity', function () {
    $activities = \App\Models\Activity::where('status', 'available')->get();
    $paymentQrCode = \App\Models\Setting::get('payment_qr_code');
    return Inertia::render('BookActivity', [
        'activities' => $activities,
        'paymentQrCode' => $paymentQrCode
    ]);
})->middleware(['auth', 'verified'])->name('book-activity');

Route::post('/api/activity-bookings', [ActivityBookingController::class, 'store'])
    ->middleware(['auth'])
    ->name('activity-bookings.store');

Route::get('/api/activity-bookings', [ActivityBookingController::class, 'index'])
    ->middleware(['auth'])
    ->name('activity-bookings.index');

Route::get('/api/activity-bookings/booked-slots', [ActivityBookingController::class, 'getBookedSlots'])
    ->middleware(['auth'])
    ->name('activity-bookings.booked-slots');

// VR Tour Routes
Route::get('/api/vr-tour-spots', [VRTourController::class, 'index'])
    ->middleware(['auth'])
    ->name('vr-tour-spots.index');

Route::get('/my-bookings', function () {
    // Get facility bookings
    $facilityBookings = \App\Models\FacilityBooking::with('facility')
        ->where('user_id', auth()->id())
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($booking) {
            return [
                'id' => $booking->id,
                'type' => 'facility',
                'reference_number' => $booking->reference_number,
                'item_name' => $booking->facility->name,
                'item_image' => $booking->facility->image,
                'booking_date' => $booking->booking_date,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'total_amount' => $booking->final_amount,
                'status' => $booking->status,
                'created_at' => $booking->created_at,
                'purpose' => $booking->purpose,
                'phone_number' => $booking->phone_number,
                'number_of_guests' => $booking->number_of_guests,
            ];
        });

    // Get activity bookings
    $activityBookings = \App\Models\ActivityBooking::with('activity')
        ->where('user_id', auth()->id())
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($booking) {
            return [
                'id' => $booking->id,
                'type' => 'activity',
                'reference_number' => $booking->reference_number,
                'item_name' => $booking->activity->name,
                'item_image' => $booking->activity->image,
                'booking_date' => $booking->booking_date,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
                'total_amount' => $booking->total_amount,
                'status' => $booking->status,
                'created_at' => $booking->created_at,
                'phone_number' => $booking->phone_number,
                'number_of_participants' => $booking->number_of_participants,
            ];
        });

    // Combine and sort by created_at
    $allBookings = $facilityBookings->concat($activityBookings)
        ->sortByDesc('created_at')
        ->values();

    return Inertia::render('MyBookings', [
        'bookings' => $allBookings
    ]);
})->middleware(['auth', 'verified'])->name('my-bookings');

// Language Switcher
Route::post('/language', [LanguageController::class, 'switch'])->name('language.switch');

// Equipment API
Route::get('/api/equipment', [EquipmentController::class, 'index'])->name('equipment.index');
Route::get('/api/equipment/{category}', [EquipmentController::class, 'getByCategory'])->name('equipment.by-category');

// User Booking Actions (Cancel and Modify)
Route::post('/bookings/{id}/cancel', [BookingActionController::class, 'cancel'])
    ->middleware(['auth', 'verified'])
    ->name('bookings.cancel');

Route::post('/bookings/{id}/request-modification', [BookingActionController::class, 'requestModification'])
    ->middleware(['auth', 'verified'])
    ->name('bookings.request-modification');

Route::get('/report-issue', function () {
    return Inertia::render('ReportIssue');
})->middleware(['auth', 'verified'])->name('report-issue');

Route::get('/feedback', function () {
    return Inertia::render('Feedback');
})->middleware(['auth', 'verified'])->name('feedback');

Route::get('/feedback/{id}', function ($id) {
    return Inertia::render('FeedbackForm', [
        'booking' => [
            'id' => $id,
            'facility' => 'Beach Area',
            'date' => '2023-12-15',
            'ref' => 'ODEC-1234'
        ]
    ]);
})->middleware(['auth', 'verified'])->name('feedback.form');

Route::get('/feedback/general', function () {
    return Inertia::render('FeedbackForm', [
        'booking' => null
    ]);
})->middleware(['auth', 'verified'])->name('feedback.general');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);

    // Facility Management
    Route::resource('facilities', AdminFacilityController::class)->except(['create', 'edit', 'show']);
    Route::post('facilities/{facility}', [AdminFacilityController::class, 'update'])->name('facilities.update.post');

    // Activity Management
    Route::resource('activities', ActivityController::class)->except(['create', 'edit', 'show']);
    Route::post('activities/{activity}', [ActivityController::class, 'update'])->name('activities.update.post');

    // Booking Management
    Route::resource('bookings', BookingController::class)->except(['create', 'edit']);
    Route::patch('bookings/{booking}/verify-payment', [BookingController::class, 'verifyPayment'])->name('bookings.verify-payment');

    // Staff Management
    Route::resource('staff', StaffController::class)->except(['create', 'edit', 'show']);

    // Maintenance Management
    Route::resource('maintenance', MaintenanceController::class)->except(['create', 'edit', 'show']);

    // Issue Reports Management
    Route::resource('issues', IssueController::class)->except(['create', 'edit']);
    Route::patch('issues/{issue}/resolve', [IssueController::class, 'resolve'])->name('issues.resolve');

    // Feedback Management
    Route::resource('feedback', FeedbackController::class)->only(['index', 'show', 'destroy']);

    // Announcement Management
    Route::resource('announcements', AnnouncementController::class)->except(['create', 'edit', 'show']);
    Route::post('announcements/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update.post');
    Route::patch('announcements/{announcement}/toggle', [AnnouncementController::class, 'toggleStatus'])->name('announcements.toggle');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports');

    // Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('settings/qr-code', [SettingsController::class, 'updateQrCode'])->name('settings.qr-code');
});

require __DIR__.'/auth.php';
