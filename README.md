# MuscleApp – MERN Workout Tracker

MuscleApp is a full-stack **MERN** application that allows registered users to track their workouts, manage training sessions by date, and view personal statistics.  
The application is built with a modern architecture and deployed to production using **Vercel** and **Render**.

- **Live demo (frontend):** https://mernapp-umber.vercel.app
- **Backend API:** https://mernapp-backend-tbx6.onrender.com

---

## What This Project Demonstrates

- Full-stack MERN development
- Secure authentication and authorization (JWT)
- Clean separation of frontend and backend
- RESTful API design
- Production deployment and debugging
- Real-world problem solving (CORS, environment variables, deployment issues)

---

## Features

### Authentication & Authorization

- JWT-based authentication
- Protected API endpoints

### Workout Management

- Create, update, and delete workouts
- Workouts are user-specific

### Calendar-Based UI

- Day-based workout view
- Weekly overview

### Profile & Statistics

- Workout counts
- Historical workout data

### Production Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Screenshots

### Authentication

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/home.png)

### Workout Details

![Profile](screenshots/profile.png)

### Profile & Statistics

![Workout List](screenshots/list.png)

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Custom Hooks
- Context API
- CSS Modules

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- express-validator

### DevOps / Tooling

- Vercel
- Render
- MongoDB Atlas
- Git & GitHub
- Environment variables (.env)

---

## Project Structure

```txt
mernapp/
├── client/              # React frontend (Vite)
│   ├── src/
│   └── dist/
├── server/              # Node / Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── app.js
└── README.md
```

---

## Environment Variables

### Backend(server)

- MONGODB_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- NODE_ENV=production

### Frontend(client)

VITE_BACKEND_URL=https://mernapp-backend-tbx6.onrender.com

---

## Local Development

#### Clone repository

- git clone https://github.com/yourusername/mernapp.git
- cd mernapp

#### Backend

- cd server
- npm install
- npm run dev

#### Frontend

- cd client
- npm install
- npm run dev

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Api Endpoints

#### Auth

- POST /api/user/signup
- POST /api/user/login
- GET /api/user/me

#### Workouts

- GET /api/workouts/user/:uid
- POST /api/workouts
- PATCH /api/workouts/:wid
- DELETE /api/workouts/:wid

---

## Contact

This project was built for learning and portfolio purposes.
