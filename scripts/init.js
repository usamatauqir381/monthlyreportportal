import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[v0] Starting Prisma client generation...');

try {
  // Generate Prisma Client
  console.log('[v0] Running: prisma generate');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('[v0] ✅ Prisma client generated successfully');
  console.log('[v0] You can now start the development server with: npm run dev');
  
  process.exit(0);
} catch (error) {
  console.error('[v0] ❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}
