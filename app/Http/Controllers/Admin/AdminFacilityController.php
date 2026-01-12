<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminFacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $facilities = Facility::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Facilities', [
            'facilities' => $facilities
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
            'price_per_hour' => 'required|numeric|min:0',
            'slot_duration' => 'nullable|integer|min:1|max:24',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:12288',
            'image_url' => 'nullable|string|max:1000',
            'vr_tour_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:12288',
            'vr_tour_image_url' => 'nullable|string|max:1000',
            'amenities' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:available,maintenance,unavailable',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = Storage::disk('public')->putFile('facilities', $request->file('image'));
            $imagePath = '/storage/' . $path;
        } elseif ($request->image_url) {
            $imagePath = $request->image_url;
        }

        // Handle VR tour image upload
        $vrTourImagePath = null;
        if ($request->hasFile('vr_tour_image')) {
            $path = Storage::disk('public')->putFile('facilities/vr', $request->file('vr_tour_image'));
            $vrTourImagePath = '/storage/' . $path;
        } elseif ($request->vr_tour_image_url) {
            $vrTourImagePath = $request->vr_tour_image_url;
        }

        Facility::create([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'price_per_hour' => $request->price_per_hour,
            'slot_duration' => $request->slot_duration,
            'image' => $imagePath,
            'vr_tour_image' => $vrTourImagePath,
            'amenities' => $request->amenities,
            'location' => $request->location,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Facility created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $facility = Facility::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price_per_hour' => 'required|numeric|min:0',
            'slot_duration' => 'nullable|integer|min:1|max:24',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:12288',
            'image_url' => 'nullable|string|max:1000',
            'vr_tour_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:12288',
            'vr_tour_image_url' => 'nullable|string|max:1000',
            'amenities' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:available,maintenance,unavailable',
        ]);

        // Handle image upload
        $imagePath = $facility->image; // Keep existing image by default
        if ($request->hasFile('image')) {
            // Delete old image if exists and is not a URL
            if ($facility->image && !str_starts_with($facility->image, 'http') && str_starts_with($facility->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $facility->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = Storage::disk('public')->putFile('facilities', $request->file('image'));
            $imagePath = '/storage/' . $path;
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        // Handle VR tour image upload
        $vrTourImagePath = $facility->vr_tour_image; // Keep existing VR tour image by default
        if ($request->hasFile('vr_tour_image')) {
            // Delete old VR tour image if exists and is not a URL
            if ($facility->vr_tour_image && !str_starts_with($facility->vr_tour_image, 'http') && str_starts_with($facility->vr_tour_image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $facility->vr_tour_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = Storage::disk('public')->putFile('facilities/vr', $request->file('vr_tour_image'));
            $vrTourImagePath = '/storage/' . $path;
        } elseif ($request->filled('vr_tour_image_url')) {
            $vrTourImagePath = $request->vr_tour_image_url;
        }

        $facility->update([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'price_per_hour' => $request->price_per_hour,
            'slot_duration' => $request->slot_duration,
            'image' => $imagePath,
            'vr_tour_image' => $vrTourImagePath,
            'amenities' => $request->amenities,
            'location' => $request->location,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Facility updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $facility = Facility::findOrFail($id);

        // Check if facility has any bookings
        $bookingsCount = $facility->bookings()->count();

        if ($bookingsCount > 0) {
            return redirect()->back()->with('error', 'Cannot delete facility with existing bookings.');
        }

        $facility->delete();

        return redirect()->back()->with('success', 'Facility deleted successfully.');
    }
}
