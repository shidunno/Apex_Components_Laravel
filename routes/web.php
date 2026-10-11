<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use App\Models\User;
use App\Http\Controllers\ProductController;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SupportController;
use App\Models\Order;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Guest Routes (Only accessible if NOT logged in)
Route::middleware(['guest', 'nocache'])->group(function () {

    // Show Login Page (GET)
    Route::get('/', function () {
        return Inertia::render('Login');
    })->name('login');

    // Handle Login Submission (POST)
    Route::post('/', function (Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Rotate the history key so old pages (like Login) can't be restored via back
            Inertia::clearHistory();

            $user = Auth::user();
            if ($user->role === 'admin') {
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    });

    // Registration Routes
    Route::get('/register', function () {
        return Inertia::render('User/Register');
    })->name('register');

    Route::post('/register', function (Request $request) {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        Inertia::clearHistory();

        return redirect(route('dashboard'));
    });
});

// 2. Authenticated Routes (Requires an active session)
Route::middleware(['auth', 'nocache'])->group(function () {

    // General User Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboard');

    // Products / Catalog (Connected to ProductController)
    Route::get('/catalog', [ProductController::class, 'index'])->name('catalog');

    Route::get('/cart', [App\Http\Controllers\CartController::class, 'index']);
    Route::post('/cart', [App\Http\Controllers\CartController::class, 'store']);

    // Wishlist Page
    Route::get('/wishlist', function () {
        return Inertia::render('User/Wishlist');
    })->name('wishlist');

    Route::get('/wishlist-items', [WishlistController::class, 'index']);
    Route::post('/wishlist-items', [WishlistController::class, 'store']);
    Route::delete('/wishlist-items/{product_id}', [WishlistController::class, 'destroy']);

    // PC Builder
    Route::get('/builder', function () {
        $products = \App\Models\Product::all()->map(function ($product) {
            // Automatically map database categories to lowercase tab keys
            $cat = strtolower(trim($product->category ?? ''));
            if (str_contains($cat, 'processor') || str_contains($cat, 'cpu')) $normalizedCat = 'cpu';
            elseif (str_contains($cat, 'board')) $normalizedCat = 'motherboard';
            elseif (str_contains($cat, 'graphics') || str_contains($cat, 'gpu') || str_contains($cat, 'card')) $normalizedCat = 'gpu';
            elseif (str_contains($cat, 'memory') || str_contains($cat, 'ram')) $normalizedCat = 'ram';
            elseif (str_contains($cat, 'cool') || str_contains($cat, 'fan') || str_contains($cat, 'aio')) $normalizedCat = 'cooling';
            elseif (str_contains($cat, 'case') || str_contains($cat, 'chassis')) $normalizedCat = 'case';
            else $normalizedCat = $cat;

            $product->builder_category = $normalizedCat;
            return $product;
        });

        return Inertia::render('User/Builder', [
            'products' => $products,
            'auth' => [
                'user' => Auth::user(),
            ]
        ]);
    })->name('builder');

    // Order Page
    Route::get('/order', function () {
        return Inertia::render('User/Order');
    })->name('order');

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Checkout Route Added Here
    Route::get('/checkout', function () {
        return Inertia::render('User/Checkout', [
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    })->name('checkout');

    // Support / Contact
    Route::get('/support', function () {
        return Inertia::render('User/Contactsupport');
    })->name('support');

    Route::get('/support/tickets', [SupportController::class, 'index']);
    Route::post('/support/tickets', [SupportController::class, 'store']);

    // User Profile
    Route::get('/profile', function () {
        return Inertia::render('User/Profile', [
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    })->name('profile');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/address', [ProfileController::class, 'updateAddress'])->name('profile.address.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    // Logout Route
    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Make previously visited private pages unreadable from history
        Inertia::clearHistory();

        return redirect('/');
    })->name('logout');

    // Admin-Only Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/AdminDashboard', [
                'orders' => Order::all()
            ]);
        })->name('admin.dashboard');

        Route::get('/orders', function () {
            return Inertia::render('Admin/Adminorders', [
                'orders' => Order::all()
            ]);
        })->name('admin.orders');

        Route::patch('/orders/{order}/status', function (Request $request, Order $order) {
            $order->update([
                'status' => $request->input('status')
            ]);

            return response()->json(['success' => true]);
        })->name('admin.orders.status');

        Route::get('/products', function () {
            return Inertia::render('Admin/AdminProducts', [
                'products' => \App\Models\Product::all(),
                'ordersCount' => Order::count(),
            ]);
        })->name('admin.products');

        Route::post('/products', function (Request $request) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'image' => 'nullable|string',
            ]);

            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . uniqid();

            \App\Models\Product::create($validated);

            return redirect()->back();
        });

        Route::put('/products/{product}', function (Request $request, \App\Models\Product $product) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'image' => 'nullable|string',
            ]);

            $product->update($validated);

            return redirect()->back();
        });

        Route::delete('/products/{product}', function (\App\Models\Product $product) {
            $product->delete();

            return response()->json(['success' => true]);
        });

        Route::get('/support', function () {
            $tickets = \App\Models\SupportTicket::with('user:id,name,email')
                ->latest()
                ->get()
                ->map(fn ($ticket) => [
                    'id'         => $ticket->id,
                    'subject'    => $ticket->subject,
                    'message'    => $ticket->message,
                    'status'     => $ticket->status,
                    'created_at' => $ticket->created_at,
                    'email'      => $ticket->user?->email,
                    'name'       => $ticket->user?->name,
                ]);

            return Inertia::render('Admin/AdminSupport', [
                'tickets' => $tickets,
                'ordersCount' => Order::count(),
            ]);
        })->name('admin.support');

        Route::patch('/support/tickets/{ticket}/status', function (Request $request, \App\Models\SupportTicket $ticket) {
            $ticket->update(['status' => $request->input('status')]);
            return response()->json(['success' => true]);
        });

        Route::delete('/support/tickets', function () {
            \App\Models\SupportTicket::truncate();
            return response()->json(['success' => true]);
        });
    });

});