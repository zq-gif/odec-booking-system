<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
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
            $path = $file->storeAs('qr_codes', $filename, 'public');

            // Update setting
            Setting::set('payment_qr_code', $path);

            return back()->with('success', 'Payment QR code updated successfully!');
        }

        return back()->with('error', 'Failed to upload QR code.');
    }
}
