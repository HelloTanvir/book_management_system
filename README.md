# 📚 Book Management System

A fully-typed, production-ready REST API for registering **authors** and their **books**. Built with [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/) and SQLite.

<p align="center">
  <a href="https://nodejs.org/en"><img src="https://img.shields.io/badge/node-%3E=18.x-brightgreen" alt="node version"/></a>
  <a href="https://yarnpkg.com"><img src="https://img.shields.io/badge/yarn-berry-blue" alt="yarn"/></a>
  <img src="https://img.shields.io/badge/coverage-e2e%20&%20unit-informational"/>
  <img src="https://img.shields.io/badge/license-MIT-lightgrey"/>
</p>

---

## ✨ Features

- CRUD endpoints for Authors & Books
- One-to-Many relationship between authors and their books
- Pagination, search & sorting out-of-the-box
- Global response transformer & exception filter for consistent JSON output
- Auto-generated Swagger (OpenAPI) docs available under `/api`
- SQLite by default—easily switch to any SQL RDBMS supported by TypeORM
- Repository pattern with transaction safety and bulk operations
- Unit & e2e tests (Jest + Supertest)
- Container-ready & 12-Factor compliant configuration
- Adheres to **SOLID**, **DRY** & **KISS** principles

---

## 🛠 Tech Stack

| Category  | Library / Tool |
|-----------|----------------|
| Language  | TypeScript |
| Framework | NestJS 10 |
| ORM       | TypeORM |
| Database  | SQLite (default) |
| Validation| class-validator / class-transformer |
| Testing   | Jest, Supertest |

---

## 📂 Project Structure

```text
src/
  core/           # global filters, interceptors, shared types, database module
  modules/
    author/       # author feature (controller, service, repository, dto, entity)
    book/         # book feature (controller, service, repository, dto, entity)
  main.ts         # application bootstrap & Swagger setup
test/             # e2e tests
.env.example      # environment template
```

Each **feature** lives in its own folder, promoting high cohesion and easy reusability.

---

## ⚡ Getting Started

### Prerequisites

1. **Node.js ≥ 18**  
2. **Yarn**

### Installation

```bash
git clone https://github.com/HelloTanvir/book_management_system.git
cd book_management_system
yarn install
```

### Configuration

Create a `.env` file based on the template:

```bash
cp .env.example .env
```

```dotenv
# .env
PORT=5000
DATABASE_PATH=./database.sqlite
```

### Running Locally

```bash
# Development w/ hot-reload
yarn start:dev

# Production
yarn build
yarn start:prod
```

Navigate to **http://localhost:5000/api** for the interactive Swagger UI.

### Available Yarn Scripts

| Script            | Purpose                              |
|-------------------|--------------------------------------|
| `yarn start`      | Start in watch mode                  |
| `yarn start:dev`  | Nest dev mode (hot reload)           |
| `yarn start:prod` | Run compiled code                    |
| `yarn build`      | Transpile TypeScript → JavaScript    |
| `yarn test`       | Unit tests                           |
| `yarn test:e2e`   | End-to-end tests                     |
| `yarn test:cov`   | Coverage report                      |
| `yarn lint`       | ESLint static analysis               |

---

## 📖 API Reference

> The full, always-up-to-date specification is available at `/api`.

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Authors

| Method | Path          | Description                       |
|--------|---------------|-----------------------------------|
| GET    | `/authors`    | List (supports `search`, pagination) |
| GET    | `/authors/:id`| Retrieve one                      |
| POST   | `/authors`    | Create new                        |
| PATCH  | `/authors/:id`| Partial update                    |
| DELETE | `/authors/:id`| Remove                             |

#### Books

| Method | Path        | Description                                                         |
|--------|-------------|---------------------------------------------------------------------|
| GET    | `/books`    | List (filter by `authorId`, search in `title`/`isbn`, pagination)    |
| GET    | `/books/:id`| Retrieve one with populated author                                  |
| POST   | `/books`    | Create (`authorId` required)                                        |
| PATCH  | `/books/:id`| Partial update                                                      |
| DELETE | `/books/:id`| Remove                                                               |

##### Pagination & Sorting Parameters

| Param  | Default | Notes                            |
|--------|---------|----------------------------------|
| `page` | `1`     | Page number (1-based)            |
| `limit`| `20`    | Items per page                   |
| `sortBy`| field  | Any entity column                |
| `order`| `ASC`   | `ASC` or `DESC`                  |
| `search`| —      | Fuzzy match on multiple columns  |

Example:

```
GET /books?search=typescript&limit=10&page=2&sortBy=title&order=DESC
```

---

## 🧪 Testing

```bash
# Unit tests
yarn test

# End-to-end
yarn test:e2e
```

---

Feel free to reach out if you have any questions!

---

Happy coding 🚀
