# SmartPath Setup Guide

## Prerequisites

Make sure you have:
- Node.js 18+ installed
- A Supabase project with PostgreSQL database
- Environment variables configured

## Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

This will automatically run `prisma generate` via the postinstall hook, creating the Prisma Client.

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
# Supabase Database URL
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[your-project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"
```

## Step 3: Initialize Database

```bash
# Option 1: Push schema to database (recommended for development)
npm run db:push

# Option 2: Create a migration
npm run db:migrate
```

## Step 4: Seed Demo Data (Optional)

```bash
npm run db:seed
```

This creates demo users and data for testing:
- **CEO**: ceo@smartpath.com / demo123
- **Department Heads**: support@smartpath.com, sales@smartpath.com, etc. / demo123

## Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Troubleshooting

### Error: "Cannot find module '.prisma/client/default'"

This means Prisma Client hasn't been generated yet. Run:
```bash
npx prisma generate
```

### Error: "DATABASE_URL is not set"

Ensure your `.env.local` file exists and contains the `DATABASE_URL` environment variable.

### Database connection issues

1. Verify your Supabase connection string is correct
2. Check that your database user has proper permissions
3. Ensure you're using PostgreSQL dialect in your connection string

## Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages by role
├── components/            # Reusable React components
├── lib/                   # Utilities and helpers
├── prisma/
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.ts            # Database seeding script
└── scripts/               # Utility scripts
```

## Database Schema

The application uses the following main tables:
- **Tenant**: Multi-tenant organization data
- **User**: User accounts with role-based access
- **Department**: Organizational departments
- **MonthlySubmission**: Monthly performance submissions
- **Metric**: KPI metrics and measurements
- **ApprovalLog**: Submission approval workflow tracking

## Next Steps

1. Customize the design via the Design Mode in v0
2. Add your own data and business logic
3. Configure authentication providers in Supabase
4. Deploy to Vercel or your preferred hosting platform

For more information, see [README.md](./README.md)
