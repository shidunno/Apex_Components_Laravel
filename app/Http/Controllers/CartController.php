<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['items' => []]
        );

        return response()->json($cart->items ?? []);
    }

    public function store(Request $request)
    {
        $cart = Cart::updateOrCreate(
            ['user_id' => $request->user()->id],
            ['items' => $request->input('items', [])]
        );

        return response()->json(['success' => true, 'items' => $cart->items]);
    }
}