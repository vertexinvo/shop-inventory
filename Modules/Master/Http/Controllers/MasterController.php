<?php

namespace Modules\Master\Http\Controllers;

use App\Models\QrLoginSession;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Modules\Master\Entities\Applogin;

class MasterController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    public function index()
    {
        return view('master::index');
    }

    //loginViaQr
    public function loginViaQr(Request $request)
    {
      
       $validator = Validator::make($request->all(), [
           'token' => 'required|string',
           'device_id' => 'nullable|string|max:255',
           'device_type' => 'required|string|max:255',
           'device_name' => 'required|string|max:255',
           'device_os' => 'required|string|max:255',
           'device_os_version' => 'required|string|max:255',
           'device_model' => 'required|string|max:255',
           'device_uid' => 'required|string|max:255',
            'ip_address' => 'required|string|max:255',
       ]);



       if ($validator->fails()) {
           return response()->json(['error' => $validator->errors()], 401);
       }
       ////check expired_at
       $applogin = Applogin::where('token', $request->token)->first();
       if (!$applogin) {
           return response()->json(['error' => 'Token Not Found'], 401);
       }

       if ($applogin->expired_at < now()) {
           return response()->json(['error' => 'Token Expired'], 401);
       }

       //check status already active
         if ($applogin->status == 'active') {
              return response()->json(['error' => 'Token Already Active'], 401);
         }

         //check ip_address not same
            // if ($applogin->ip_address != $request->ip_address) {
            //     return response()->json(['error' => 'IP Address Not Same'], 401);
            // }

            //check applogin->tanant->status
            if ($applogin->tenant->status == 'inactive') {
                return response()->json(['error' => 'System Inactive'], 401);
            }

            //check applogin->tanant->mobileapp_access
            if ($applogin->tenant->mobileapp_access == false) {
                return response()->json(['error' => 'Mobile App Access Inactive'], 401);
            }


         $applogin = \Modules\Master\Entities\Applogin::where('token', $request->token)->first();
        $applogin->status = 'active';
        $applogin->device_id = $request->device_id;
        $applogin->device_type = $request->device_type;
        $applogin->device_name = $request->device_name;
        $applogin->device_os = $request->device_os;
        $applogin->device_os_version = $request->device_os_version;
        $applogin->device_model = $request->device_model;
        $applogin->device_uid = $request->device_uid;
        $applogin->save();

         if ($applogin) {
             return response()->json([
                 'token' => $applogin->token,
                 'user' => $applogin->tenant->user,
                 'domain' => $applogin->tenant->domain,
             ]);
         }
    }

    //logout
    public function logout(Request $request)
    {
        $applogin = \Modules\Master\Entities\Applogin::where('token', $request->token)->first();
        if ($applogin) {
            $applogin->status = 'logout';
            $applogin->save();
            return response()->json(['message' => 'Logout Success']);
        }
        return response()->json(['error' => 'Token Not Found'], 401);
    }

    /**
     * Show the form for creating a new resource.
     * @return Renderable
     */
    public function create()
    {
        return view('master::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Renderable
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show($id)
    {
        return view('master::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function edit($id)
    {
        return view('master::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Renderable
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Renderable
     */
    public function destroy($id)
    {
        //
    }
}
