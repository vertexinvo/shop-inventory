<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Spatie\DbDumper\Databases\MySql;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Setting');
    }

    public function edit()
    {
        $setting = Setting::first();
        $currencies = json_decode(file_get_contents(public_path('currencies.json')), true);
        return Inertia::render('Site/SiteSetting', compact('setting', 'currencies'));
    }

    public function update(Request $request)
    {
        $data = $request->except('site_favicon', 'site_logo');
        Setting::updateOrCreate(['id' => 1], $data);

        // Handle site_favicon file upload
        if ($request->hasFile('site_favicon')) {

            $oldFavicon = Setting::first()->site_favicon;

            // Check if the old file exists and delete it
            if ($oldFavicon) {
                // Extract the file path relative to the storage folder
                $relativePath = str_replace(url('storage/'), '', $oldFavicon);
        
                // Delete the old file if it exists in the storage
                if (\Storage::disk('public')->exists($relativePath)) {
                    \Storage::disk('public')->delete($relativePath);
                }
            }

            $file = $request->file('site_favicon');
            $filename = md5(uniqid() . $file->getClientOriginalName()) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('site_favicon', $filename, 'public');
            $data['site_favicon'] = url('storage/' . $path);
        }

        // Handle site_logo file upload
        if ($request->hasFile('site_logo')) {

            $oldLogo = Setting::first()->site_logo;

            // Check if the old file exists and delete it
            if ($oldLogo) {
                // Extract the file path relative to the storage folder
                $relativePath = str_replace(url('storage/'), '', $oldLogo);
        
                // Delete the old file if it exists in the storage
                if (\Storage::disk('public')->exists($relativePath)) {
                    \Storage::disk('public')->delete($relativePath);
                }
            }

            $file = $request->file('site_logo');
            $filename = md5(uniqid() . $file->getClientOriginalName()) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('site_logo', $filename, 'public');
            $data['site_logo'] = url('storage/' . $path);
        }
        Setting::updateOrCreate(['id' => 1], $data);

        session()->flash('message', 'Setting updated successfully');
        return back();
    } 

    
    public function exportDatabase()
    {
        $databaseName = config('database.connections.mysql.database');
        $userName = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');
    
        // Define the file name and path
        $fileName = 'database_backup.sql';
        $filePath = storage_path($fileName);
    
        // Dump the database to the specified file
        MySql::create()
            ->setDbName($databaseName)
            ->setUserName($userName)
            ->setPassword($password)
            ->setHost($host)
            ->dumpToFile($filePath);
    
        // Return the file as a download
        return response()->download($filePath)->deleteFileAfterSend(true);
    }
    

}
