# 📚 AI-Based Personalized Learning Platform

An early-stage AI-powered learning platform that helps teachers understand where students struggle and gives students instant, contextual help while studying.
This is currently in process of development.

## 🧠 Project Goal

To build a personalized learning loop where:

- Students study and ask questions

- AI helps in real time

- Teachers see aggregated learning gaps

- Teaching improves based on actual student struggles

# 🚀 Setting Up

### 1. Clone the repository

```bash
git clone https://github.com/ShriyaAl/AI_Personalized_Learning_Platform.git ./
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Gemini API 🔑

- The platform uses the Gemini 2.5 Flash model to power the academic AI Tutor.

- Obtain an API key from the Google AI Studio.

- Create a .env file in the root directory:
  ```bash
  touch .env
  ```
- Add your key to the .env file
  ```bash
  VITE_GEMINI_API_KEY=your_actual_key_here
  ```

### 4. In another terminal:

```bash
  cd backend
  npm install
```

## Backend Setup (Firebase Admin)

1. Go to Firebase Console.

2. Project Settings > Service Accounts.

3. Click Generate New Private Key.

4. Rename the downloaded file to firebaseAdmin.json and move it to backend/config/.

## Frontend Setup (Firebase Client)

1. Go to Firebase Console > Project Settings > General.

2. Scroll to "Your apps" and copy the firebaseConfig object.

3. Save it as firebaseClient.json in src/config/.

### 5. Set up Supabase variables in .env file within backend folder

```bash
DATABASE_URL =
DATABSE_KEY =
```

### 6. Start the development server in one terminal

```bash
npm run dev
```

### 7. Open your browser and visit

```bash
http://localhost:5173
```

### 7. In the terminal having the backend as present working directory

```bash
node app.js
```

## 🗄️ Database Schema

### Supabase (PostgreSQL)

The relational data is stored in Supabase. You can find the full schema in [schema.sql](file:///f:/Projects/AI_Personalized_Learning_Platform/backend/db/schema.sql).

**Main Tables:**

- `users`: Profile and roles (teacher/student).
- `courses`: Learning material containers.
- `groups`: Classrooms and student memberships.
- `quizzes`: AI-generated assessments.
- `discussion_threads`: Forum topics.

### Firebase (Firestore)

Firestore is used for real-time and session-based data.

**Collections:**

- `/sessions/{sessionId}`: AI tutor chat transcripts.
- `/streaks/{userId}`: Gamification data (XP, Streaks).
- `/activity/{userId}/feed`: User event log.
- `/learning_paths/{courseId}`: AI-generated roadmaps.

## 🤖 AI Mastery Checks

The platform features an **Adaptive Quiz Engine** powered by Gemini 2.5 Flash.

- **Dynamic Generation**: Quizzes are generated on-the-fly based on the specific lesson content.
- **Adaptive Difficulty**: The system automatically scales difficulty (HARD → MEDIUM → EASY) if a student struggles, ensuring a personalized mastery path.
- **Threshold-Based Progress**: Students must achieve a mastery score (> 2/5) to unlock rewards and proceed.

---
