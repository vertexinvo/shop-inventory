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


        return $next($request);
    }
}
