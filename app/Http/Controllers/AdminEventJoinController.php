<?php

namespace App\Http\Controllers;

use App\Models\EventJoin;
use App\Models\User;
use App\Models\Event;
use Inertia\Inertia;

class AdminEventJoinController extends Controller
{
    public function index($eventId)
{
    $event = Event::findOrFail($eventId);

    $joins = EventJoin::with('user')->where('event_id', $eventId)->get();

    $users = $joins->map(function ($join) {
        $user = $join->user;

        return [
            'join_id'   => $join->id,
            'status'    => $join->status,
            'joined_at' => $join->created_at,
            'user'      => $user ? [
                'id'     => (string)$user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'mobile' => $user->mobile_number,
            ] : null,
        ];
    });

    return Inertia::render('Admin/Events/Joins', [
        'event' => [
            'id'           => $event->id,
            'title'        => $event->title,
            'excerpt'      => $event->excerpt,
            'content'      => $event->content,
            'start_at'     => $event->start_at,
            'end_at'       => $event->end_at,
            'location'     => $event->location,
            'is_published' => $event->is_published,
            'image'        => $event->image_url,
        ],
        'users' => $users
    ]);
}

}
