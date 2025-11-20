# AgriConnect

**Connecting Kenyan Farmers Directly to Buyers — No Middlemen, No Commissions, No Hassles.**

AgriConnect is a full-stack MERN marketplace that empowers farmers to sell their fresh produce directly to buyers at fair prices — instantly, securely, and transparently.

Built for Kenya. Made by Kenyans. For Kenyans.

---

### Features

- **Farmers** can:
  - Register as farmers
  - List fresh produce with photos
  - Set their own prices per KG
  - Receive instant order notifications
  - Manage orders in real-time dashboard

- **Buyers** can:
  - Browse fresh farm produce
  - View farmer profiles (name, phone, location)
  - Place orders directly
  - Get instant confirmation

- **Real-time Features**:
  - Live notifications (Socket.io)
  - Order status updates
  - Mobile-responsive design (works perfectly on phones)
  - Dark/Light mode

---

### Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Image Uploads**: Multer + Local Storage
- **Authentication**: JWT + HTTP-only cookies
- **Deployment Ready**: Works on Render, Vercel, Railway, etc.

---

### Project Structure
agriconnect/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── public/
│
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── uploads/            # Product images
│
└── README.md
text---

### How to Run Locally

#### 1. Start the Backend (server folder)
```bash
cd server
npm install
npm run dev
→ Runs on http://localhost:5001
2. Start the Frontend (client folder)
Bashcd client
npm install
npm run dev
→ Runs on http://localhost:5173
3. Open in Browser
Go to: http://localhost:5173

Environment Variables
Create .env in /server:
envMONGO_URI=mongodb://127.0.0.1:27017/agriconnect
JWT_SECRET=your_strong_secret_here
PORT=5001

Future Features (Planned)

WhatsApp/SMS notifications
Payment integration (M-Pesa)
Delivery tracking
Ratings & reviews
Farmer verification badge


Made With Love For Kenya
This app removes middlemen and puts money directly in farmers' pockets.
No commissions. No exploitation. Just fair trade.
"When farmers win, Kenya eats better."

