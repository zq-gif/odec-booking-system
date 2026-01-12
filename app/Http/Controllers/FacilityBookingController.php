<?php

namespace App\Http\Controllers;

use App\Models\FacilityBooking;
use App\Models\Facility;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            'payment_method' => 'required|string|in:cash,bank_transfer',
            'payment_receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'equipment' => 'nullable|array',
            'equipment.*.id' => 'required|exists:equipment,id',
            'equipment.*.quantity' => 'required|integer|min:1',
        ], [
            'number_of_guests.max' => 'The number of guests cannot exceed the facility capacity of ' . $facility->capacity . '.',
            'payment_receipt.required' => 'Payment receipt is required. Please upload your deposit or full payment receipt.',
        ]);

        // Generate unique reference number
        $referenceNumber = 'FB-' . strtoupper(Str::random(8));

        // Calculate amounts
        $pricePerHour = $facility->price_per_hour;
        $totalAmount = $pricePerHour * $validated['duration_hours'];

        // Calculate equipment cost
        $equipmentTotal = 0;
        if ($request->has('equipment') && is_array($request->equipment)) {
            foreach ($request->equipment as $item) {
                $equipment = Equipment::find($item['id']);
                if ($equipment) {
                    $equipmentTotal += $equipment->price_per_unit * $item['quantity'];
                }
            }
        }

        $discount = 0;
        $finalAmount = $totalAmount + $equipmentTotal - $discount;

        // Handle file upload
        $receiptPath = null;
        if ($request->hasFile('payment_receipt')) {
            $file = $request->file('payment_receipt');
            $filename = $referenceNumber . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = Storage::disk('public')->putFileAs('payment_receipts', $file, $filename);
            $receiptPath = $path;
        }

        // Create booking
        $booking = DB::transaction(function () use ($validated, $referenceNumber, $pricePerHour, $totalAmount, $discount, $finalAmount, $receiptPath, $request) {
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

            // Attach equipment to booking
            if ($request->has('equipment') && is_array($request->equipment)) {
                foreach ($request->equipment as $item) {
                    $equipment = Equipment::find($item['id']);
                    if ($equipment) {
                        DB::table('booking_equipment')->insert([
                            'booking_type' => 'facility',
                            'booking_id' => $booking->id,
                            'equipment_id' => $equipment->id,
                            'quantity' => $item['quantity'],
                            'price' => $equipment->price_per_unit * $item['quantity'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            return $booking;
        });

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
