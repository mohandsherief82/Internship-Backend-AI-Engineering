import { Task } from "./types";

/**
 * Very small in-memory "database" for tasks.
 * Everything lives in a plain array — data is lost on restart,
 * which is expected for this assignment (no database).
 */
class TaskStore {
  private tasks: Task[] = [
    { id: 1, title: "Learn Node.js + TypeScript", done: false },
    { id: 2, title: "Build the Task API", done: false },
  ];
  private nextId = 3;

  getAll(): Task[] {
    return this.tasks;
  }

  getById(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  create(title: string): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      done: false,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number, changes: { title?: string; done?: boolean }): Task | undefined {
    const task = this.getById(id);
    if (!task) return undefined;

    if (changes.title !== undefined) task.title = changes.title;
    if (changes.done !== undefined) task.done = changes.done;

    return task;
  }

  delete(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }
}

// Singleton store shared by all routes for the lifetime of the process.
export const taskStore = new TaskStore();
