# Quick Start Guide - Fleet Management System

This guide will help you get the Fleet Management System up and running in minutes.

## Prerequisites

Make sure you have Node.js 18 or higher installed. Check with:
```bash
node --version
```

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
```

The default `.env` file is already configured for local development. No changes needed!

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Sample Data
```bash
node scripts/seed.js
```

This creates:
- 3 vehicles (2 active, 1 in maintenance)
- 4 users (1 admin, 1 manager, 2 drivers)
- Sample maintenance records
- Sample trips

### 5. Start the Server
```bash
npm run dev
```

### 6. Login

Open http://localhost:3000 and login with:

**Admin Account:**
- Email: `admin@fleet.com`
- Password: `admin123`

**Manager Account:**
- Email: `manager@fleet.com`
- Password: `manager123`

**Driver Account:**
- Email: `john.doe@fleet.com`
- Password: `driver123`

## What You Can Do

### As Admin (Full Access)
- View dashboard with fleet statistics
- Add/edit/delete vehicles
- Manage all users
- Record maintenance activities
- Track trips
- Generate reports

### As Manager
- View dashboard
- Add/edit vehicles
- Record maintenance
- Track trips
- View reports

### As User/Driver
- View dashboard
- View vehicles
- View trips
- Create new trips

## Key Features to Try

1. **Dashboard** - See real-time fleet statistics
2. **Add Vehicle** - Click "Add Vehicle" on Vehicles page (admin/manager only)
3. **View Vehicle Details** - Click on any vehicle card
4. **Maintenance Records** - Navigate to Maintenance to see service history
5. **Drivers** - View all system users and their roles
6. **Reports** - Explore report generation options

## Troubleshooting

### Database Issues
If you encounter database errors, reset with:
```bash
rm prisma/dev.db
npx prisma db push
node scripts/seed.js
```

### Port Already in Use
If port 3000 is busy, specify a different port:
```bash
PORT=3001 npm run dev
```

### TypeScript Errors
Run type checking:
```bash
npm run type-check
```

## Next Steps

- Explore all pages: Vehicles, Drivers, Maintenance, Reports
- Try adding a new vehicle (admin/manager)
- Record a maintenance activity
- Check out the API documentation in README.md
- Customize the theme in `tailwind.config.ts`

## Need Help?

- See full documentation in README.md
- Check the project structure section for file locations
- All API routes are documented in README.md

---

Happy fleet managing!
