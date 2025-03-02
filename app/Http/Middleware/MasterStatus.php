<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Master\Entities\Tenancy;
use Symfony\Component\HttpFoundation\Response;

class MasterStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
       
        $domainurl = $request->getScheme() . '://' . $request->getHttpHost();
       
        $tenant = Tenancy::where('domain',  $domainurl)->first();
        if($tenant == null){
            return  abort(403, 'Domain not found. Please contact your administrator.');
        }
     
        if ($tenant->status == 'inactive') {
            return  abort(403, $tenant->message ?? "Unauthorized action. Please contact your administrator.");
        }
        return $next($request);
    }
}
