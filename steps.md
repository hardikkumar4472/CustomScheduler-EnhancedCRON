# 🚶‍♂️ Step-by-Step Implementation Guide

Follow these concise steps to build **Cron++** from scratch. This is designed for a MERN stack approach but focuses on the logic flow.

---

### Phase 1: Foundation & Auth 🔐
1. **Initialize Project:** Create a root folder with `server/` and `client/` subdirectories.
2. **Setup Server:** Initialize `npm` in the server folder and install dependencies (`express`, `mongoose`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `cors`, `cron-parser`).
3. **User Schema:** Create a `User` model with `email` and `password`.
4. **Auth Routes:** Build `/signup` (hashing password) and `/login` (returning a JWT).
5. **Auth Middleware:** Create a function to verify JWTs to protect your Job routes.

### Phase 2: The Data Store 🗄️
6. **Job Schema:** Create a `Job` model with:
   - `userId` (Owner)
   - `name`, `status` (PENDING, RUNNING, SUCCESS, FAILED)
   - `cronExpression` (string)
   - `action` (Object: {url, method, payload})
   - `nextRunTime` (Date - **Crucial for the Poller**)
   - `retryConfig` (Object: {attempts, max})
7. **Job CRUD:** Build routes to Create, Read, and Delete jobs.
8. **NextRun Logic:** When creating a job, use `cron-parser` to calculate the first `nextRunTime` based on the cron string and save it.

### Phase 3: The Engine (The Poller) ⚙️
9. **The Loop:** Create a script (`poller.js`) that runs a `setInterval` (e.g., every 10 seconds).
10. **The Fetch:** Query MongoDB for jobs where `nextRunTime <= new Date()` and `status` is `PENDING`.
11. **The Lock (Concurrency):** Use `findOneAndUpdate` to atomically change the status from `PENDING` to `RUNNING`. This ensures distributed safety.
12. **The Worker:** If a job is locked, trigger the action (e.g., use `axios` to hit the target Webhook URL).

### Phase 4: Reliability & Lifecycle 🔁
13. **Success Handling:** If the worker succeeds:
    - If recurring: Calculate the *new* `nextRunTime` and set status back to `PENDING`.
    - If one-time: Set status to `SUCCESS`.
14. **Failure & Retry:** If the worker fails:
    - Increment `retryCount`.
    - If `retryCount < max`, calculate a backoff time (e.g., now + 5 mins) and set status back to `PENDING`.
    - Else, set status to `DEAD` or `FAILED`.
15. **Execution Logs:** Every attempt should create a document in an `ExecutionLogs` collection for user visibility.

### Phase 5: The Interface 🖥️
16. **React Setup:** Initialize a React app (Vite) and install `axios`, `lucide-react`, and a routing library.
17. **Auth UI:** Build the Login/Signup pages and store the token in `localStorage`.
18. **Dashboard:** Build a table to display all jobs belonging to the logged-in user.
19. **Job Creator:** Create a form with:
    - Name field
    - Cron expression helper (or simple picker)
    - Webhook URL & JSON Payload editor
20. **Monitoring:** Add a "View Logs" modal to see the history of tries/failures for a specific job.

---

### 💡 Pro Tip for Development:
*   Start by manually setting `nextRunTime` in the database to test your **Poller** before you build the **Cron Parser** logic. 
*   Use a tool like **Webhook.site** to test your scheduler's outgoing requests.
