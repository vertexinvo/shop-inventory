<?php

namespace App\Http\Controllers;
 
use App\Facades\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{ 
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users =  UserService::getAllUser($request, null, ['superadmin', 'customer']);

        $totalusers = $users->count();
        $totalactiveusers = $users->where('status', '1')->count();
        $totalinactiveusers = $users->where('status', '0')->count();
        return Inertia::render('User/List' , compact('users', 'totalusers', 'totalactiveusers', 'totalinactiveusers'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::where('name', '!=', 'superadmin')->get();
        return Inertia::render('User/Add', compact('roles'));
        
    }
  
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'role' => 'required|string|exists:roles,name',
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
        session()->flash('message', 'User created successfully');
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
        $user = User::with('roles')->find($id); 
        $roles = Role::where('name', '!=', 'superadmin')->get();  
        return Inertia::render('User/Edit',compact('user', 'roles'));
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$id,
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->except(['role']);
        $user = User::find($id);
        $user->update($data);
        $user->syncRoles($request->role);
        session()->flash('message', 'User updated successfully');
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
        $user = User::with('roles')->whereDoesntHave('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->find($id);
        $user->delete();
        session()->flash('message', 'User deleted successfully');
        return back();
    }

    //bulkdestroy
    public function bulkdestroy(Request $request)
    {
        $ids = explode(',', $request->ids);
        User::whereIn('id', $ids)->with('roles') ->whereDoesntHave('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->delete();
        session()->flash('message', 'User deleted successfully');
        return back();
    }
}
