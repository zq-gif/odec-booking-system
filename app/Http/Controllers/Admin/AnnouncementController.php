<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with('creator')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Announcements', [
            'announcements' => $announcements
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:12288',
            'photo_url' => 'nullable|url',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('announcements', 'public');
            $photoPath = '/storage/' . $photoPath;
        } elseif (!empty($validated['photo_url'])) {
            $photoPath = $validated['photo_url'];
        }

        Announcement::create([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'photo_path' => $photoPath,
            'is_active' => $validated['is_active'] ?? true,
            'expires_at' => $validated['expires_at'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Announcement created successfully');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:12288',
            'photo_url' => 'nullable|url',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'message' => $validated['message'],
            'is_active' => $validated['is_active'] ?? $announcement->is_active,
            'expires_at' => $validated['expires_at'] ?? $announcement->expires_at,
        ];

        if ($request->hasFile('photo')) {
            // Delete old photo if exists and is not a URL
            if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
                $oldPath = str_replace('/storage/', '', $announcement->photo_path);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $photoPath = $request->file('photo')->store('announcements', 'public');
            $updateData['photo_path'] = '/storage/' . $photoPath;
        } elseif (!empty($validated['photo_url'])) {
            // Delete old photo if exists and is not a URL
            if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
                $oldPath = str_replace('/storage/', '', $announcement->photo_path);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $updateData['photo_path'] = $validated['photo_url'];
        }

        $announcement->update($updateData);

        return redirect()->back()->with('success', 'Announcement updated successfully');
    }

    public function destroy(Announcement $announcement)
    {
        // Delete photo if exists and is not a URL
        if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
            $oldPath = str_replace('/storage/', '', $announcement->photo_path);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }

        $announcement->delete();

        return redirect()->back()->with('success', 'Announcement deleted successfully');
    }

    public function toggleStatus(Announcement $announcement)
    {
        $announcement->update([
            'is_active' => !$announcement->is_active
        ]);

        return redirect()->back()->with('success', 'Announcement status updated');
    }
}
