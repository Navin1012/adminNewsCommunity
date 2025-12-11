<?php

namespace App\Http\Controllers;

use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class NewsArticleController extends Controller
{
    public function index(Request $request)
    {
        try {

            $validated = $request->validate([
                'q' => 'nullable|string|max:100'
            ]);

            $query = NewsArticle::select('_id', 'title', 'summary', 'author', 'category', 'read_time', 'image', 'content')
                ->orderBy('_id', 'desc');

            if ($search = $validated['q'] ?? null) {
                $query->where(function ($x) use ($search) {
                    $x->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%");
                });
            }

            $articles = $query->paginate(10)->appends($request->query());

            $articles->getCollection()->transform(function ($a) {
                return [
                    'id' => (string) $a->_id,
                    'title' => $a->title,
                    'summary' => $a->summary,
                    'author' => $a->author,
                    'content' => $a->content,
                    'category' => $a->category,
                    'read_time' => $a->read_time,
                    'image' => $a->image ? Storage::url($a->image) : null,
                ];
            });

            return Inertia::render('News/Index', [
                'articles' => $articles,
                'filters' => $request->only('q')
            ]);

        } catch (\Exception $e) {

            Log::error("News index failed: " . $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return back()->with('message', 'Something went wrong! please try again.');
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'summary' => 'required|string',
            'content' => 'required|string',
            'category' => 'nullable|string',
            'author' => 'nullable|string',
            'read_time' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('Article', 'public');
        }

        NewsArticle::create($data);

        return redirect()->route('news.index')->with('success', 'Article created!');
    }



    public function update(Request $request, $id)
    {
        $article = NewsArticle::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string',
            'summary' => 'required|string',
            'content' => 'required|string',
            'category' => 'nullable|string',
            'author' => 'nullable|string',
            'read_time' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remove_image' => 'nullable|boolean',
        ]);

        // Do NOT delete image unless user clicked remove_image
        if ($request->remove_image) {
            if ($article->image) {
                Storage::disk('public')->delete($article->image);
            }
            $data['image'] = null;
        }

        // If NO new image uploaded, and NO remove_image flag → KEEP OLD IMAGE
        if (!$request->remove_image && !$request->hasFile('image')) {
            unset($data['image']);
        }


        if ($request->hasFile('image')) {
            if ($article->image) {
                Storage::disk('public')->delete($article->image);
            }

            $data['image'] = $request->file('image')->store('Article', 'public');
        }

        $article->update($data);

        return redirect()->route('news.index')->with('success', 'Article updated!');
    }



    public function destroy($id)
    {
        $article = NewsArticle::findOrFail($id);

        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }

        $article->delete();

        return redirect()->route('news.index')->with('success', 'Article deleted!');
    }

}
