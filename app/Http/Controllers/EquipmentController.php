<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::where('is_available', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->groupBy('category');

        return response()->json($equipment);
    }

    public function getByCategory($category)
    {
        $equipment = Equipment::where('category', $category)
            ->where('is_available', true)
            ->orderBy('name')
            ->get();

        return response()->json($equipment);
    }
}
