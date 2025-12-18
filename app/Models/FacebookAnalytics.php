<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FacebookAnalytics extends Model
{
    protected $collection = 'facebook_analytics';

    protected $fillable = [
        'facebook_user_id',
        'period_analytics', 
        'total_followers',
        'total_reach',
        'avg_engagement',
        'highest_engagement',

        'engagement',
        'engagement_split',
        'engagement_trend',

        'chart_labels',
        'reach_series',

        'calculated_at',
    ];
}
