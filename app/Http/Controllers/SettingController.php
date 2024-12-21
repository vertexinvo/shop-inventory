<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Setting');
    }

    public function edit()
    {
        $setting = Setting::first();
        return Inertia::render('Site/SiteSetting', compact('setting'));
    }

    public function update(Request $request)
    {
        $data = $request->all();
        Setting::updateOrCreate(['id' => 1], $data);
        session()->flash('message', 'Setting updated successfully');
        return back();
    }   
}
