<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        // Include the folder path 'User/' so Inertia can find the file
        return Inertia::render('User/Order', [
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_price' => 'required|numeric',
            'shipping_address' => 'required|string',
            'items' => 'required|array',
        ]);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'status' => 'Processing',
            'total_price' => $validated['total_price'],
            'shipping_address' => $validated['shipping_address'],
            'items' => $validated['items'],
        ]);

        return response()->json(['success' => true, 'order' => $order]);
    }
}