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

        $domainurl = $request->getScheme() . '://' . $request->getHttpHost();

        Config::set('app.url', $domainurl);
 
        // Map domains to their respective database configurations
        $domainToDatabase = [
            'localhost:8000' => [
                'database' => env('DB_SHOPA_DATABASE'),
                'username' => env('DB_SHOPA_USERNAME'),
                'password' => env('DB_SHOPA_PASSWORD'),
                'host' => env('DB_SHOPA_HOST'),
            ],
            'celltech.vertexinvo.io' => [
                'database' => env('DB_CELLTECH_DATABASE'),
                'username' => env('DB_CELLTECH_USERNAME'),
                'password' => env('DB_CELLTECH_PASSWORD'),
                'host' => env('DB_CELLTECH_HOST'),
            ],
            'inventorysystem.vertexinvo.io' => [
                'database' => env('DB_VERTEXINVO_DATABASE'),
                'username' => env('DB_VERTEXINVO_USERNAME'),
                'password' => env('DB_VERTEXINVO_PASSWORD'),
                'host' => env('DB_VERTEXINVO_HOST'),
            ],
            'solinvo.vertexinvo.io' => [
                'database' => env('DB_SOLINVO_DATABASE'),
                'username' => env('DB_SOLINVO_USERNAME'),
                'password' => env('DB_SOLINVO_PASSWORD'),
                'host' => env('DB_SOLINVO_HOST'),
            ],
        ];
   
        if (array_key_exists($domain, $domainToDatabase)) {
        
            Config::set('database.connections.mysql.database', $domainToDatabase[$domain]['database']);
            Config::set('database.connections.mysql.username', $domainToDatabase[$domain]['username']);
            Config::set('database.connections.mysql.password', $domainToDatabase[$domain]['password']);
            Config::set('database.connections.mysql.host', $domainToDatabase[$domain]['host']);
        
            DB::purge('mysql');
            DB::reconnect('mysql');

            if($domain === 'inventorysystem.vertexinvo.io'){
                abort(500)->with('message', 'Currently this domain is not allowed');
            }

        }
        return $next($request);
    }
}