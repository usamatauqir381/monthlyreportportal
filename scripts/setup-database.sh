#!/bin/bash

# Setup database schema with Prisma
# This script will create all tables and enable RLS policies

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database with initial data..."
npx prisma db seed

echo "Database setup complete!"
