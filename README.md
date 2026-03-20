# 📚 ExamGenie (100)
### AI-Powered Exam Preparation Platform

ExamGenie is a modern, full-stack academic web application designed to help students study smarter by transforming uploaded reviewers into **AI-generated mock exams**. Built for **school and academic use**, it focuses on learning reinforcement, self-assessment, and progress tracking.

---

## ✨ Features

### 🔐 Authentication
- Secure **Login & Signup** using Supabase (Email & Password)
- Protected routes for authenticated users

### 🏠 Landing Page
- Scrollable **Home Page**
- Call-to-action sections
- Modern navigation menu
- Footer with helpful links

### 📂 Reviewer Upload
- Upload **PDF reviewers** (up to 10MB)
- Stored securely using Supabase Storage
- Automatic text extraction

### 🧠 AI Exam Generator
- Generates mock exams directly from uploaded reviewers
- Supported question types:
  - Multiple Choice
  - True / False
  - Identification
  - Short Answer
- Customizable:
  - Number of questions
  - Difficulty level (Easy / Medium / Hard)
  - Randomized questions per attempt

### ⏱️ Exam System
- Timed exams
- Unlimited retakes
- Auto-submit on timeout

### 📊 Results & Analytics
- Instant scoring
- Correct answers shown
- AI-generated explanations
- Performance graphs
- Topic-level weakness analysis
- Improvement suggestions

### 📁 Dashboard
- Sidebar navigation
- Exam history
- Progress tracking
- Subject management

### 🌗 Dark & Light Mode
- Modern UI with theme toggle
- Fully responsive design

### 💳 Payment Integration
- Stripe / PayPal support
- Subscription-based premium features
- Secure checkout and plan management

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- React Router
- Context API (Auth & Theme)

### Backend
- **Node.js**
- **Express.js**
- REST API architecture

### Database & Auth
- **Supabase**
  - Authentication
  - PostgreSQL Database
  - File Storage

### AI
- LLM-based API (Free / Low-cost)
- Used for:
  - Exam generation
  - Auto-grading
  - Explanations
  - Improvement suggestions

### Payments
- Stripe or PayPal

---

## 📁 Project Structure

```bash
examgenie/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, Footer, UI components
│   │   ├── pages/          # Home, Login, Dashboard, Exam, Results
│   │   ├── context/        # Auth & Theme Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   ├── assets/         # Images & icons
│   │   └── App.jsx
│   └── tailwind.config.js
│
├── server/                 # Express Backend
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── services/           # AI, Supabase, Payments
│   ├── middleware/         # Auth & validation
│   └── index.js
│
├── .env
├── README.md
└── package.json
