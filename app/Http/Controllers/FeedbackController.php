<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\FacilityBooking;
use App\Models\ActivityBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Submit feedback/review for a booking.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|integer',
            'booking_type' => 'required|string|in:facility,activity',
            'booking_reference' => 'required|string',
            'overall_rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'aspects' => 'nullable|array',
            'would_recommend' => 'required|boolean',
        ]);

        // Create feedback record
        Feedback::create([
            'user_id' => auth()->id(),
            'booking_reference' => $validated['booking_reference'],
            'feedback_type' => $validated['booking_type'], // 'facility' or 'activity'
            'overall_rating' => $validated['overall_rating'],
            'comment' => $validated['comment'],
            'would_recommend' => $validated['would_recommend'],
            'status' => 'pending', // Admin can review before publishing
        ]);

        return redirect()->route('my-bookings')->with('success', 'Thank you for your review! Your feedback has been submitted.');
    }

    /**
     * View a submitted review for a booking.
     */
    public function viewReview(string $type, string $id)
    {
        // Find booking based on type
        if ($type === 'facility') {
            $booking = FacilityBooking::with('facility')->find($id);
            $itemName = $booking?->facility->name;
        } else {
            $booking = ActivityBooking::with('activity')->find($id);
            $itemName = $booking?->activity->name;
        }

        if (!$booking) {
            return redirect()->route('my-bookings')->with('error', 'Booking not found.');
        }

        // Verify the booking belongs to the authenticated user
        if ($booking->user_id !== auth()->id()) {
            return redirect()->route('my-bookings')->with('error', 'Unauthorized action.');
        }

        // Find the review for this booking
        $review = Feedback::where('user_id', auth()->id())
            ->where('booking_reference', $booking->reference_number)
            ->first();

        if (!$review) {
            return redirect()->route('my-bookings')->with('error', 'Review not found.');
        }

        // Prepare booking data for the view
        $bookingData = [
            'id' => $booking->id,
            'type' => $type,
            'facility' => $itemName,
            'date' => $booking->booking_date,
            'ref' => $booking->reference_number,
        ];

        return Inertia::render('ViewReview', [
            'review' => $review,
            'booking' => $bookingData
        ]);
    }
}
