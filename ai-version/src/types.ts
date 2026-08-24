export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// Body shape accepted by POST /tasks — only a title is allowed.
export interface CreateTaskBody {
  title: string;
}

// Body shape accepted by PUT /tasks/:id — both fields optional,
// but at least one must be present (enforced in the route handler).
export interface UpdateTaskBody {
  title?: string;
  done?: boolean;
}
