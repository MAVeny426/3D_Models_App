# 3D_Models_App

This is a full-stack web application designed to display 3D models in GLB format. It features a dashboard for uploading 3D models to a MongoDB database and serves them for display on the frontend.

## 🚀 Live Demo
- Frontend: ```bash https://threed-models-app-1zkr.onrender.com ```
- Backend : ```bash https://threed-models-app.onrender.com ```
  

## ✨ Features

  - 3D Model Display: Renders GLB-formatted 3D models on the web.

  - Home : Provides an interface for authenticated users to upload new 3D models.

  - Database Storage: Stores 3D model metadata and file paths in MongoDB Atlas.

  - User Authentication: Secure user registration and login.

  - CORS Configuration: Properly configured for secure communication between frontend and backend.
 
 ## 🛠️ Technologies Used
 
 Frontend: 

- React: A JavaScript library for building user interfaces.

- Vite: A fast build tool for modern web projects.

- @react-three/fiber: A React renderer for Three.js, bringing 3D to React.

- @react-three/drei: A collection of useful helpers and abstractions for @react-three/fiber.

- Three.js: A JavaScript 3D library.

- React Router DOM: For declarative routing in React applications.

- Tailwind CSS: A utility-first CSS framework for rapid UI development.
    
    
 Backend (backend directory)

   - Node.js: JavaScript runtime environment.

   - Express.js: Fast, unopinionated, minimalist web framework for Node.js.

   - MongoDB: NoSQL database for storing data.

   - Mongoose: MongoDB object data modeling (ODM) for Node.js.

   - Bcrypt & Bcryptjs: For hashing passwords securely.

   - JSON Web Tokens (JWT): For user authentication and authorization.

   - Multer: Middleware for handling multipart/form-data, used for file uploads.

   - Nodemailer: Module for sending emails (e.g., for contact forms or notifications).

   - CORS: Node.js package for providing a Connect/Express middleware that can be used to enable CORS.

   - Dotenv: Loads environment variables from a .env file.
     

  ## 🚀 Getting Started

 -- Prerequisites
 
  - Node.js (v18+)
  - npm (or yarn/pnpm)
  - MongoDB (local or cloud-hosted like MongoDB Atlas)
  - Git

## 1. Clone the repository
```bash git clone git@github.com:MAVeny426/3D_Models_App.git ```
```bash cd 3D_Models_App/3D_Models ```

## 2. Backend Setup
```bash cd backend ```

Install dependencies:
```bash npm install ```

Create a .env file in the backend directory and add the following environment variables:

```bash MONGO_URL=mongodb+srv://venyma504:w7XkOagoujZk4rXP@cluster0.46qrm8i.mongodb.net/3D-Models?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=3d_models
CORS_ORIGIN=https://threed-models-app-1zkr.onrender.com
PORT=5000
```

Start the backend server:

```bash npm start
# or for development with nodemon
npm run dev
```

The backend will run on http://localhost:5000

## 3. Frontend Setup
Navigate back to the 3D_Models directory and then into the frontend directory:
``` bash
cd ../frontend
Install dependencies:
```

```bash
npm install
```

Create a .env file in the frontend directory and add the following environment variables if your frontend needs to know the backend URL during local development:

## Code snippet

VITE_APP_BACKEND_URL=http://localhost:5000 # Or your backend's local development URL
Start the frontend development server:

``` bash

npm run dev
```

The frontend will typically run on http://localhost:5173 (Vite's default).


