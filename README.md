# 📚 SmartStudy — Frontend Web Application

**SmartStudy** is a modern, intuitive study planner and productivity web application designed to help students organize their academic life, track progress, and boost focus. This repository contains the React-based frontend of the platform.

---

## ✨ Key Features

- **📊 Dynamic Dashboard:** Get an overview of your academic stats and visualize completion rates using interactive visual charts.
- **📅 Personalized Study Plans:** Create, manage, and schedule study tasks and timelines.
- **⏱️ Pomodoro Focus Timer:** Built-in productivity tool to help you stay focused during study sessions.
- **📖 Subject Management:** Organize your curriculum, track tasks by subject, and stay on top of exams or assignments.
- **🔒 Secure Authentication:** Complete user onboarding with registration, login, and robust password recovery flows.
- **👤 User Profiles:** Track individual achievements and customize account details.

---

## 📸 Snapshots
Responsive Design <img width="1600" height="855" alt="35772cef-aa47-4961-a33f-620aafa0d5bd" src="https://github.com/user-attachments/assets/7cfc527c-e393-4195-b818-0001688dc365" />
Dashboard Overview <img width="1600" height="836" alt="WhatsApp Image 2026-09-05 at 12 09 22 PM" src="https://github.com/user-attachments/assets/c59a1221-4022-447b-8c81-408611a2fc48" />
Subject Management <img width="1600" height="837" alt="WhatsApp Image 2026-09-05 at 12 09 39 PM" src="https://github.com/user-attachments/assets/d3ff83bf-451b-459b-87ee-6389f8a0f01b" />
Automated Study Plan <img width="1600" height="839" alt="WhatsApp Image 2026-09-05 at 12 09 54 PM" src="https://github.com/user-attachments/assets/8e49ed10-4b1b-4b65-a48c-bb15db5fe44b" />
Pomodoro Timer <img width="1600" height="837" alt="WhatsApp Image 2026-09-05 at 12 10 10 PM" src="https://github.com/user-attachments/assets/7e03b8f8-fffa-4db5-8252-60f1c1b532e2" />




---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## 🚀 Getting Started

Follow these simple steps to set up the project locally.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/smart-study.git
   cd smart-study
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory (or update configuration in `src/constants/backendUrl.ts`) to configure your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

---

## 📦 Project Scripts

The following scripts are available in the project:

- `npm run dev`: Runs the app in development mode with Hot Module Replacement (HMR).
- `npm run build`: Compiles and optimizes the application for production deployment into the `dist/` directory.
- `npm run lint`: Performs static code analysis using ESLint to enforce code quality.
- `npm run preview`: Previews the built production application locally.

---

## 📂 Folder Structure

```text
src/
├── assets/         # Project images, icons, and logo assets
├── components/     # Reusable UI components (Navbar, Charts, Breadcrumbs)
├── constants/      # Global constants and API base URL configurations
├── pages/          # Layouts and view pages (Dashboard, Pomodoro, Profile, Auth)
├── services/       # Axios client and API integration layer
├── App.tsx         # Main application component & routes
├── types.ts        # TypeScript interface and type definitions
└── main.tsx        # Application entry point
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project, please fork the repository, make your changes, and submit a pull request.
