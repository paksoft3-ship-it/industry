import { Client } from 'pg';

const connectionString = 'postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require';

const client = new Client({
  connectionString,
  connectionTimeoutMillis: 5000 // 5 seconds timeout
});

client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
