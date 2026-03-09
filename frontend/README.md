# AI-Powered Smart Salon Management System

A full-stack smart management system designed for high-end salons.  
The system helps manage appointments, clients, staff, inventory, users, and business insights through one dashboard, with AI-powered recommendations and notifications.

---

## Project Overview

This project was built to improve salon operations by focusing on three main goals:

- Reducing appointment congestion through smart staff recommendations
- Controlling inventory and minimizing material waste
- Improving client loyalty using digital memory, VIP logic, and personalized offers

The system combines:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- AI Engine: Python + Flask

---

# Main Features

## Authentication & Roles

- Secure login system
- Password hashing with bcrypt
- User roles:
  - Admin
  - Reception
  - Staff
- Role-based page access

---

## Dashboard

- Total clients
- Today appointments
- Available staff
- Low stock alerts
- VIP clients
- Smart notifications

---

## Clients Management

- Add / edit / delete clients
- Store visit history
- Loyalty level calculation
- Preferred service memory
- Smart offer suggestion

---

## Appointments Management

- Add / edit / delete appointments
- Smart staff recommendation
- Estimated appointment duration
- Expected end time
- Appointment status tracking

---

## Staff Management

- Add and manage staff members
- Specialty
- Speed
- Performance
- Availability

---

## Inventory Management

- Add inventory items
- Track quantity and minimum level
- Low stock alerts
- Smart stock monitoring

---

## Reports & Insights

- Most popular service
- Top performing staff
- Most loyal client
- Completion rate
- AI-powered peak hour analysis
- AI stock risk analysis
- AI loyalty analysis

---

## Users Management

- Add new users
- Change user role
- Delete users
- Admin-only access

---

## Smart Notifications

- Inactive client reminders
- VIP follow-up reminders
- Low stock alerts
- Busy hour alerts

---

# Project Structure

```bash
smart-salon-management-system/
│
├── frontend/
├── backend/
├── ai-engine/
├── database/
├── docs/
└── README.md

Tech Stack
Frontend

React

Vite

React Router DOM

Axios

CSS

Backend

Node.js

Express

MySQL2

JWT

bcryptjs

CORS

dotenv

AI Engine

Python

Flask

Flask-CORS

Pandas

Database

MySQL

phpMyAdmin / XAMPP

Database Tables

The system uses the following main tables:

users

clients

appointments

inventory

staff

Additional fields were added to support:

loyalty logic

appointment duration estimation

AI recommendations

smart notifications

Installation & Setup
1. Clone the project
git clone <alzoubitoqa>
cd smart-salon-management-system
Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
Backend Setup
cd backend
npm install
npm run dev

Backend runs on:

http://localhost:5000
AI Engine Setup
cd ai-engine
pip install -r requirements.txt
python app.py

AI engine runs on:

http://localhost:8000
Environment Variables

Create a .env file inside backend/:

PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_salon_db
JWT_SECRET=smart_salon_super_secret_key_2026
Database Setup

Create the database in MySQL:

CREATE DATABASE smart_salon_db;

Then create the required tables:

users

clients

appointments

inventory

staff

You can also run your saved SQL schema if available.

Demo Accounts

After seeding users, you can log in with:

Admin

Email: admin@pearls.com
Password: 123456

Reception

Email: reception@pearls.com
Password: 123456

Staff

Email: staff@pearls.com
Password: 123456

AI Features

The AI engine currently provides:

Peak hour analysis

Inventory risk analysis

Client loyalty analysis

Smart recommendations for salon management

It also supports:

Smart appointment recommendations

Smart notifications

VIP follow-up logic

Future Improvements

Possible future enhancements include:

WhatsApp / SMS reminder simulation

Export PDF reports

Image upload for clients

Advanced analytics charts

Deployment to cloud

Real-time notifications

Better schedule conflict detection