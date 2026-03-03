# Smart Path - Multi-Tenant Department Management Platform

A comprehensive enterprise portal for managing 9+ departments with real-time dashboards, role-based access control, and monthly reporting workflows.

## 🎯 Features

### ✅ Completed

#### **Foundation & Infrastructure**
- Multi-tenant architecture with Supabase PostgreSQL
- Role-based access control (RBAC) with 5 roles
- Secure authentication with JWT tokens and HTTP-only cookies
- Professional theme system (3-color design: deep blue primary, teal accent, slate secondary)
- RESTful API with authorization middleware
- Database seeding with demo data

#### **CEO Dashboard**
- 15 real-time metrics organized in 4 categories:
  - **Students**: Active students, Net growth, Churn rate
  - **Revenue**: ARPA, Revenue MTD, Cash collected, Receivables, Gross margin
  - **Operations**: Tutor utilization, CAC, Payback period
  - **Risk**: Escalations, Compliance breaches, Quality flags
- Metric cards with trend indicators and status colors
- Department submission overview
- Tab navigation by metric category
- Responsive mobile-friendly design

#### **Department Dashboards (5 Priority Departments)**

**1. Support Team Dashboard**
- Metrics: Open tickets, resolution time, CSAT score, response rate
- Team member workload tracking
- Performance highlights

**2. Sales & Marketing Dashboard**
- Metrics: Leads generated, conversion rate, pipeline value, deal size
- Sales rep performance ranking
- Pipeline stage distribution
- Deal tracking

**3. HR & Recruitment Dashboard**
- Metrics: Open positions, applications, interviews, offer acceptance
- Recruitment funnel visualization
- Open positions by department
- Attrition rate tracking

**4. Finance & Admin Dashboard**
- Metrics: Monthly revenue, expenses, profit, margins
- Budget vs actual analysis
- Expense category breakdown
- Financial health indicators

**5. Training & Development Dashboard**
- Metrics: Training completion, active learners, assessment scores, shift coverage
- Active training programs with enrollment
- Tutor performance ranking
- Monthly workflow timeline with approval steps

#### **Monthly Workflow System**
- 5-step submission process: Draft → Submit → Review → Approve → Archive
- Timeline visualization with completion indicators
- Approval history with comments
- Submission status tracking
- Past submission records

#### **Real-time Infrastructure**
- Metrics polling every 30 seconds
- Submission update polling
- Real-time status indicators
- Live connection status display
- Event notification system (submission updates, metrics changes, approvals required)

#### **User Interface**
- Dashboard layout with collapsible sidebar
- Navigation by role (CEO sees all, others see filtered data)
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Consistent component system (cards, badges, tabs, forms)
- Loading states and error handling

## 🗂️ Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── callback/               # Auth callback handler
│   ├── api/
│   │   ├── auth/login/route.ts     # Authentication endpoint
│   │   └── v1/
│   │       ├── submissions/route.ts # Submissions API
│   │       └── metrics/route.ts     # Metrics API
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard redirect
│   │   ├── ceo/page.tsx            # CEO Dashboard
│   │   ├── support/page.tsx        # Support Dashboard
│   │   ├── sales/page.tsx          # Sales Dashboard
│   │   ├── hr/page.tsx             # HR Dashboard
│   │   ├── finance/page.tsx        # Finance Dashboard
│   │   └── td/page.tsx             # Training Dashboard
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page redirect
│   └── globals.css                 # Global styles & theme
├── components/
│   ├── layout/
│   │   └── dashboard-layout.tsx    # Shared dashboard layout
│   ├── dashboard/
│   │   ├── metric-card.tsx         # Metric display card
│   │   ├── department-metrics.tsx  # Metrics grid
│   │   ├── submission-form.tsx     # Monthly submission form
│   │   └── realtime-status.tsx     # Real-time status indicator
│   └── ui/                          # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx              # Mobile detection
│   ├── use-toast.ts                # Toast notifications
│   └── use-realtime-updates.ts     # Real-time updates hook
├── lib/
│   ├── auth.ts                     # Authentication utilities
│   ├── db.ts                       # Database utilities
│   ├── metrics.ts                  # Metrics calculation
│   └── utils.ts                    # General utilities
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Database seeding
├── middleware.ts                   # Route protection middleware
├── .env.example                    # Environment variables template
├── IMPLEMENTATION_GUIDE.md         # Detailed implementation guide
└── README.md                       # This file
```

## 🚀 Quick Start

### 1. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase details:

```bash
cp .env.example .env.local
```

Required variables:
```
DATABASE_URL=your-postgresql-connection-string
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Database

