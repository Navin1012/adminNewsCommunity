<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventJoin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use MongoDB\BSON\ObjectId;

class EventController extends Controller
{
    private function validateObjectId($id)
    {
        if (!preg_match('/^[a-f0-9]{24}$/i', $id)) {
            abort(404);
        }
    }
    private function handleImageUpload($request, $event = null)
    {
        if ($request->remove_image) {
            if ($event?->image) {
                Storage::disk('public')->delete($event->image);
            }
            return null;
        }

        if ($request->hasFile('image')) {
            if ($event?->image) {
                Storage::disk('public')->delete($event->image);
            }
            return $request->file('image')->store('events', 'public');
        }

        return $event?->image;
    }

    public function index(Request $request)
    {
        $query = Event::orderBy('start_at', 'desc');

        if ($request->q) {
            $q = $request->q;
            $query->where(function ($x) use ($q) {
                $x->where('title', 'like', "%{$q}%")
                    ->orWhere('excerpt', 'like', "%{$q}%")
                    ->orWhere('location', 'like', "%{$q}%");
            });
        }

        $events = $query->paginate(15);

        $eventIds = $events->pluck('_id')->map(fn($id) => (string) $id)->toArray();

        $joinCounts = EventJoin::raw(function ($collection) use ($eventIds) {
            return $collection->aggregate([
                ['$match' => ['event_id' => ['$in' => $eventIds], 'status' => 'joined']],
                [
                    '$group' => [
                        '_id' => '$event_id',
                        'total' => ['$sum' => 1]
                    ]
                ]
            ]);
        });

        $joinMap = [];
        foreach ($joinCounts as $row) {
            $joinMap[(string) $row->_id] = $row->total;
        }

        $events->getCollection()->transform(function ($e) use ($joinMap) {
            return [
                'id' => (string) $e->_id,
                'title' => $e->title,
                'excerpt' => $e->excerpt,
                'content' => $e->content,
                'start_at' => $e->start_at,
                'end_at' => $e->end_at,
                'location' => $e->location,
                'is_published' => (bool) $e->is_published,
                'image' => $e->image ? Storage::url($e->image) : null,
                'join_count' => $joinMap[(string) $e->_id] ?? 0,
            ];
        });

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filters' => $request->only('q'),
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
            'location' => 'required|string|max:255',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp|max:2048',
            'is_published' => 'sometimes|boolean',
        ]);

        $data['created_by'] = auth()->guard('admin')->id();
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        $data['image'] = $this->handleImageUpload($request);

        Event::create($data);

        return redirect()->route('admin.events.index')
            ->with('success', 'Event created successfully.');
    }


    public function update(Request $request, $id)
    {
        $this->validateObjectId($id);

        $event = Event::find($id);
        abort_unless($event, 404);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
            'location' => 'required|string|max:255',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp|max:2048',
            'is_published' => 'sometimes|boolean',
            'remove_image' => 'nullable|boolean',
        ]);

        $data['image'] = $this->handleImageUpload($request, $event);

        $event->update($data);

        return redirect()->route('admin.events.index')
            ->with('success', 'Event updated successfully.');
    }

    public function togglePublish($id)
    {
        $this->validateObjectId($id);

        $event = Event::find($id);
        abort_unless($event, 404);

        $event->is_published = !$event->is_published;
        $event->save();

        return redirect()->back()->with('success', 'Event status updated.');
    }


    public function destroy($id)
    {
        $this->validateObjectId($id);

        $event = Event::find($id);
        abort_unless($event, 404);

        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return redirect()->route('admin.events.index')
            ->with('success', 'Event deleted successfully.');
    }
}
