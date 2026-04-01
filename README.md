# 💎 Veloura – AI-Powered Smart Salon Management System

A full-stack intelligent salon management system designed for modern, high-end beauty salons.  
The platform centralizes operations into a single dashboard while leveraging AI to enhance decision-making, optimize scheduling, and improve customer experience.

---

## 🚀 Project Overview

Veloura was developed to solve real-world salon challenges through technology and AI.

The system focuses on three core objectives:

- Reducing appointment congestion using smart staff recommendations
- Minimizing inventory waste through intelligent tracking
- Increasing customer loyalty via personalized experiences and VIP logic

---

## 🧠 Key Features

### 🔐 Authentication & Roles
- Secure login system (JWT-based)
- Password hashing using bcrypt
- Role-based access:
  - Admin
  - Reception
  - Staff

---

### 📊 Dashboard
- Total clients overview
- Daily appointments tracking
- Available staff monitoring
- Low stock alerts
- VIP client tracking
- Smart notifications system

---

### 👩‍💼 Client Management
- Add / edit / delete clients
- Track visit history
- Loyalty level calculation
- Preferred service memory
- AI-powered offer suggestions

---

### 📅 Appointment Management
- Create / update / delete appointments
- Smart staff recommendation (AI)
- Estimated duration calculation
- Expected end time prediction
- Appointment status tracking

---

### 👨‍🔧 Staff Management
- Manage staff profiles
- Specialty tracking
- Speed & performance monitoring
- Availability status

---

### 📦 Inventory Management
- Track product quantities
- Minimum stock level alerts
- Smart stock monitoring
- Usage-based insights

---

### 📈 Reports & Insights
- Most popular services
- Top-performing staff
- Most loyal clients
- Appointment completion rate
- AI-powered analytics:
  - Peak hours prediction
  - Inventory risk detection
  - Loyalty behavior analysis

---

### 🔔 Smart Notifications
- Inactive client reminders
- VIP follow-up alerts
- Low stock warnings
- Busy hour alerts

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js + Express
- MySQL2
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### AI Engine
- Python + Flask
- Flask-CORS
- Pandas

### Database
- MySQL (XAMPP / phpMyAdmin)

---

## 📂 Project Structure

```bash
smart-salon-management-system/
│
├── frontend/
├── backend/
├── ai-engine/
└── README.md

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/alzoubitoqa/veloura-smart-salon-system.git
cd smart-salon-management-system

2. Frontend Setup
cd frontend
npm install
npm run dev

Runs on: http://localhost:5173

3. Backend Setup
cd backend
npm install
npm run dev

Runs on: http://localhost:5000

4. AI Engine Setup
cd ai-engine
pip install -r requirements.txt
python app.py

Runs on: http://localhost:8000

🔐 Environment Variables

Create a .env file inside backend/:

PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_salon_db
JWT_SECRET=smart_salon_super_secret_key_2026

🗄️ Database Setup
CREATE DATABASE smart_salon_db;

Then create the following tables:

users
clients
appointments
inventory
staff

🔑 Demo Accounts

Admin

Email: admin@veloura.com
Password: 123456

Reception

Email: reception@veloura.com
Password: 123456

Staff

Email: staff@veloura.com
Password: 123456

🤖 AI Capabilities

The system includes intelligent modules for:

Peak hour analysis
Inventory risk prediction
Client loyalty analysis
Smart staff recommendations
Automated notifications logic

🚀 Future Improvements
WhatsApp / SMS notifications
PDF report export
Image upload for clients
Advanced analytics dashboard
Cloud deployment
Real-time updates (WebSockets)

👩‍💻 Author

Toqa Al-Zoubi
AI & Machine Learning Engineer

🔗 GitHub: https://github.com/alzoubitoqa

⭐ Final Note

This project demonstrates the integration of:

Artificial Intelligence
Full-Stack Development
Real-world business problem solving

It reflects a scalable system ready for real-world deployment.
