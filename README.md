# SecureVision CCTV Solutions

A professional, full-stack CCTV security services website built with:

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express (MVC structure)
- **Database**: MongoDB (Mongoose)
- **Email**: Nodemailer
- **Animations**: Framer Motion

---

## 📁 Project Structure

```
task cctv/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # All page components
│       ├── App.jsx       # Router setup
│       └── index.css     # Tailwind + global styles
└── server/          # Express backend
    ├── config/       # Database config
    ├── models/       # Mongoose models
    ├── routes/       # API route handlers
    ├── index.js      # Express entry point
    ├── seed.js       # Database seed script
    └── .env          # Environment variables
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
# Edit .env with your MongoDB URI and email credentials
npm start
```

> Server runs on `http://localhost:5000`

### 2. Database Seed (optional but recommended)

```bash
cd server
npm run seed  # Inserts 6 services + 6 testimonials into MongoDB
```

### 3. Frontend Setup

```bash
cd client
npm run dev
```

> Frontend runs on `http://localhost:5174`

---

## 🌐 Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/services` | Services List |
| `/services/:slug` | Service Detail |
| `/industries` | Industries Served |
| `/testimonials` | Client Testimonials |
| `/careers` | Careers & Applications |
| `/contact` | Contact Form + Map |
| `/blog` | Blog |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit contact form |
| `GET` | `/api/testimonials` | Fetch testimonials |
| `GET` | `/api/services` | Fetch all services |
| `GET` | `/api/services/:slug` | Fetch one service |
| `POST` | `/api/careers` | Submit job application |
| `GET` | `/api/health` | Health check |

---

## ⚙️ Environment Variables (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/securevision_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=info@securevision.com
NODE_ENV=development
```

> For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your regular password.

---

## 🎨 Theme

Dark blue security theme: `#060e1a` (bg) · `#0a1628` (surface) · `#3b82f6` (accent)
