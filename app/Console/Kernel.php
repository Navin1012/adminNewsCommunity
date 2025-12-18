<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    
    protected function schedule($schedule)
    {
        $schedule->job(new \App\Jobs\SyncFacebookAnalyticsJob)
            ->everyMinute();

        $schedule->job(new \App\Jobs\SyncChapterAnalyticsJob)
            ->everyMinute();
    }

    
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
