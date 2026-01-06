<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
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
            'image' => 'nullable|string|max:1000',
            'amenities' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:available,maintenance,unavailable',
        ]);

        Facility::create([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'price_per_hour' => $request->price_per_hour,
            'image' => $request->image,
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
            'image' => 'nullable|string|max:1000',
            'amenities' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:available,maintenance,unavailable',
        ]);

        $facility->update([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'price_per_hour' => $request->price_per_hour,
            'image' => $request->image,
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
