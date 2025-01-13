<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class LedgerController extends Controller
{
    public function sales(Request $request)
    {
        return Inertia::render('Ledger/Sales');
    }
}
