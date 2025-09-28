# Library Management System

A web application to manage library books, borrowing, and user roles (members and librarians).  

## Features

- User authentication (members and librarians) via Devise + JWT
- Member dashboard for borrowed books, due dates, and overdue status
- Librarian dashboard for managing books and viewing member borrowings
- Borrowing and returning books
- Book CRUD for librarians
- Search and filter books by title, author, genre, ISBN, and availability
- Frontend built with React and Vite
- RESTful Rails API backend with MySQL database

---

## Requirements

- **Backend:** Ruby 3.4.x, Rails 8.x, MySQL 8.x
- **Frontend:** Node.js 20.x, npm or yarn
- MySQL database

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-root>
```


### 2. Configure the database

Edit ```config/database.yml``` to match your local MySQL setup:

```yaml
default: &default
  adapter: mysql2
  encoding: utf8
  pool: 5
  username: user
  password: password
  host: localhost
```

Create and migrate the database:

```bash
cd backend
bundle install
rails db:create
rails db:migrate
rails db:seed
```

### 3. Start the backend server

```bash
rails s
```

API will be available at: http://localhost:3000/

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

