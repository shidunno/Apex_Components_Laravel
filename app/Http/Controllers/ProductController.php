<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products for the catalog.
     */
    public function index()
    {
        return Inertia::render('User/Catalog', [
            'products' => Product::all()
        ]);
    }
}