# 🗂️ Task Manager App

A full-stack task management application built using the **MERN stack** with secure authentication, role-based access, file uploads, checklist tracking, and real-time dashboards.

🔗 **Live Demo**: [https://task-manager-dusky-nine.vercel.app/](https://task-manager-dusky-nine.vercel.app/)

---

## 🚀 Features

- 🔐 **JWT Authentication** (Register/Login/Profile)
- 👥 **Role-Based Access** (Admin & User dashboards)
- 📋 **Task Management** (CRUD, status, priority, due dates)
- ✅ **Todo Checklist** (Subtasks inside tasks)
- 🧑‍🤝‍🧑 **Multi-user Task Assignment**
- 📁 **File Upload Support** (Multer + Local Storage)
- 📊 **Dashboard Charts** (Recharts)
- 📈 **Task/User Report Export**
- ⚙️ **REST API with Modular Controllers**

---

## 🧱 Tech Stack

| Layer         | Tech Stack                                       |
| ------------- | ------------------------------------------------ |
| **Frontend**  | React, Tailwind CSS, React Router, Moment.js     |
| **Backend**   | Node.js, Express.js, MongoDB, Mongoose           |
| **State**     | React Context                                     |
| **Auth**      | JWT (JSON Web Tokens), bcrypt                    |
| **Upload**    | Multer                                            |
| **Charts**    | Recharts                                         |
| **Deployment**| Frontend: Vercel • Backend: Render               |

---

## 📁 Folder Structure

### 🔙 Backend

backend/
├── config/ # DB connection
│ └── db.js
├── controllers/ # Route handlers
│ ├── authController.js
│ ├── reportController.js
│ ├── taskController.js
│ └── userController.js
├── middleware/
│ ├── authMiddleware.js
│ └── uploadMiddleware.js
├── models/
│ ├── Task.js
│ └── User.js
├── routes/
│ ├── authRoutes.js
│ ├── reportRoutes.js
│ ├── taskRoutes.js
│ └── userRoutes.js
├── uploads/ # Uploaded files/images
├── .env
├── server.js # Entry point


### 🌐 Frontend

frontend/
├── public/assets/images/
│ ├── auth-image.jpg
│ └── react.svg
├── src/
│ ├── components/
│ │ ├── Cards/
│ │ ├── Charts/
│ │ ├── Inputs/
│ │ └── layouts/
│ ├── context/ # userContext
│ ├── hooks/ # useUserAuth
│ ├── pages/ # Admin, Auth, User
│ ├── utils/ # axios, API paths, image upload
│ ├── App.jsx
│ └── main.jsx
├── vite.config.js
├── tailwind.config.js



---

## 🔐 Authentication APIs

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/auth/register`  | Register a new user            |
| POST   | `/api/auth/login`     | Login user                     |
| GET    | `/api/auth/profile`   | Get logged-in user profile     |
| POST   | `/api/auth/upload-image` | Upload profile image        |

---

## 👥 User APIs (Admin Only)

| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| GET    | `/api/users`               | Get all users                 |
| GET    | `/api/users/:id`           | Get user by ID                |
| POST   | `/api/users`               | Create user                   |
| PUT    | `/api/users/:id`           | Update user                   |
| DELETE | `/api/users/:id`           | Delete user                   |

---

## ✅ Task APIs

| Method | Endpoint                             | Description                          |
|--------|--------------------------------------|--------------------------------------|
| GET    | `/api/tasks`                         | Get all tasks                        |
| GET    | `/api/tasks/:id`                     | Get a task by ID                     |
| POST   | `/api/tasks`                         | Create a new task                    |
| PUT    | `/api/tasks/:id`                     | Update task by ID                    |
| DELETE | `/api/tasks/:id`                     | Delete task by ID                    |
| PATCH  | `/api/tasks/:id/status`              | Update task status                   |
| PATCH  | `/api/tasks/:id/todo`                | Update checklist inside task         |
| GET    | `/api/tasks/dashboard-data`          | Admin dashboard summary              |
| GET    | `/api/tasks/user-dashboard-data`     | User-specific dashboard summary      |

---

## 📄 Report APIs

| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/api/reports/export/tasks`     | Export task data        |
| GET    | `/api/reports/export/users`     | Export user data (Admin)|


## ⚙️ Getting Started (Local Setup)

Follow these steps to run the app locally.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

---

### 🔙 Backend Setup

1. Clone the repository and navigate to the backend folder:

   ```bash
   git clone <your-repository-url>
   cd backend
2.Install backend dependencies:
npm install
3.Create a .env file in the backend folder with the following variables:
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

3.Start the backend server:
npm run dev,npm start


### 🌐 Frontend Setup
Navigate to the frontend folder:
cd ../frontend
Install frontend dependencies:
bun i 
Start the frontend development server:
bun dev
Start the frontend development server:

📤 Deployment
Frontend: Vercel
Backend: Render

🤝 Contributing
Contributions, issues, and feature requests are welcome!  
Feel free to fork the repository and create pull requests.

🧑‍💻 Author
Neel Samel
📧 neelsamel3@gmail.com

📜 License
This project is licensed under the MIT License.

Feel free to reach out via email: neelsamel3@gmail.com

