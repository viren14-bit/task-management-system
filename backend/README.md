# Task Management System - Backend

Django REST API for task management system with role-based access control.

## Setup Instructions

1. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run migrations:
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

4. Create a superuser (admin):
\`\`\`bash
python manage.py createsuperuser
\`\`\`

5. Run the development server:
\`\`\`bash
python manage.py runserver
\`\`\`

The API will be available at `http://localhost:8000`

## Running Tests

Run all tests:
\`\`\`bash
python manage.py test
\`\`\`

Run tests for specific app:
\`\`\`bash
python manage.py test accounts
python manage.py test projects
python manage.py test tasks
\`\`\`

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register new user
- POST `/api/auth/login/` - Login user
- POST `/api/auth/logout/` - Logout user
- GET `/api/auth/me/` - Get current user

### Projects
- GET `/api/projects/` - List all projects
- POST `/api/projects/` - Create project (admin only)
- GET `/api/projects/{id}/` - Get project details
- PUT/PATCH `/api/projects/{id}/` - Update project (admin only)
- DELETE `/api/projects/{id}/` - Delete project (admin only)

### Tasks
- GET `/api/tasks/` - List all tasks
- POST `/api/tasks/` - Create task (all authenticated users)
- GET `/api/tasks/{id}/` - Get task details
- PUT/PATCH `/api/tasks/{id}/` - Update task (admin only)
- DELETE `/api/tasks/{id}/` - Delete task (admin only)

Query parameters for tasks:
- `?project={id}` - Filter by project
- `?status={status}` - Filter by status
- `?priority={priority}` - Filter by priority

## User Roles

- **Standard User**: Can view all tasks and projects, create new tasks
- **Administrator**: Full CRUD operations on all resources
