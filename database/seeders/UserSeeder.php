<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {  
         //make super admin
         $user = \App\Models\User::firstOrCreate([
            'name' => 'SuperAdmin',
            'email' => 'superadmin@yopmail.com',
            'email_verified_at' => now(),
            'password' => bcrypt('superadmin@yopmail.com'),
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);

        $user->assignRole('superadmin');
    }
}
