import Database from 'better-sqlite3';

import { TASK_QUERIES } from './queries.js';
import { ValidationError, NotFoundError } from '../errors.js';  

// Custom type handling tasks
export interface Task {
    id: number,
    title: string,
    done: boolean
}

export const SEED_TASKS: Task[] = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Walk the dog', done: true },
  { id: 3, title: 'Read a book', done: false },
] as const;

export const db = new Database("src/db/tasks.db");

db.exec(TASK_QUERIES.createTable);
