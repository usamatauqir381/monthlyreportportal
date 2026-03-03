# Troubleshooting Guide

## Prisma Client Generation Issues

### Error: "Cannot find module '.prisma/client/default'"

**Root Cause**: Prisma Client hasn't been generated from the schema file.

**Solution**:

1. **Automatic (Recommended)**: The `postinstall` hook should generate it automatically. Re-run dependencies:
   ```bash
   rm -rf node_modules .next
   npm install
   ```

2. **Manual Generation**: Explicitly generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

3. **With Clean Build**: Clean everything and reinstall:
   ```bash
   rm -rf node_modules pnpm-lock.yaml .next
   pnpm install
   ```

### The Prisma schema hasn't been migrated yet

**Solution**:

```bash
# Push schema to database (development only)
npm run db:push

# Or create a proper migration
npm run db:migrate
```

---

## Database Connection Issues

### Error: "ECONNREFUSED - Connection refused"

**Root Cause**: Database is not running or connection string is incorrect.

**Solution**:

1. Verify your `DATABASE_URL` in `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/smartpath"
   ```

2. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql

   # Docker
   docker ps | grep postgres
   ```

3. Test the connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

---

## Environment Variables

### Error: "DATABASE_URL is not set"

**Solution**: Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your actual Supabase credentials.

**For Supabase users**:

1. Go to your Supabase project dashboard
2. Click "Connect" button
3. Copy the "Connection string" (PostgreSQL)
4. Replace the `[YOUR-PASSWORD]` placeholder
5. Paste into `DATABASE_URL` in `.env.local`

---

## Build Issues

### Error during "npm run build"

Common causes and solutions:

1. **Missing Prisma Client**:
   ```bash
   npx prisma generate
   npm run build
   ```

2. **Database connection not needed at build time**:
   - The application doesn't require a live database connection during build
   - If you get connection errors, ensure `DATABASE_URL` is set in `.env.local`

3. **Type errors with Prisma**:
   ```bash
   # Regenerate types
   npx prisma generate --skip-engine
   npm run build
   ```

---

## Development Server Issues

### Hot reload not working

**Solution**:

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Check for file watching limit (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

## Authentication Issues

### Login always fails

**Solution**:

1. Verify demo users exist:
   ```bash
   npm run db:seed
   ```

2. Check password hash:
   - All demo users use password: `demo123`
   - Passwords are bcrypt-hashed in the database

3. Verify credentials:
   ```sql
   SELECT id, email, role FROM public."User" LIMIT 10;
   ```

---

## Migration Issues

### Error: "Migration failed"

**Solution**:

1. Check for blocking processes:
   ```bash
   npm run db:push
   ```

2. Reset database (CAUTION - loses all data):
   ```bash
   npx prisma migrate reset
   ```

3. Manually drop and recreate:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   ```

---

## Performance Issues

### Slow database queries

**Solution**:

1. Enable query logging:
   ```
   # In lib/db.ts, change log level to ["query", "error", "warn"]
   ```

2. Add indexes (schema already has them)

3. Check database statistics:
   ```bash
   npm run db:push
   ```

---

## Still Having Issues?

1. Check the [README.md](./README.md) for general project information
2. Verify all [SETUP.md](./SETUP.md) steps are complete
3. Check Supabase documentation: https://supabase.com/docs
4. Check Prisma documentation: https://www.prisma.io/docs
