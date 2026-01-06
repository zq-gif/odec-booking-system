<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatBotController extends Controller
{
    /**
     * Get chatbot data including activities, facilities, and general info
     */
    public function getData(Request $request): JsonResponse
    {
        try {
            // Fetch all available activities
            $activities = Activity::where('status', 'available')
                ->select('id', 'name', 'description', 'price_per_person', 'duration', 'capacity', 'image', 'difficulty_level')
                ->get()
                ->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'name' => $activity->name,
                        'description' => $activity->description,
                        'price' => number_format($activity->price_per_person, 2),
                        'duration' => $activity->duration ?? 'Varies',
                        'max_participants' => $activity->capacity,
                        'difficulty_level' => $activity->difficulty_level ?? 'All levels',
                        'image' => $activity->image,
                    ];
                });

            // Fetch all available facilities
            $facilities = Facility::where('status', 'available')
                ->select('id', 'name', 'description', 'price_per_hour', 'capacity', 'slot_duration', 'image')
                ->get()
                ->map(function ($facility) {
                    return [
                        'id' => $facility->id,
                        'name' => $facility->name,
                        'description' => $facility->description,
                        'price' => number_format($facility->price_per_hour, 2),
                        'capacity' => $facility->capacity,
                        'slot_duration' => $facility->slot_duration,
                        'image' => $facility->image,
                    ];
                });

            // Get raw facilities and activities for price calculations
            $rawFacilities = Facility::where('status', 'available')->get();
            $rawActivities = Activity::where('status', 'available')->get();

            // Calculate pricing ranges
            $facilityPriceRange = $rawFacilities->isEmpty()
                ? ['min' => '0.00', 'max' => '0.00']
                : [
                    'min' => number_format((float)$rawFacilities->min('price_per_hour'), 2),
                    'max' => number_format((float)$rawFacilities->max('price_per_hour'), 2)
                ];

            $activityPriceRange = $rawActivities->isEmpty()
                ? ['min' => '0.00', 'max' => '0.00']
                : [
                    'min' => number_format((float)$rawActivities->min('price_per_person'), 2),
                    'max' => number_format((float)$rawActivities->max('price_per_person'), 2)
                ];

            return response()->json([
                'success' => true,
                'data' => [
                    'activities' => $activities,
                    'facilities' => $facilities,
                    'stats' => [
                        'total_activities' => $activities->count(),
                        'total_facilities' => $facilities->count(),
                        'facility_price_range' => $facilityPriceRange,
                        'activity_price_range' => $activityPriceRange,
                    ],
                    'general_info' => [
                        'operating_hours' => '8:00 AM - 6:00 PM',
                        'location' => 'UMS ODEC Beach Club, Unnamed Road, 88400 Kota Kinabalu, Sabah, Malaysia',
                        'phone' => '+60 12-345-6789',
                        'email' => 'info@odecbeachclub.com',
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch chatbot data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific activity details
     */
    public function getActivity($id): JsonResponse
    {
        try {
            $activity = Activity::where('id', $id)
                ->where('status', 'available')
                ->first();

            if (!$activity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Activity not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $activity->id,
                    'name' => $activity->name,
                    'description' => $activity->description,
                    'price' => number_format((float)$activity->price_per_person, 2),
                    'duration' => $activity->duration ?? 'Varies',
                    'max_participants' => $activity->capacity,
                    'difficulty_level' => $activity->difficulty_level ?? 'All levels',
                    'image' => $activity->image,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific facility details
     */
    public function getFacility($id): JsonResponse
    {
        try {
            $facility = Facility::where('id', $id)
                ->where('status', 'available')
                ->first();

            if (!$facility) {
                return response()->json([
                    'success' => false,
                    'message' => 'Facility not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $facility->id,
                    'name' => $facility->name,
                    'description' => $facility->description,
                    'price' => number_format((float)$facility->price_per_hour, 2),
                    'capacity' => $facility->capacity,
                    'slot_duration' => $facility->slot_duration,
                    'image' => $facility->image,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch facility',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
