export const TASK_QUERIES = {
    createTable: `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        );`,

    getAll: `
        SELECT * 
        FROM tasks
        ORDER BY id ASC
        ;`,

    getById: `
        SELECT * 
        FROM tasks 
        WHERE id = $1
        ;`,
    
    deleteById: `
        DELETE 
        FROM tasks 
        WHERE id = $1
        ;`,

    insert: `
        INSERT INTO tasks (title, done) 
        VALUES ($1, $2)
        RETURNING *
        ;`,

    getCounts: `
        SELECT 
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE done = TRUE) AS done
        FROM tasks
        ;`,

    clear: `
        DELETE 
        FROM tasks
        ;`,

    clearHistory: `
        TRUNCATE tasks RESTART IDENTITY
        ;`,

    update: `
        UPDATE tasks
        SET done = $2
        WHERE id = $1
        RETURNING *
        ;`,
} as const;