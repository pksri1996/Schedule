# 🗓️ Employee Scheduler App

A full-stack employee scheduling system built with the **MERN stack** (MongoDB, Express, React, Node.js). Designed to handle large-scale scheduling needs with dynamic rotation, central zone tracking, replacement management, and leave handling for up to 3000 employees.

---

## 🚀 Features

- 📅 **Automated Scheduling**: Assigns employees to different zones based on logic — rotation, preferences, and central zone minimums.
- 🔁 **Zone Rotation Logic**: Ensures employees rotate through 5 zones, including a central zone where each must serve at least once before repeating.
- 💼 **Role-Based Assignments**: Designation-based assignment of TSI, HC, and C for each zone.
- 💤 **Leave Management**: Handles employee leave with replacement logic and dynamic updates.
- 👀 **Detailed Employee Views**: Expandable, inline employee info with designation, leave history, and central zone days.
- 🧠 **Smart Replacements**: Supports impromptu leave and auto-adjusts current schedule with replacements.
- 🎯 **Optimized Performance**: Built to handle 3000 employees with real-time adjustments.

---

## 🛠️ Tech Stack

**Frontend**:
- React (Vite)
- Material UI
- Axios

**Backend**:
- Node.js
- Express.js
- MongoDB (Mongoose)

---

## 📷 Screenshots

_Add screenshots or GIFs here (optional)_

---

## 🧪 How to Run Locally

### 🔧 Backend
```bash
git clone https://github.com/your-username/scheduler-backend
cd scheduler-backend
npm install
npm run dev
