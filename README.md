# CareerForge Pro Backend

AI Resume Architect & ATS Optimizer

##  Backend Architecture
- Models : Define MongoDB schemas using Mongoose
- Controllers : Handle business logic and API responses
- Routes : Define API endpoints and connect to controllers
- Middlewares : Handle authentication, validation, error handling
- config  :  MongoDB connection configuration
- app.js : Express app setup 
- server.js : Application entry point

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication


##### Setup
npm install
npm run devs
Run the Application

# production
npm start 

## Access the API 
http://localhost:5000/api

# Endpoints:

  ### Authentication
- `POST /api/users/signup` → Register user  
- `POST /api/users/login` → Login user  

  ### CRUD Opration for Resume 

  ### 1. Create Resume
 `POST /api/resume/create`
 - Requires authentication

  ### 2. Get All Resumes
 `GET /api/resume/`
 - Requires authentication

  ### 3. Update Resume
 `PUT /api/resume/update/:id`
 - Requires authentication

  ### 4. Delete Resume
 `DELETE /api/resume/delete/:id`
 - Requires authentication

# Usage:
Include token in headers


##  Features

-  User Authentication 
-  Resume Management (CRUD Operations)
  - Create Resume
  - Get All Resumes
  - Update Resume
  - Delete Resume
- Protected Routes (Authentication required)

