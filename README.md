# 🚀 Event Management API
A complete Event Management REST API built using **NestJS + MongoDB**, featuring authentication, role-based access, event CRUD with file upload, attendee registration, and powerful event listing filters.

## 📌 Features
- **JWT Authentication**
- **Role-Based Access Control** (`admin`, `user`)
- **Users**: Register, Login, Get Profile
- **Events (Admin)**: Create, Update, Delete
- **File Upload** (Multer)
- **Event Listing**: Pagination, Search, Date Filter
- **Attendee Registration**

## 🏗 Tech Stack
- NestJS (v10)
- Express
- MongoDB + Mongoose
- JWT Authentication
- Multer
- Class Validator

## 📁 Project Structure
```
src/
 ├── auth/
 ├── users/
 ├── events/
 ├── common/
 ├── app.module.ts
 └── main.ts
uploads/
.env
```

## ⚙️ Installation
### Clone
```
git clone https://github.com/souvikpl/event-management-api.git
cd event-management-api
```

### Install
```
npm install
```

### .env Setup
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/eventdb
JWT_SECRET=souvikevent
JWT_EXPIRES_IN=1h
UPLOAD_DIR=./uploads
```

### Run
```
npm run start:dev
```

## 🧪 Postman
Import:
```
postman_collection.json
```

## 🛠 Scripts
npm run start  
npm run start:dev  
npm run build  

## 📄 License
MIT
