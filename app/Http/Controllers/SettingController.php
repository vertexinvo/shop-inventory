<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Spatie\Backup\Config\Config;
use Spatie\Backup\Tasks\Backup\BackupJobFactory;

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
    try {
        // Trigger a database backup using the configuration array
        $backupJob = BackupJobFactory::createFromConfig(new Config(config('backup')));
        $backupJob->run();

        // Get the latest backup file path
        $disk = Storage::disk(config('backup.destination.disks')[0]);
        $files = $disk->files('Laravel');
        $latestFile = collect($files)->last();

        if ($latestFile) {
            // Serve the backup file as a download
            return response()->download($disk->path($latestFile));
        }

        return response()->json(['error' => 'No backup file found'], 500);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}
