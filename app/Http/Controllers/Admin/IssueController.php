<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Issue;
use App\Models\Facility;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $issues = Issue::with(['user', 'facility', 'assignedStaff'])
            ->orderBy('reported_date', 'desc')
            ->get();

        $facilities = Facility::all();
        $staff = Staff::where('status', 'active')->get();
        $users = User::all();

        return Inertia::render('Admin/Issues', [
            'issues' => $issues,
            'facilities' => $facilities,
            'staff' => $staff,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'facility_id' => 'nullable|exists:facilities,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:maintenance,cleanliness,equipment,safety,other',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:open,in-progress,resolved,closed',
            'assigned_to' => 'nullable|exists:staff,id',
            'reported_date' => 'required|date',
            'resolved_date' => 'nullable|date',
            'admin_notes' => 'nullable|string',
            'resolution_details' => 'nullable|string',
        ]);

        Issue::create($validated);

        return redirect()->back()->with('success', 'Issue created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $issue = Issue::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'facility_id' => 'nullable|exists:facilities,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:maintenance,cleanliness,equipment,safety,other',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:open,in-progress,resolved,closed',
            'assigned_to' => 'nullable|exists:staff,id',
            'reported_date' => 'required|date',
            'resolved_date' => 'nullable|date',
            'admin_notes' => 'nullable|string',
            'resolution_details' => 'nullable|string',
        ]);

        $issue->update($validated);

        return redirect()->back()->with('success', 'Issue updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $issue = Issue::findOrFail($id);
        $issue->delete();

        return redirect()->back()->with('success', 'Issue deleted successfully.');
    }
}
