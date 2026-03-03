const {Pool} = require('pg');
(async()=>{
  const connectionString = "postgresql://postgres.dvdseogukxbfiwzwbmzi:p%40ss%3Awo%3Frd%231@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";
  const pool = new Pool({connectionString, ssl: { rejectUnauthorized: false }});
  try{ const r=await pool.query('SELECT 1'); console.log('connected', r.rows);}catch(e){console.error('error', e);}finally{await pool.end();}
})();
