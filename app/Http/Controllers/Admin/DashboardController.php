<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Facility;
use App\Models\FacilityBooking;
use App\Models\ActivityBooking;
use Illuminate\Http\Request;
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

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'activeBookings' => $activeBookings,
                'totalFacilities' => $totalFacilities,
                'monthlyRevenue' => $monthlyRevenue,
            ],
            'recentActivity' => $recentActivity,
        ]);
    }
}
