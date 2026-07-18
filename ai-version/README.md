# Task API

A simple in-memory to-do list CRUD API built with **Node.js + TypeScript + Express**.
No database — tasks live in a plain array in memory and reset when the server restarts.

## Project layout

```
task-api/
├── src/
│   ├── index.ts          # server entry point (starts the app on PORT)
│   ├── app.ts             # express app assembly (routes, json body parsing, swagger)
│   ├── data.ts             # in-memory TaskStore (the "database")
│   ├── types.ts            # Task / request body TypeScript interfaces
│   ├── openapi.json         # OpenAPI 3.0 spec (Stage 5)
│   └── routes/
│       ├── meta.ts          # GET / and GET /health
│       └── tasks.ts         # GET/POST/PUT/DELETE /tasks
├── package.json
└── tsconfig.json
```

## Setup

```bash
npm install
```

## Run

```bash
# development (auto-restart on save)
npm run dev

# or compile then run the compiled JS
npm run build
npm start
```

The server listens on `http://localhost:3000` by default (override with the `PORT` env var).

## Endpoints

| Stage | Method | Path         | Description                                    |
|-------|--------|--------------|-------------------------------------------------|
| 1     | GET    | `/`          | API name, version, and endpoint list            |
| 1     | GET    | `/health`    | Server status, uptime, timestamp                |
| 2     | GET    | `/tasks`     | List all tasks                                  |
| 2     | GET    | `/tasks/:id` | Get a single task by id                         |
| 3     | POST   | `/tasks`     | Create a task from `{ "title": "..." }`         |
| 4     | PUT    | `/tasks/:id` | Update `title` and/or `done` on a task          |
| 4     | DELETE | `/tasks/:id` | Delete a task by id                             |
| 5     | GET    | `/openapi.json` | Raw OpenAPI 3.0 spec (JSON)                  |
| 5     | GET    | `/docs`      | Swagger UI, rendered from the spec above        |

### Example requests

```bash
# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'

# Mark it done
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

# Delete it
curl -X DELETE http://localhost:3000/tasks/1
```

## Design notes

- **Task shape**: `{ id: number, title: string, done: boolean }`.
- **IDs**: assigned by an auto-incrementing counter starting at the next free
  number after the seed data (never reused, even after a delete) — the
  simplest, safest interpretation of "next free id" for a course-project API.
- **Validation**: every route validates its inputs and returns `400` for bad
  input (non-numeric id, missing/blank title, wrong types) and `404` when the
  id doesn't exist, before touching the store.
- **PUT semantics**: partial update — you can send `title`, `done`, or both,
  but at least one field is required.
- **Seed data**: the store starts with two example tasks so `GET /tasks`
  isn't empty on first run; feel free to remove `data.ts`'s seed array if you
  want to start empty.
