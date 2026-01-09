<?php

namespace App\Http\Controllers;

use App\Models\ActivityBooking;
use App\Models\Activity;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
            'payment_method' => 'required|string|in:cash,bank_transfer',
            'payment_receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'equipment' => 'nullable|array',
            'equipment.*.id' => 'required|exists:equipment,id',
            'equipment.*.quantity' => 'required|integer|min:1',
        ], [
            'number_of_participants.max' => 'The number of participants cannot exceed the activity capacity of ' . $activity->capacity . '.',
            'payment_receipt.required' => 'Payment receipt is required. Please upload your deposit or full payment receipt.',
        ]);

        // Calculate total amount
        $totalAmount = $activity->price_per_person * $request->number_of_participants;

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

        $finalAmount = $totalAmount + $equipmentTotal;

        // Generate reference number
        $referenceNumber = 'ACTV-' . strtoupper(Str::random(8));

        // Handle file upload
        $receiptPath = null;
        if ($request->hasFile('payment_receipt')) {
            $file = $request->file('payment_receipt');
            $filename = $referenceNumber . '_' . time() . '.' . $file->getClientOriginalExtension();
            $disk = env('FILESYSTEM_DISK', 'public');
            $receiptPath = $file->storeAs('payment_receipts', $filename, $disk);
        }

        $booking = DB::transaction(function () use ($request, $referenceNumber, $finalAmount, $receiptPath) {
            $booking = ActivityBooking::create([
                'user_id' => auth()->id(),
                'activity_id' => $request->activity_id,
                'reference_number' => $referenceNumber,
                'booking_date' => $request->booking_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'number_of_participants' => $request->number_of_participants,
                'phone_number' => $request->phone_number,
                'total_amount' => $finalAmount,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'payment_receipt' => $receiptPath,
            ]);

            // Attach equipment to booking
            if ($request->has('equipment') && is_array($request->equipment)) {
                foreach ($request->equipment as $item) {
                    $equipment = Equipment::find($item['id']);
                    if ($equipment) {
                        DB::table('booking_equipment')->insert([
                            'booking_type' => 'activity',
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
