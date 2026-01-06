<?php

namespace App\Http\Controllers;

use App\Models\FacilityBooking;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FacilityBookingController extends Controller
{
    public function store(Request $request)
    {
        // Get facility first for capacity validation
        $facility = Facility::findOrFail($request->facility_id);

        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required',
            'end_time' => 'required',
            'duration_hours' => 'required|integer|min:1',
            'number_of_guests' => [
                'required',
                'integer',
                'min:1',
                'max:' . $facility->capacity
            ],
            'purpose' => 'required|string',
            'phone_number' => 'nullable|string',
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
            'payment_receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ], [
            'number_of_guests.max' => 'The number of guests cannot exceed the facility capacity of ' . $facility->capacity . '.',
        ]);

        // Generate unique reference number
        $referenceNumber = 'FB-' . strtoupper(Str::random(8));

        // Calculate amounts
        $pricePerHour = $facility->price_per_hour;
        $totalAmount = $pricePerHour * $validated['duration_hours'];
        $discount = 0;
        $finalAmount = $totalAmount - $discount;

        // Handle file upload
        $receiptPath = null;
        if ($request->hasFile('payment_receipt')) {
            $file = $request->file('payment_receipt');
            $filename = $referenceNumber . '_' . time() . '.' . $file->getClientOriginalExtension();
            $receiptPath = $file->storeAs('payment_receipts', $filename, 'public');
        }

        // Create booking
        $booking = FacilityBooking::create([
            'user_id' => auth()->id(),
            'facility_id' => $validated['facility_id'],
            'reference_number' => $referenceNumber,
            'booking_date' => $validated['booking_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration_hours' => $validated['duration_hours'],
            'number_of_guests' => $validated['number_of_guests'],
            'number_of_attendees' => $validated['number_of_guests'],
            'phone_number' => $validated['phone_number'] ?? null,
            'price_per_hour' => $pricePerHour,
            'total_amount' => $totalAmount,
            'discount' => $discount,
            'final_amount' => $finalAmount,
            'purpose' => $validated['purpose'],
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_method' => $request->payment_method,
            'payment_receipt' => $receiptPath,
        ]);

        // Return JSON response for AJAX/Inertia requests
        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking' => $booking->load('facility'),
            'reference_number' => $referenceNumber,
        ]);
    }

    public function index()
    {
        $bookings = FacilityBooking::with('facility')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function getBookedSlots(Request $request)
    {
        $request->validate([
            'facility_id' => 'required|exists:facilities,id',
            'date' => 'required|date',
        ]);

        $bookedSlots = FacilityBooking::where('facility_id', $request->facility_id)
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
}
