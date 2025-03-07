<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Modules\Master\Entities\Tenancy;

class DomainDatabaseSwitcher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
      
     
        $domainurl = $request->getScheme() . '://' . $request->getHttpHost();

        // $tenants = Tenancy::all();

        Config::set('app.url', $domainurl);
 
        // Map domains to their respective database configurations
       // $domainToDatabase = [
            
            // 'localhost:8000' => [
            //     'database' => env('DB_SHOPA_DATABASE'),
            //     'username' => env('DB_SHOPA_USERNAME'),
            //     'password' => env('DB_SHOPA_PASSWORD'),
            //     'host' => env('DB_SHOPA_HOST'),
            // ],
            // 'celltech.vertexinvo.io' => [
            //     'database' => env('DB_CELLTECH_DATABASE'),
            //     'username' => env('DB_CELLTECH_USERNAME'),
            //     'password' => env('DB_CELLTECH_PASSWORD'),
            //     'host' => env('DB_CELLTECH_HOST'),
            // ],
            // 'inventorysystem.vertexinvo.io' => [
            //     'database' => env('DB_VERTEXINVO_DATABASE'),
            //     'username' => env('DB_VERTEXINVO_USERNAME'),
            //     'password' => env('DB_VERTEXINVO_PASSWORD'),
            //     'host' => env('DB_VERTEXINVO_HOST'),
            // ],
            // 'iqracompb1.vertexinvo.io' => [
            //     'database' => env('DB_IQRACOMPB1_DATABASE'),
            //     'username' => env('DB_IQRACOMPB1_USERNAME'),
            //     'password' => env('DB_IQRACOMPB1_PASSWORD'),
            //     'host' => env('DB_IQRACOMPB1_HOST'),
            // ]
       // ];

       $tenant = Tenancy::where('domain',  $domainurl)->first();

    //    $domainToDatabase = []; // Ensure the array is initialized

    //    foreach ($tenants as $tenant) {
    //        $domain = parse_url($tenant->domain, PHP_URL_HOST);
    //        $port = parse_url($tenant->domain, PHP_URL_PORT);
       
    //        // Combine domain and port if the port exists
    //        $domainWithPort = $port ? "{$domain}:{$port}" : $domain;
    //         dd($domainWithPort);
    //        $record[$domainWithPort] = [
    //            'database' => $tenant->db_name,
    //            'username' => $tenant->db_user,
    //            'password' => $tenant->db_password,
    //            'host' => $tenant->db_host,
    //        ];

    //        $domainToDatabase = array_merge($domainToDatabase, $record);
    //    }

       
   
        // if (array_key_exists($domain, $domainToDatabase)) {
        
            Config::set('database.connections.mysql.database',$tenant->db_name);
            Config::set('database.connections.mysql.username', $tenant->db_user);
            Config::set('database.connections.mysql.password', $tenant->db_password);
            Config::set('database.connections.mysql.host', $tenant->db_host);
        
            DB::purge('mysql');
            DB::reconnect('mysql');

            // if($domain === 'inventorysystem.vertexinvo.io'){
            //     abort(500)->with('message', 'Currently this domain is not allowed');
            // }

        // }
        return $next($request);
    }
}