# Gold Loan Management System Documentation

## Overview
A full-stack platform for gold-based loan management, built with React/TypeScript (frontend) and Node.js/Express (backend) using MySQL for persistent storage.

---

## Frontend Functionality
- **User Authentication**: Google OAuth (Firebase), session management, role-based access.
- **User Registration**: Multi-step form, validation, progress persistence.
- **Gold Loan Processing**: Gold valuation, loan calculator, application tracking.
- **Admin Controls**: Application review, user management, system monitoring.

### Main Folders
- `api/`: API calls to backend (`loanApi.ts`, `userApi.ts`).
- `components/`: UI components (`Loading.tsx`, `ProtectedRoute.tsx`).
- `context/`: Auth state.
- `firebase/`: Firebase config.
- `pages/`: User/admin pages.

---

## Backend Functionality (MySQL)
- **Database**: MySQL (`schema.sql` for table definitions).
- **Models**:
  - `userModel.js`: User CRUD, status updates.
  - `loanModel.js`: Loan CRUD, status updates.
  - `goldModel.js`: Gold inventory CRUD.
- **Routes**:
  - `userRoutes.js`: User registration, profile, status.
  - `loanRoutes.js`: Loan application, status, update.
  - `goldRoutes.js`: Gold inventory management.

### MySQL Integration
- All models use MySQL connection pool (`db.js`).
- SQL queries for user, loan, and gold tables.

#### Table Structure
- `users`: id, username, email, password, role, status, created_at
- `loans`: id, user_id, amount, status, applied_at, approved_at
- `gold_inventory`: id, user_id, gold_weight, gold_type, value, created_at

---

## API Endpoints
### User
- `POST /api/users` — Register new user
- `GET /api/users/:id` — Get user by ID
- `GET /api/users/email/:email` — Get user by email
- `PUT /api/users/:id/status` — Update user status

### Loan
- `POST /api/loans` — Apply for loan
- `GET /api/loans/user/:userId` — Get loans for user
- `PUT /api/loans/:id/status` — Update loan status

### Gold
- `POST /api/gold` — Add gold inventory
- `GET /api/gold/:userId` — Get gold inventory for user

---

## Development & Deployment
- **Install dependencies**: `npm install` (frontend), `cd server && npm install` (backend)
- **Configure MySQL**: Use credentials in `db.js` and run `schema.sql` on your MySQL server.
- **Run servers**: `npm run dev` (frontend), `cd server && npm run dev` (backend)
- **Environment variables**: Store MySQL credentials securely.

---

## Testing
- Unit and integration tests for components and API endpoints.
- Test user registration, gold inventory, and loan application flows.

---

## UI/UX
- Tailwind CSS for styling.
- Responsive and accessible design.

---

## Security
- JWT authentication for API.
- Input validation and sanitization.
- CORS and rate limiting.

---

For more details, see `README.md` or ask for specific integration examples.
