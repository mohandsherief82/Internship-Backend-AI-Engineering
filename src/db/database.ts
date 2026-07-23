import Database from 'better-sqlite3';
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

const db = new Database("src/db/tasks.db");

db.exec(TASK_QUERIES.createTable);

// Important statements
const insertQuery = db.prepare(TASK_QUERIES.insert);
const getAllQuery = db.prepare(TASK_QUERIES.getAll);
const getByIdQuery = db.prepare(TASK_QUERIES.getById);
const deleteByIdQuery = db.prepare(TASK_QUERIES.deleteById);
const clearQuery = db.prepare(TASK_QUERIES.clear);

export function getTasks() {
    const tasks = getAllQuery.all() as Task[];

    return tasks;
}

export function getTaskByID(id: number) {
    const task = getByIdQuery.get(id) as Task | undefined;

    return task;
}

export function deleteTaskById(id: number) {
    const info = deleteByIdQuery.run({ id });

    console.log(`Row with id = ${id} has been deleted.\nAffected rows: ${info.changes}`);
}

export function resetDB() {
    const info = clearQuery.run();
    console.log(`Affected rows: ${info.changes}`);
    
    db.transaction(() => {
        for (const task of SEED_TASKS) {
            insertQuery.run({
                title: task.title,
                done: task.done ? 1 : 0
            });
        }
    })();

    console.log("The database has been reset to the initial state.")
}

export default db