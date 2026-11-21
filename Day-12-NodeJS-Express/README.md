# Day 12 – Node.js Fundamentals & Express.js Server Development

**ApexLark Full Stack Development Internship Program**
**Project:** Employee Management REST API
**Stack:** Node.js, Express.js, JavaScript (in-memory data store)

A backend server for an online employee management system. It follows a modular **MVC-style architecture** (Routes → Controllers → Middleware) and exposes REST endpoints for full CRUD on employees.

---

## Features

- Express server on **port 5000**
- JSON body parsing and **CORS** enabled
- Custom welcome message on `/`
- Employee CRUD API (GET, POST, PUT, DELETE) using an in-memory array
- Custom **logger middleware** (method, URL, timestamp, status, duration)
- Fallback **404** handler and centralised **error-handling** middleware
- Input validation (required fields, email format, numeric salary, duplicate email → 409)
- Environment config via `dotenv`, auto-reload in development via `nodemon`

## Project Structure

```
Day-12-NodeJS-Express/
├── controllers/
│   └── employeeController.js   # CRUD logic + validation
├── middleware/
│   ├── logger.js               # Logs method, URL, timestamp
│   └── errorHandler.js         # 404 fallback + error handler
├── routes/
│   └── employeeRoutes.js       # /employees routes
├── screenshots/                # API testing screenshots
├── app.js                      # Server entry point
├── package.json
├── package-lock.json
├── .env                        # Local environment variables
├── .env.example                # Template for env variables
├── .gitignore
├── postman_collection.json     # Importable Postman / Thunder Client collection
└── README.md
```

## Setup & Installation

**Prerequisites:** Node.js v18+ and npm.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Day-12-NodeJS-Express

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Run the server
npm run dev     # development (nodemon, auto-restart)
# or
npm start       # production (node)
```

The server starts at **http://localhost:5000**.

### Environment Variables

| Variable   | Default       | Description            |
|------------|---------------|------------------------|
| `PORT`     | `5000`        | Port the server runs on |
| `NODE_ENV` | `development` | Runtime environment     |

### Dependencies

| Package   | Purpose                                |
|-----------|----------------------------------------|
| express   | Web framework                          |
| cors      | Cross-Origin Resource Sharing          |
| dotenv    | Loads variables from `.env`            |
| nodemon   | (dev) Restarts server on file changes  |

---

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint          | Description              | Success |
|--------|-------------------|--------------------------|---------|
| GET    | `/`               | Welcome message          | 200     |
| GET    | `/employees`      | Retrieve all employees   | 200     |
| GET    | `/employees/:id`  | Retrieve employee by ID  | 200     |
| POST   | `/employees`      | Add a new employee       | 201     |
| PUT    | `/employees/:id`  | Update employee details  | 200     |
| DELETE | `/employees/:id`  | Delete an employee       | 200     |

### Employee Object

```json
{
  "id": 1,
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "department": "Engineering",
  "position": "Software Engineer",
  "salary": 850000
}
```

### Request / Response Examples

**GET `/employees`**
```json
{ "success": true, "count": 3, "data": [ { "id": 1, "name": "Aarav Sharma", "...": "..." } ] }
```

**POST `/employees`**
```json
// Request body
{
  "name": "Neha Singh",
  "email": "neha.singh@example.com",
  "department": "Quality Assurance",
  "position": "QA Engineer",
  "salary": 600000
}
// Response 201
{ "success": true, "message": "Employee created successfully", "data": { "id": 4, "...": "..." } }
```

**PUT `/employees/4`** (send only the fields you want to change)
```json
{ "position": "Senior QA Engineer", "salary": 750000 }
```

**DELETE `/employees/4`**
```json
{ "success": true, "message": "Employee deleted successfully", "data": { "id": 4, "...": "..." } }
```

### Error Responses

| Status | When                                                          |
|--------|---------------------------------------------------------------|
| 400    | Validation failed, invalid ID, or malformed JSON              |
| 404    | Employee not found, or route does not exist                   |
| 409    | An employee with the same email already exists                |
| 500    | Unexpected server error                                       |

```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": ["name is required", "email must be a valid email address"]
}
```

## Middleware

- **`logger.js`** – prints `[timestamp] METHOD /url` for every request and the final status code with response time once the response finishes.
- **`errorHandler.js`** – `notFound` turns unmatched routes into a 404 error; `errorHandler` returns a consistent JSON error body.

Sample console output:
```
[2026-11-21T11:30:12.101Z] GET /employees
[2026-11-21T11:30:12.101Z] GET /employees -> 200 (3ms)
```

---

## API Testing

All routes were tested with **Postman / Thunder Client**. Import `postman_collection.json` to run the same requests.

> Save your screenshots inside the `screenshots/` folder using the names below so they render here.

| # | Test Case                         | Screenshot |
|---|-----------------------------------|------------|
| 1 | GET `/` – welcome message         | ![Welcome](screenshots/01-welcome.png) |
| 2 | GET `/employees`                  | ![Get All](screenshots/02-get-all.png) |
| 3 | GET `/employees/1`                | ![Get One](screenshots/03-get-by-id.png) |
| 4 | POST `/employees`                 | ![Create](screenshots/04-post-create.png) |
| 5 | PUT `/employees/4`                | ![Update](screenshots/05-put-update.png) |
| 6 | DELETE `/employees/4`             | ![Delete](screenshots/06-delete.png) |
| 7 | GET `/employees/99` (404)         | ![Not Found](screenshots/07-not-found.png) |
| 8 | POST with invalid data (400)      | ![Validation](screenshots/08-validation-error.png) |
| 9 | Unknown route (404 fallback)      | ![404 Route](screenshots/09-route-404.png) |
| 10 | Logger output in terminal        | ![Logger](screenshots/10-logger-terminal.png) |

## Notes

- Data is stored **in memory**; it resets every time the server restarts (as required by the task).
- IDs are auto-incremented and are never reused after deletion.

## Author

**Vanshika Dhiman** – ApexLark Full Stack Development Internship, Day 12
