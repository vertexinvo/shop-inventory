<?php

namespace App\Http\Controllers;

use App\Facades\UserService;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Validator;


class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);
        $users = UserService::getAllUser($request, 'customer');

        $totalcustomers = $users->count();
        $totalactivecus = $users->where('status', '1')->count();
        $totalinactivecus = $users->where('status', '0')->count();
        // dd($totalactivecus);
        return Inertia::render('Customer/List', compact('users', 'totalcustomers', 'totalactivecus', 'totalinactivecus'));
    }

    public function csvExport(Request $request)
    {
            $customers = UserService::getAllUser($request, 'customer');
            $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=customers.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        $columns = [
            'name',
            'email',
            'status',
            'phone',
            'address',
        ];
        $callback = function() use ($customers, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($customers as $customer) {
                fputcsv($file, [
                    $customer->name,
                    $customer->email,
                    $customer->status,
                    $customer->phone,
                    $customer->address
                ]);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        return Inertia::render('Customer/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'nullable|email|unique:users',
            'phone' => 'nullable|regex:/^\+?[0-9\s\-]{8,15}$/',
            'address' => 'nullable|string|max:1000',

          
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }

        $data = $request->all();
        $user = User::create($data);
        $user->assignRole('customer');
        session()->flash('message', 'Customer created successfully');
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
    
        $user = User::find($id); 
        $this->authorize('update', $user);
        return Inertia::render('Customer/Edit',compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
      
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,'.$id,
            'phone' => 'nullable|regex:/^\+?[0-9\s\-]{8,15}$/',
            'address' => 'nullable|string|max:1000',
            
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->all();
        $user = User::find($id);
        $this->authorize('update', $user);
        $user->update($data);
        session()->flash('message', 'Customer updated successfully');
        return back();
    
    }

    public function status(Request $request, string $id)
    {
        
        $user = User::find($id);
        $this->authorize('update', $user);
        $user->status = !$user->status;
        $user->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
       $user = User::find($id);
        $this->authorize('delete', $user);
        $user->delete();
        session()->flash('message', 'Customer deleted successfully');
        return back();
    }

    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', User::class);
        $ids = explode(',', $request->ids);
        User::whereIn('id', $ids)->delete();
        session()->flash('message', 'Customer deleted successfully');
        return back();
    }
}
