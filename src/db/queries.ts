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

    getCounts: `
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) AS done
        FROM tasks
    `,

    
    clear: `
        DELETE 
        FROM tasks
    `,

    clearHistory: `
        DELETE 
        FROM sqlite_sequence 
        WHERE name = 'tasks'
    `,

    update: `
        UPDATE tasks
        SET done = @done
        WHERE id = @id
    `
} as const;