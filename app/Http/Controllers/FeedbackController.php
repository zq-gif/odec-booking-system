<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

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
}
