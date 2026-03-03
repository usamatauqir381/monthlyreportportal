# Smart Path Implementation Guide

## Current Status
✅ **Phase 1: Foundation - COMPLETE**
- Database schema with Prisma ORM
- Authentication system (Supabase Auth)
- RBAC middleware
- API routes for submissions and metrics
- Professional theme with 3 colors (deep blue primary, teal accent, slate secondary)
- Home page with auth redirect

✅ **Phase 2: CEO Dashboard - COMPLETE**
- All 15 metrics displayed in organized cards
- Real-time metric card component with trend indicators
- Status colors for risk indicators
- Department submission overview
- Responsive design (mobile-friendly)
- Dashboard layout with sidebar navigation

## Remaining Work

### Phase 3: Department Dashboards
**Files to Create:**
- `/app/dashboard/support/page.tsx` - Support Team dashboard
- `/app/dashboard/sales/page.tsx` - Sales & Marketing dashboard
- `/app/dashboard/hr/page.tsx` - HR & Recruitment dashboard
- `/app/dashboard/finance/page.tsx` - Finance & Admin dashboard
- `/app/dashboard/td/page.tsx` - Training & Development dashboard

**Each Department Dashboard Should Include:**
- Department-specific metrics (KPIs)
- Monthly submission form
- Submission history table
- Department team members list
- Real-time status updates

### Phase 4: WebSocket Integration
**Files to Create:**
- `/app/api/socket/route.ts` - Socket.IO server
- `/lib/socket.ts` - Socket.IO client utilities
- Real-time metric updates when submissions change

**Events to Implement:**
- `submission:created` - New submission
- `submission:updated` - Submission status change
- `metrics:refresh` - Metrics updated
- `department:alert` - New alerts

### Phase 5: Advanced Features
- Monthly approval workflows with comments
- Email notifications
- Data export (CSV/PDF)
- Historical trend analysis
- Audit logging

## Database Setup Instructions

### 1. Connect Supabase
Add these environment variables to your Vercel project:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-postgresql-connection-string
```

### 2. Run Migrations
```bash
npm run db:push
```

### 3. Seed Demo Data
```bash
npm run db:seed
```

## Demo Login Credentials

```
CEO Account:
Email: ceo@smartpath.com
Password: demo123

Department Heads:
- support@smartpath.com (Support Team)
- sales@smartpath.com (Sales & Marketing)
- hr@smartpath.com (HR & Recruitment)
- finance@smartpath.com (Finance & Admin)
- training@smartpath.com (Training & Development)

Password: demo123 (all accounts)
```

## Architecture Overview

### Multi-Tenant Structure
All tables include `tenant_id` for isolation. Users only see data from their tenant.

### Role Hierarchy
1. **ADMIN** - Super admin, full access
2. **CEO** - Sees all departments in their tenant
3. **DEPARTMENT_HEAD** - Sees only their department
4. **TEAM_LEAD** - Submits department data
5. **STAFF** - Views assignments, limited permissions

### Data Flow
1. Users submit department data via form
2. Status changes to SUBMITTED
3. Department Head reviews and approves/rejects
4. Metrics recalculated automatically
5. WebSocket updates dashboard in real-time

## Color Scheme (Design Tokens)

- **Primary (Deep Blue)**: `oklch(0.42 0.145 262.5)` - Trust, professionalism
- **Accent (Teal)**: `oklch(0.65 0.15 180)` - Action items, highlights
- **Secondary (Slate)**: `oklch(0.57 0.035 255)` - Supporting text
- **Background**: Light (`oklch(0.98 0 0)`), Dark (`oklch(0.10 0 0)`)

## Next Steps

1. **Create Department Dashboards** (Phase 3)
   - Use DashboardLayout component for consistent UX
   - Follow metric-card pattern for KPI display
   - Create submission forms with department-specific fields

2. **Add WebSocket Infrastructure** (Phase 4)
   - Set up Socket.IO server
   - Connect to metrics API
   - Implement real-time updates

3. **Implement Approval Workflows** (Phase 5)
   - Create approval comment component
   - Add workflow status transitions
   - Send email notifications

## Testing Checklist

- [ ] Login with CEO account
- [ ] CEO Dashboard loads with all 15 metrics
- [ ] Department heads can see only their department
- [ ] Submit a monthly report
- [ ] Approve/reject submissions
- [ ] Metrics update after submission
- [ ] Role-based access works
- [ ] Responsive on mobile

## Support Resources

- Prisma Docs: https://www.prisma.io/docs/
- Supabase Auth: https://supabase.com/docs/guides/auth
- Socket.IO: https://socket.io/docs/
- Next.js: https://nextjs.org/docs
