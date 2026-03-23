# Task Manager

This package is a full stack task manager application. The application runs a backend of Ruby on Rails to handle the APIs, PostGres for database, and Angular for frontend. The package route contains a Docker image. Unit tests are included for each frontend and backend functionality piece. Mobile app packaging is achieved via Capacitor.

## Tech Stack

- **Backend:** Ruby on Rails 8.1, PostgreSQL 16
- **Frontend:** Angular 21, TypeScript
- **Mobile:** Capacitor 8 (iOS & Android)
- **Infrastructure:** Docker, Docker Compose, Nginx

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/) (included with Docker Desktop)

For local development without Docker:
- Ruby 3.3, Bundler 4
- Node.js 20+, npm
- PostgreSQL 16

---

## Running with Docker (Recommended)

### Start everything

```bash
docker compose up --build
```

This starts three services:
- `db` — PostgreSQL on port 5432
- `backend` — Rails API on port 3000 (runs migrations automatically)
- `frontend` — Angular dev server on port 4200

### Stop

```bash
docker compose down
```

### Stop and remove volumes (wipes database)

```bash
docker compose down -v
```

---

## Backend

### Build & run (Docker)

```bash
docker compose up --build backend
```

### Run individually (local)

```bash
cd backend
bundle install
bundle exec rails db:create db:migrate
bundle exec rails server
```

API is available at `http://localhost:3000/api/v1`.

### Database commands

```bash
# Create databases
bundle exec rails db:create

# Run migrations
bundle exec rails db:migrate

# Reset database (drop, create, migrate)
bundle exec rails db:reset

# Seed data
bundle exec rails db:seed
```

### Run backend tests

```bash
# Via Docker
docker compose exec backend bundle exec rails test

# Locally (requires local Postgres running)
cd backend
bundle exec rails db:create RAILS_ENV=test
bundle exec rails test
```

---

## Frontend

### Build & run (Docker)

```bash
docker compose up --build frontend
```

App is available at `http://localhost:4200`.

### Run individually (local)

```bash
cd frontend
npm install
npm start
```

### Build for production

```bash
cd frontend
npm run build
```

Output is written to `dist/frontend/browser/`.

### Run frontend tests

```bash
cd frontend
npm test
```

---

## Mobile (Capacitor)

Requires a production build of the frontend first.

```bash
cd frontend
npm run build
```

### iOS

```bash
npx cap sync ios
npx cap open ios   # Opens Xcode
```

Build and run from Xcode.

### Android

```bash
npx cap sync android
npx cap open android   # Opens Android Studio
```

Build and run from Android Studio.

---

## API Overview

All endpoints are prefixed with `/api/v1` and use session-based authentication.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in |
| DELETE | `/auth/logout` | Log out |

### Tasks

Requires authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (filter by status, sort by title or due_date) |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Task statuses

`Pending`, `In Progress`, `Completed`, `Canceled`, `Blocked`

---

## Using the App

1. Go to `http://localhost:4200` in your browser
2. Click the **Sign Up** link to create an account if you do not have one. If you do then please log in. After signing up, you may then log in.
4. Create tasks using the **New Task** button
5. Set a title, optional description, due date, and status
6. Filter tasks by their status or due date.
7. Click a task to edit or delete it. You will receive a prompt before deleting.
8. Click a task View button to view more details. By defualt the table only shows the first 50 characters of a description

---

## Assumptions Made

1. Passwords should be fully hashed and have confirmation fields
2. We will require all sign-up fields to be filled out for a user creating an account
3. You may not have the same email address in the database twice since this is effectively your user name
4. Authentication is done via session cookies. There are alternate means (JWT) but session cookies can suffice for this example
5. Upon accessing the main page, you are redirected to /task. If you are not logged in, you are taken to /login first
6. A user should not be able to access the /login page again unless they are not authenticated. We want to prevent double authentication.
7. A user should be able to list, sort, and filter tasks by various metrics (sorting by title and due date, filtering by status)
8. A task is set to Pending automatically and you may then edit it to be whatever status you want later.
9. Users should only be able to add, view, edit, or delete their own tasks and no others.
10. Compilation and mobile packaging are done via Capacitor. I have done the iOS test but Android and iOS packaging is available.
11. Under normal circumstances things like SCSS files would be gitignored. However for this example I included them to show fully rendered out versions. Tailwind may also be used in circumstances like this but for this example, bespoke SCSS may suffice.
12. Unit tests for both frontend and backend should exist and run correctly without error.
13. I built this in a Docker image with containers for all facets for ease of scaling and tear down. This could run locally as well but building as one solid package helped this run easier.
14. Running tests inside Docker may be best in this circumstance. For example for backend tests I ran docker compose exec backend bundle exec rails test in the Terminal
15. This application was built on 2019 Macbook Pro using an Intel chip. Apple has since moved away from Intel chips and because of this some items in Docker and other applications have changed. Please consult your machine's composition and chip set.

---

## Decisions while task and user modeling

1. Before saving I am turning all email addresses lowercase to make sure duplicate email addresses are not allowed.
2. Passwords are hashed out and need confirmation. This is so a user can't just put anything in the password field without verifying it's correct. It's also hashed in the database for security purposes
3. The user is set to be able to have many tasks, but a task can only have one user, so this creates key constraints within the tables for ease and security.
4. I am mapping various task status text values to integers. I do not want to store full text fields for statuses since these can be updated at some point, but statuses will not. So this creates an easy association based on ID numbers.
5. Validating fields prior to saving in the database, relying on the data confirming all fields are correct and not invalid as opposed to only the frontend. This is in case someone (bot or human) can get around validation checks. I don't want anything getting into the database without being completely secured.
6. All APIs are stored within app/controllers/api/v1. Routes are in config/routes.rb
7. For the tasks controller, we are only allowing a user to grab the tasks assigned to them. A user is not able to edit, delete, or add tasks for another user.
8. We secure this data via cookies stored after logging in. There are other ways to do this as well (JWT) but for the sake of efficiency, session cookies were used in this example.
9. For each of the actions able to be taken inside the controllers, we will return unsuccessful JSON responses with error messages depending on what is missing or left out and display it in the frontend. The controllers handle all of this for each of the actions. The actions and their routes are defined in the controllers and through routes.rb.
10. Various unit tests exist for both the frontend and backend to verify *all* core functionality pieces are able to be done without error.