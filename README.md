# 📚 AI-Based Personalized Learning Platform

An early-stage AI-powered learning platform that helps teachers understand where students struggle and gives students instant, contextual help while studying.

## 🧠 Project Goal

To build a personalized learning loop where:

- Students study and ask questions

- AI helps in real time

- Teachers see aggregated learning gaps

- Teaching improves based on actual student struggles

## 🚀 Quick Start

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
  ``` bash
  touch .env
  ```
- Add your key to the .env file
  ``` bash
  VITE_GEMINI_API_KEY=your_actual_key_here
  ```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open your browser and visit

```bash
http://localhost:5173
```
