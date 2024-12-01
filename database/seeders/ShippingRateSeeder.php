<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\ShippingRate;
class ShippingRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonFile = public_path('shipping_rates.json');
        
        // Read and decode JSON file
        if (File::exists($jsonFile)) {
            $jsonData = File::get($jsonFile);
            $data = json_decode($jsonData, true);
            
            // Check if the data is valid
            if (is_array($data)) {
                // Insert data into the database
                ShippingRate::insert($data);
            } else {
                $this->command->error('JSON data is not valid.');
            }
        } else {
            $this->command->error('JSON file not found at ' . $jsonFile);
        }
    }
}
