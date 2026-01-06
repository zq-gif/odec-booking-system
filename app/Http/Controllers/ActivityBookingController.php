<?php

namespace App\Http\Controllers;

use App\Models\ActivityBooking;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ActivityBookingController extends Controller
{
    public function store(Request $request)
    {
        // Get activity first for capacity validation
        $activity = Activity::findOrFail($request->activity_id);

        $validated = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'number_of_participants' => [
                'required',
                'integer',
                'min:1',
                'max:' . $activity->capacity
            ],
            'phone_number' => 'nullable|string',
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
            'payment_receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ], [
            'number_of_participants.max' => 'The number of participants cannot exceed the activity capacity of ' . $activity->capacity . '.',
        ]);

        // Calculate total amount
        $totalAmount = $activity->price_per_person * $request->number_of_participants;

        // Generate reference number
        $referenceNumber = 'ACTV-' . strtoupper(Str::random(8));

        // Handle file upload
        $receiptPath = null;
        if ($request->hasFile('payment_receipt')) {
            $file = $request->file('payment_receipt');
            $filename = $referenceNumber . '_' . time() . '.' . $file->getClientOriginalExtension();
            $receiptPath = $file->storeAs('payment_receipts', $filename, 'public');
        }

        $booking = ActivityBooking::create([
            'user_id' => auth()->id(),
            'activity_id' => $request->activity_id,
            'reference_number' => $referenceNumber,
            'booking_date' => $request->booking_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'number_of_participants' => $request->number_of_participants,
            'phone_number' => $request->phone_number,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'payment_receipt' => $receiptPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Activity booked successfully!',
            'reference_number' => $referenceNumber,
            'booking' => $booking,
        ]);
    }

    public function getBookedSlots(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'date' => 'required|date',
        ]);

        $bookedSlots = ActivityBooking::where('activity_id', $request->activity_id)
            ->where('booking_date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->select('start_time', 'end_time')
            ->get()
            ->map(function ($booking) {
                return [
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                ];
            });

        return response()->json($bookedSlots);
    }

    public function index()
    {
        $bookings = ActivityBooking::with('activity')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }
}
