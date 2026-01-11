<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            // Use Cloudinary for production, public disk for local
            $disk = env('APP_ENV') === 'production' ? 'cloudinary' : 'public';
            \Log::info('AnnouncementController Store - APP_ENV: ' . env('APP_ENV') . ', Using disk: ' . $disk);
            $photoPath = Storage::disk($disk)->putFile('announcements', $request->file('photo'));
            \Log::info('AnnouncementController Store - Photo path: ' . $photoPath);
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
            $disk = env('APP_ENV') === 'production' ? 'cloudinary' : 'public';
            // Delete old photo if exists and is not a URL
            if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
                Storage::disk($disk)->delete($announcement->photo_path);
            }
            $photoPath = Storage::disk($disk)->putFile('announcements', $request->file('photo'));
            $updateData['photo_path'] = $photoPath;
        } elseif (!empty($validated['photo_url'])) {
            $disk = env('APP_ENV') === 'production' ? 'cloudinary' : 'public';
            // Delete old photo if exists and is not a URL
            if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
                Storage::disk($disk)->delete($announcement->photo_path);
            }
            $updateData['photo_path'] = $validated['photo_url'];
        }

        $announcement->update($updateData);

        return redirect()->back()->with('success', 'Announcement updated successfully');
    }

    public function destroy(Announcement $announcement)
    {
        $disk = env('APP_ENV') === 'production' ? 'cloudinary' : 'public';
        // Delete photo if exists and is not a URL
        if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
            Storage::disk($disk)->delete($announcement->photo_path);
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
