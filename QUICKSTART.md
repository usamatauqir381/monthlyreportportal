# Quick Start Guide

Get up and running with SmartPath in 5 minutes!

## Prerequisites

Ensure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ Supabase account (or local PostgreSQL)
- ✅ Git

---

## Step 1: Clone or Download

```bash
# If cloning from GitHub
git clone <repo-url>
cd smartpath

# If using v0, download and extract the ZIP
# Then navigate to the project directory
cd smartpath
```

---

## Step 2: Install & Auto-Generate Prisma Client

```bash
npm install
# The `postinstall` hook automatically runs:
# → npm run postinstall: prisma generate ✓
```

**What this does:**
- Installs all dependencies
- Generates Prisma Client from schema
- Creates `.prisma/client` directory

If you see warnings about PostCSS or TypeScript, ignore them.

---

## Step 3: Configure Database Connection

### Get your Supabase Connection String:

1. Go to **Supabase Dashboard** → Your Project
2. Click **"Connect"** button (top-right)
3. Select **"PostgreSQL"** tab
4. Copy the connection string

### Create `.env.local` file:

```bash
# Copy the example
cp .env.example .env.local

# Edit with your editor
nano .env.local
# or
code .env.local
```

### Paste your connection string:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-key]"
```

**Note:** Replace `[password]` placeholder with your actual password!

---

## Step 4: Initialize Database

```bash
npm run db:push
```

This creates all tables in your PostgreSQL database:
- ✓ Tenants
- ✓ Users
- ✓ Departments
- ✓ Monthly Submissions
- ✓ Metrics
- ✓ Approval Logs

---

## Step 5: Seed Demo Data (Optional)

```bash
npm run db:seed
```

Creates demo users for testing:

| Email | Role | Password |
|-------|------|----------|
| ceo@smartpath.com | CEO | demo123 |
| support@smartpath.com | Department Head | demo123 |
| sales@smartpath.com | Department Head | demo123 |
| hr@smartpath.com | Department Head | demo123 |
| finance@smartpath.com | Department Head | demo123 |
| training@smartpath.com | Department Head | demo123 |

---

## Step 6: Start Development Server

```bash
npm run dev
```

Open browser: **http://localhost:3000**

You should see:
- ✅ Page loads without Prisma errors
- ✅ Redirects to `/auth/login`
- ✅ Can log in with demo credentials

---

## Success! 🎉

Your SmartPath application is ready to use!

### Next Steps:

- **Test the app**: Log in with a demo account
- **Explore dashboards**: Navigate to different department views
- **Check the code**: Start in `/app/dashboard/`
- **Read the docs**: See [README.md](./README.md) for full documentation

---

## Troubleshooting

### ❌ "Cannot find module '.prisma/client'"

```bash
# Regenerate Prisma Client
npx prisma generate

# Then start dev server
npm run dev
```

### ❌ "DATABASE_URL is not set"

```bash
# Create .env.local file
cp .env.example .env.local

# Add your Supabase connection string
# (See Step 3 above)
```

### ❌ "Database connection failed"

1. ✅ Check your DATABASE_URL is correct (no typos)
2. ✅ Verify Supabase project is running
3. ✅ Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### ❌ Other issues?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

---

## Project Structure

```
smartpath/
├── app/                    # Next.js pages & API routes
│   ├── auth/login         # Login page
│   ├── dashboard/         # Dashboard pages
│   └── api/               # Backend API routes
├── components/            # Reusable React components
├── lib/                   # Utilities (db, auth, etc.)
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Demo data
└── public/                # Static assets
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server on :3000

# Database
npm run db:push         # Push schema to database
npm run db:migrate      # Create a migration
npm run db:seed         # Populate demo data

# Build & Deploy
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
```

---

## Deploying to Vercel

1. Push code to GitHub
2. Go to **Vercel.com**
3. Click **"New Project"** → Select your GitHub repo
4. Add environment variables:
   ```
   DATABASE_URL = [your-production-db-url]
   ```
5. Click **"Deploy"**

---

## Support

- 📖 Full documentation: [README.md](./README.md)
- 🆘 Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 🔧 Technical details: [FIX_SUMMARY.md](./FIX_SUMMARY.md)
- 🚀 Setup guide: [SETUP.md](./SETUP.md)

---

**Ready?** Run `npm install` and you're on your way! 🚀
