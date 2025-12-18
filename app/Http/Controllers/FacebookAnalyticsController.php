<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\FacebookUser;
use App\Models\FacebookPage;
use App\Models\FacebookAnalytics;
use Inertia\Inertia;
use App\Services\FacebookAnalyticsService;
class FacebookAnalyticsController extends Controller
{

public function index(Request $request, FacebookAnalyticsService $fbAnalytics)
{
    $days = (int) $request->get('days', 7);
    $days = in_array($days, [7, 30, 90]) ? $days : 7;

    $response = [
        'pages' => [],
        'activePage' => null,
        'selectedUserId' => null,
        'days' => $days,
    ];

    if (!$request->user_id) {
        return Inertia::render('Social/FacebookAnalytics', $response);
    }

    $fbUser = FacebookUser::where('user_id', $request->user_id)->first();
    if (!$fbUser) {
        return Inertia::render('Social/FacebookAnalytics', $response);
    }

    $pages = FacebookPage::where('facebook_user_id', $fbUser->id)->get();
    if ($pages->isEmpty()) {
        return Inertia::render('Social/FacebookAnalytics', $response);
    }

    $page = $request->page_id
        ? $pages->where('page_id', $request->page_id)->first()
        : $pages->first();

    if (!$page) {
        return Inertia::render('Social/FacebookAnalytics', $response);
    }

    $analytics = $fbAnalytics->getPageAnalytics($page, $days);

    return Inertia::render('Social/FacebookAnalytics', array_merge(
        $response,
        $analytics,
        [
            'pages' => $pages,
            'activePage' => $page,
            'selectedUserId' => $request->user_id,
        ]
    ));
}
 public function allUsersAnalytics(Request $request)
{
    
    $days = (int) $request->get('days', 7);
    if (!in_array($days, [7, 30, 90])) {
        $days = 7;
    }

    $analytics = FacebookAnalytics::first();
// dd($analytics);
    return Inertia::render('Social/usersAnalytics', [
        'analytics' => $analytics,
        'days'      => $days,
        'auth'      => [
            'admin' => auth('admin')->user(),
        ],
    ]);
}


}