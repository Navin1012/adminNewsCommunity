<?php

namespace App\Jobs;

use App\Models\Chapter;
use App\Models\ChapterJoin;
use App\Models\FacebookUser;
use App\Models\ChapterAnalytics;
use App\Services\FacebookAnalyticsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SyncChapterAnalyticsJob implements ShouldQueue
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
        $chapters = Chapter::all();

        Log::info('Chapter Analytics Job Started', [
            'chapters_count' => $chapters->count()
        ]);

        foreach ($chapters as $chapter) {

            $chapterId = (string) $chapter->_id;

            $joinedUserIds = ChapterJoin::where('chapter_id', $chapterId)
                ->where('status', 'joined')
                ->pluck('user_id')
                ->map(fn ($id) => (string) $id)
                ->toArray();

            if (empty($joinedUserIds)) {
                ChapterAnalytics::updateOrCreate(
                    ['chapter_id' => $chapterId],
                    ['period_analytics' => [], 'calculated_at' => now()]
                );
                continue;
            }

            $facebookUsers = FacebookUser::whereIn('user_id', $joinedUserIds)
                ->with('pages')
                ->get();

            if ($facebookUsers->isEmpty()) {
                ChapterAnalytics::updateOrCreate(
                    ['chapter_id' => $chapterId],
                    ['period_analytics' => [], 'calculated_at' => now()]
                );
                continue;
            }

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

                foreach ($facebookUsers as $fbUser) {
                    foreach ($fbUser->pages as $page) {

                        $data = $this->analyticsService
                            ->getPageAnalytics($page, $days);

                        if (!$data) {
                            continue;
                        }

                        $totalPages++;

                        $totalFollowers += $data['followers'] ?? 0;
                        $totalReach     += $data['totalReach'] ?? 0;
                        $engagementSum  += $data['engagement'] ?? 0;
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

            ChapterAnalytics::updateOrCreate(
                ['chapter_id' => $chapterId],
                [
                    'period_analytics' => $finalAnalytics,
                    'calculated_at'    => now(),
                ]
            );
        }

        Log::info('Chapter Analytics Job Completed');
    }
}
