# Task Management API

A minimal backend with Express, SQLite, and Prisma.

## Setup

Dependencies are already installed. The database has been initialized.

## Running the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Get all tasks
```
GET /tasks
```

### Get task by ID
```
GET /tasks/:id
```

### Create task
```
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

### Update task
```
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, butter",
  "completed": true
}
```

### Delete task
```
DELETE /tasks/:id
```

## Database

SQLite database is stored in `prisma/dev.db`

View the database with:
```bash
npm run studio
```

## Schema

Tasks have:
- `id` - Auto-incrementing primary key
- `title` - Task title (required)
- `description` - Optional description
- `completed` - Boolean flag (default: false)
- `createdAt` - Timestamp
- `updatedAt` - Auto-updated timestamp
