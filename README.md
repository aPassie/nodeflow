# NodeFlow 🚀

> Because managing tasks shouldn't feel like... well, a task.

A sleek, full-stack task management application built with the MERN stack. Think Trello met a calendar app, they had a baby, and that baby grew up to be really good at organizing stuff.

## 🎯 What's This About?

NodeFlow is a task management platform designed for teams who are tired of sticky notes, forgotten deadlines, and wondering "wait, who was supposed to do that?" It features:

- **Organization Management** - Admin creates an invite code, team joins. Simple as that.
- **Task Creation & Assignment** - Create tasks, add checklists, attach files, assign to your teammates
- **Real-time Tracking** - Check off todos, watch progress bars fill up (oddly satisfying)
- **Dashboard Analytics** - Pretty charts that make you look productive
- **Priority Levels** - High, Medium, Low (we don't judge if everything is "High")
- **Report Generation** - Export to PDF/Excel for those formal meetings

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript 
- Vite 
- shadcn/ui 
- TailwindCSS
- Recharts (for those satisfying data visualizations)

**Backend:**
- Node.js + Express 
- MongoDB + Mongoose 
- JWT Authentication 
- bcrypt

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- Node.js (v16 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn
- A cup of coffee ☕ (optional but recommended)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/nodeflow.git
   cd nodeflow
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This installs dependencies for both frontend and backend. One command to rule them all.

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nodeflow
   JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
   ```
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   sudo systemctl start mongod
   
   # Or if you're on macOS with brew
   brew services start mongodb-community
   ```

5. **Run the application**
   ```bash
   npm run dev:all
   ```
   
   This starts both:
   - Backend server at `http://localhost:5000`
   - Frontend dev server at `http://localhost:8080`

## 📖 How It Works

### For Admins:
1. Sign up with role "Admin"
2. Get your unique invite code
3. Share it with your team
4. Create tasks, assign people, watch productivity soar (hopefully)

### For Team Members:
1. Get invite code from your admin
2. Sign up with role "User" and enter the code
3. View assigned tasks
4. Check off todos
5. Feel accomplished

## 🎨 Features Breakdown

### Authentication
- JWT-based auth (your secrets stay secret)
- Role-based access (Admin vs User)
- Invite code system (no random people in your org)

### Task Management
- Create tasks with title, description, priority, due date
- Add todo checklists (because tasks have sub-tasks, it's turtles all the way down)
- Attach files via URLs (Google Drive, Figma, whatever works)
- Assign to multiple team members
- Edit and delete (admins only)

### Dashboard
- Overview stats (total, completed, in-progress, pending)
- Priority distribution charts
- Status distribution charts
- Recent tasks feed

### User Management
- View all team members
- Remove users from organization (admins only)
- Copy invite code to clipboard

### Reports
- Download task reports as PDF
- Export to Excel for spreadsheet lovers
- Filtered by date range and status

## 📁 Project Structure

```
nodeflow/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Express app entry
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   ├── lib/         # API client & utilities
│   │   └── hooks/       # Custom React hooks
│   └── public/          # Static assets
├── .env                 # Environment variables
└── package.json         # Root package with scripts
```

## 🔐 Security Features

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Organization-based data isolation
- Role-based access control
- Protected API routes

## 🌐 Deployment

### Frontend Deployment
Deploy the `frontend` folder to:
- Vercel (recommended, one click deploy)

Don't forget to set `VITE_API_URL` to your production backend URL.

### Backend Deployment
Deploy the `backend` folder to:
- Render


Set these environment variables:
- `PORT`
- `MONGODB_URI` (MongoDB Atlas recommended)
- `JWT_SECRET`

### Live Links
- **Frontend:** [Add your deployment link here]
- **Backend API:** [Add your API URL here]


---

**Remember:** The best task manager is the one you actually use. Now go organize some stuff! ✨
