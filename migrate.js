import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:ngr2PGX9mJ0o1wSs@db.ebvwwpvnasxngnvhyele.supabase.co:5432/postgres';

async function migrate() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    console.log("Running 001_initial_schema...");
    const file1 = fs.readFileSync('./supabase/migrations/001_initial_schema.sql', 'utf8');
    await client.query(file1);
    
    console.log("Running 002_multiplayer...");
    const file2 = fs.readFileSync('./supabase/migrations/002_multiplayer.sql', 'utf8');
    await client.query(file2);
    
    console.log("Migrations successful!");
  } catch (e) {
    console.error("Migration failed:", e);
  } finally {
    await client.end();
  }
}

migrate();
