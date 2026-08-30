# Pathfinder 🧭
### AI-Powered Personalized Learning Path Recommender
*Developed for the HCL Hackathon*

---

## 💡 Overview

Most online learning platforms give you an endless catalog of courses and leave you to figure out what to learn, in what order, and why. If you want to become a **Full Stack Developer** or a **Data Scientist**, searching for tutorials often leads to tutorial hell—taking overlapping beginner courses or jumping into advanced topics without the required prerequisites.

**Pathfinder** solves this by acting as an intelligent learning copilot. It takes your background, career aspirations, available weekly hours, and current skill set, and builds a **structured, milestone-based learning roadmap**. 

Along the way, an embedded **AI Mentor** explains *why* each course was recommended, breaks down prerequisite dependencies, and adapts your path as you finish modules and level up your skills.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🎯 **Learner Profiling Engine** | Captures target career goals, current skill proficiencies, experience level, weekly time commitment, and learning preferences. |
| 📊 **Skill Gap Analyzer** | Maps current competencies against industry target role profiles to pinpoint exactly what skills are missing. |
| 🧠 **Hybrid Recommendation Engine** | Combines TF-IDF vectorization with cosine similarity and weighted skill-gap scoring (50% content similarity, 35% missing skill coverage, 15% existing skill alignment). |
| 🗺️ **Prerequisite-Aware Roadmaps** | Uses a Directed Acyclic Graph (DAG) dependency graph to logically sequence learning steps (e.g., Foundations ➔ Core ➔ Advanced Projects) so learners don't get stuck. |
| 💬 **Context-Aware AI Mentor** | An interactive conversational assistant powered by Google Gemini that understands your active roadmap, current milestone, and profile to answer doubts and suggest next steps. |
| 📈 **Real-Time Progress Dashboard** | Visualizes completed courses, active milestones, skill mastery metrics, and next recommended actions. |
| 👥 **Role-Based Access Control (RBAC)** | Dedicated interfaces and permissions for **Learners**, **Content Managers** (course management), and **Admins** (system oversight). |

---

## 🏗️ System Architecture & Tech Stack

```
                     ┌─────────────────────────────────────────┐
                     │          React 18 + Vite Client         │
                     │  (Tailwind CSS, Lucide Icons, Router)  │
                     └────────────────────┬────────────────────┘
                                          │ REST API (JWT)
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │           Flask Application Core        │
                     │    Controllers • Services • Blueprints  │
                     └───────┬────────────────────┬────────────┘
                             │                    │
              ┌──────────────┴──────┐      ┌──────┴────────────────┐
              ▼                     ▼      ▼                       ▼
     ┌────────────────┐  ┌──────────────┐  ┌───────────────┐ ┌──────────────┐
     │ MongoDB Atlas  │  │ Scikit-Learn │  │ Prerequisite  │ │ Google       │
     │ / Local DB     │  │ TF-IDF Match │  │ Dependency DAG│ │ Gemini LLM   │
     │ (User/Course)  │  │ Engine       │  │ Topological   │ │ (AI Mentor)  │
     └────────────────┘  └──────────────┘  └───────────────┘ └──────────────┘
```

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (Modern responsive design with glassmorphic accents)
- **Routing:** React Router v7 with protected & role-based routes
- **Icons & UI:** Lucide React, Axios interceptors for JWT session management

### Backend
- **Framework:** Python Flask (Application Factory pattern with modular blueprints)
- **Auth & Security:** Flask-JWT-Extended, Bcrypt password hashing, RBAC middleware
- **Database:** MongoDB via PyMongo
- **AI & NLP Suite:** 
  - `scikit-learn`: TF-IDF Vectorizer with n-grams and cosine similarity ranking
  - Custom Skill Gap & Prerequisite Graph resolver (Topological sort)
  - Google Gemini API (`gemini-3.6-flash` / generative language models) for conversational mentoring

---

## 📁 Repository Structure

```
Pathfinder-The-Genz/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Reusable UI components & layouts
│   │   ├── context/            # Global Auth & State Context
│   │   ├── routes/             # AppRoutes, ProtectedRoute & RoleRoute
│   │   ├── services/           # API service layers (Auth, Course, Roadmap, Chat)
│   │   ├── views/              # Pages: Dashboard, Roadmap, Chat, Courses, Progress...
│   │   ├── App.jsx             # Root React component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend REST API
│   ├── app/
│   │   ├── ai/                 # Recommendation & AI engine
│   │   │   ├── llm/            # Gemini client & prompt templates
│   │   │   ├── nlp/            # Intent classification & text processors
│   │   │   ├── recommendation/ # TF-IDF vectorizer, ranking & skill gap logic
│   │   │   └── roadmap/        # Prerequisite graph & milestone generator
│   │   ├── config/             # DB connection & environment settings
│   │   ├── controllers/        # Request handling & input validation
│   │   ├── middleware/         # RBAC & authentication guards
│   │   ├── models/             # MongoDB data models
│   │   ├── routes/             # Flask blueprints
│   │   └── services/           # Core business logic
│   ├── scripts/                # Database seeders & admin creation utilities
│   ├── main.py                 # Server entry point
│   └── requirements.txt        # Python dependencies
│
└── README.md                   # Project documentation
```

