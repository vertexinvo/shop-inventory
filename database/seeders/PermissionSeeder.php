<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permssions = [];
        //get all models
        $models = app('files')->allFiles(app_path('Models'));
        foreach ($models as $model) {
            $permssions[] = ['name' => 'viewAny '.$model->getBasename('.php'), 'guard_name' => 'web'];
            $permssions[] = ['name' => 'view '.$model->getBasename('.php'), 'guard_name' => 'web'];
            $permssions[] = ['name' => 'create '.$model->getBasename('.php'), 'guard_name' => 'web'];
            $permssions[] = ['name' => 'update '.$model->getBasename('.php'), 'guard_name' => 'web'];
            $permssions[] = ['name' => 'delete '.$model->getBasename('.php'), 'guard_name' => 'web'];
        }

        foreach ($permssions as $permssion) {
            Permission::firstOrCreate($permssion);
        }

        //assign permissions to roles superadmin
        $role = Role::where('name', 'superadmin')->first();
        $role->givePermissionTo(Permission::all());
    }
}
