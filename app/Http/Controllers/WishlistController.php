<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Product;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        try {
            $favorites = Favorite::where('user_id', $request->user()->id)->with('product')->get();
            
            $items = $favorites->map(function($fav) {
                return $fav->product;
            })->filter();

            return response()->json($items->values());
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $productId = $request->input('id');

        Favorite::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $productId
        ]);

        $product = Product::find($productId);

        return response()->json($product);
    }

    public function destroy(Request $request, $product_id)
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $product_id)
            ->delete();

        return response()->json(['success' => true]);
    }
}