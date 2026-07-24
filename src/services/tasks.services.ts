import { db, Task, SEED_TASKS } from '../db/database.js';
import { TASK_QUERIES } from '../db/queries.js';

// Important statements
const getAllQuery = db.prepare(TASK_QUERIES.getAll);
const getByIdQuery = db.prepare(TASK_QUERIES.getById);

const insertQuery = db.prepare(TASK_QUERIES.insert);
const updateQuery = db.prepare(TASK_QUERIES.update);

const deleteByIdQuery = db.prepare(TASK_QUERIES.deleteById);
const resetQuery = db.prepare(TASK_QUERIES.clear);

const getCountsQuery = db.prepare(TASK_QUERIES.getCounts);

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

    db.exec(TASK_QUERIES.clearHistory);
    
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
    const counts = getCountsQuery.get() as { total: number; done: number | null };
    const done = counts.done ?? 0;
    
    return {
        done,
        open: counts.total - done,
        total: counts.total
    };
}

export function insertTask(task: Omit<Task, 'id'>) : [boolean, number] {
    const info = insertQuery.run({
        title: task.title,
        done: task.done ? 1: 0
    });

    return [info.changes === 1 ? true: false, Number(info.lastInsertRowid)];
}

export function updateTask(id: number, done: boolean) : boolean {
    const info = updateQuery.run({ id, done });

    return info.changes === 1 ? true: false;
}
