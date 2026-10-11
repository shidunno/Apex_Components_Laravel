<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SupportTicket;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        // Adjust 'User/Contactsupport' to match your actual page file path under resources/js/Pages/
        return Inertia::render('User/Contactsupport');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        SupportTicket::create([
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'Open',
        ]);

        return response()->json(['success' => true]);
    }
}