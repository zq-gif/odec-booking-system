<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\FacilityBooking;
use App\Models\ActivityBooking;
use App\Models\Facility;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Get date range from request or default to current month
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        // Overview Stats
        $overviewStats = $this->getOverviewStats($startDate, $endDate);

        // Booking Trends (last 12 months)
        $bookingTrends = $this->getBookingTrends();

        // Revenue Trends (last 12 months)
        $revenueTrends = $this->getRevenueTrends();

        // Popular Facilities
        $popularFacilities = $this->getPopularFacilities($startDate, $endDate);

        // Popular Activities
        $popularActivities = $this->getPopularActivities($startDate, $endDate);

        // Recent Bookings
        $recentBookings = $this->getRecentBookings();

        // User Growth (last 12 months)
        $userGrowth = $this->getUserGrowth();

        return Inertia::render('Admin/Reports', [
            'overviewStats' => $overviewStats,
            'bookingTrends' => $bookingTrends,
            'revenueTrends' => $revenueTrends,
            'popularFacilities' => $popularFacilities,
            'popularActivities' => $popularActivities,
            'recentBookings' => $recentBookings,
            'userGrowth' => $userGrowth,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    private function getOverviewStats($startDate, $endDate)
    {
        $totalUsers = User::count();
        $newUsers = User::whereBetween('created_at', [$startDate, $endDate])->count();

        $facilityBookings = FacilityBooking::whereBetween('booking_date', [$startDate, $endDate])->count();
        $activityBookings = ActivityBooking::whereBetween('booking_date', [$startDate, $endDate])->count();
        $totalBookings = $facilityBookings + $activityBookings;

        $facilityRevenue = FacilityBooking::whereBetween('booking_date', [$startDate, $endDate])
            ->where('status', 'confirmed')
            ->sum('final_amount');

        $activityRevenue = DB::table('activity_bookings')
            ->join('activities', 'activity_bookings.activity_id', '=', 'activities.id')
            ->whereBetween('activity_bookings.booking_date', [$startDate, $endDate])
            ->where('activity_bookings.status', 'confirmed')
            ->sum(DB::raw('activities.price_per_person * activity_bookings.number_of_participants'));

        $totalRevenue = $facilityRevenue + $activityRevenue;

        $facilities = Facility::where('status', 'available')->count();
        $activities = Activity::where('status', 'available')->count();

        return [
            'totalUsers' => $totalUsers,
            'newUsers' => $newUsers,
            'totalBookings' => $totalBookings,
            'facilityBookings' => $facilityBookings,
            'activityBookings' => $activityBookings,
            'totalRevenue' => $totalRevenue,
            'facilityRevenue' => $facilityRevenue,
            'activityRevenue' => $activityRevenue,
            'availableFacilities' => $facilities,
            'availableActivities' => $activities,
        ];
    }

    private function getBookingTrends()
    {
        $months = [];
        $facilityData = [];
        $activityData = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $months[] = $date->format('M Y');

            $facilityCount = FacilityBooking::whereBetween('booking_date', [$monthStart, $monthEnd])->count();
            $activityCount = ActivityBooking::whereBetween('booking_date', [$monthStart, $monthEnd])->count();

            $facilityData[] = $facilityCount;
            $activityData[] = $activityCount;
        }

        return [
            'labels' => $months,
            'datasets' => [
                [
                    'label' => 'Facility Bookings',
                    'data' => $facilityData,
                    'borderColor' => 'rgb(59, 130, 246)',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                ],
                [
                    'label' => 'Activity Bookings',
                    'data' => $activityData,
                    'borderColor' => 'rgb(249, 115, 22)',
                    'backgroundColor' => 'rgba(249, 115, 22, 0.1)',
                ]
            ]
        ];
    }

    private function getRevenueTrends()
    {
        $months = [];
        $facilityRevenue = [];
        $activityRevenue = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $months[] = $date->format('M Y');

            $facilityRev = FacilityBooking::whereBetween('booking_date', [$monthStart, $monthEnd])
                ->where('status', 'confirmed')
                ->sum('final_amount');

            $activityRev = DB::table('activity_bookings')
                ->join('activities', 'activity_bookings.activity_id', '=', 'activities.id')
                ->whereBetween('activity_bookings.booking_date', [$monthStart, $monthEnd])
                ->where('activity_bookings.status', 'confirmed')
                ->sum(DB::raw('activities.price_per_person * activity_bookings.number_of_participants'));

            $facilityRevenue[] = floatval($facilityRev);
            $activityRevenue[] = floatval($activityRev);
        }

        return [
            'labels' => $months,
            'datasets' => [
                [
                    'label' => 'Facility Revenue',
                    'data' => $facilityRevenue,
                    'borderColor' => 'rgb(34, 197, 94)',
                    'backgroundColor' => 'rgba(34, 197, 94, 0.1)',
                ],
                [
                    'label' => 'Activity Revenue',
                    'data' => $activityRevenue,
                    'borderColor' => 'rgb(168, 85, 247)',
                    'backgroundColor' => 'rgba(168, 85, 247, 0.1)',
                ]
            ]
        ];
    }

    private function getPopularFacilities($startDate, $endDate)
    {
        return FacilityBooking::select('facilities.name', DB::raw('count(*) as booking_count'), DB::raw('sum(facility_bookings.final_amount) as revenue'))
            ->join('facilities', 'facility_bookings.facility_id', '=', 'facilities.id')
            ->whereBetween('facility_bookings.booking_date', [$startDate, $endDate])
            ->groupBy('facilities.id', 'facilities.name')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get();
    }

    private function getPopularActivities($startDate, $endDate)
    {
        return ActivityBooking::select(
                'activities.name',
                DB::raw('count(*) as booking_count'),
                DB::raw('sum(activity_bookings.number_of_participants) as total_participants'),
                DB::raw('sum(activities.price_per_person * activity_bookings.number_of_participants) as revenue')
            )
            ->join('activities', 'activity_bookings.activity_id', '=', 'activities.id')
            ->whereBetween('activity_bookings.booking_date', [$startDate, $endDate])
            ->groupBy('activities.id', 'activities.name')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get();
    }

    private function getRecentBookings()
    {
        $facilityBookings = FacilityBooking::with(['user:id,name,email', 'facility:id,name'])
            ->select('id', 'user_id', 'facility_id', 'booking_date', 'final_amount', 'status', 'created_at')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'type' => 'Facility',
                    'item_name' => $booking->facility->name,
                    'user_name' => $booking->user->name,
                    'user_email' => $booking->user->email,
                    'date' => $booking->booking_date,
                    'amount' => $booking->final_amount,
                    'status' => $booking->status,
                    'created_at' => $booking->created_at->diffForHumans(),
                ];
            });

        $activityBookings = ActivityBooking::with(['user:id,name,email', 'activity:id,name,price_per_person'])
            ->select('id', 'user_id', 'activity_id', 'booking_date', 'number_of_participants', 'status', 'created_at')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'type' => 'Activity',
                    'item_name' => $booking->activity->name,
                    'user_name' => $booking->user->name,
                    'user_email' => $booking->user->email,
                    'date' => $booking->booking_date,
                    'amount' => $booking->activity->price_per_person * $booking->number_of_participants,
                    'status' => $booking->status,
                    'created_at' => $booking->created_at->diffForHumans(),
                ];
            });

        return $facilityBookings->concat($activityBookings)
            ->sortByDesc('created_at')
            ->take(10)
            ->values();
    }

    private function getUserGrowth()
    {
        $months = [];
        $userData = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $months[] = $date->format('M Y');

            $userCount = User::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $userData[] = $userCount;
        }

        return [
            'labels' => $months,
            'data' => $userData,
        ];
    }
}
