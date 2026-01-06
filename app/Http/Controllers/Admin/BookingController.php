<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FacilityBooking;
use App\Models\ActivityBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of all bookings (facility and activity).
     */
    public function index()
    {
        $facilityBookings = FacilityBooking::with(['user', 'facility'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'type' => 'facility',
                    'reference_number' => $booking->reference_number,
                    'user_name' => $booking->user->name,
                    'user_email' => $booking->user->email,
                    'item_name' => $booking->facility->name,
                    'booking_date' => $booking->booking_date,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'number_of_guests' => $booking->number_of_guests,
                    'total_amount' => $booking->total_amount,
                    'status' => $booking->status,
                    'payment_method' => $booking->payment_method,
                    'payment_receipt' => $booking->payment_receipt,
                    'payment_verified' => $booking->payment_verified,
                    'payment_verified_at' => $booking->payment_verified_at,
                    'payment_verification_notes' => $booking->payment_verification_notes,
                    'special_requests' => $booking->special_requests,
                    'created_at' => $booking->created_at,
                ];
            });

        $activityBookings = ActivityBooking::with(['user', 'activity'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'type' => 'activity',
                    'reference_number' => $booking->reference_number,
                    'user_name' => $booking->user->name,
                    'user_email' => $booking->user->email,
                    'item_name' => $booking->activity->name,
                    'booking_date' => $booking->booking_date,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'number_of_participants' => $booking->number_of_participants,
                    'total_amount' => $booking->total_amount,
                    'status' => $booking->status,
                    'payment_method' => $booking->payment_method,
                    'payment_receipt' => $booking->payment_receipt,
                    'payment_verified' => $booking->payment_verified,
                    'payment_verified_at' => $booking->payment_verified_at,
                    'payment_verification_notes' => $booking->payment_verification_notes,
                    'special_requests' => $booking->special_requests,
                    'created_at' => $booking->created_at,
                ];
            });

        $allBookings = $facilityBookings->concat($activityBookings)->sortByDesc('created_at')->values();

        return Inertia::render('Admin/Bookings', [
            'bookings' => $allBookings,
        ]);
    }

    /**
     * Update booking status (confirm/cancel).
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'type' => 'required|in:facility,activity',
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        if ($request->type === 'facility') {
            $booking = FacilityBooking::findOrFail($id);
        } else {
            $booking = ActivityBooking::findOrFail($id);
        }

        $booking->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Booking status updated successfully.');
    }

    /**
     * Verify payment for a booking.
     */
    public function verifyPayment(Request $request, string $id)
    {
        $request->validate([
            'type' => 'required|in:facility,activity',
            'verified' => 'required|boolean',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($request->type === 'facility') {
            $booking = FacilityBooking::findOrFail($id);
        } else {
            $booking = ActivityBooking::findOrFail($id);
        }

        // Update payment verification status
        $booking->update([
            'payment_verified' => $request->verified,
            'payment_verified_at' => $request->verified ? now() : null,
            'payment_verified_by' => $request->verified ? auth()->id() : null,
            'payment_verification_notes' => $request->notes,
        ]);

        // If payment is verified and booking is pending, auto-confirm it
        if ($request->verified && $booking->status === 'pending') {
            $booking->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);
        }

        $message = $request->verified ? 'Payment verified successfully.' : 'Payment verification removed.';
        return redirect()->back()->with('success', $message);
    }

    /**
     * Delete a booking.
     */
    public function destroy(Request $request, string $id)
    {
        $type = $request->query('type', 'facility');

        if ($type === 'facility') {
            $booking = FacilityBooking::findOrFail($id);
        } else {
            $booking = ActivityBooking::findOrFail($id);
        }

        $booking->delete();

        return redirect()->back()->with('success', 'Booking deleted successfully.');
    }
}
