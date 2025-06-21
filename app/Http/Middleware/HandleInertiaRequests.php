<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Services\BreadcrumbService;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Config;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';
    protected Setting $setting;
    protected BreadcrumbService $breadcrumbService;
    /**
     * Determine the current asset version.
     */

    public function __construct(BreadcrumbService $breadcrumbService)
    {
        $this->breadcrumbService = $breadcrumbService;
    }
    public function version(Request $request): string|null
    {


        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request)
    {
        $this->setting = Setting::first() ?? null;

        $message = Session::get('message');
        $error = Session::get('error');

        Session::forget(['message', 'error']);

        if ($this->setting && $this->setting->site_name) {
            Config::set('app.name', $this->setting->site_name);
        }
        if ($this->setting && $this->setting->site_logo) {
            Config::set('app.favicon', $this->setting->site_favicon);
        }




        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name')->toArray() : [],
            ],
            'flash' => [
                'message' => $message,
                'error' => $error,
            ],
            'setting' => $this->setting,
            'breadcrumbs' => $this->breadcrumbService->generateBreadcrumbs(),
            'name' => Config::get('app.name'),
        ];
    }
}
