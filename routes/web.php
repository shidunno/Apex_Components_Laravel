<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Public Routes (Anyone can access)
Route::get('/', function () {
    return Inertia::render('Login');
});

// 2. Authenticated Routes (Requires an active session / being logged in)
Route::middleware(['auth'])->group(function () {

    // General User Dashboard (resources/js/Pages/User/Dashboard.jsx)
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboard');

    // Admin-Only Routes (resources/js/Pages/Admin/...)
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/AdminDashboard'); // <-- Updated to AdminDashboard
        })->name('admin.dashboard');
    });

});