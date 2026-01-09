<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Facility;
use App\Models\Activity;
use App\Models\FacilityBooking;
use App\Models\ActivityBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get real statistics from database
        $totalUsers = User::count();
        $totalFacilities = Facility::count();

        // Active bookings (pending + confirmed)
        $activeFacilityBookings = FacilityBooking::whereIn('status', ['pending', 'confirmed'])->count();
        $activeActivityBookings = ActivityBooking::whereIn('status', ['pending', 'confirmed'])->count();
        $activeBookings = $activeFacilityBookings + $activeActivityBookings;

        // Revenue for this month
        $currentMonth = now()->format('Y-m');
        $facilityRevenue = FacilityBooking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$currentMonth])
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('final_amount');
        $activityRevenue = ActivityBooking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$currentMonth])
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('total_amount');
        $monthlyRevenue = $facilityRevenue + $activityRevenue;

        // Get recent activity (last 10 bookings)
        $recentFacilityBookings = FacilityBooking::with(['user', 'facility'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'user' => $booking->user->name,
                    'action' => 'booked ' . $booking->facility->name,
                    'time' => $booking->created_at->diffForHumans(),
                ];
            });

        $recentActivityBookings = ActivityBooking::with(['user', 'activity'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'user' => $booking->user->name,
                    'action' => 'booked ' . $booking->activity->name . ' activity',
                    'time' => $booking->created_at->diffForHumans(),
                ];
            });

        $recentActivity = $recentFacilityBookings->concat($recentActivityBookings)
            ->sortByDesc('time')
            ->take(10)
            ->values();

        // Revenue trends (last 6 months)
        $revenueData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthKey = $month->format('Y-m');
            $monthLabel = $month->format('M Y');

            $facilityRev = FacilityBooking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$monthKey])
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('final_amount');

            $activityRev = ActivityBooking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$monthKey])
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('total_amount');

            $revenueData->push([
                'month' => $monthLabel,
                'revenue' => $facilityRev + $activityRev,
            ]);
        }

        // Popular facilities (top 5 by booking count)
        $popularFacilities = FacilityBooking::select('facility_id', DB::raw('COUNT(*) as booking_count'))
            ->with('facility:id,name')
            ->whereIn('status', ['confirmed', 'completed'])
            ->groupBy('facility_id')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'name' => $booking->facility->name,
                    'bookings' => $booking->booking_count,
                ];
            });

        // Booking volume by month (last 6 months)
        $bookingVolumeData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthKey = $month->format('Y-m');
            $monthLabel = $month->format('M Y');

            $facilityCount = FacilityBooking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$monthKey])
                ->count();

            $activityCount = ActivityBooking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$monthKey])
                ->count();

            $bookingVolumeData->push([
                'month' => $monthLabel,
                'facilities' => $facilityCount,
                'activities' => $activityCount,
                'total' => $facilityCount + $activityCount,
            ]);
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'activeBookings' => $activeBookings,
                'totalFacilities' => $totalFacilities,
                'monthlyRevenue' => $monthlyRevenue,
            ],
            'recentActivity' => $recentActivity,
            'charts' => [
                'revenueData' => $revenueData,
                'popularFacilities' => $popularFacilities,
                'bookingVolumeData' => $bookingVolumeData,
            ],
        ]);
    }
}
