import { pool, Task, SEED_TASKS } from '../db/database.js';
import { TASK_QUERIES } from '../db/queries.js';

import { ValidationError, NotFoundError } from '../errors.js'


export async function getTasks() : Promise<Task[]> {
    const res = await pool.query(TASK_QUERIES.getAll);

    return res.rows as Task[];
}

export async function getTaskByID(id: number) : Promise<Task | null> {
    const res = await pool.query<Task>(TASK_QUERIES.getById, [id]);

    if (res.rowCount === 0) {
        throw new NotFoundError(`Task with ID ${id} was not found.`);
    }

    return res.rows[0] ?? null;
}

export async function deleteTaskById(id: number) {
    const res = await pool.query(TASK_QUERIES.deleteById, [id]);

    if (res.rowCount === 0) {
        throw new NotFoundError(`Task with ID ${id} was not found.`);
    }
    
    console.log(`Row with id = ${id} has been deleted.\nAffected rows: ${res.rowCount}`);
}

export async function resetDB() {
    const res = await pool.query(TASK_QUERIES.clear)
    console.log(`Affected rows: ${res.rowCount}`);

    await pool.query(TASK_QUERIES.clearHistory);

    for (var task of SEED_TASKS) {
        await pool.query(TASK_QUERIES.insert, [ task.title, task.done ]);
    }

    console.log("The database has been reset to the initial state.");
}

export async function getCounts() {
    const res = await pool.query(TASK_QUERIES.getCounts);

    const total = parseInt(res.rows[0].total, 10) || 0;
    const done = parseInt(res.rows[0].done, 10) || 0;
    
    return {
        done,
        open: total - done,
        total,
    };
}

export async function insertTask(task: Omit<Task, 'id'>) : Promise<Task | null> {
    const res = await pool.query<Task>(TASK_QUERIES.insert, [task.title, task.done])

    return res.rows[0] ?? null;
}

export async function updateTask(id: number, done: boolean) : Promise<Task | null> {
    if (typeof done !== "boolean") {
        throw new ValidationError(`Done must be a boolean. Was Given ${done}`);
    }

    const res = await pool.query<Task>(TASK_QUERIES.update, [id, done]);

    if (res.rowCount === 0) {
        throw new NotFoundError(`Task with ID ${id} was not found.`);
    }

    return res.rows[0] ?? null;
}
