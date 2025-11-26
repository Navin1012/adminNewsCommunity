<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\ChapterJoin;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ChapterController extends Controller
{
    public function index(Request $request)
    {
        try {

            // SECURITY
            $validated = $request->validate([
                'q' => 'nullable|string|max:100'
            ]);

            // MAIN QUERY (only required fields)
            $query = Chapter::select('_id', 'title', 'state', 'total_members', 'icon', 'status', 'description')
                ->orderBy('_id', 'desc');

            // SEARCH
            if ($search = $validated['q'] ?? null) {
                $query->where(function ($x) use ($search) {
                    $x->where('title', 'like', "%{$search}%")
                        ->orWhere('state', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $chapters = $query->paginate(10)->appends($request->query());

            // collect ids only
            $chapterIds = $chapters->pluck('_id')->map(fn($id) => (string) $id)->all();

            // AGGREGATION
            $joinCounts = ChapterJoin::raw(
                fn($collection) =>
                $collection->aggregate([
                    [
                        '$match' => [
                            'chapter_id' => ['$in' => $chapterIds],
                            'status' => 'joined'
                        ]
                    ],
                    [
                        '$group' => [
                            '_id' => '$chapter_id',
                            'total' => ['$sum' => 1]
                        ]
                    ]
                ])
            );

            $joinMap = collect($joinCounts)->pluck('total', '_id');

            // FINAL TRANSFORM
            $chapters->getCollection()->transform(function ($c) use ($joinMap) {
                return [
                    'id' => (string) $c->_id,
                    'title' => $c->title,
                    'state' => $c->state,
                    'description' => $c->description,
                    'total_members' => (int) $c->total_members,
                    'icon' => $c->icon ? Storage::url($c->icon) : null,
                    'status' => $c->status,
                    'join_count' => $joinMap[(string) $c->_id] ?? 0,
                ];
            });

            return Inertia::render('Chapters/Index', [
                'chapters' => $chapters,
                'filters' => $request->only('q'),
            ]);

        } catch (\Exception $e) {

            // ERROR LOGGING (always)
            Log::error("Chapters index failed: " . $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            // SAFE fallback without crashing
            return back()->with('message', 'Something went wrong! please try again.');
        }
    }
    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'total_members' => 'required|integer|min:0',
                'description' => 'nullable|string',
                'icon' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:2048',
                'status' => 'required|in:active,inactive',
            ]);

            if ($request->hasFile('icon')) {
                $validated['icon'] = $request->file('icon')->store('chapters', 'public');
            }

            Chapter::create($validated);

            return redirect()
                ->route('chapters.index')
                ->with('success', 'Chapter created successfully!');

        } catch (ValidationException $e) {

            throw $e;

        } catch (\Throwable $e) {

            Log::error('Chapter Create Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Something went wrong! Please try again.');
        }
    }




    public function update(Request $request, $id)
    {
        // 1) Validate input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'total_members' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'icon' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:2048',
            'status' => 'required|in:active,inactive',
            'remove_icon' => 'nullable|boolean',
        ]);

        // 2) Get chapter (one DB read)
        $chapter = Chapter::findOrFail($id);

        // 3) Manage ICON logic
        if ($request->boolean('remove_icon')) {

            // Delete old icon if exists
            if ($chapter->icon && Storage::disk('public')->exists($chapter->icon)) {
                Storage::disk('public')->delete($chapter->icon);
            }

            $validated['icon'] = null;
        } else if ($request->hasFile('icon')) {

            // Remove old icon
            if ($chapter->icon && Storage::disk('public')->exists($chapter->icon)) {
                Storage::disk('public')->delete($chapter->icon);
            }

            // Store new icon
            $validated['icon'] = $request->file('icon')->store('chapters', 'public');
        } else {
            // Keep old icon
            $validated['icon'] = $chapter->icon;
        }

        // 4) One single DB update (best performance)
        $chapter->update($validated);

        // 5) Redirect with success
        return redirect()
            ->route('chapters.index')
            ->with('success', 'Chapter updated successfully!');
    }

    public function destroy($id)
    {
        $chapter = Chapter::findOrFail($id);

        if ($chapter->icon) {
            Storage::disk('public')->delete($chapter->icon);
        }

        $chapter->delete();

        return redirect()->route('chapters.index')->with('success', 'Chapter deleted!');
    }
    public function toggle($id)
    {
        $chapter = Chapter::findOrFail($id);

        $chapter->status = $chapter->status === 'active'
            ? 'inactive'
            : 'active';

        $chapter->save();

        return back()->with('success', 'Status updated!');
    }
    public function joins($id)
    {
        $chapter = Chapter::findOrFail($id);

        $joins = ChapterJoin::where('chapter_id', $id)
            ->get()
            ->map(function ($join) {

                $data = $join->user_data ?? [];

                return [
                    'id' => $join->id,
                    'name' => $data['name'] ?? '-',
                    'email' => $data['email'] ?? '-',
                    'phone' => $data['mobile_number'] ?? '-',
                    'address' => $data['address'] ?? '-',
                    'channel_name' => $data['channel_name'] ?? '-',
                    'channel_url' => $data['channel_url'] ?? '-',
                    'premium' => $data['premium'] ?? false,
                    'active' => $data['active'] ?? false,
                    'payment_status' => $data['payment_status'] ?? '-',
                    'email_verified_at' => $data['email_verified_at'] ?? null,
                    'created_at' => $join->created_at,
                ];
            });

        return inertia("Chapters/ChapterJoins", [
            "chapter" => [
                "id" => (string) $chapter->_id,
                "title" => $chapter->title,
            ],
            "joins" => $joins,
        ]);
    }



}
