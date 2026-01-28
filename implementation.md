# 🛠️ Cron++ Implementation Plan (MERN Stack)

This document outlines the architecture and step-by-step roadmap to build **Cron++**, a distributed task scheduler, using MongoDB, Express, React, and Node.js.

---

## 🏗️ Full-Stack Architecture

### 1. **Backend (Node.js & Express)**
- **API Server:** Handles REST requests from the frontend to manage job lifecycles.
- **The Poller:** A dedicated background process that queries MongoDB every few seconds for jobs where `nextRunTime <= now`.
- **Execution Worker:** The logic that executes the task (e.g., making an HTTP request to a target service).
- **Concurrency Guard:** Uses MongoDB's atomic operations (`findOneAndUpdate`) to implement a distributed lock, ensuring only one worker instance picks up a specific job.

### 2. **Database (MongoDB)**
- **Jobs Collection:** Stores job metadata, cron expressions, payloads, and current state.
- **Logs Collection:** Stores the history of every execution attempt, including error stack traces for failed retries.

### 3. **Frontend (React)**
- **Dashboard:** A modern, real-time UI to monitor "In-Flight" and "Scheduled" jobs.
- **Job Creator:** An interface to define task payloads and schedule patterns (using a Cron expression builder).
- **History Viewer:** A detailed drill-down into why a job failed or when it last succeeded.

---

## 📅 The 20-Phase Roadmap

### Phase 1: Environment & Project Setup
Initialize the project structure. Setup `server/` and `client/` directories. Configure Git, `.env` variables, and basic scripts.

### Phase 2: MongoDB Schema Design (Users & Jobs)
Define the `User` schema (email, password hash) and the `Job` schema (linked to `userId`, schedule, status, nextRunTime).

### Phase 3: Auth Backend - Signup & JWT
Implement the `/api/auth/signup` route with password hashing (Bcrypt) and JWT token generation.

### Phase 4: Auth Backend - Login & Validation
Implement the `/api/auth/login` route and create an `authMiddleware` to protect private routes using JWT.

### Phase 5: Express Server & General Middleware
Set up the core Express app with CORS, JSON parsing, and a centralized error handling system.

### Phase 6: Job Management API (Write - Secured)
Implement `POST /api/jobs` where the job is automatically assigned to the `req.user.id`. Calculate the first `nextRunTime`.

### Phase 7: Job Management API (Read - Secured)
Implement `GET /api/jobs` to fetch only the jobs belonging to the authenticated user. Add pagination.

### Phase 8: The Core Poller (Background Loop)
Create the high-frequency poller that scans the DB for any job (across all users) that is due for execution.

### Phase 9: Atomic Locking Mechanism
Implement the "Claim" logic. Use MongoDB's `findOneAndUpdate` to prevent multiple workers from running the same job.

### Phase 10: Execution Engine & Worker Logic
Build the worker logic to execute the task (simulated HTTP request or log). Handle time-tracking for execution duration.

### Phase 11: Workflow Lifecycle Management
Manage state transitions: `PENDING` -> `RUNNING` -> `SUCCESS`. Update `nextRunTime` for recurring patterns.

### Phase 12: Exponential Backoff Retry Logic
Implement failure handling. Reschedule failed jobs with increasing delays based on the `retryCount`.

### Phase 13: Execution History & Logs
Set up the `ExecutionLog` collection. Log every attempt (User, JobID, Status, Error Message) for traceability.

### Phase 14: React Frontend Setup (Vite)
Initialize the React app. Install essential libraries (Axios, Framer Motion, React Router, Lucide Icons).

### Phase 15: Auth Frontend - Signup & Login Pages
Design stunning, premium Login/Signup screens with validation and error feedback.

### Phase 16: Auth Context & Protected Routes
Implement a React Context to manage `user` state and create a `ProtectedRoute` wrapper for the Dashboard.

### Phase 17: Job Creation & Action Definition UI
Build the main dashboard interface. Create a sleek form for:
- **The "When" (Schedule):** Dynamic Cron builder or Date/Time picker.
- **The "What" (Action):** Input fields for Webhook URL, HTTP Method (POST/GET), and custom JSON Payload to be sent when the job triggers.
- **Retry Config:** Setting the max retry limits and backoff preference.

### Phase 18: Real-time Job Monitoring Table
Build the "My Jobs" table with status badges and real-time updates (via polling or local state management).

### Phase 19: Detailed Log Viewer & Edit UI
Add a modal to view execution history for a job and implement the ability to Pause/Resume/Delete jobs.

### Phase 20: Performance Tuning & Final Polish
Add MongoDB indexes for speed. Implement loading skeletons and smooth transitions. Final deployment testing.
