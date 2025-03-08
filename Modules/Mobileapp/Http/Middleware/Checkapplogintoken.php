<?php

namespace Modules\Mobileapp\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Master\Entities\Applogin;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Modules\Master\Entities\Tenancy;

class CheckAppLoginToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');
        
        if ($token == null) {
            return response()->json(['error' => 'Token not found'], 401);
        }

        $applogin = Applogin::where('token', $token)->where('status', 'active')->first();
        if (!$applogin) {
            return response()->json(['error' => 'Invalid token or token expired'], 401);
        }

        $domainurl = $request->getScheme() . '://' . $request->getHttpHost();

        // $tenants = Tenancy::all();

        Config::set('app.url', $domainurl);

        $tenant = Tenancy::where('domain',  $domainurl)->first();

        // Set up dynamic database connection
        $newDbConfig = [
            'driver'    => 'mysql',
            'host'      => $tenant->db_host,
            'database'  => $tenant->db_name,
            'username'  => $tenant->db_user,
            'password'  => $tenant->db_password,
            
        ];

        Config::set('database.connections.default', $newDbConfig);
        DB::purge('default'); // Clear any existing connections
        DB::setDefaultConnection('default'); // Switch to new database connection
        DB::reconnect('mysql'); // Reconnect with new settings


        return $next($request);
    }
}
