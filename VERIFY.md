# Verification Checklist

Use this checklist to verify your SmartPath setup is complete and working correctly.

---

## ✅ Installation Phase

### Dependencies Installed
- [ ] Run `npm install` without errors
- [ ] `node_modules` directory exists
- [ ] `package-lock.json` or `pnpm-lock.yaml` exists

### Verify Prisma Client Generated
```bash
ls -la node_modules/.prisma/client/
```
- [ ] Directory exists and contains files
- [ ] No errors in `npm install` output

### Check Prisma Version
```bash
npx prisma --version
```
- [ ] Shows version (e.g., "4.0.0" or higher)
- [ ] No "not found" errors

---

## ✅ Environment Configuration

### .env.local File Exists
```bash
test -f .env.local && echo "✓ .env.local exists" || echo "✗ missing"
```
- [ ] `.env.local` file created (not `.env.example`)

### Environment Variables Set
```bash
grep "DATABASE_URL" .env.local
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local
```
- [ ] `DATABASE_URL` is set with a valid PostgreSQL connection string
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set (Supabase users)
- [ ] All values replaced actual credentials (no placeholders)

### Verify Connection String Format
```bash
# Should match this format (PostgreSQL):
# postgresql://user:password@host:5432/database?schema=public
```
- [ ] Starts with `postgresql://`
- [ ] Contains `@` (separating credentials from host)
- [ ] Contains `/` (separating host from database)
- [ ] No `[brackets]` or `[placeholders]`

---

## ✅ Database Phase

### Create Database Tables
```bash
npm run db:push
```
- [ ] Command completes without errors
- [ ] See message like "✓ Your database is now in sync"
- [ ] No connection errors

### Verify Tables Created
```bash
psql $DATABASE_URL -c "\dt"
```
- [ ] Shows tables: `User`, `Tenant`, `Department`, `MonthlySubmission`, etc.
- [ ] At least 6 tables listed

### (Optional) Seed Demo Data
```bash
npm run db:seed
```
- [ ] Command completes without errors
- [ ] See "Seeding completed" or similar message

### Verify Demo Users (If Seeded)
```bash
psql $DATABASE_URL -c "SELECT email, role FROM \"User\" LIMIT 5;"
```
- [ ] Shows at least one user with each role
- [ ] Includes `ceo@smartpath.com`
- [ ] Includes department head emails

---

## ✅ Development Server

### Start Dev Server
```bash
npm run dev
```
- [ ] Compiles without errors
- [ ] See message "Ready in XXms"
- [ ] No "Prisma" or "module" errors
- [ ] Server runs on `http://localhost:3000`

### Check Server Started
```bash
curl http://localhost:3000
```
- [ ] Returns HTML (page content)
- [ ] No connection refused errors
- [ ] Redirects work properly

### Verify Logs Clean
Check dev server console:
- [ ] No red error messages
- [ ] No "ENOENT" or "ECONNREFUSED" errors
- [ ] No "Cannot find module" errors

---

## ✅ Application Functionality

### Access Login Page
Visit: `http://localhost:3000`

- [ ] Page loads without errors
- [ ] Redirects to `/auth/login`
- [ ] Login form displays
- [ ] No console errors (F12 → Console)

### Test Login with Demo Credentials
```
Email: ceo@smartpath.com
Password: demo123
```

- [ ] Login succeeds
- [ ] Redirects to dashboard
- [ ] No authentication errors

### Verify Dashboard Loads
- [ ] CEO Dashboard displays
- [ ] Shows metric cards
- [ ] Shows "Active Students", "Revenue", etc.
- [ ] No data loading errors

### Test Navigation
- [ ] Sidebar visible and clickable
- [ ] Can click different department links
- [ ] Each page loads without errors

---

## ✅ Database Connection

### Verify Prisma Can Connect
```bash
npx prisma db execute --stdin < /dev/null
```
- [ ] Command completes without errors
- [ ] No connection timeout or refused messages

### Test Query Execution
```bash
npx prisma studio
```
- [ ] Prisma Studio opens in browser
- [ ] Can see database tables and data
- [ ] No connection errors

### Check Database Logs
In Supabase dashboard:
- [ ] No error messages in logs
- [ ] Shows successful connections
- [ ] No "authentication failed" messages

---

## ✅ Type Safety

### Check TypeScript Compilation
```bash
npx tsc --noEmit
```
- [ ] No type errors reported
- [ ] Completes without errors

### Verify Prisma Types Generated
```bash
grep -r "PrismaClient" node_modules/.prisma/client/
```
- [ ] Types exist
- [ ] No "not found" errors

---

## ✅ Build Process

### Build for Production
```bash
npm run build
```
- [ ] Builds successfully
- [ ] No "Prisma" errors during build
- [ ] Creates `.next` directory
- [ ] Completes in <2 minutes

### Check Build Output
```bash
ls -la .next/
```
- [ ] Directory contains: `server`, `static`, `trace`
- [ ] No obvious errors

### Start Production Build
```bash
npm run start
```
- [ ] Starts without errors
- [ ] Runs on port 3000
- [ ] Can access application

---

## 📋 Summary Checklist

Quick final check:

- [ ] `npm install` ✓
- [ ] Prisma Client generated ✓
- [ ] `.env.local` configured ✓
- [ ] Database initialized (`npm run db:push`) ✓
- [ ] Demo data seeded (optional) (`npm run db:seed`) ✓
- [ ] Dev server runs (`npm run dev`) ✓
- [ ] Can log in ✓
- [ ] Dashboard displays ✓
- [ ] No errors in console ✓
- [ ] Builds successfully (`npm run build`) ✓

---

## ❌ If Something Fails

### Issue: Prisma Client Not Generated
```bash
npx prisma generate
npm run dev
```

### Issue: Database Connection Failed
```bash
# Check connection string
cat .env.local | grep DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: Login Fails
```bash
# Verify users exist
psql $DATABASE_URL -c "SELECT email FROM \"User\";"

# Re-seed demo data
npm run db:seed
```

### Issue: Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Dev Server Won't Start
```bash
# Check for port conflicts
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Restart
npm run dev
```

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

---

## 🎉 All Checks Passed?

**Congratulations!** Your SmartPath setup is complete and working correctly.

**Next steps:**
1. Explore the dashboard
2. Test different user roles
3. Review the code in `/app`
4. Start building your features!

---

## 📞 Need Help?

1. **Quick answers**: Check [QUICKSTART.md](./QUICKSTART.md)
2. **Common issues**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Full setup**: Read [SETUP.md](./SETUP.md)
4. **Technical details**: Review [FIX_SUMMARY.md](./FIX_SUMMARY.md)

Good luck! 🚀
