<?php

namespace App\Services;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Request;

class BreadcrumbService
{
    // Define custom display names for specific segments
    protected array $customTitles = [
        'order' => 'Sales',
        'user' => 'Users',
        'product' => 'Inventory',
    ];

    public function generateBreadcrumbs(): array
    {
        $breadcrumbs = [];
        $segments = Request::segments();
        $accumulatedPath = '';
        $routes = Route::getRoutes();

        foreach ($segments as $index => $segment) {
            $accumulatedPath .= '/' . $segment;

            // Attempt to find a matching named route
            $matchedRoute = collect($routes)->first(function ($route) use ($accumulatedPath) {
                return $route->uri === ltrim($accumulatedPath, '/');
            });

            // Apply custom title if available
            $title = $this->customTitles[$segment] ?? ucfirst(str_replace(['-', '_'], ' ', $segment));

            $breadcrumbs[] = [
                'title' => $title,
                'url' => $matchedRoute && $matchedRoute->getName()
                    ? route($matchedRoute->getName(), request()->route()->parameters())
                    : url($accumulatedPath),
            ];
        }

        return $breadcrumbs;
    }
}
