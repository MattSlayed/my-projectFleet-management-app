# Fleet Management System

A comprehensive fleet management application built with Next.js, TypeScript, Prisma, and Tailwind CSS. This system allows you to manage vehicles, drivers, maintenance records, trips, and generate reports.

## Features

- **Dashboard**: Real-time overview of fleet statistics and metrics
- **Vehicle Management**: Add, edit, and track all fleet vehicles
- **Driver Management**: Manage users and driver assignments
- **Maintenance Tracking**: Record and monitor vehicle maintenance activities
- **Trip Management**: Track vehicle trips and routes
- **Reports & Analytics**: Generate insights about fleet performance
- **Authentication**: Secure login system with role-based access control
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite (easily swappable to PostgreSQL/MySQL)
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd my-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following variables:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database with initial data (optional):
```bash
node scripts/seed.js
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

After seeding the database, you can login with:

- **Email**: admin@fleet.com
- **Password**: admin123

## Database Schema

The application uses the following main models:

- **User**: System users with roles (admin, manager, user)
- **Vehicle**: Fleet vehicles with all relevant details
- **DriverAssignment**: Links drivers to vehicles
- **MaintenanceRecord**: Tracks vehicle maintenance activities
- **Trip**: Records vehicle trips and routes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
my-project/
├── components/          # React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── StatsCard.tsx   # Dashboard statistics card
│   ├── VehicleCard.tsx # Vehicle display card
│   └── VehicleForm.tsx # Vehicle form component
├── lib/                # Utility functions and configurations
│   ├── auth.ts         # NextAuth configuration
│   ├── prisma.ts       # Prisma client
│   ├── utils.ts        # Utility functions
│   └── validations.ts  # Zod validation schemas
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── vehicles/      # Vehicle pages
│   ├── drivers/       # Driver pages
│   ├── maintenance/   # Maintenance pages
│   ├── reports/       # Reports pages
│   ├── index.tsx      # Dashboard
│   └── login.tsx      # Login page
├── prisma/            # Prisma schema and migrations
│   └── schema.prisma  # Database schema
├── styles/            # Global styles
│   └── globals.css    # Tailwind CSS imports
├── types/             # TypeScript type definitions
│   ├── index.ts       # Main types
│   └── next-auth.d.ts # NextAuth type extensions
└── public/            # Static files
```

## API Routes

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create new vehicle (admin/manager only)
- `GET /api/vehicles/[id]` - Get vehicle details
- `PUT /api/vehicles/[id]` - Update vehicle (admin/manager only)
- `DELETE /api/vehicles/[id]` - Delete vehicle (admin only)

### Maintenance
- `GET /api/maintenance` - List maintenance records
- `POST /api/maintenance` - Create maintenance record (admin/manager only)

### Trips
- `GET /api/trips` - List trips
- `POST /api/trips` - Create new trip

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## User Roles

- **Admin**: Full access to all features including user management
- **Manager**: Can manage vehicles, maintenance, and trips
- **User**: Can view data and create trips

## Customization

### Changing Database Provider

To use PostgreSQL or MySQL instead of SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update DATABASE_URL in `.env`:
```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/fleet_db"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/fleet_db"
```

3. Run migrations:
```bash
npx prisma db push
```

### Styling

The application uses Tailwind CSS. You can customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your brand colors here
      },
    },
  },
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue in the repository.

## Screenshots

The application includes:
- Interactive dashboard with real-time statistics
- Vehicle management with detailed views
- Maintenance tracking and history
- Driver assignment management
- Comprehensive reporting system

---

Built with Next.js and TypeScript
