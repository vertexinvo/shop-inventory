<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
//Role
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::whereNotIn('name', ['superadmin'])->latest()->paginate(10);
        // $roles = Role::whereNotIn('name', ['user'])->pluck('name')->toArray();
        return Inertia::render('Role/List',compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Role/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name',
            'guard_name' => 'required',
         ]);

        if ($validator->fails()) {
            return session()->flash('error', $validator->errors()->first());
        }
        $role = Role::create($request->all());

        return session()->flash('message', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        
        $role = Role::findOrFail($id);

        $permissions = $role->permissions->pluck('name')->toArray();

        $permissionsList = Permission::pluck('name')->toArray();

        return Inertia::render('Role/View', compact('role', 'permissions','permissionsList'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        
        $role = Role::findOrFail($id);  
        return Inertia::render('Role/Edit',compact('role'));
    }

    public function updatePermission(Request $request, $id)
    {
       $permissions = $request->all();

       $role = Role::find($id)->syncPermissions($permissions);

       return session()->flash('message', 'Permissions updated successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name,'.$id,
            'guard_name' => 'required',
         ]);

        if ($validator->fails()) {
            return session()->flash('error', $validator->errors()->first());
        }
        $role = Role::find($id)->update($request->all());

        return session()->flash('message', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::find($id)->delete();
    }
}
