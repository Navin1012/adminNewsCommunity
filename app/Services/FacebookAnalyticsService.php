<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class FacebookAnalyticsService
{
    public function getPageAnalytics($page, int $days): array
    {
        $cacheKey = "fb_analytics_{$page->page_id}_{$days}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($page, $days) {

            $since = Carbon::now()->subDays($days)->startOfDay();
            $until = Carbon::now()->endOfDay();

            $token  = $page->access_token;
            $pageId = $page->page_id;

            $followers = $this->getFollowers($pageId, $token);

            [$chartLabels, $reachSeries, $totalReach] =
                $this->getPageViews($pageId, $token, $since, $until);

            [$engagement, $engagementTrend] =
                $this->getEngagement($pageId, $token, $since, $until);

            $avgEngagement = $days > 0 ? round($engagement / $days, 1) : 0;
            $highestEngagement = !empty($engagementTrend)
                ? max(array_column($engagementTrend, 'value'))
                : 0;

            $engagementSplit = [
                'reactions' => (int) round($engagement * 0.6),
                'comments'  => (int) round($engagement * 0.25),
                'shares'    => max(0, $engagement - (int) round($engagement * 0.85)),
            ];

            return compact(
                'followers',
                'totalReach',
                'chartLabels',
                'reachSeries',
                'engagement',
                'avgEngagement',
                'highestEngagement',
                'engagementSplit',
                'engagementTrend'
            );
        });
    }

    

    private function getFollowers(string $pageId, string $token): int
    {
        $res = Http::get("https://graph.facebook.com/v24.0/{$pageId}", [
            'fields' => 'followers_count',
            'access_token' => $token,
        ])->json();

        return (int) ($res['followers_count'] ?? 0);
    }

    private function getPageViews($pageId, $token, $since, $until): array
    {
        $res = Http::get("https://graph.facebook.com/v24.0/{$pageId}/insights", [
            'metric' => 'page_views_total',
            'period' => 'day',
            'since'  => $since->toDateString(),
            'until'  => $until->toDateString(),
            'access_token' => $token,
        ])->json();

        $labels = [];
        $series = [];
        $total  = 0;

        foreach ($res['data'][0]['values'] ?? [] as $row) {
            $labels[] = Carbon::parse($row['end_time'])->format('d M');
            $val = (int) ($row['value'] ?? 0);
            $series[] = $val;
            $total += $val;
        }

        return [$labels, $series, $total];
    }

    private function getEngagement($pageId, $token, $since, $until): array
    {
        $res = Http::get("https://graph.facebook.com/v24.0/{$pageId}/insights", [
            'metric' => 'page_post_engagements',
            'period' => 'day',
            'since'  => $since->toDateString(),
            'until'  => $until->toDateString(),
            'access_token' => $token,
        ])->json();

        $total = 0;
        $trend = [];

        foreach ($res['data'][0]['values'] ?? [] as $row) {
            $val = (int) ($row['value'] ?? 0);
            $total += $val;

            $trend[] = [
                'name'  => Carbon::parse($row['end_time'])->format('d M'),
                'value' => $val,
            ];
        }

        return [$total, $trend];
    }
}
