export const TASK_QUERIES = {
    createTable: `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0
    );`,

    getAll: `
        SELECT * 
        FROM tasks
    `,

    getById: `
        SELECT * 
        FROM tasks 
        WHERE id = ?
    `,

    insert: `
        INSERT INTO tasks (title, done) 
        VALUES (@title, @done)
    `
} as const;