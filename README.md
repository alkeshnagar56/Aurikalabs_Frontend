# Aurika Labs – Frontend

Frontend application for **Aurika Labs**, a modern collaborative workspace that combines project management, real-time communication, task tracking, and team collaboration in a single platform.

---

## Tech Stack

* React (Vite)
* Tailwind CSS
* Axios
* Socket.IO Client
* React Router DOM
* React Context API
* React Hot Toast
* Lucide React

---

## Core Features

### Authentication

* User Registration
* User Login
* Protected Routes
* JWT-Based Authentication Flow

### Dashboard

* User Dashboard
* Project Overview
* Assigned Tasks Overview
* Recent Activity Tracking

### Project Management

* Create Projects
* Update Projects
* Delete Projects
* Project Details Page
* Team Member Management
* Role-Based Access Control

### Task Management

* Create Tasks
* Update Tasks
* Delete Tasks
* Task Assignment
* Priority Management
* Status Tracking
* Kanban Workflow

### Real-Time Collaboration

* Real-Time Project Updates
* Real-Time Task Updates
* Real-Time Comments
* Real-Time Activity Feed
* Socket.IO Integration

### Comments System

* Task-Based Discussions
* Comment Creation
* Comment Deletion
* Permission-Based Comment Management

### Activity Tracking

* Task Creation Activities
* Task Update Activities
* Task Deletion Activities
* Task Movement Activities
* Comment Activities
* Live Activity Feed

### Messaging System

* Real-Time Chat
* Typing Indicators
* Read Receipts
* Presence Tracking
* Conversation Management

### UI & UX

* Responsive Design
* Mobile-Friendly Layout
* Dark Modern Interface
* Reusable Components
* Toast Notifications
* Confirmation Modals

---

## Folder Structure

frontend/

├── components/

├── context/

├── models/

├── pages/

├── services/

├── sockets/

├── utils/

├── App.jsx

├── main.jsx

├── package.json

└── .env

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://aurikalabs-backend.onrender.com

VITE_SOCKET_URL=https://aurikalabs-backend.onrender.com
```

---

## Installation

Clone repository:

```bash
git clone https://github.com/alkeshnagar56/Aurika-Labs.git
```

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Application runs on:

```text
http://localhost:5173
```

---

## Production Build

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Backend Repository

Aurika Labs Backend:

https://github.com/alkeshnagar56

---

## Deployment

### Frontend

Hosted on Vercel

### Backend

Hosted on Render

### Database

Hosted on MongoDB Atlas

---

## Author

**Alkesh Nagar**

GitHub:
https://github.com/alkeshnagar56

---

## License

This project is developed for educational, learning, and portfolio purposes.
