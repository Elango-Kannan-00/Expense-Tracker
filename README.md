# Expense Tracker

A React expense tracker backed by a Spring Boot REST API and PostgreSQL. The frontend is in `frontend/`; the backend is in `backend/`.

## Requirements

- Node.js 20.19+ or 22.12+
- Java 21
- Maven 3.9+
- PostgreSQL

## Database

Create the database before starting the backend:

```sql
CREATE DATABASE expense_tracker;
```

The backend defaults to `jdbc:postgresql://localhost:5432/expense_tracker`,
with the PostgreSQL username and password set to `postgres`. Override these
defaults with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` if needed. JPA creates
and updates the tables on startup. Set `FRONTEND_ORIGIN` to the frontend's
origin when running outside local development.

## Run the application

Start the API from `backend/`:

```sh
cd backend
mvn spring-boot:run
```

Start the frontend in another terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and calls the API at
`http://localhost:8080`. Set `VITE_API_URL` in the frontend environment if the
API is hosted elsewhere. The API accepts browser requests from
`http://localhost:5173`.

## API

- `POST /api/auth/signup` — create an account; the password is stored as a BCrypt hash.
- `POST /api/auth/login` — verify credentials and start a server-side session.
- `GET /api/auth/me` — return the signed-in user.
- `POST /api/auth/logout` — end the session.
- `GET /api/expenses` — list the signed-in user's expenses.
- `POST /api/expenses` — add an expense (`text`, `expense`, `sector`).
- `DELETE /api/expenses/{id}` — delete an expense owned by the signed-in user.

Login uses an HTTP session cookie, so the browser must allow cookies for the
frontend and API origins. Expense endpoints require a valid login session.
