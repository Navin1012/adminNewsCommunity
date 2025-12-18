<?php

namespace App\Jobs;

use App\Models\FacebookUser;
use App\Models\FacebookAnalytics;
use App\Services\FacebookAnalyticsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class SyncFacebookAnalyticsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected FacebookAnalyticsService $analyticsService;

    public function __construct()
    {
        $this->analyticsService = app(FacebookAnalyticsService::class);
    }

    public function handle()
    {
        $periods = [7, 30, 90];
        $finalAnalytics = [];

        foreach ($periods as $days) {

            $totalFollowers    = 0;
            $totalReach        = 0;
            $engagementSum     = 0;
            $highestEngagement = 0;
            $totalPages        = 0;

            $engagementSplit = [
                'reactions' => 0,
                'comments'  => 0,
                'shares'    => 0,
            ];

            $chartLabels      = [];
            $reachByDate      = [];
            $engagementByDate = [];

            for ($i = $days - 1; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('d M');
                $chartLabels[] = $date;
                $reachByDate[$date] = 0;
                $engagementByDate[$date] = 0;
            }

            FacebookUser::with('pages')->chunk(50, function ($users) use (
                $days,
                &$totalFollowers,
                &$totalReach,
                &$engagementSum,
                &$highestEngagement,
                &$totalPages,
                &$engagementSplit,
                &$reachByDate,
                &$engagementByDate
            ) {
                foreach ($users as $user) {
                    foreach ($user->pages as $page) {

                        $data = $this->analyticsService
                            ->getPageAnalytics($page, $days);

                        if (empty($data)) {
                            continue;
                        }

                        $totalPages++;

                        $totalFollowers    += $data['followers'] ?? 0;
                        $totalReach        += $data['totalReach'] ?? 0;
                        $engagementSum     += $data['engagement'] ?? 0;
                        $highestEngagement = max(
                            $highestEngagement,
                            $data['highestEngagement'] ?? 0
                        );

                        $engagementSplit['reactions'] += $data['engagementSplit']['reactions'] ?? 0;
                        $engagementSplit['comments']  += $data['engagementSplit']['comments'] ?? 0;
                        $engagementSplit['shares']    += $data['engagementSplit']['shares'] ?? 0;

                        foreach ($data['chartLabels'] as $index => $label) {

                            if (isset($reachByDate[$label])) {
                                $reachByDate[$label] += $data['reachSeries'][$index] ?? 0;
                            }

                            if (isset($engagementByDate[$label])) {
                                $engagementByDate[$label] +=
                                    $data['engagementTrend'][$index]['value'] ?? 0;
                            }
                        }
                    }
                }
            });

            $avgEngagement = $totalPages > 0
                ? round($engagementSum / $totalPages, 2)
                : 0;

            $reachSeries = array_values($reachByDate);

            $engagementTrend = [];
            foreach ($engagementByDate as $date => $value) {
                $engagementTrend[] = [
                    'name'  => $date,
                    'value' => $value,
                ];
            }

            $finalAnalytics[$days . 'd'] = [
                'total_followers'    => $totalFollowers,
                'total_reach'        => $totalReach,
                'engagement'         => $engagementSum,
                'avg_engagement'     => $avgEngagement,
                'highest_engagement' => $highestEngagement,
                'engagement_split'   => $engagementSplit,
                'chart_labels'       => $chartLabels,
                'reach_series'       => $reachSeries,
                'engagement_trend'   => $engagementTrend,
            ];
        }

        FacebookAnalytics::updateOrCreate(
            ['facebook_user_id' => null],
            [
                'period_analytics' => $finalAnalytics,
                'calculated_at'    => now(),
            ]
        );
    }
}