```bash
# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser.

## 👤 Demo Credentials

### CEO Account
- **Email**: `ceo@smartpath.com`
- **Password**: `demo123`
- **Access**: All departments, 15-metric dashboard

### Department Heads
- **Support**: `support@smartpath.com` / `demo123`
- **Sales**: `sales@smartpath.com` / `demo123`
- **HR**: `hr@smartpath.com` / `demo123`
- **Finance**: `finance@smartpath.com` / `demo123`
- **Training**: `training@smartpath.com` / `demo123`

All have password: `demo123`

## 🏗️ Architecture

### Multi-Tenant Design
- All tables include `tenant_id` for isolation
- Users only see data from their tenant
- Row-level security (RLS) at database level

### Role Hierarchy
1. **ADMIN** - System administrator, full access
2. **CEO** - Sees all departments in tenant
3. **DEPARTMENT_HEAD** - Manages their department only
4. **TEAM_LEAD** - Submits department data
5. **STAFF** - Limited access to assignments

### Authentication Flow
1. User logs in with email/password
2. Password validated with bcrypt
3. JWT token generated and stored in HTTP-only cookie
4. Middleware checks token on protected routes
5. Role stored in JWT for authorization

### Real-time Updates
- Polling-based updates (30-second intervals)
- Event system for status changes
- Live connection indicator
- Notification badges for new events

## 📊 Data Schema

### Core Tables
- **users** - User accounts with roles and departments
- **tenants** - Tenant organizations
- **departments** - Company departments
- **metrics** - KPI data by department
- **monthly_submissions** - Monthly reports
- **approval_logs** - Workflow approval history

## 🎨 Design System

### Color Palette
- **Primary (Deep Blue)**: `oklch(0.42 0.145 262.5)` - Trust, professionalism
- **Accent (Teal)**: `oklch(0.65 0.15 180)` - Actions, highlights
- **Secondary (Slate)**: `oklch(0.57 0.035 255)` - Supporting text
- **Neutrals**: Light background (`oklch(0.98 0 0)`), Dark (`oklch(0.10 0 0)`)

### Typography
- **Font**: Geist (sans), Geist Mono (monospace)
- **Line Height**: 1.5-1.6 for body text
- **Font Sizes**: Semantic scale (sm, base, lg, xl, 2xl, 3xl, 4xl)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile, enhanced for desktop
- **Breakpoints**: md (768px), lg (1024px)
- **Sidebar**: Collapses on mobile, expands on tablet+
- **Grid**: 1 column mobile, 2-3 columns on larger screens

## 🔒 Security

- **Password Hashing**: bcryptjs with 10 salt rounds
- **Session Management**: HTTP-only cookies, JWT tokens
- **Authorization**: Role-based middleware on all routes
- **Data Isolation**: Multi-tenant with tenant_id enforcement
- **SQL Injection Protection**: Prisma parameterized queries
- **Input Validation**: Form validation with Zod schemas

## 🚀 Deployment

### Vercel
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel settings
3. Deploy main branch automatically
4. Database: Use Supabase PostgreSQL

### Scaling Considerations
- Database indexing on `(tenant_id, department_id)`
- API rate limiting for submission endpoints
- WebSocket migration path (currently polling)
- Caching layer for metric calculations

## 📚 API Documentation

### Submissions API
```
GET /api/v1/submissions?month=YYYY-MM-DD
POST /api/v1/submissions
```

### Metrics API
```
GET /api/v1/metrics?month=YYYY-MM-DD&departmentId=xxx
POST /api/v1/metrics
```

All endpoints require authentication token in cookies.

## 🔄 Workflow Status

### Submission States
- **DRAFT** - In progress, not submitted
- **SUBMITTED** - Awaiting review
- **UNDER_REVIEW** - Being reviewed by department head
- **APPROVED** - Approved by CEO/Admin
- **REJECTED** - Sent back for revision

## 📈 Future Enhancements

- [ ] WebSocket (Socket.IO) for true real-time updates
- [ ] Email notifications on status changes
- [ ] CSV/PDF export functionality
- [ ] Advanced analytics and trend analysis
- [ ] Custom dashboards by role
- [ ] Approval workflow with comments
- [ ] Audit logging for compliance
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a template project. To extend:

1. Add new departments: Create new page in `/app/dashboard/[dept]/`
2. Add metrics: Update `lib/metrics.ts` and database schema
3. Add roles: Update `UserRole` enum in `prisma/schema.prisma`
4. Customize theme: Edit color tokens in `app/globals.css`

## 📞 Support

For questions or issues:
1. Check `IMPLEMENTATION_GUIDE.md` for detailed setup
2. Review database migrations in `/prisma/migrations/`
3. Inspect API routes for endpoint details
4. Check component props for UI customization

## 📄 License

This project is part of the Vercel v0 template suite.

---

**Built with:**
- Next.js 16 (App Router)
- Prisma ORM
- Supabase PostgreSQL
- Tailwind CSS
- shadcn/ui
- TypeScript

**Last Updated**: March 2, 2026
