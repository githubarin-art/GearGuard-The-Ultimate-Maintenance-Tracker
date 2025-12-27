# GearGuard: The Ultimate Maintenance Tracker

A production-ready maintenance management system for tracking assets and managing maintenance requests.

## Features

✅ Equipment Management (Machines, Vehicles, Computers)
✅ Maintenance Team Management
✅ Maintenance Request Tracking (Corrective & Preventive)
✅ Kanban Board with Drag & Drop
✅ Calendar View for Preventive Maintenance
✅ Smart Buttons & Auto-fill Logic
✅ Overdue Indicators

## Tech Stack

- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **UI Libraries:** React DnD (Drag & Drop), React Big Calendar

## Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup Database
Create a MongoDB database (local or Atlas) and set `MONGO_URI` in your `.env` file:
```bash
cp .env.example .env
# Edit .env and set MONGO_URI, e.g. mongodb://localhost:27017/gearguard
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
npm start
```

## Database Setup

The application uses MongoDB. Ensure your `MONGO_URI` is set and MongoDB is accessible.

## API Endpoints

### Equipment
- GET /api/equipment - List all equipment
- POST /api/equipment - Create equipment
- PUT /api/equipment/:id - Update equipment
- DELETE /api/equipment/:id - Delete equipment

### Teams
- GET /api/teams - List all teams
- POST /api/teams - Create team
- PUT /api/teams/:id - Update team
- DELETE /api/teams/:id - Delete team

### Maintenance Requests
- GET /api/requests - List all requests
- POST /api/requests - Create request
- PUT /api/requests/:id - Update request
- PATCH /api/requests/:id/stage - Update stage
- DELETE /api/requests/:id - Delete request

## Project Structure

```
gearguard/
├── server/
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   └── index.js        # Server entry
├── client/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── App.tsx     # Main app
│   └── package.json
└── package.json
```

## License

MIT
