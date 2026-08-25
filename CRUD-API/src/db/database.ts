import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

import { TASK_QUERIES } from './queries.js';

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

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

await pool.query(TASK_QUERIES.createTable);
