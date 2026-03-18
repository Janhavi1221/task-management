# Task Management System

A full-stack task management application built for educational settings with separate frontend and backend components.

## Project Structure

```
task-management/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express + MongoDB backend API
└── README.md          # This file
```

## Features

- **User Authentication**: Login system for teachers and students
- **Role-based Access**: Different interfaces and permissions for teachers vs students
- **Task Management**: Create, assign, track, and manage tasks
- **Comments**: Add comments to tasks for collaboration
- **Progress Tracking**: Monitor task completion status
- **Student Management**: Teachers can manage student accounts
- **Real-time Updates**: Frontend syncs with backend API

## Technology Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Radix UI components
- React Router
- React Query (TanStack Query)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS support
- Rate limiting
- Helmet security

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URL:
```
MONGODB_URL=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
# Development
npm run dev

# Production
npm start
```

6. (Optional) Seed the database with sample data:
```bash
node src/utils/seedData.js
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users (Teacher only)
- `GET /api/users/students` - Get all students
- `GET /api/users/students/:id` - Get student by ID
- `POST /api/users/students` - Create new student

### Tasks
- `GET /api/tasks` - Get tasks (filtered by user role)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (Teacher only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Teacher only)
- `POST /api/tasks/:id/comments` - Add comment to task

## Default Login Credentials

After seeding the database, you can use these credentials:

### Teacher
- Name: `Teacher Admin`
- Role: `teacher`

### Students
- Name: `Alice Johnson` (Role: `student`)
- Name: `Bob Martinez` (Role: `student`)
- Name: `Clara Lee` (Role: `student`)
- And 3 more students...

## Development Notes

- The frontend uses a simplified login system (name + role) for demo purposes
- In production, implement proper email/password authentication
- JWT tokens are stored in localStorage (consider HttpOnly cookies for production)
- The backend includes rate limiting and security headers
- All API endpoints are protected with authentication middleware

## Environment Variables

### Backend (.env)
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - Token expiration time
- `PORT` - Backend server port
- `NODE_ENV` - Environment mode
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API base URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
