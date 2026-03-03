const fs=require('fs');
const path=require('path');
const {Pool} = require('pg');

function loadCA(){
  const b64 = process.env.DB_CA_B64;
  if(b64 && b64.trim()){
    try { return Buffer.from(b64,'base64').toString('utf8'); } catch {}
  }
  const filePath = path.resolve(process.cwd(), 'certs', 'prod-ca-2021.crt');
  try { if (fs.existsSync(filePath)) return fs.readFileSync(filePath,'utf8'); } catch {}
  return undefined;
}

const isProd = process.env.NODE_ENV === 'production';
// allow overriding via command line when calling directly
const connectionString =
  process.env.DATABASE_URL ||
  process.argv[2] ||
  ""; // pass URL as first arg if needed
console.log('conn string', connectionString);
const ca = loadCA();
const ssl =
  isProd
    ? (ca
        ? { ca, rejectUnauthorized: true }
        : { rejectUnauthorized: false })
    : (ca
        ? { ca, rejectUnauthorized: false }
        : { rejectUnauthorized: false });

console.log('ssl config', ssl);

(async () => {
  const pool = new Pool({ connectionString, ssl });
  try {
    const r = await pool.query('SELECT now()');
    console.log('ok', r.rows);
  } catch (e) {
    console.error('err', e);
  } finally {
    await pool.end();
  }
})();
