# 📚 Personalized AI Learning Platform — Project Overview

A **Personalized AI Learning Platform** built with:

- **Backend:** Node.js + Express  
- **Databases:**  
  - Supabase (PostgreSQL) → relational data  
  - Firebase Firestore → real-time / NoSQL data  
- **AI Engine:** Gemini 2.5 Flash (AI tutoring)

---

## 🧱 Technical Stack Constraints

### 🔐 Authentication
- Firebase Admin SDK
- Use **httpOnly cookies** for session management

### 🗄️ Database
- `supabase-js` → PostgreSQL operations  
- `firebase-admin` → Firestore operations  

### 🏗️ Architecture
- Controller → Route → Service pattern
- Global:
  - `errorHandler`
  - `logger`

### ✅ Validation
- Use `config/index.js` for environment variable safety

---

## 📡 API Endpoint Specifications

---

## 1. 🔑 Authentication & Identity (`/api/auth`)

### `POST /sync-user`
- Verifies Firebase `idToken`
- Syncs user to **Supabase `users` table**
- Sets role via custom claims
- Issues **httpOnly cookie**

### `POST /logout`
- Clears authentication cookie

### `GET /me`
- Returns:
  - Decoded Firebase user
  - Supabase profile data

---

## 2. 📘 Course & Content Management (`/api/courses`)

### `GET /`
- List all **published courses**

### `GET /:id`
- Get detailed course metadata:
  - Modules
  - Lessons

### `POST /` *(Teacher Only)*
- Create a new course

### `GET /:id/modules`
- Get all modules for a course (ordered)

### `GET /:id/materials`
- Get supplemental content:
  - PDFs
  - Links

---

## 3. 🎓 Enrollments & Progress (`/api/enrollments`)

### `POST /enroll`
- Enroll student into:
  - Course
  - Group (classroom)

### `GET /my-courses`
- List all enrolled courses for authenticated user

### `PATCH /progress`
- Update lesson progress:
  - `lesson_id`
  - Status (e.g., completed)

### `GET /stats/:userId`
- Aggregate:
  - `skill_scores`
  - Badges

---

## 4. 🤖 AI Tutoring & Sessions (`/api/ai`)

### `POST /sessions/start`
- Create new session document in Firestore

### `GET /sessions/history/:courseId`
- Retrieve previous chat transcripts

### `POST /chat`

#### Input:
- `sessionId`
- `message`
- `courseId`

#### Logic:
- Fetch course context from Supabase
- Fetch last **10 messages** from Firestore

#### AI:
- Generate response using **Gemini 1.5 Flash**
- System instruction:
  - Persona → *Socratic Tutor*

#### Output:
- Save:
  - User message
  - AI response → Firestore
- Return generated text

---

### `GET /learning-path/:courseId`
- Retrieve AI-generated learning path from Firestore

---

## 5. 🏆 Gamification & Engagement (`/api/gamify`)

### `GET /streaks/:userId`
- Fetch from Firestore:
  - `streak_count`
  - `xp`

### `GET /badges`
- List all available badges
- Include criteria

### `GET /activity-feed`
- Fetch last **20 activity events**

---

## 6. 📝 Assessments & Quizzes (`/api/quizzes`)

### `GET /course/:courseId`
- List quizzes for a course

### `POST /generate` *(Teacher Only)*
- Use Gemini to:
  - Generate quiz
- Store in:
  - `quizzes`
  - `quiz_questions`

### `POST /submit/:quizId`
- Submit answers
- Calculate score
- Update:
  - `quiz_attempts`
  - `skill_scores`

---

## 7. 💬 Community & Discussions (`/api/discussions`)

### `GET /threads/:courseId`
- List discussion threads

### `POST /threads`
- Create thread:
  - Announcement
  - Question

### `GET /posts/:threadId`
- Get replies

### `POST /posts`
- Reply to thread
- Optional:
  - AI content safety review

---

## 8. 🔔 Notifications (`/api/notifications`)

### `GET /`
- Get unread notifications (Supabase)

### `PATCH /read/:id`
- Mark notification as read

---

## 🌐 Global Requirements

### 🔒 Security
- Access user via:
  ```js
  req.user.uid```

### 🔐 Provided by authMiddleware

---

### ⚠️ Error Handling


### This triggers the global errorHandler

🗃️ Database Usage
supabase → User-level actions
supabaseAdmin → System/auth operations only
⏱️ Timestamps

Use:

PostgreSQL DEFAULT
OR
new Date().toISOString()


9. Frontend-Backend Auth Handshake
The implementation must strictly follow this handshake to ensure roles are synced before the user reaches the dashboard:

Client performs signInWithEmailAndPassword.

Client calls POST /api/auth/sync-user with the idToken.

Backend verifies token, checks Supabase users.role, and calls adminAuth.setCustomUserClaims(uid, { role }).

Backend sets an httpOnly cookie named token.

Client receives success, calls user.getIdToken(true) to refresh local claims, and redirects based on the role value in the token.

10. Frontend Architecture Requirements
apiClient.js: All requests must use a centralized apiRequest utility that:

Uses import.meta.env.VITE_API_BASE_URL.

Includes credentials: 'include' for cookie passing.

AuthContext.jsx: Must provide user, role, and loading states. It must wrap the entire application.

ProtectedRoute.jsx: A high-order component that:

Redirects to /login if user is null.

Redirects to /unauthorized if user.role does not match the requiredRole prop.

11. Security Implementation Rules
RLS (Row Level Security): In Supabase, use the anon key for client-side fetching but enforce RLS policies where auth.uid() = uid.

Service Role: The Backend must use the DATABASE_SERVICE_ROLE_KEY only for the sync-user logic and administrative overrides.

No Secrets on Client: Ensure NO variables like FIREBASE_SERVICE_ACCOUNT or SUPABASE_SERVICE_ROLE are ever referenced in frontend code.

12. Expanded Feature Modules
A. AI Tutor Logic (The "ReMotion" & "Pinnacle" Core)
System Prompting: When calling Gemini, the controller must pull student_badges and skill_scores to adapt the AI's tone (e.g., more challenging for high-skill students).

Context Window: Only send the last 10 messages from the Firestore transcript sub-collection to minimize token usage.

B. Gamification Logic
Trigger: Upon quiz_attempts completion, the backend should check criteria_json in the badges table.

Action: If criteria are met, insert into student_badges and trigger a realtime_notification in Firestore.