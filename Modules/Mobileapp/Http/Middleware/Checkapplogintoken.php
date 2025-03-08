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

        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 401);
        }

        
        Config::set('database.connections.mysql.database',$tenant->db_name);
        Config::set('database.connections.mysql.username', $tenant->db_user);
        Config::set('database.connections.mysql.password', $tenant->db_password);
        Config::set('database.connections.mysql.host', $tenant->db_host);
    
        DB::purge('mysql');
        DB::reconnect('mysql');



        return $next($request);
    }
}
