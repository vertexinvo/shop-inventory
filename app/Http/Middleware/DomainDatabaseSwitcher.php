<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class DomainDatabaseSwitcher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
       
        $domain = $request->getHttpHost();// Get the domain name
 
        // Map domains to their respective database configurations
        $domainToDatabase = [
            'localhost:8000' => [
                'database' => env('DB_SHOPA_DATABASE'),
                'username' => env('DB_SHOPA_USERNAME'),
                'password' => env('DB_SHOPA_PASSWORD'),
            ],
            'localhost:8001' => [
                'database' => env('DB_SHOPB_DATABASE'),
                'username' => env('DB_SHOPB_USERNAME'),
                'password' => env('DB_SHOPB_PASSWORD'),
            ],
        ];
   
        if (array_key_exists($domain, $domainToDatabase)) {
        
            Config::set('database.connections.mysql.database', $domainToDatabase[$domain]['database']);
            Config::set('database.connections.mysql.username', $domainToDatabase[$domain]['username']);
            Config::set('database.connections.mysql.password', $domainToDatabase[$domain]['password']);
        
            DB::purge('mysql');
            DB::reconnect('mysql');

        }
        return $next($request);
    }
}
