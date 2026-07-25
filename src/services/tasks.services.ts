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
    const info = deleteByIdQuery.run({ id });

    if (info.changes === 0) {
        throw new NotFoundError(`Task with ID ${id} was not found.`);
    }

    console.log(`Row with id = ${id} has been deleted.\nAffected rows: ${info.changes}`);
}

export async function resetDB() {
    const info = resetQuery.run();
    console.log(`Affected rows: ${info.changes}`);

    pool.exec(TASK_QUERIES.clearHistory);
    
    pool.transaction(() => {
        for (const task of SEED_TASKS) {
            insertQuery.run({
                title: task.title,
                done: task.done ? 1 : 0
            });
        }
    })();

    console.log("The database has been reset to the initial state.")
}

export async function getCounts(): Promise<Record<string, number>> {
    const counts = getCountsQuery.get() as { total: number; done: number | null };
    const done = counts.done ?? 0;
    
    return {
        done,
        open: counts.total - done,
        total: counts.total
    };
}

export async function insertTask(task: Omit<Task, 'id'>) : Promise<number> {
    const info = insertQuery.run({
        title: task.title,
        done: task.done ? 1: 0
    });

    return Number(info.lastInsertRowid);
}

export async function updateTask(id: number, done: boolean) {
    if (typeof done !== "boolean") {
        throw new ValidationError(`Done must be a boolean. Was Given ${done}`);
    }

    const info = updateQuery.run({ 
            id,
            done: done ? 1 : 0 
        });

    if (info.changes === 0) {
        throw new NotFoundError(`Task with ID ${id} was not found.`);
    }
}
