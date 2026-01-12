<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activities = Activity::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Activities', [
            'activities' => $activities
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price_per_person' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url' => 'nullable|string|max:1000',
            'vr_tour_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'vr_tour_image_url' => 'nullable|string|max:1000',
            'duration' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'difficulty_level' => 'nullable|in:easy,moderate,hard',
            'status' => 'required|in:available,unavailable',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = Storage::disk('public')->putFile('activities', $request->file('image'));
            $imagePath = '/storage/' . $path;
        } elseif ($request->image_url) {
            $imagePath = $request->image_url;
        }

        // Handle VR tour image upload
        $vrTourImagePath = null;
        if ($request->hasFile('vr_tour_image')) {
            $path = Storage::disk('public')->putFile('activities/vr', $request->file('vr_tour_image'));
            $vrTourImagePath = '/storage/' . $path;
        } elseif ($request->vr_tour_image_url) {
            $vrTourImagePath = $request->vr_tour_image_url;
        }

        Activity::create([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'price_per_person' => $request->price_per_person,
            'image' => $imagePath,
            'vr_tour_image' => $vrTourImagePath,
            'duration' => $request->duration,
            'requirements' => $request->requirements,
            'difficulty_level' => $request->difficulty_level,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Activity created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $activity = Activity::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price_per_person' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url' => 'nullable|string|max:1000',
            'vr_tour_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'vr_tour_image_url' => 'nullable|string|max:1000',
            'duration' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'difficulty_level' => 'nullable|in:easy,moderate,hard',
            'status' => 'required|in:available,unavailable',
        ]);

        // Handle image upload
        $imagePath = $activity->image; // Keep existing image by default
        if ($request->hasFile('image')) {
            // Delete old image if exists and is not a URL
            if ($activity->image && !str_starts_with($activity->image, 'http') && str_starts_with($activity->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $activity->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = Storage::disk('public')->putFile('activities', $request->file('image'));
            $imagePath = '/storage/' . $path;
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        // Handle VR tour image upload
        $vrTourImagePath = $activity->vr_tour_image; // Keep existing VR tour image by default
        if ($request->hasFile('vr_tour_image')) {
            // Delete old VR tour image if exists and is not a URL
            if ($activity->vr_tour_image && !str_starts_with($activity->vr_tour_image, 'http') && str_starts_with($activity->vr_tour_image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $activity->vr_tour_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = Storage::disk('public')->putFile('activities/vr', $request->file('vr_tour_image'));
            $vrTourImagePath = '/storage/' . $path;
        } elseif ($request->filled('vr_tour_image_url')) {
            $vrTourImagePath = $request->vr_tour_image_url;
        }

        $activity->update([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'price_per_person' => $request->price_per_person,
            'image' => $imagePath,
            'vr_tour_image' => $vrTourImagePath,
            'duration' => $request->duration,
            'requirements' => $request->requirements,
            'difficulty_level' => $request->difficulty_level,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Activity updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $activity = Activity::findOrFail($id);

        // Check if activity has any bookings
        $bookingsCount = $activity->bookings()->count();

        if ($bookingsCount > 0) {
            return redirect()->back()->with('error', 'Cannot delete activity with existing bookings.');
        }

        $activity->delete();

        return redirect()->back()->with('success', 'Activity deleted successfully.');
    }
}