---

## ⚙️ Quick Start & Local Setup

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or newer) & **npm**
- **Python** (v3.10 or newer)
- **MongoDB** (Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI)
- A **Google Gemini API Key** (Free tier from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Setup

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file inside the `server/` directory with the following variables:
   ```env
   FLASK_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=pathfinder_db
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Seed initial courses and create the default admin account:
   ```bash
   # Seed default catalog of courses
   python -m app.data.seed_courses

   # Create the default administrator account
   python -m scripts.create_admin
   ```

6. Start the Flask backend server:
   ```bash
   python main.py
   ```
   > 🚀 Backend will be running at `http://127.0.0.1:5000` (or `http://localhost:5002` if configured).

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > 🌐 Frontend will be accessible at `http://localhost:5173`.

---

## 🔑 Default Test Credentials

You can register a new learner account directly from the UI, or use the pre-seeded admin account:

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pathfinder.com` | `Admin@123` | Full administrative control & role management |
| **Content Manager** | *(Can be created via Admin portal)* | Custom | Add & curate courses and skills |
| **Learner** | *Register via `/register`* | Custom | Personalized Dashboard, Roadmap, AI Mentor, Progress |

---

## 🧮 How the AI Recommendation Algorithm Works

Rather than treating course recommendations as simple keyword searches, Pathfinder combines semantic understanding with structural skill progression:

```
Final Score = (TF-IDF Similarity × 0.50) + (Missing Skill Match × 0.35) + (Current Skill Synergy × 0.15)
```

1. **TF-IDF & N-Gram Vectorization (50%):** Vectorizes course titles, descriptions, topics, and learner career goals to identify semantic relevance.
2. **Skill-Gap Optimization (35%):** Prioritizes courses that directly cover missing skills needed for the learner's target role.
3. **Current Skill Synergy (15%):** Ensures the course matches the learner's existing foundational capabilities without being overwhelmingly difficult.
4. **Prerequisite Graph Resolution:** Milestones are ordered through a topological dependency graph so learners tackle prerequisite concepts (e.g., *Python ➔ Statistics ➔ Machine Learning ➔ Deep Learning ➔ NLP*) in the optimal sequence.

---

## 📡 Key API Endpoints

### Authentication & Profile
- `POST /api/auth/register` - Create learner or content manager account
- `POST /api/auth/login` - Authenticate and receive JWT access token
- `GET /api/users/profile` - Fetch authenticated user profile & skills
- `PUT /api/users/profile` - Update career goal, experience level, interests, and hours

### Recommendations & Roadmap
- `POST /api/recommendations/analyze` - Generate weighted personalized course recommendations
- `GET /api/roadmap` - Retrieve the active customized learning roadmap
- `POST /api/roadmap/generate` - Generate a new milestone roadmap based on current skill gaps

### AI Mentor (Chat)
- `POST /api/chat` - Send query to the Gemini-powered AI Mentor with learner context
- `GET /api/chat/history` - Retrieve conversation history
- `DELETE /api/chat/history` - Clear chat history

### Courses & Progress
- `GET /api/courses` - Browse all available courses
- `POST /api/progress/start/<course_id>` - Enroll in course and track milestone progress
- `PUT /api/progress/update/<course_id>` - Update module completion percentage
- `GET /api/progress` - Get overall progress summary and streak data

---

## 🏆 HCL Hackathon Deliverables Summary

- **Deliverable 1 (Source Code ZIP):** Clean repository excluding `node_modules`, `venv`, and build caches.
- **Deliverable 2 (Source Code Repo):** Complete GitHub repository with structured commit history.
- **Deliverable 3 (Solution Documentation):** Comprehensive architecture, AI/ML scoring breakdown, and workflow specs included.
- **Deliverable 4 (Demo Video):** Walkthrough demonstrating onboarding, roadmap generation, course recommendations, AI Mentor interaction, and progress tracking.
- **Deliverable 5 (Application Access):** Full local execution instructions and environment configuration detailed above.

---

## 👥 Authors & Acknowledgments

- **Team Pathfinder**
- Built with passion for the **HCL Hackathon: AI-Powered Personalized Learning Path Recommender**.
