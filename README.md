# 🌾 AgriConnect  
**Connecting Kenyan Farmers Directly to Buyers — No Middlemen, No Commissions, No Hassles.**

AgriConnect is a full-stack MERN marketplace that empowers farmers to sell fresh produce directly to buyers at fair prices — instantly, securely, and transparently.

Built for Kenya. Made in Kenya. For Kenyans.

---

## 🚀 Live Deployment  
👉 **[Visit AgriConnect Live](https://agriconnect-git-master-james-projects-fe647a3d.vercel.app/)**

---

## ✨ Features

### 👨‍🌾 Farmers Can:
- Register and manage their accounts  
- List produce with images  
- Set custom prices per KG  
- Receive instant real-time notifications  
- Manage orders in a simple dashboard  

### 🛒 Buyers Can:
- Browse available farm produce  
- View farmer profiles (name, phone, location)  
- Place orders instantly  
- Receive instant confirmation  

### ⚡ Real-Time Features
- Live notifications using Socket.io  
- Order status updates  
- Fully responsive (mobile-first)  
- Light & dark mode

---

## 🧰 Tech Stack

**Frontend:** React.js · Vite · Tailwind CSS  
**Backend:** Node.js · Express.js  
**Database:** MongoDB  
**Real-time:** Socket.io  
**Image Uploads:** Multer + Local Storage  
**Authentication:** JWT (token-based)  
**Deployment:** Vercel + Render (compatible with Railway, Fly.io, etc.)

---

## 📂 Project Structure

agriconnect/
├── client/ # React Frontend (Vite)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── api/
│ └── public/
│
├── server/ # Node.js Backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── uploads/ # Product images
│
└── README.md

yaml
Copy code

---

## 🏃‍♂️ How to Run Locally

### 1️⃣ Start the Backend  
```bash
cd server
npm install
npm run dev
➡ Runs on http://localhost:5001

2️⃣ Start the Frontend
bash
Copy code
cd client
npm install
npm run dev
➡ Runs on http://localhost:5173

3️⃣ Open in Browser
Visit:
👉 http://localhost:5173

🔐 Environment Variables (Backend)
Create a .env file inside /server:

env
Copy code
MONGO_URI=mongodb://127.0.0.1:27017/agriconnect
JWT_SECRET=your_strong_secret_here
PORT=5001
🛠 Future Features (Planned)
WhatsApp / SMS notifications

M-Pesa payment integration

Delivery dispatch & tracking

Product ratings & reviews

Verified farmer badge

Admin dashboard

 ❤️ Made With Love For Kenya
This project removes middlemen and puts money directly into farmers' pockets.
No exploitation. No commissions. Just fair and transparent trade.

“When farmers win, Kenya eats better.”