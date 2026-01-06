<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Facility;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $maintenances = Maintenance::with(['facility', 'assignedStaff'])
            ->orderBy('scheduled_date', 'desc')
            ->get();

        $facilities = Facility::all();
        $staff = Staff::where('status', 'active')->get();

        return Inertia::render('Admin/Maintenance', [
            'maintenances' => $maintenances,
            'facilities' => $facilities,
            'staff' => $staff,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'nullable|exists:facilities,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:routine,repair,upgrade,inspection,cleaning',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:scheduled,in-progress,completed,cancelled',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'nullable',
            'completion_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:staff,id',
            'cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        Maintenance::create($validated);

        return redirect()->back()->with('success', 'Maintenance record created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $maintenance = Maintenance::findOrFail($id);

        $validated = $request->validate([
            'facility_id' => 'nullable|exists:facilities,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:routine,repair,upgrade,inspection,cleaning',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:scheduled,in-progress,completed,cancelled',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'nullable',
            'completion_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:staff,id',
            'cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $maintenance->update($validated);

        return redirect()->back()->with('success', 'Maintenance record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $maintenance = Maintenance::findOrFail($id);
        $maintenance->delete();

        return redirect()->back()->with('success', 'Maintenance record deleted successfully.');
    }
}
