<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->projects()->withCount('tasks')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project = $request->user()->projects()->create($validated);

        return response()->json($project->loadCount('tasks'), 201);
    }

    public function show(Request $request, Project $project)
    {
        abort_unless($project->user()->is($request->user()), 403);

        return response()->json($project->loadCount('tasks'));
    }

    public function update(Request $request, Project $project)
    {
        abort_unless($project->user()->is($request->user()), 403);

        $project->update($request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
        ]));

        return response()->json($project->loadCount('tasks'));
    }

    public function destroy(Request $request, Project $project)
    {
        abort_unless($project->user()->is($request->user()), 403);

        $project->delete();

        return response()->noContent();
    }
}
