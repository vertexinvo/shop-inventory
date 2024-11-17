<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //dont show role superadmin
        $users = User::with('roles') ->whereDoesntHave('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->latest()->paginate(1);
        return Inertia::render('User/List' , compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Add');
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'role' => 'required',
            'password' => 'required|min:8',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->except(['password_confirmation', 'role']);
        $data['password'] = bcrypt($request->password);
        $user = User::create($data);
        $user->assignRole($request->role);
        session()->flash('success', 'User created successfully');
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
        return Inertia::render('User/Edit',compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->except(['role']);
        $user = User::find($id);
        $user->update($data);
        $user->syncRoles($request->role);
        session()->flash('success', 'User updated successfully');
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
        session()->flash('success', 'User deleted successfully');
        return back();
    }
}
