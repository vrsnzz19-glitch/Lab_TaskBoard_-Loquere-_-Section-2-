<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Project $project)
    {
        return TaskResource::collection($project->tasks);
    }

    public function store(Request $request, Project $project)
    {
        abort_unless($project->user()->is($request->user()), 403);

        $task = $project->tasks()->create($request->validate([
            'title' => ['required', 'string', 'max:255'],
            'due_date' => ['nullable', 'date'],
            'is_done' => ['sometimes', 'boolean'],
        ]));

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorizeTask($request, $task);

        return new TaskResource($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorizeTask($request, $task);

        $task->update($request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'is_done' => ['sometimes', 'boolean'],
        ]));

        return new TaskResource($task);
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authorizeTask($request, $task);
        $task->delete();

        return response()->noContent();
    }

    private function authorizeTask(Request $request, Task $task): void
    {
        abort_unless($task->project->user()->is($request->user()), 403);
    }
}
