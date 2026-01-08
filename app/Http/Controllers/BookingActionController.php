<?php

namespace App\Http\Controllers;

use App\Models\FacilityBooking;
use App\Models\ActivityBooking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingActionController extends Controller
{
    /**
     * Cancel a booking by the user.
     */
    public function cancel(Request $request, string $id)
    {
        $request->validate([
            'type' => 'required|in:facility,activity',
            'reason' => 'required|string|max:500',
        ]);

        if ($request->type === 'facility') {
            $booking = FacilityBooking::findOrFail($id);
        } else {
            $booking = ActivityBooking::findOrFail($id);
        }

        // Verify the booking belongs to the authenticated user
        if ($booking->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        // Check if booking can be cancelled (only confirmed bookings)
        if ($booking->status !== 'confirmed') {
            return redirect()->back()->with('error', 'Only confirmed bookings can be cancelled.');
        }

        // Check if booking is at least 24 hours away
        $bookingDateTime = Carbon::parse($booking->booking_date . ' ' . ($booking->start_time ?? '00:00:00'));
        $hoursUntilBooking = now()->diffInHours($bookingDateTime, false);

        if ($hoursUntilBooking < 24) {
            return redirect()->back()->with('error', 'Bookings can only be cancelled at least 24 hours in advance.');
        }

        // Update booking status to cancelled
        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->reason,
        ]);

        return redirect()->back()->with('success', 'Booking cancelled successfully. You will receive a refund within 5-7 business days.');
    }

    /**
     * Request modification for a booking.
     */
    public function requestModification(Request $request, string $id)
    {
        $request->validate([
            'type' => 'required|in:facility,activity',
            'modification_details' => 'required|string|max:1000',
            'new_date' => 'nullable|date|after:today',
            'new_start_time' => 'nullable|date_format:H:i',
            'new_end_time' => 'nullable|date_format:H:i|after:new_start_time',
        ]);

        if ($request->type === 'facility') {
            $booking = FacilityBooking::findOrFail($id);
        } else {
            $booking = ActivityBooking::findOrFail($id);
        }

        // Verify the booking belongs to the authenticated user
        if ($booking->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        // Check if booking can be modified (only confirmed bookings)
        if ($booking->status !== 'confirmed') {
            return redirect()->back()->with('error', 'Only confirmed bookings can be modified.');
        }

        // Check if booking is at least 48 hours away
        $bookingDateTime = Carbon::parse($booking->booking_date . ' ' . ($booking->start_time ?? '00:00:00'));
        $hoursUntilBooking = now()->diffInHours($bookingDateTime, false);

        if ($hoursUntilBooking < 48) {
            return redirect()->back()->with('error', 'Modification requests must be submitted at least 48 hours in advance.');
        }

        // Store modification request in special_requests field (you could create a separate table for this)
        $modificationRequest = [
            'type' => 'modification_request',
            'requested_at' => now()->toDateTimeString(),
            'details' => $request->modification_details,
            'new_date' => $request->new_date,
            'new_start_time' => $request->new_start_time,
            'new_end_time' => $request->new_end_time,
            'status' => 'pending',
        ];

        $booking->update([
            'special_requests' => json_encode($modificationRequest),
        ]);

        return redirect()->back()->with('success', 'Modification request submitted successfully. Our team will review and contact you shortly.');
    }
}
