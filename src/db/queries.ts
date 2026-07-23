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
    
    deleteById: `
        DELETE 
        FROM tasks 
        WHERE title = @title
    `,

    insert: `
        INSERT 
        INTO tasks 
        (title, done) VALUES (@title, @done)
    `,

    getCountDone: `
        SELECT COUNT(*) AS totalDone 
        FROM tasks 
        WHERE done = 1
    `,

    getCountTotal: `
        SELECT COUNT(*)
        FROM tasks    
    `,

    clear: `
        DELETE 
        FROM tasks
    `,

    update: `
        UPDATE tasks
        SET done = @done
        WHERE id = @id
    `
} as const;