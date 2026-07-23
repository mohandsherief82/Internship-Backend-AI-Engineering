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
const getAllQuery = db.prepare(TASK_QUERIES.getAll);
const getByIdQuery = db.prepare(TASK_QUERIES.getById);

const insertQuery = db.prepare(TASK_QUERIES.insert);
const updateQuery = db.prepare(TASK_QUERIES.update);

const deleteByIdQuery = db.prepare(TASK_QUERIES.deleteById);
const resetQuery = db.prepare(TASK_QUERIES.clear);

const getCountDone = db.prepare(TASK_QUERIES.getCountDone);
const getCountTotal = db.prepare(TASK_QUERIES.getCountTotal);

export function getTasks() {
    const tasks = getAllQuery.all() as Task[];

    return tasks;
}

export function getTaskByID(id: number) {
    const task = getByIdQuery.get(id) as Task | undefined;

    return task;
}

export function deleteTaskById(id: number) : boolean {
    const info = deleteByIdQuery.run({ id });

    console.log(`Row with id = ${id} has been deleted.\nAffected rows: ${info.changes}`);

    return info.changes === 1 ? true: false;
}

export function resetDB() {
    const info = resetQuery.run();
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

export function getCounts(): Record<string, number> {
    const countDone = getCountDone.pluck().get() as number;
    const countTotal = getCountTotal.pluck().get() as number;

    return {
        done: countDone,
        open: countTotal - countDone,
        total: countTotal
    };
}

export function insertTask(task: Omit<Task, 'id'>) : boolean {
    const info = insertQuery.run({
        title: task.title,
        done: task.done ? 1: 0
    });

    return info.changes === 1 ? true: false;
}

export function updateTask(id: number, done: boolean) : boolean {
    const info = updateQuery.run({ id, done });

    return info.changes === 1 ? true: false;
}

export default db