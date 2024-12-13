<?php

namespace App\Services;

use Eliseekn\LaravelMetrics\Enums\Aggregate;
use Eliseekn\LaravelMetrics\LaravelMetrics;

class Metrics
{
    public static function trends(LaravelMetrics $metrics, string|array $period, array $groupedDataLabels = [], string $column = ''): array
    {
        if (is_array($period)) {
            
            // If the period is a range (array), use countBetween
            return $metrics
                ->countBetween($period, !empty($groupedDataLabels) ? $column : 'order_date')
                ->trends();
        }
   

        // Handle string periods using match
        $metrics = match ($period) {
            'day' => $metrics->countByDay(column: !empty($groupedDataLabels) ? $column : 'order_date'),
            'last_week' => $metrics->countFrom(
                now()->subWeek()->startOfWeek()->format('Y-m-d'),
                !empty($groupedDataLabels) ? $column : 'order_date'
            ),
            'week' => $metrics->countByWeek(column: !empty($groupedDataLabels) ? $column : 'order_date'),
            'quarter_year' => $metrics->countByMonth(count: 4, column: !empty($groupedDataLabels) ? $column : 'order_date'),
            'half_year' => $metrics->countByMonth(count: 6, column: !empty($groupedDataLabels) ? $column : 'order_date'),
            'month' => $metrics->countByMonth(column: !empty($groupedDataLabels) ? $column : 'order_date'),
            'last_month' => $metrics->countFrom(
                now()->subMonth()->startOfMonth()->format('Y-m-d'),
                !empty($groupedDataLabels) ? $column : 'order_date'
            ),
            'year' => $metrics->countByYear(count: 5, column: !empty($groupedDataLabels) ? $column : 'order_date'),
            'last_year' => $metrics->countFrom(
                now()->subYear()->startOfYear()->format('Y-m-d'),
                !empty($groupedDataLabels) ? $column : 'order_date'
            ),
            default => $metrics->countByDay(column: !empty($groupedDataLabels) ? $column : 'order_date'), // Default to 'day'
        };

     
  
        // Return grouped data if labels are provided, otherwise return trends directly
        return !empty($groupedDataLabels)
            ? $metrics->trends()
            : $metrics->trends();
    }
}
