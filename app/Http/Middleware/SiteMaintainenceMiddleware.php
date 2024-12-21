<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SiteMaintainenceMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
      // Check if the user is authenticated and a super admin
        if (auth()->check() && auth()->user()->hasRole('superadmin')) {
            return $next($request); // Skip maintenance mode for super admins
        }
        if (auth()->check() ) {
            $setting = Setting::first();
            if ($setting && $setting->site_maintenance == 1) {
                auth()->logout();
                return response()->view('maintenance', ["message"=>$setting->site_maintenance_message], 503);
            }
        }
      

        return $next($request);
    }
}
