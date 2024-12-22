<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'site_name' => 'Inventory',
            'site_title' => 'Inventory',
            'site_language' => 'en',
            'site_currency' => 'PKR',
            'site_currency_symbol' => 'Rs.',
            'site_currency_position' => 'Pakistani rupee',
            'site_maintenance' => 0,
        ]);
    }
}
