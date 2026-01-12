<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $paymentQrCode = Setting::get('payment_qr_code');

        return Inertia::render('Admin/Settings', [
            'paymentQrCode' => $paymentQrCode,
        ]);
    }

    public function updateQrCode(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        // Handle file upload
        if ($request->hasFile('qr_code')) {
            $file = $request->file('qr_code');
            $filename = 'payment_qr_' . time() . '.' . $file->getClientOriginalExtension();

            // Delete old QR code if exists
            $oldPath = Setting::get('payment_qr_code');
            if ($oldPath && !str_starts_with($oldPath, 'http') && str_starts_with($oldPath, '/storage/')) {
                $pathToDelete = str_replace('/storage/', '', $oldPath);
                Storage::disk('public')->delete($pathToDelete);
            }

            // Upload new QR code
            $path = Storage::disk('public')->putFileAs('qr_codes', $file, $filename);
            $qrCodePath = '/storage/' . $path;

            // Update setting
            Setting::set('payment_qr_code', $qrCodePath);

            return back()->with('success', 'Payment QR code updated successfully!');
        }

        return back()->with('error', 'Failed to upload QR code.');
    }
}
