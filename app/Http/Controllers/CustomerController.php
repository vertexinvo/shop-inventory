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
        $users = UserService::getAllUser($request, 'customer');

        $totalcustomers = $users->count();
        $totalactivecus = $users->where('status', '1')->count();
        $totalinactivecus = $users->where('status', '0')->count();
        // dd($totalactivecus);
        return Inertia::render('Customer/List', compact('users', 'totalcustomers', 'totalactivecus', 'totalinactivecus'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Customer/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'nullable|email|unique:users',
            'phone' => 'nullable',
            'address' => 'nullable',

          
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
        return Inertia::render('Customer/Edit',compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'nullable|email|unique:users,email,'.$id,
            'phone' => 'nullable',
            'address' => 'nullable',
            
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->all();
        $user = User::find($id);
        $user->update($data);
        session()->flash('message', 'Customer updated successfully');
        return back();
    
    }

    public function status(Request $request, string $id)
    {
        $user = User::find($id);
        $user->status = !$user->status;
        $user->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
       $user = User::find($id);
        $user->delete();
        session()->flash('message', 'Customer deleted successfully');
        return back();
    }

    public function bulkdestroy(Request $request)
    {
        $ids = explode(',', $request->ids);
        User::whereIn('id', $ids)->delete();
        session()->flash('message', 'Customer deleted successfully');
        return back();
    }
}
