<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $customers =  \App\Models\User::factory(20)->create();

    //    assign role to customers
         foreach($customers as $customer){
              $customer->assignRole('customer');
         }
    }
}
