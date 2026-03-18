# Task Management Backend

Backend API for the task management system built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Role-based access control (Teacher/Student)
- Task management (CRUD operations)
- Comments on tasks
- Student management
- MongoDB integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB URL and other configuration.

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/students` - Get all students (Teacher only)
- `GET /api/users/students/:id` - Get student by ID (Teacher only)
- `POST /api/users/students` - Create student (Teacher only)

### Tasks
- `GET /api/tasks` - Get tasks (based on user role)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Teacher only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Teacher only)
- `POST /api/tasks/:id/comments` - Add comment to task

## Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: Enum ['teacher', 'student']
- avatar: String

### Task
- title: String
- description: String
- assignedTo: Array of User IDs
- dueDate: Date
- priority: Enum ['Low', 'Medium', 'High']
- status: Enum ['Pending', 'In Progress', 'Completed']
- comments: Array of comments
- createdBy: User ID

## Environment Variables

- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Role-based access control
