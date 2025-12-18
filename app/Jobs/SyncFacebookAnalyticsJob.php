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
        $totalFollowers = 0;
        $totalReach = 0;
        $engagementSum = 0;
        $highestEngagement = 0;
        $totalPages = 0;

        $engagementSplit = [
            'reactions' => 0,
            'comments'  => 0,
            'shares'    => 0,
        ];

        $chartLabels = [];
        $reachSeries = [];
        $engagementTrend = [];

        FacebookUser::with('pages')->chunk(50, function ($users) use (
            &$totalFollowers,
            &$totalReach,
            &$engagementSum,
            &$highestEngagement,
            &$totalPages,
            &$engagementSplit,
            &$chartLabels,
            &$reachSeries,
            &$engagementTrend
        ) {

            foreach ($users as $user) {
                foreach ($user->pages as $page) {

                    $data = $this->analyticsService
                        ->getPageAnalytics($page, 7); 

                    if (empty($data)) {
                        continue;
                    }

                    $totalPages++;

                    $totalFollowers += $data['followers'];
                    $totalReach     += $data['totalReach'];
                    $engagementSum  += $data['engagement'];

                    $highestEngagement = max(
                        $highestEngagement,
                        $data['highestEngagement']
                    );

                    $engagementSplit['reactions'] += $data['engagementSplit']['reactions'] ?? 0;
                    $engagementSplit['comments']  += $data['engagementSplit']['comments'] ?? 0;
                    $engagementSplit['shares']    += $data['engagementSplit']['shares'] ?? 0;

                    $chartLabels = array_unique(
                        array_merge($chartLabels, $data['chartLabels'])
                    );

                    $reachSeries = array_merge($reachSeries, $data['reachSeries']);
                    $engagementTrend = array_merge($engagementTrend, $data['engagementTrend']);
                }
            }
        });

        $avgEngagement = $totalPages > 0
            ? round($engagementSum / $totalPages, 2)
            : 0;

        FacebookAnalytics::updateOrCreate(
            [ 'facebook_user_id' => "all users data", ],
            [
                'total_followers' => $totalFollowers,
                'total_reach' => $totalReach,
                'avg_engagement' => $avgEngagement,
                'highest_engagement' => $highestEngagement,

                'engagement' => $engagementSum,
                'engagement_split' => $engagementSplit,
                'engagement_trend' => $engagementTrend,

                'chart_labels' => array_values($chartLabels),
                'reach_series' => $reachSeries,

                'calculated_at' => now(),
            ]
        );
    }
}
