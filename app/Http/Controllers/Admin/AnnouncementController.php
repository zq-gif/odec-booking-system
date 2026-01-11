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
            // Temporarily hardcode cloudinary to test
            $disk = 'cloudinary';
            \Log::info('AnnouncementController Store - APP_ENV: ' . env('APP_ENV'));
            \Log::info('AnnouncementController Store - CLOUDINARY_URL exists: ' . (env('CLOUDINARY_URL') ? 'YES' : 'NO'));

            // Check if CLOUDINARY_URL is properly formatted
            $cloudinaryUrl = env('CLOUDINARY_URL');
            if ($cloudinaryUrl) {
                \Log::info('AnnouncementController Store - CLOUDINARY_URL starts with: ' . substr($cloudinaryUrl, 0, 15));
            }

            \Log::info('AnnouncementController Store - Using disk: ' . $disk);

            // Validate that Cloudinary disk config exists
            $diskConfig = config('filesystems.disks.cloudinary');
            \Log::info('AnnouncementController Store - Disk config URL: ' . ($diskConfig['url'] ?? 'NULL'));

            try {
                // Try to get the disk instance
                $storage = Storage::disk($disk);
                \Log::info('AnnouncementController Store - Disk instance created successfully');

                // Attempt the upload
                $photoPath = $storage->putFile('announcements', $request->file('photo'));
                \Log::info('AnnouncementController Store - Upload successful - Photo path: ' . $photoPath);

                // Verify the path looks like a Cloudinary URL
                if (!str_starts_with($photoPath, 'http')) {
                    \Log::error('AnnouncementController Store - WARNING: Photo path does not start with http: ' . $photoPath);
                }
            } catch (\Exception $e) {
                \Log::error('AnnouncementController Store - Error: ' . $e->getMessage());
                \Log::error('AnnouncementController Store - Error trace: ' . $e->getTraceAsString());

                // Fall back to public disk on error
                \Log::info('AnnouncementController Store - Falling back to public disk');
                $photoPath = Storage::disk('public')->putFile('announcements', $request->file('photo'));
                \Log::info('AnnouncementController Store - Fallback upload path: ' . $photoPath);
            }
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
