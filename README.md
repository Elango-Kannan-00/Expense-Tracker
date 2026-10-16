# Expense Tracker

## Overview

Expense Tracker is a web application with a React frontend and a Spring Boot REST API backed by PostgreSQL. Users can create an account, sign in, and manage their own expenses.

The backend uses a simple layered architecture with Controller, Service, Repository, DTO, and Entity layers. Passwords are stored as BCrypt hashes, never as plain text.

## Features

- Register and sign in to an account
- Store and retrieve expenses for the signed-in user
- Add and delete expenses
- View expense summaries and charts in the frontend
- Validate API input using Jakarta Validation
- Store users and expenses in PostgreSQL
- Keep the signed-in user in a server-side HTTP session

## Technology Stack

| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 3.4.5 |
| Spring Data JPA | Spring Boot managed |
| PostgreSQL | — |
| Maven | 3.9+ recommended |
| React | 19 |
| Vite | 7 |

## Project Structure

```text
Expense-Tracker
│
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java/com/expensetracker
│   │   │   │   ├── config
│   │   │   │   ├── controller
│   │   │   │   ├── dto
│   │   │   │   ├── entity
│   │   │   │   ├── repository
│   │   │   │   └── service
│   │   │   └── resources/application.properties
│   │   └── test
│   └── pom.xml
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── services/api.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Database Configuration

Create the PostgreSQL database before starting the backend:

```sql
CREATE DATABASE expense_tracker;
```

The default connection settings are:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=postgres
spring.datasource.password=postgres
```

You can override the defaults with the `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables. Hibernate creates or updates the database tables at startup.

The backend listens on port `8080` by default. Set `PORT` to change it. For a frontend running at a different origin, set `FRONTEND_ORIGIN` to that origin. The frontend API URL can be changed with `VITE_API_URL`; its default is `http://localhost:8080`.

## Running the Application

### Start the Backend

```sh
cd backend
mvn spring-boot:run
```

The API starts at:

```text
http://localhost:8080
```

### Start the Frontend

In a separate terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

## API Documentation

Base URL:

```text
http://localhost:8080
```

All request and response bodies use JSON. Login sets an HTTP session cookie. Keep the cookie for subsequent requests (Postman does this automatically). Expense endpoints require an authenticated session and only access the signed-in user's expenses.

### 1. Register an Account

**Request**

```http
POST /api/auth/signup
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "9876543210"
}
```

**Response — `201 Created`**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

The password must be at least 8 characters and at most 72 UTF-8 bytes. The phone number must be a valid 10-digit Indian mobile number. An email address can only be registered once.

### 2. Sign In

**Request**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response — `200 OK`**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

The response also sets a session cookie. Invalid credentials return `401 Unauthorized`.

### 3. Get the Signed-In User

**Request**

```http
GET /api/auth/me
```

**Response — `200 OK`**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

Returns `401 Unauthorized` when no valid login session exists.

### 4. Sign Out

**Request**

```http
POST /api/auth/logout
```

**Response:** `204 No Content`

### 5. View Expenses

**Request**

```http
GET /api/expenses
```

**Response — `200 OK`**

```json
[
  {
    "id": 1,
    "text": "Weekly groceries",
    "expense": 1250.00,
    "sector": "Food & Groceries"
  },
  {
    "id": 2,
    "text": "Bus pass",
    "expense": 500.00,
    "sector": "Transportation"
  }
]
```

An account with no expenses receives an empty array.

### 6. Add an Expense

**Request**

```http
POST /api/expenses
Content-Type: application/json
```

```json
{
  "text": "Weekly groceries",
  "expense": 1250.00,
  "sector": "Food & Groceries"
}
```

**Response — `200 OK`**

```json
{
  "id": 1,
  "text": "Weekly groceries",
  "expense": 1250.00,
  "sector": "Food & Groceries"
}
```

The amount must be positive, with at most 10 integer digits and 2 decimal places. The text is required and may be up to 200 characters. Allowed sectors are:

- `Food & Groceries`
- `Transportation`
- `Medical/Healthcare`
- `Entertainment`
- `Others`

### 7. Delete an Expense

**Request**

```http
DELETE /api/expenses/1
```

**Response:** `204 No Content`

An expense belonging to another user is not accessible. An unknown expense ID returns `404 Not Found`.

## Validation and Error Responses

Request DTOs validate required fields, email format, password length, phone number, expense amount, and expense sector. Invalid request data returns `400 Bad Request`. Requests to protected endpoints without a valid session return `401 Unauthorized`.

## Testing with Postman

Create requests for the following endpoints:

| Method | Endpoint | Login required |
|---|---|---|
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| POST | `/api/auth/logout` | Yes |
| GET | `/api/expenses` | Yes |
| POST | `/api/expenses` | Yes |
| DELETE | `/api/expenses/{id}` | Yes |
