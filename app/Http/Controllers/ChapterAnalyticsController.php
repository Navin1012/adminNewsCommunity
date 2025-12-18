<?php


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\ChapterAnalytics;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChapterAnalyticsController extends Controller
{
    public function index()
    {
        $chapters = Chapter::query()
            ->orderBy('title')
            ->get()
            ->filter(function ($chapter) {

                $analytics = ChapterAnalytics::where(
                    'chapter_id',
                    (string) $chapter->_id
                )->first();

                if (!$analytics || empty($analytics->period_analytics)) {
                    return false;
                }

                foreach ($analytics->period_analytics as $period => $data) {
                    if (
                        ($data['total_reach'] ?? 0) > 0 ||
                        ($data['engagement'] ?? 0) > 0 ||
                        ($data['total_followers'] ?? 0) > 0
                    ) {
                        return true; 
                    }
                }

                return false;
            })
            ->map(function ($chapter) {

                $analytics = ChapterAnalytics::where(
                    'chapter_id',
                    (string) $chapter->_id
                )->first();

                return [
                    'id' => (string) $chapter->_id, 
                    'title' => $chapter->title,
                    'state' => $chapter->state,
                    'status' => $chapter->status,
                    'hasAnalytics' => true,
                    'calculated_at' => $analytics?->calculated_at,
                ];
            })
            ->values();

        $perPage = 10;
        $page = request()->get('page', 1);
        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $chapters->forPage($page, $perPage),
            $chapters->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        return Inertia::render('Social/ChapterAnalyticsIndex', [
            'chapters' => $paginated,
            'auth' => [
                'admin' => auth('admin')->user(),
            ],
        ]);
    }



    public function chaptersAnalytics(Request $request, Chapter $chapter)
    {
        $days = (int) $request->get('days', 7);
        if (!in_array($days, [7, 30, 90])) {
            $days = 7;
        }

        $analytics = ChapterAnalytics::where(
            'chapter_id',
            (string) $chapter->_id
        )->first();

        return Inertia::render('Social/ChapterAnalytics', [
            'chapter' => $chapter,
            'analytics' => $analytics,
            'days' => $days,
            'auth' => [
                'admin' => auth('admin')->user(),
            ],
        ]);
    }

}
