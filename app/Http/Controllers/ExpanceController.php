<?php

namespace App\Http\Controllers;

use App\Models\Expance;
use App\Http\Requests\StoreExpanceRequest;
use App\Http\Requests\UpdateExpanceRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class ExpanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Expance::class);
        $startdate = $request->startdate ?? '';
        $enddate = $request->enddate ??'';
  
        $expences = Expance::with('user');
        if($startdate && $enddate){
         $expences = $expences->whereBetween('datetime', [$startdate, $enddate]);
        }
        $expences = $expences->orderBy('datetime', 'desc')->paginate(20);

            // Today's totals
        $today = now()->format('Y-m-d');
        $todayTotal = Expance::whereDate('datetime', $today)->sum('amount');
        $todayPending = Expance::whereDate('datetime', $today)->sum('pending_amount');

        // This month's totals
        $thisMonth = now()->format('Y-m');
        $monthTotal = Expance::whereYear('datetime', now()->year)
            ->whereMonth('datetime', now()->month)
            ->sum('amount');
        $monthPending = Expance::whereYear('datetime', now()->year)
            ->whereMonth('datetime', now()->month)
            ->sum('pending_amount');

        // This year's totals
        $yearTotal = Expance::whereYear('datetime', now()->year)->sum('amount');
        $yearPending = Expance::whereYear('datetime', now()->year)->sum('pending_amount');



        return Inertia::render('Expence/List', compact('expences', 'startdate', 'enddate', 'todayTotal', 'todayPending', 'monthTotal', 'monthPending', 'yearTotal', 'yearPending'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {    
        $this->authorize('create', Expance::class);
        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->get();
        return Inertia::render('Expence/Add', compact('users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpanceRequest $request)
    {
        $this->authorize('create', Expance::class);
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:rent,utilities,salary,miscellaneous',  // Type options for dropdown
            'datetime' => 'nullable|date',
            'description' => 'nullable|string|max:255',
            'amount' => 'nullable|numeric',
            'status' => 'required|in:paid,unpaid',  // Allowed values for status
            'pending_amount' => 'nullable|numeric',
            'uid' => 'nullable|exists:users,id',  // Ensure the user exists
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->all();
        $expance = Expance::create($data);
        $expance->save();
        session()->flash('message', 'Expense created successfully');
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Expance $expance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $expance = Expance::find($id);
        $this->authorize('update', $expance);
        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->get();
        return Inertia::render('Expence/Add', compact('expance', 'users'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpanceRequest $request, $id)
    {
        $expance = Expance::find($id);
        if(!$expance){
            return abort(404);
        }
        $this->authorize('update', $expance);
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:rent,utilities,salary,miscellaneous',  // Type options for dropdown
            'datetime' => 'nullable|date',
            'description' => 'nullable|string|max:255',
            'amount' => 'nullable|numeric',
            'status' => 'required|in:paid,unpaid',  // Allowed values for status
            'pending_amount' => 'nullable|numeric',
            'uid' => 'nullable|exists:users,id',  // Ensure the user exists
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
    
        $expance->update($request->all());
        session()->flash('message', 'Expense updated successfully');
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $expance = Expance::find($id);
        $this->authorize('delete', $expance);
        $expance->delete();
        session()->flash('message', 'Expense deleted successfully');
        return back();
    }

    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', Expance::class);
        $ids = explode(',', $request->ids);
        Expance::whereIn('id', $ids)->delete();
        session()->flash('message', 'Expense deleted successfully');
        return back();
    }
}
