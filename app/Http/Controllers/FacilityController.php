<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $query = Facility::query();

        // Filter by status if provided
        if ($request->has('filter') && $request->filter !== 'all') {
            $query->where('status', $request->filter);
        }

        // Search functionality
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        }

        $facilities = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Facilities', [
            'facilities' => $facilities,
        ]);
    }

    public function show($id)
    {
        $facility = Facility::findOrFail($id);

        return Inertia::render('FacilityDetails', [
            'facility' => $facility,
        ]);
    }
}
