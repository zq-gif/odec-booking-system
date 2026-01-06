<?php

namespace App\Http\Controllers;

use App\Models\VRTourSpot;

class VRTourController extends Controller
{
    public function index()
    {
        $spots = VRTourSpot::active()->ordered()->get();

        return response()->json($spots);
    }
}
